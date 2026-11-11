import SeoHead from '../components/SeoHead';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from '@lucasmarkes/hairline/react';
import type { GetServerSideProps } from 'next';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from '../styles/Typing.module.scss';
import keybrSnapshot from '../data/keybr-history.json';
import { parseKeybr, type KeybrStats } from '../lib/keybr';

type Best = { wpm: number; acc: number; timestamp: number; language: string; punctuation?: boolean; numbers?: boolean; difficulty: string };
type Profile = { name: string; addedAt: number; typingStats?: { completedTests: number; timeTyping: number }; personalBests?: { time?: Record<string, Best[]> }; maxStreak?: number };
type Result = { wpm: number; acc: number | null; timestamp: number; mode: string; mode2: string | number; language: string; punctuation?: boolean; numbers?: boolean; difficulty: string };
type Props = { profile: Profile | null; results: Result[]; historyEnabled: boolean; keybrHistory: KeybrStats; keybrLive: boolean };

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
  let upstreamUnavailable = false;
  let profile: Profile | null = null;
  let results: Result[] = [];
  const key = process.env.MONKEYTYPE_APE_KEY;
  try {
    const response = await fetch('https://api.monkeytype.com/users/pravindia/profile', { signal: AbortSignal.timeout(5000) });
    const body = await response.json();
    if (response.ok && body.data?.name === 'pravindia') profile = body.data;
    else upstreamUnavailable = true;
  } catch { upstreamUnavailable = true; }
  if (key) {
    try {
      const response = await fetch('https://api.monkeytype.com/results?limit=1000', { headers: { Authorization: `ApeKey ${key}` }, signal: AbortSignal.timeout(5000) });
      const body = await response.json();
      if (response.ok && Array.isArray(body.data)) results = body.data.filter((r: Result) => r.mode === 'time' && String(r.mode2) === '60' && r.language === 'english' && r.difficulty === 'normal' && !r.punctuation && !r.numbers && Number.isFinite(r.wpm) && Number.isFinite(r.timestamp)).sort ( (a: Result, b: Result) => a.timestamp - b.timestamp).map((r: Result) => ({ wpm: r.wpm, acc: Number.isFinite(r.acc) ? r.acc : null, timestamp: r.timestamp, mode: r.mode, mode2: r.mode2, language: r.language, difficulty: r.difficulty }));
      else upstreamUnavailable = true;
    } catch { upstreamUnavailable = true; }
  }
  let keybrHistory: KeybrStats = keybrSnapshot;
  let keybrLive = false;
  try {
    const response = await fetch('https://www.keybr.com/_/sync/data/m5imp7d', { signal: AbortSignal.timeout(5000) });
    const length = Number(response.headers.get('content-length'));
    if (response.ok && response.headers.get('content-type')?.includes('application/octet-stream') && (!length || length <= 5000000)) {
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength <= 5000000) {
        const parsed = parseKeybr(new Uint8Array(buffer));
        if (parsed.days.length > 0) { keybrHistory = parsed; keybrLive = true; }
      }
    }
    if (!keybrLive) upstreamUnavailable = true;
  } catch { upstreamUnavailable = true; }
  res.setHeader('Cache-Control', upstreamUnavailable ? 'public, s-maxage=60, stale-while-revalidate=60' : 'public, s-maxage=3600, stale-while-revalidate=86400');
  return { props: { profile, results, historyEnabled: Boolean(key), keybrHistory, keybrLive } };
};

const date = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 });
const durations = ['15', '30', '60', '120'];

function CountUp({ value }: { value: number | null | undefined }) {
  const valid = typeof value === 'number' && Number.isFinite(value);
  const target = valid ? value : null;
  const [display, setDisplay] = useState(target);
  const element = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplay(target);
    if (target === null || !element.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      observer.disconnect();
      let start: number | undefined;
      const tick = (time: number) => {
        start ??= time;
        const progress = Math.min((time - start) / 1200, 1);
        setDisplay(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(element.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);

  return <span ref={element} aria-label={target === null ? 'unavailable' : number(target)}><span aria-hidden="true">{display === null ? '—' : number(Number.isInteger(target) ? Math.round(display) : display)}</span></span>;
}

export default function TypingPage({ profile, results, historyEnabled, keybrHistory, keybrLive }: Props) {
  const records = durations.map(duration => ({ duration, best: profile?.personalBests?.time?.[duration]?.filter(b => b.language === 'english' && b.difficulty === 'normal' && !b.punctuation && !b.numbers && Number.isFinite(b.wpm)).sort((a, b) => b.wpm - a.wpm)[0] }));
  const best60 = records.find(r => r.duration === '60')?.best;
  const max = Math.max(1, ...results.map(r => r.wpm));
  const chartMax = Math.max(90, Math.ceil(max / 10) * 10);
  const points = results.map(r => `${results.length === 1 ? 50 : 5 + (r.timestamp - results[0].timestamp) * 90 / Math.max(1, results[results.length - 1].timestamp - results[0].timestamp)},${90 - r.wpm / chartMax * 75}`).join(' ');
  const keybrDays = keybrHistory.days;
  const firstKeybr = keybrDays[0].timestamp, lastKeybr = keybrDays[keybrDays.length - 1].timestamp;
  const keybrScaleMax = Math.max(90, Math.ceil(Math.max(...keybrDays.map(d => d.wpm)) / 10) * 10);
  const keybrX = (timestamp: number) => 54 + (timestamp - firstKeybr) / Math.max(lastKeybr - firstKeybr, 1) * 596;
  const keybrY = (wpm: number) => 275 - wpm / keybrScaleMax * 224;
  const keybrLine = keybrDays.map(d => `${keybrX(d.timestamp)},${keybrY(d.wpm)}`).join(' ');
  return <><SeoHead title="Typing Journey — Pravin Kumar" description="Pravin Kumar's typing practice history and personal bests from Keybr and Monkeytype." path="/typing" /><Header /><main className={styles.page}>
    <div className={styles.shell}>
      
      <section className={styles.hero}><div><div className={styles.topline}><span>MY TYPING SPEED</span></div><h1>Started slow.<br /><em>Still getting faster.</em></h1><p>From learning the keys on Keybr to chasing 80 words per minute on Monkeytype. Here’s the progress, one test at a time.</p><a className={styles.profileButton} href="https://monkeytype.com/profile/pravindia" target="_blank" rel="noreferrer">View Monkeytype profile <span>↗</span></a></div><div className={styles.heroArt}><Keyboard theme="dark" className={styles.keyboard} aria-label="Interactive keyboard illustration" /></div></section>
      {!profile && <p className={styles.notice}>Monkeytype is temporarily unavailable. Please check back later or visit the profile directly.</p>}
      <section className={styles.stats} aria-label="Typing statistics"><div><span>60 SECOND BEST</span><strong><CountUp value={best60?.wpm} /><small> wpm</small></strong><p>English · normal</p></div><div><span>ACCURACY</span><strong><CountUp value={best60?.acc} /><small>{best60 ? '%' : ''}</small></strong><p>On my 60 second best</p></div><div><span>TESTS COMPLETED</span><strong><CountUp value={profile?.typingStats?.completedTests} /></strong><p>All time</p></div><div><span>TIME TYPING</span><strong><CountUp value={profile?.typingStats ? profile.typingStats.timeTyping / 3600 : null} /><small> hrs</small></strong><p>All time</p></div></section>
      <section className={styles.goal}><div><div className={styles.eyebrow}>THE GOAL</div><h2>On the way to <em>80 wpm.</em></h2><p>My 60-second English personal best is {best60 ? `${number(best60.wpm)} wpm` : 'temporarily unavailable'}. There’s still room to grow.</p></div><div className={styles.goalMeter}><div><span>60-SECOND BEST</span><span>GOAL · 80 WPM</span></div><div className={styles.goalTrack}><span style={{width: `${best60 ? Math.min(best60.wpm / 80 * 100, 100) : 0}%`}} /></div><strong><CountUp value={best60?.wpm} /> <small>/ 80 wpm</small></strong><p>Personal best, not an average.</p></div></section>
      <section className={styles.section}><div className={styles.sectionHead}><div><div className={styles.eyebrow}>PERSONAL BESTS</div><h2>Speed, in<br /><em>different measures.</em></h2></div><p>My best English results across timed tests. Different durations are different challenges, so these are records to compare, not a timeline.</p></div><div className={styles.records}>{records.map(({ duration, best }) => <div className={styles.record} key={duration}><div className={styles.recordTop}><span>{duration} SECONDS</span><span>↗</span></div><div className={styles.barTrack}><div className={styles.bar} style={{width: `${best ? Math.max(3, best.wpm / Math.max(1, ...records.map(r => r.best?.wpm || 0)) * 100) : 0}%`}} /></div><strong><CountUp value={best?.wpm} /> <small>wpm</small></strong><p>{best ? `${number(best.acc)}% accuracy · ${date(best.timestamp)}` : 'No public record yet'}</p></div>)}</div></section>
      <section className={`${styles.section} ${styles.history}`}><div className={styles.sectionHead}><div><div className={styles.eyebrow}>OVER TIME</div><h2>Progress is<br /><em>a practice.</em></h2></div><p>One test at a time. This chart follows English 60-second tests, so each result has the same rules.</p></div>{results.length > 0 ? <><div className={styles.chart}><div className={styles.chartLabel}>WORDS PER MINUTE <span>{number(max)} WPM PEAK</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`60 second typing results over time, from ${date(results[0].timestamp)} to ${date(results[results.length-1].timestamp)}`}><line x1="5" y1="90" x2="95" y2="90" stroke="currentColor" opacity=".15" vectorEffect="non-scaling-stroke"/><line x1="5" y1={90-80/chartMax*75} x2="95" y2={90-80/chartMax*75} stroke="var(--green)" opacity=".6" strokeDasharray="3 5" vectorEffect="non-scaling-stroke"/><polyline points={points} fill="none" stroke="var(--green)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>{results.length === 1 && <circle cx="50" cy={90-results[0].wpm/chartMax*75} r="1.5" fill="var(--green)"/>}</svg><div className={styles.chartDates}><span>{date(results[0].timestamp)}</span><span>{date(results[results.length-1].timestamp)}</span></div></div><details><summary>View results as a table</summary><table><thead><tr><th>Date</th><th>Speed</th><th>Accuracy</th></tr></thead><tbody>{results.slice().reverse().map((r,i)=><tr key={`${r.timestamp}-${i}`}><td>{date(r.timestamp)}</td><td>{number(r.wpm)} wpm</td><td>{r.acc !== null ? `${number(r.acc)}%` : '—'}</td></tr>)}</tbody></table></details><p className={styles.note}>Showing matching tests among the latest 1,000 saved results. The dashed line marks the 80 WPM goal.</p></> : <div className={styles.empty}><span>↗</span><div><strong>The next chapter is taking shape.</strong><p>{historyEnabled ? 'Typing history is currently unavailable or has no matching 60-second English tests.' : 'The public profile shares personal bests, but individual test history requires a private API key.'}</p></div></div>}</section>
      <section className={`${styles.section} ${styles.history}`}><div className={styles.sectionHead}><div><div className={styles.eyebrow}>WHERE IT STARTED / KEYBR</div><h2>From the basics<br /><em>to a foundation.</em></h2></div><p>I used Keybr to build my typing skills from a low starting point. This chart shows my actual lesson history from that earlier chapter; I no longer practise there.</p></div><div className={styles.journeyChart}>
        <div className={styles.journeyHeader}><span>KEYBR · DAILY AVERAGE WPM</span><span><CountUp value={keybrHistory.lessons} /> LESSONS</span></div>
        <svg viewBox="0 0 700 330" role="img" aria-labelledby="journeyTitle journeyDescription">
          <title id="journeyTitle">Keybr practice history and the 80 words per minute goal</title>
          <desc id="journeyDescription">Daily average typing speed across {keybrDays.length} days of Keybr lessons from {date(firstKeybr)} to {date(lastKeybr)}. The goal line is 80 words per minute.</desc>
          {[0,20,40,60,80].map(value => <g key={value}><line x1="54" y1={keybrY(value)} x2="650" y2={keybrY(value)} className={value === 80 ? styles.goalLine : styles.gridLine}/><text x="42" y={keybrY(value)+4} textAnchor="end" className={styles.axisText}>{value}</text></g>)}
          <text x="650" y={keybrY(80)-9} textAnchor="end" className={styles.goalLabel}>80 WPM GOAL</text>
          <polyline points={keybrLine} className={styles.realHistoryLine} pathLength="1" />
          <text x="54" y="300" textAnchor="start" className={styles.axisText}>{date(firstKeybr).toUpperCase()}</text><text x="650" y="300" textAnchor="end" className={styles.axisText}>{date(lastKeybr).toUpperCase()}</text>
        </svg>
        <div className={styles.journeyLegend}><span><i /> Daily average speed</span><span>Dashed line · 80 WPM goal</span></div>
      </div><details><summary>View Keybr daily results as a table</summary><table><thead><tr><th>Date (UTC)</th><th>Average speed</th><th>Lessons</th></tr></thead><tbody>{keybrDays.slice().reverse().map(d=><tr key={d.timestamp}><td>{date(d.timestamp)}</td><td>{number(d.wpm)} wpm</td><td>{d.lessons}</td></tr>)}</tbody></table></details><p className={styles.note}>{keybrLive ? 'Keybr public profile data, refreshed when the page cache expires.' : 'Keybr public profile snapshot captured 7 Nov 2026; live data is currently unavailable.'} Daily speed is weighted by lesson time, using five characters per word. Lessons may use different settings; dates use UTC. Monkeytype results appear separately above because the test conditions differ.</p><a className={styles.profileButton} href="https://www.keybr.com/profile/m5imp7d" target="_blank" rel="noreferrer">View Keybr profile <span>↗</span></a></section>
      <div className={styles.bottom}><span>PROFILE DATA · CACHED UP TO ONE HOUR</span><a href="https://monkeytype.com/profile/pravindia" target="_blank" rel="noreferrer">VISIT PROFILE ↗</a></div>
    </div></main><Footer textEnter={()=>{}} textLeave={()=>{}} /></>;
}
