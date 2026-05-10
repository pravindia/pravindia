import { useState, useMemo } from 'react';
import styles from './Interests.module.scss';

const Interests = () => {
	const W = 1100;
	const H = 540;

	const nodes = useMemo(() => [
		// Core interests
		{ id: 'distsys', label: 'distributed systems', x: 0.50, y: 0.48, s: 3, group: 'core' },
		{ id: 'arch', label: 'system architecture', x: 0.30, y: 0.30, s: 3, group: 'core' },
		{ id: 'queues', label: 'message queues', x: 0.62, y: 0.30, s: 2, group: 'core' },
		{ id: 'observ', label: 'observability', x: 0.78, y: 0.42, s: 2, group: 'core' },
		{ id: 'pg', label: 'postgres', x: 0.20, y: 0.62, s: 2, group: 'core' },

		// Languages
		{ id: 'dart', label: 'dart', x: 0.42, y: 0.74, s: 2, group: 'lang' },
		{ id: 'ts', label: 'typescript', x: 0.58, y: 0.66, s: 2, group: 'lang' },
		{ id: 'py', label: 'python', x: 0.36, y: 0.20, s: 2, group: 'lang' },

		// Life interests
		{ id: 'aquarist', label: 'fishkeeping', x: 0.86, y: 0.62, s: 2, group: 'life' },
		{ id: 'ele', label: 'electronics', x: 0.16, y: 0.40, s: 2, group: 'life' },
		{ id: 'coffee', label: 'pour-over coffee', x: 0.74, y: 0.78, s: 1, group: 'life' },
		{ id: 'scifi', label: 'Music & Movies', x: 0.10, y: 0.78, s: 1, group: 'life' },
		{ id: 'apps', label: 'build apps', x: 0.66, y: 0.85, s: 1, group: 'life' },
	], []);

	const edges = useMemo(() => [
		['arch', 'distsys'],
		['queues', 'distsys'],
		['observ', 'distsys'],
		['pg', 'distsys'],
		['dart', 'distsys'],
		['ts', 'arch'],
		['py', 'arch'],
		['aquarist', 'observ'],
		['ele', 'arch'],
		['coffee', 'aquarist'],
		['scifi', 'ele'],
		['apps', 'aquarist'],
	], []);

	const [hovered, setHovered] = useState<string | null>(null);

	const getPos = (id: string) => {
		const node = nodes.find(n => n.id === id);
		if (!node) return { x: 0, y: 0 };
		return { x: node.x * W, y: node.y * H };
	};

	const colors: Record<string, string> = {
		core: 'var(--green)',
		lang: '#79c0ff',
		life: '#ffa657',
	};

	return (
		<section className={styles.section} id="interests">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>/03</span>
					<h2>Interests</h2>
					<span className={styles.meta}>things I think about · hover to explore</span>
				</div>

				<div className={styles.constellation}>
					<svg
						viewBox={`0 0 ${W} ${H}`}
						preserveAspectRatio="xMidYMid meet"
						className={styles.constellationSvg}
					>
						<defs>
							<radialGradient id="cstar">
								<stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
								<stop offset="100%" stopColor="rgba(255,255,255,0)" />
							</radialGradient>
						</defs>

						{/* Faint background grid */}
						{Array.from({ length: 11 }).map((_, i) => (
							<line
								key={`v${i}`}
								x1={i * (W / 10)}
								x2={i * (W / 10)}
								y1={0}
								y2={H}
								stroke="rgba(139,148,158,0.06)"
								strokeWidth="1"
							/>
						))}
						{Array.from({ length: 7 }).map((_, i) => (
							<line
								key={`h${i}`}
								x1={0}
								x2={W}
								y1={i * (H / 6)}
								y2={i * (H / 6)}
								stroke="rgba(139,148,158,0.06)"
								strokeWidth="1"
							/>
						))}

						{/* Distant stars */}
						{Array.from({ length: 60 }).map((_, i) => {
							const x = (Math.sin(i * 7.3) * 0.5 + 0.5) * W;
							const y = (Math.cos(i * 5.1) * 0.5 + 0.5) * H;
							const r = 0.8 + (i % 3) * 0.4;
							return (
								<circle
									key={`s${i}`}
									cx={x}
									cy={y}
									r={r}
									fill="rgba(255,255,255,0.25)"
								/>
							);
						})}

						{/* Edges */}
						{edges.map(([a, b], i) => {
							const posA = getPos(a);
							const posB = getPos(b);
							const isHighlighted = hovered && (a === hovered || b === hovered);

							return (
								<line
									key={`edge${i}`}
									x1={posA.x}
									y1={posA.y}
									x2={posB.x}
									y2={posB.y}
									stroke={
										isHighlighted
											? 'rgba(126,231,135,0.55)'
											: 'rgba(139,148,158,0.18)'
									}
									strokeWidth={isHighlighted ? 1.2 : 0.7}
									strokeDasharray={isHighlighted ? '0' : '3 3'}
									className={styles.edge}
								/>
							);
						})}

						{/* Nodes */}
						{nodes.map(node => {
							const pos = getPos(node.id);
							const r = 4 + node.s * 3;
							const isHighlighted = hovered === node.id;

							return (
								<g
									key={node.id}
									className={styles.node}
									onMouseEnter={() => setHovered(node.id)}
									onMouseLeave={() => setHovered(null)}
									style={{ cursor: 'pointer' }}
								>
									{/* Glow effect */}
									<circle
										cx={pos.x}
										cy={pos.y}
										r={r * 3}
										fill="url(#cstar)"
										opacity={isHighlighted ? 0.6 : 0.18}
										className={styles.glow}
									/>

									{/* Main circle */}
									<circle
										cx={pos.x}
										cy={pos.y}
										r={r}
										fill={colors[node.group]}
										className={styles.circle}
									/>

									{/* Label */}
									<text
										x={pos.x + r + 8}
										y={pos.y + 4}
										fontFamily="JetBrains Mono, monospace"
										fontSize="11"
										fill={isHighlighted ? '#fff' : 'rgba(230,237,243,0.7)'}
										className={styles.label}
									>
										{node.label}
									</text>
								</g>
							);
						})}
					</svg>

					{/* Legend */}
					<div className={styles.legend}>
						<span>
							<i style={{ background: 'var(--green)' }} />
							core interests
						</span>
						<span>
							<i style={{ background: '#79c0ff' }} />
							languages
						</span>
						<span>
							<i style={{ background: '#ffa657' }} />
							off the keyboard
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Interests;
