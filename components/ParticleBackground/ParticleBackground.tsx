import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.scss';

interface Dot {
	x: number;
	y: number;
	ox: number;
	oy: number;
	base: number;
	phase: number;
}

interface Glyph {
	x: number;
	y: number;
	vy: number;
	char: string;
	alpha: number;
	size: number;
	life: number;
	age: number;
}

const ParticleBackground = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseRef = useRef({ x: -9999, y: -9999, lastMove: 0 });
	const rafRef = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let W = 0,
			H = 0;
		let dots: Dot[] = [];
		let glyphs: Glyph[] = [];
		const GLYPH_CHARS = '01{}<>/$#~*+-=.•';
		let accentRgb = '126,231,135';

		function readAccent() {
			const v = getComputedStyle(document.documentElement)
				.getPropertyValue('--accent-rgb')
				.trim();
			if (v) accentRgb = v;
		}

		function build() {
			readAccent();
			W = canvas.clientWidth;
			H = canvas.clientHeight;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const spacing = Math.max(28, Math.min(46, Math.floor(Math.min(W, H) / 22)));
			const cols = Math.ceil(W / spacing) + 1;
			const rows = Math.ceil(H / spacing) + 1;
			dots = [];
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					dots.push({
						x: c * spacing,
						y: r * spacing,
						ox: c * spacing,
						oy: r * spacing,
						base: 0.08 + Math.random() * 0.05,
						phase: Math.random() * Math.PI * 2,
					});
				}
			}

			glyphs = [];
			const glyphCount = Math.max(10, Math.floor((W * H) / 90000));
			for (let i = 0; i < glyphCount; i++) {
				glyphs.push(makeGlyph());
			}
		}

		function makeGlyph(): Glyph {
			return {
				x: Math.random() * W,
				y: Math.random() * H,
				vy: 6 + Math.random() * 14,
				char: GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)],
				alpha: 0.05 + Math.random() * 0.12,
				size: 10 + Math.random() * 4,
				life: 6 + Math.random() * 14,
				age: 0,
			};
		}

		let last = performance.now();
		function tick(now: number) {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;

			ctx.clearRect(0, 0, W, H);

			const mx = mouseRef.current.x;
			const my = mouseRef.current.y;
			const cursorAlive = now - mouseRef.current.lastMove < 1500;
			const radius = 180;
			const radiusSq = radius * radius;

			// Dots
			ctx.save();
			for (let i = 0; i < dots.length; i++) {
				const d = dots[i];
				const dx = d.ox - mx;
				const dy = d.oy - my;
				const distSq = dx * dx + dy * dy;
				let pull = 0;
				if (distSq < radiusSq && cursorAlive) {
					pull = 1 - Math.sqrt(distSq) / radius;
				}

				const px = d.ox + (pull > 0 ? ((dx / Math.max(8, Math.sqrt(distSq))) * pull * 22) : 0);
				const py = d.oy + (pull > 0 ? ((dy / Math.max(8, Math.sqrt(distSq))) * pull * 22) : 0);
				d.x += (px - d.x) * Math.min(1, dt * 8);
				d.y += (py - d.y) * Math.min(1, dt * 8);

				const alpha = d.base + pull * 0.85;
				const size = 1 + pull * 1.6;

				if (pull > 0.01) {
					ctx.fillStyle = `rgba(${accentRgb}, ${alpha})`;
				} else {
					ctx.fillStyle = `rgba(139, 148, 158, ${alpha})`;
				}
				ctx.beginPath();
				ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();

			// Connections near cursor
			if (cursorAlive) {
				ctx.save();
				ctx.lineWidth = 0.6;
				for (let i = 0; i < dots.length; i++) {
					const d = dots[i];
					const dx = d.ox - mx;
					const dy = d.oy - my;
					const distSq = dx * dx + dy * dy;
					if (distSq < radiusSq) {
						const dist = Math.sqrt(distSq);
						const a = ((1 - dist / radius) * 0.35);
						ctx.strokeStyle = `rgba(${accentRgb}, ${a})`;
						ctx.beginPath();
						ctx.moveTo(d.x, d.y);
						ctx.lineTo(mx, my);
						ctx.stroke();
					}
				}
				ctx.restore();
			}

			// Drifting glyphs
			ctx.save();
			ctx.font = `12px JetBrains Mono, monospace`;
			for (let i = 0; i < glyphs.length; i++) {
				const g = glyphs[i];
				g.age += dt;
				g.y += g.vy * dt;
				if (g.y > H + 20 || g.age > g.life) {
					Object.assign(g, makeGlyph(), { y: -10, age: 0 });
				}
				const fade = Math.min(1, g.age * 0.5) * Math.min(1, (g.life - g.age) * 0.5);
				ctx.fillStyle = `rgba(${accentRgb}, ${g.alpha * fade})`;
				ctx.font = `${g.size}px JetBrains Mono, monospace`;
				ctx.fillText(g.char, g.x, g.y);
			}
			ctx.restore();

			rafRef.current = requestAnimationFrame(tick);
		}

		function onMove(e: MouseEvent) {
			const rect = canvas.getBoundingClientRect();
			mouseRef.current.x = e.clientX - rect.left;
			mouseRef.current.y = e.clientY - rect.top;
			mouseRef.current.lastMove = performance.now();
		}

		function onLeave() {
			mouseRef.current.x = -9999;
			mouseRef.current.y = -9999;
		}

		build();
		rafRef.current = requestAnimationFrame(tick);
		window.addEventListener('resize', build);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseleave', onLeave);

		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener('resize', build);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseleave', onLeave);
		};
	}, []);

	return (
		<>
			<canvas ref={canvasRef} className={styles.canvas} />
			<div className={styles.vignette} />
			<div className={styles.grain} />
		</>
	);
};

export default ParticleBackground;
