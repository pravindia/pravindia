import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DotPortrait from '../components/DotPortrait/DotPortrait'
import styles from '../styles/DotPortrait.module.scss'

const roughModelUrl = '/models/pravin-rough-bust.glb'

export default function DotPortraitPage() {
  const [modelUrl, setModelUrl] = useState(roughModelUrl)
  useEffect(() => () => { if (modelUrl.startsWith('blob:')) URL.revokeObjectURL(modelUrl) }, [modelUrl])
  const usingUploadedModel = modelUrl.startsWith('blob:')
  return <>
    <Head><title>Dot portrait experiment | Pravindia</title><meta name="robots" content="noindex" /></Head>
    <main className={styles.page}>
      <div className={styles.canvas}><DotPortrait modelUrl={modelUrl} /></div>
      <div className={styles.grain} />
      <div className={styles.controls}><div><span className={styles.status}><i /> {usingUploadedModel ? 'UPLOADED MODEL' : 'ROUGH PORTRAIT MODEL'}</span><p>{usingUploadedModel ? 'Your model stays in this browser.' : 'An approximate bust built from your reference photos.'}</p></div><label className={styles.button}>Try another GLB<input type="file" accept=".glb,model/gltf-binary" onChange={e => { const file = e.target.files?.[0]; if (file) setModelUrl(URL.createObjectURL(file)); e.target.value = '' }} /></label>{usingUploadedModel && <button className={styles.reset} onClick={() => setModelUrl(roughModelUrl)}>Reset</button>}</div>
    </main>
  </>
}
