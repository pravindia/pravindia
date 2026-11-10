import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

interface Props { modelUrl?: string }

// The temporary bust is deliberately generic; replace it with a personal GLB.
function placeholder() {
  const group = new THREE.Group()
  const add = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24))
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); group.add(mesh)
  }
  add(0, 0.48, 0, 0.49, 0.67, 0.43)
  add(0, -0.18, 0, 0.25, 0.35, 0.25)
  add(0, -0.78, 0, 0.95, 0.48, 0.35)
  return group
}

export default function DotPortrait({ modelUrl }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const el = container.current
    if (!el) return
    setError('')
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) }
    catch { setError('This browser could not start the 3D preview.'); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    el.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.z = 5.5
    const portrait = new THREE.Group(); scene.add(portrait)
    const pointer = new THREE.Vector2(0, 0)
    const uniforms = { uPointer: { value: pointer }, uTime: { value: 0 }, uMotion: { value: 1 } }
    let geometry: THREE.BufferGeometry | undefined
    let material: THREE.ShaderMaterial | undefined
    let stopped = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const build = (source: THREE.Object3D) => {
      if (stopped) return
      source.updateMatrixWorld(true)
      const bounds = new THREE.Box3().setFromObject(source)
      const size = bounds.getSize(new THREE.Vector3())
      if (!Number.isFinite(size.y) || size.y === 0) { setError('The model has no visible mesh. Try another GLB.'); return }
      const center = bounds.getCenter(new THREE.Vector3())
      const scale = 2.55 / Math.max(size.x, size.y)
      const meshes: { sampler: MeshSurfaceSampler; area: number; geometry: THREE.BufferGeometry }[] = []
      source.traverse((object) => {
        if (!(object instanceof THREE.Mesh) || !object.geometry?.attributes.position) return
        const g = object.geometry.clone().applyMatrix4(object.matrixWorld)
        const pos = g.attributes.position; const index = g.index
        let area = 0
        const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
        for (let i = 0; i < (index ? index.count : pos.count); i += 3) {
          a.fromBufferAttribute(pos, index ? index.getX(i) : i)
          b.fromBufferAttribute(pos, index ? index.getX(i + 1) : i + 1)
          c.fromBufferAttribute(pos, index ? index.getX(i + 2) : i + 2)
          area += new THREE.Triangle(a, b, c).getArea()
        }
        if (area > 0) meshes.push({ sampler: new MeshSurfaceSampler(new THREE.Mesh(g)).build(), area, geometry: g })
        else g.dispose()
      })
      const total = meshes.reduce((sum, mesh) => sum + mesh.area, 0)
      if (!total) { setError('The model has no sampleable surfaces. Try another GLB.'); return }
      const count = window.innerWidth < 700 ? 28000 : 50000
      const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3), seeds = new Float32Array(count)
      const p = new THREE.Vector3(), n = new THREE.Vector3()
      for (let i = 0; i < count; i++) {
        let pick = Math.random() * total; let chosen = meshes[meshes.length - 1]
        for (const mesh of meshes) { pick -= mesh.area; if (pick <= 0) { chosen = mesh; break } }
        chosen.sampler.sample(p, n); p.sub(center).multiplyScalar(scale)
        positions.set([p.x, p.y, p.z], i * 3); normals.set([n.x, n.y, n.z], i * 3); seeds[i] = Math.random()
      }
      meshes.forEach(mesh => mesh.geometry.dispose())
      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
      material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
        vertexShader: `attribute float aSeed; uniform vec2 uPointer; uniform float uTime; uniform float uMotion; varying float vLight; varying float vSeed;
        void main() { vec4 view = modelViewMatrix * vec4(position, 1.); vec4 clip = projectionMatrix * view; vec2 screen = clip.xy / clip.w; float light = exp(-distance(screen, uPointer) * 3.5); vec3 n = normalize(normalMatrix * normal); vLight = .30 + .15 * max(0., dot(n, normalize(vec3(-.4,.7,1.)))) + light * .6; vSeed = aSeed; gl_PointSize = (1.2 + aSeed * 2.2 + light) * (4.5 / -view.z); gl_Position = clip; }`,
        fragmentShader: `varying float vLight; varying float vSeed; void main() { float r = length(gl_PointCoord - .5); float a = exp(-r*r*15.) * smoothstep(.5,.25,r); gl_FragColor = vec4(vec3(.72,.86,.81) * vLight * (.7 + vSeed*.5), a * .8); }` })
      portrait.add(new THREE.Points(geometry, material))
    }
    if (modelUrl) new GLTFLoader().load(modelUrl, gltf => build(gltf.scene), undefined, () => { if (!stopped) setError('Could not load this GLB. Please try another file.') })
    else build(placeholder())
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.position.z = w < 600 ? 6.8 : 5.5; camera.updateProjectionMatrix() }
    const observer = new ResizeObserver(resize); observer.observe(el); resize()
    const move = (event: PointerEvent) => { const rect = el.getBoundingClientRect(); pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1) }
    const leave = () => pointer.set(0, 0)
    window.addEventListener('pointermove', move); window.addEventListener('pointerout', leave)
    let frame = 0
    const tick = (time: number) => { if (stopped) return; uniforms.uTime.value = time / 1000; const motion = reduced.matches ? 0 : 1; portrait.rotation.y += (pointer.x * .24 * motion - portrait.rotation.y) * .045; portrait.rotation.x += (-pointer.y * .12 * motion - portrait.rotation.x) * .045; renderer.render(scene, camera); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => { stopped = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerout', leave); geometry?.dispose(); material?.dispose(); renderer.dispose(); renderer.domElement.remove() }
  }, [modelUrl])
  return <div ref={container} style={{ width: '100%', height: '100%', position: 'relative' }} aria-label="Interactive dotted 3D portrait">{error && <p role="status" style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center', color: '#b9c9c1' }}>{error}</p>}</div>
}
