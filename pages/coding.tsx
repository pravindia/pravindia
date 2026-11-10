import Head from "next/head";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CountUp } from "countup.js";
import type { GetServerSideProps } from "next";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import styles from "../styles/Coding.module.scss";
import activity from "../data/coding-activity.json";
import profileSnapshot from "../data/wakatime-profile.json";

type Profile = {
  totalSeconds: number;
  dailyAverageSeconds: number;
  activeDays: number;
  languageCount: number;
  observedDate: string;
  live: boolean;
};
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  let profile: Profile = { ...profileSnapshot, live: false };
  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/pravindia/stats",
      { signal: AbortSignal.timeout(4000) },
    );
    const data = (await response.json()).data;
    if (
      response.ok &&
      data?.range === "all_time" &&
      data.is_up_to_date !== false &&
      Number.isFinite(data.total_seconds_including_other_language) &&
      Number.isFinite(data.daily_average_including_other_language) &&
      Number.isFinite(data.days_minus_holidays) &&
      Array.isArray(data.languages)
    ) {
      profile = {
        totalSeconds: data.total_seconds_including_other_language,
        dailyAverageSeconds: data.daily_average_including_other_language,
        activeDays: data.days_minus_holidays,
        languageCount: data.languages.length,
        observedDate: new Date().toISOString().slice(0, 10),
        live: true,
      };
    }
  } catch {
    /* The last public snapshot keeps the dashboard available offline. */
  }
  return { props: { profile } };
};

type ActivityDay = (typeof activity.days)[number];
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const colors = ["#2979ff", "#ff4c00", "#39d353", "#8ab5ff"];
const categoryColors = ["#39d353", "#2979ff", "#ff4c00", "#8ab5ff"];
const hours = (seconds: number) => seconds / 3600;
const formatHours = (seconds: number) =>
  hours(seconds).toLocaleString("en-US", { maximumFractionDigits: 1 });
const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const dayOfWeek = (date: string) =>
  (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
const years = Array.from(
  new Set(activity.days.map((d) => d.date.slice(0, 4))),
).reverse();
const emptyDay = (date: string): ActivityDay => ({
  date,
  seconds: 0,
  languages: {},
  categories: {},
  heartbeats: 0,
  writes: 0,
});
function aggregate(rows: ActivityDay[], field: "languages" | "categories") {
  const result: Record<string, number> = {};
  rows.forEach((day) =>
    Object.entries(day[field]).forEach(([name, seconds]) => {
      result[name] = (result[name] || 0) + Number(seconds);
    }),
  );
  return Object.entries(result).sort((a, b) => b[1] - a[1]);
}
function AnimatedNumber({ value }: { value: string }) {
  const element = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);
  const target = Number(value.replace(/,/g, ""));

  useEffect(() => {
    const node = element.current;
    if (!node || !Number.isFinite(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = value;
      previous.current = target;
      return;
    }

    let counter: CountUp | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      counter = new CountUp(node, target, {
        startVal: previous.current ?? 0,
        duration: 1.2,
        decimalPlaces: value.includes(".") ? 1 : 0,
        smartEasingThreshold: Number.MAX_SAFE_INTEGER,
      });
      if (!counter.error) counter.start();
      else node.textContent = value;
      previous.current = target;
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      counter?.onDestroy();
    };
  }, [target, value]);

  return <span aria-label={value}><span ref={element} aria-hidden="true">{value}</span></span>;
}
function Spark({
  series,
  color,
  unit,
}: {
  series: number[];
  color: string;
  unit: string;
}) {
  const [point, setPoint] = useState<number | null>(null);
  const max = Math.max(...series, 1);
  const points = series
    .map(
      (n, i) =>
        `${(i * 100) / Math.max(series.length - 1, 1)},${46 - (n / max) * 36}`,
    )
    .join(" ");
  return (
    <div className={styles.sparkWrap}>
      <svg viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className={styles.sparkTargets}>
        {series.map((v, i) => (
          <button
            key={i}
            aria-label={`Day ${i + 1}: ${v.toFixed(1)} ${unit}`}
            onMouseEnter={() => setPoint(i)}
            onFocus={() => setPoint(i)}
            onClick={() => setPoint(i)}
            onMouseLeave={() => setPoint(null)}
            onBlur={() => setPoint(null)}
          />
        ))}
      </div>
      {point !== null && (
        <span className={styles.sparkValue}>
          {series[point].toFixed(1)} {unit}
        </span>
      )}
    </div>
  );
}
function blockPath(x: number, y: number, h: number) {
  return {
    top: `${x},${y - h} ${x + 10},${y - 5 - h} ${x + 20},${y - h} ${x + 10},${y + 5 - h}`,
    left: `${x},${y - h} ${x + 10},${y + 5 - h} ${x + 10},${y + 5} ${x},${y}`,
    right: `${x + 10},${y + 5 - h} ${x + 20},${y - h} ${x + 20},${y} ${x + 10},${y + 5}`,
  };
}
function wedge(i: number, h: number) {
  const a = ((i * 12 - 90) * Math.PI) / 180,
    half = (4.6 * Math.PI) / 180,
    inner = 100,
    outer = 100 + h * 10;
  const p = (r: number, t: number) =>
    `${200 + r * Math.cos(t)},${200 + r * Math.sin(t)}`;
  return `M${p(inner, a - half)} L${p(outer, a - half)} A${outer},${outer} 0 0 1 ${p(outer, a + half)} L${p(inner, a + half)} A${inner},${inner} 0 0 0 ${p(inner, a - half)} Z`;
}
export default function CodingPage({ profile }: { profile: Profile }) {
  const [selected, setSelected] = useState(29),
    [tower, setTower] = useState<number | null>(null),
    [language, setLanguage] = useState<number | null>(null),
    [weekday, setWeekday] = useState<number | null>(null);
  const [year, setYear] = useState("all");
  const [endDate, setEndDate] = useState("2026-07-01");
  const rows = activity.days.filter(
    (d) => year === "all" || d.date.startsWith(year),
  );
  const byDate = new Map(activity.days.map((d) => [d.date, d]));
  const end = endDate;
  const range = (length: number) =>
    Array.from({ length }, (_, i) => {
      const date = addDays(end, i - length + 1);
      return byDate.get(date) || emptyDay(date);
    });
  const skyline = range(196),
    recent = range(30);
  const total = rows.reduce((sum, d) => sum + d.seconds, 0),
    active = rows.filter((d) => d.seconds > 0).length;
  const languageTotals = aggregate(rows, "languages");
  const leading = languageTotals
    .filter(([name]) => name !== "Other")
    .slice(0, 3);
  const remaining = languageTotals
    .filter(([name]) => !leading.some(([top]) => top === name))
    .reduce((sum, x) => sum + x[1], 0);
  const languages = [
    ...leading,
    ...(remaining > 0 ? [["Other", remaining] as [string, number]] : []),
  ].map(([name, seconds], i) => ({
    name,
    hours: hours(seconds),
    color: colors[i],
  }));
  const categoryTotals = aggregate(rows, "categories").slice(0, 4);
  const dayCounts = weekdays.map(
    (_, i) => rows.filter((d) => dayOfWeek(d.date) === i).length,
  );
  const categories = categoryTotals.map(([name], i) => ({
    name,
    color: categoryColors[i],
    values: weekdays.map(
      (_, j) =>
        rows.reduce(
          (sum, d) =>
            sum +
            (dayOfWeek(d.date) === j
              ? Number((d.categories as Record<string, number>)[name] || 0)
              : 0),
          0,
        ) /
        Math.max(dayCounts[j], 1) /
        3600,
    ),
  }));
  const days = recent.map((d) => hours(d.seconds));
  const maxRecent = Math.max(...days, 1),
    maxSkyline = Math.max(...skyline.map((d) => d.seconds), 1);
  const weekMax = Math.max(
    ...weekdays.map((_, i) =>
      categories.reduce((sum, c) => sum + c.values[i], 0),
    ),
    1,
  );
  const dailySeries = range(7).map((d) => hours(d.seconds));
  const metrics = [
    {
      label: "CODING TIME",
      value: formatHours(year === "all" ? profile.totalSeconds : total),
      unit: "hrs",
      color: "#39d353",
      note:
        year === "all" ? "WakaTime · all time" : `Export estimate · ${year}`,
      series: dailySeries,
      sparkUnit: "hours",
    },
    {
      label: "ACTIVE DAYS",
      value: (year === "all" ? profile.activeDays : active).toLocaleString(),
      unit: "days",
      color: "#ff4c00",
      note: year === "all" ? "WakaTime · all time" : "Days with estimated time",
      series: range(7).map((d) => (d.seconds > 0 ? 1 : 0)),
      sparkUnit: "active days",
    },
    {
      label: "DAILY AVERAGE",
      value: formatHours(
        year === "all"
          ? profile.dailyAverageSeconds
          : total / Math.max(active, 1),
      ),
      unit: "hrs",
      color: "#2979ff",
      note: year === "all" ? "WakaTime · active days" : "Across active days",
      series: dailySeries,
      sparkUnit: "hours",
    },
    {
      label: "LANGUAGES",
      value: String(
        year === "all"
          ? profile.languageCount
          : languageTotals.filter(([n]) => n !== "Other").length,
      ),
      unit: "used",
      color: "#2979ff",
      note: year === "all" ? "WakaTime · all time" : "Recognised languages",
      series: range(7).map(
        (d) => Object.keys(d.languages).filter((k) => k !== "Other").length,
      ),
      sparkUnit: "languages",
    },
  ];

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (!window.location.hash)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const oldSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 800px)",
    ).matches
      ? "none"
      : "y mandatory";
    return () => {
      root.style.scrollSnapType = oldSnap;
    };
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.panel}`);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible);
        }),
      { threshold: 0.15 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const move = (
    e: React.KeyboardEvent,
    value: number,
    count: number,
    update: (n: number) => void,
  ) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
      update(
        (value +
          (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) +
          count) %
          count,
      );
    }
  };
  return (
    <>
      <Head>
        <title>Coding activity — Pravin Kumar</title>
        <meta
          name="description"
          content="Coding activity and the patterns behind the work."
        />
      </Head>
      <Header />
      <div className={`${styles.page}`}>
        <main>
          <section className={`${styles.panel} ${styles.hero}`} id="overview">
            <div className={styles.topline}>
              <span>
                CODING ACTIVITY · THROUGH{" "}
                {dateLabel(
                  activity.days[activity.days.length - 1].date,
                ).toUpperCase()}
              </span>
              <label className={styles.yearSelect}>
                VIEW{" "}
                <select
                  value={year}
                  onChange={(e) => {
                    const next = e.target.value;
                    setYear(next);
                    setEndDate(
                      (next === "all"
                        ? activity.days
                        : activity.days.filter((d) => d.date.startsWith(next))
                      ).slice(-1)[0].date,
                    );
                    setTower(null);
                    setSelected(29);
                    setLanguage(null);
                    setWeekday(null);
                  }}
                >
                  <option value="all">All years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.eyebrow}>
                  <span className={styles.greenDot} /> THE WORK BEHIND THE WORK
                </div>
                <h1>
                  Making things,
                  <br />
                  <em>one day at a time.</em>
                </h1>
                <p className={styles.lede}>
                  A little window into the hours, habits, and happy accidents
                  behind the code. All-time totals come from WakaTime; the
                  charts explore my exported history.
                </p>
              </div>
              <div className={styles.cards}>
                {metrics.map((m) => (
                  <div className={styles.card} key={m.label}>
                    <span>{m.label}</span>
                    <div>
                      <strong><AnimatedNumber value={m.value} /></strong> <small>{m.unit}</small>
                    </div>
                    <Spark
                      series={m.series}
                      color={m.color}
                      unit={m.sparkUnit}
                    />
                    <p>{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.bottomline}>
              <p>
                Not a measure of productivity.
                <br />
                Just a record of showing up.
              </p>
              <a href="#landscape">SCROLL TO EXPLORE ↓</a>
            </div>
          </section>
          <section
            className={`${styles.panel} ${styles.landscape}`}
            id="landscape"
          >
            <div className={styles.sectionHead}>
              <div>
                <div className={styles.eyebrow}>01 / THE LANDSCAPE</div>
                <h2>
                  Every day
                  <br />
                  <em>leaves a mark.</em>
                </h2>
              </div>
              <p>
                A skyline of time spent making things. Hover, tap, or use the
                arrow keys to explore a day.
              </p>
            </div>
            <label className={styles.dateControl}>
              CHART END DATE{" "}
              <input
                type="date"
                min={rows[0].date}
                max={rows[rows.length - 1].date}
                value={end}
                onChange={(e) => {
                  if (e.target.value) {
                    setEndDate(e.target.value);
                    setTower(null);
                    setSelected(29);
                  }
                }}
              />
            </label>
            <div className={styles.cityWrap}>
              <svg
                className={styles.citySvg}
                viewBox="0 0 750 270"
                role="group"
                aria-label="Coding activity chart. Use arrow keys to explore days."
                onKeyDown={(e) => move(e, tower ?? 0, skyline.length, setTower)}
              >
                {skyline.map((dayRecord, i) => {
                  const hours = dayRecord.seconds / 3600;
                  const week = Math.floor(i / 7),
                    day = i % 7,
                    x = 65 + week * 19 + day * 10,
                    y = 55 + week * 6 - day * 5,
                    h = (dayRecord.seconds / maxSkyline) * 65 + 3,
                    p = blockPath(x, y, h),
                    active = tower === i;
                  return (
                    <g
                      key={i}
                      className={styles.tower}
                      role="button"
                      tabIndex={i === (tower ?? 0) ? 0 : -1}
                      aria-label={`${dateLabel(dayRecord.date)}: ${formatHours(dayRecord.seconds)} hours`}
                      onFocus={() => setTower(i)}
                      onMouseEnter={() => setTower(i)}
                      onClick={() => setTower(i)}
                      style={
                        { "--delay": `${week * 25}ms` } as React.CSSProperties
                      }
                    >
                      <polygon
                        points={p.left}
                        fill={active ? "#53b575" : "#17683b"}
                      />
                      <polygon
                        points={p.right}
                        fill={active ? "#82daa0" : "#238c4e"}
                      />
                      <polygon
                        points={p.top}
                        fill={
                          active
                            ? "#c1f5cb"
                            : hours === 0
                              ? "#203c30"
                              : `hsl(139 52% ${35 + (dayRecord.seconds / maxSkyline) * 30}%)`
                        }
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className={styles.chartFooter}>
              <span aria-live="polite">
                {tower === null
                  ? `28 WEEKS ENDING ${dateLabel(end).toUpperCase()}`
                  : `${dateLabel(skyline[tower].date).toUpperCase()} · ${formatHours(skyline[tower].seconds)} HOURS`}
              </span>
              <span>
                LESS <i /> <i /> <i /> <i /> MORE
              </span>
            </div>
            <div className={styles.dividerStats}>
              <div>
                <span>THE IDEA</span>
                <strong>One day, one tower.</strong>
              </div>
              <div>
                <span>THE SOURCE</span>
                <strong>WakaTime export.</strong>
              </div>
              <div>
                <span>THE DETAILS</span>
                <strong>Names stay private.</strong>
              </div>
            </div>
          </section>
          <section
            className={`${styles.panel} ${styles.languages}`}
            id="languages"
          >
            <div className={styles.sectionHead}>
              <div>
                <div className={styles.eyebrow}>02 / THE MIX</div>
                <h2>
                  Time, in
                  <br />
                  <em>different languages.</em>
                </h2>
              </div>
              <p>
                Different tools for different ideas. Select a block to inspect
                the breakdown. Other includes all remaining languages.
              </p>
            </div>
            <div className={styles.dotColumns}>
              {languages.map((l, i) => (
                <button
                  className={`${styles.dotColumn} ${language === i ? styles.activeBlock : ""}`}
                  key={l.name}
                  onClick={() => setLanguage(i)}
                  onFocus={() => setLanguage(i)}
                  onMouseEnter={() => setLanguage(i)}
                  aria-pressed={language === i}
                >
                  <div className={styles.dots} aria-hidden="true">
                    {Array.from(
                      {
                        length: Math.max(
                          1,
                          Math.round(
                            (l.hours /
                              Math.max(...languages.map((x) => x.hours), 1)) *
                              70,
                          ),
                        ),
                      },
                      (_, j) => (
                        <span
                          key={j}
                          style={{
                            background: l.color,
                            animationDelay: `${j * 12}ms`,
                          }}
                        />
                      ),
                    )}
                  </div>
                  <div className={styles.languageLabel}>
                    <span>{l.name.toUpperCase()}</span>
                    <strong>
                      {l.hours.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      <small> hrs</small>
                    </strong>
                    <small>
                      {Math.round((l.hours / Math.max(hours(total), 1)) * 100)}%
                      OF TOTAL
                    </small>
                  </div>
                </button>
              ))}
            </div>
            <p className={styles.note} aria-live="polite">
              {language === null
                ? "Dot counts are scaled to the largest language."
                : `${languages[language].name}: ${languages[language].hours.toLocaleString("en-US", { maximumFractionDigits: 1 })} hours.`}
            </p>
            <details>
              <summary>Show as a table</summary>
              <table>
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Hours</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {languageTotals.map(([name, seconds]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{hours(seconds).toFixed(1)}</td>
                      <td>
                        {Math.round((seconds / Math.max(total, 1)) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </section>
          <section className={`${styles.panel} ${styles.month}`} id="month">
            <div className={styles.monthGrid}>
              <div className={styles.radial}>
                <svg
                  viewBox="0 0 400 400"
                  role="group"
                  aria-label="30-day activity chart. Use arrow keys to change day."
                  onKeyDown={(e) => move(e, selected, days.length, setSelected)}
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="168"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity=".12"
                    strokeDasharray="2 8"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="104"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity=".12"
                    strokeDasharray="2 8"
                  />
                  {days.map((h, i) => (
                    <path
                      key={i}
                      className={styles.wedge}
                      d={wedge(i, (h / maxRecent) * 6)}
                      fill={
                        h === 0
                          ? "#e1e6dd"
                          : h >= maxRecent * 0.6
                            ? "#327b4d"
                            : "#b6d3b9"
                      }
                      stroke={i === selected ? "#111" : "transparent"}
                      strokeWidth="2"
                      role="button"
                      tabIndex={i === selected ? 0 : -1}
                      aria-label={`${dateLabel(recent[i].date)}: ${h.toFixed(1)} hours`}
                      aria-pressed={i === selected}
                      onMouseEnter={() => setSelected(i)}
                      onFocus={() => setSelected(i)}
                      onClick={() => setSelected(i)}
                      style={
                        { "--delay": `${i * 30}ms` } as React.CSSProperties
                      }
                    />
                  ))}
                </svg>
                <div className={styles.radialCenter} aria-live="polite">
                  <strong>
                    {days[selected].toFixed(1)}
                    <small>h</small>
                  </strong>
                  <span>{dateLabel(recent[selected].date).toUpperCase()}</span>
                </div>
              </div>
              <div>
                <div className={styles.eyebrow}>
                  03 / THIRTY DAYS IN A CIRCLE
                </div>
                <h2>
                  A month blooms
                  <br />
                  <em>in a second.</em>
                </h2>
                <p>
                  One spoke per day. The longer the spoke, the more time spent
                  coding. Hover, tap, or use the arrow keys to inspect it.
                </p>
                <label className={styles.selectLabel} htmlFor="day">
                  INSPECT A DAY
                </label>
                <select
                  id="day"
                  value={selected}
                  onChange={(e) => setSelected(Number(e.target.value))}
                >
                  {days.map((_, i) => (
                    <option key={i} value={i}>
                      {dateLabel(recent[i].date)}
                    </option>
                  ))}
                </select>
                <details>
                  <summary>Show as a table</summary>
                  <table>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((h, i) => (
                        <tr key={i}>
                          <td>{dateLabel(recent[i].date)}</td>
                          <td>{h.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </div>
            </div>
          </section>
          <section className={`${styles.panel} ${styles.rhythm}`} id="rhythm">
            <div className={styles.eyebrow}>04 / WEEKDAY AVERAGE</div>
            <h2>
              Every week has
              <br />
              <em>its own rhythm.</em>
            </h2>
            <p>
              Average time by day of the week, split across the four largest
              activity categories across all calendar days in the selected
              period.
            </p>
            <div
              className={styles.weekChart}
              role="group"
              aria-label="Weekday averages for the four largest categories"
              onKeyDown={(e) => move(e, weekday ?? 0, 7, setWeekday)}
            >
              {weekdays.map((day, i) => (
                <div className={styles.weekColumn} key={day}>
                  <button
                    className={styles.weekBar}
                    aria-label={`${day}: ${categories.reduce((sum, c) => sum + c.values[i], 0).toFixed(1)} hours average`}
                    onMouseEnter={() => setWeekday(i)}
                    onFocus={() => setWeekday(i)}
                    onClick={() => setWeekday(i)}
                    aria-pressed={weekday === i}
                  >
                    {categories.map((c) => (
                      <span
                        key={c.name}
                        style={{
                          height: `${(c.values[i] / weekMax) * 100}%`,
                          background: c.color,
                        }}
                      />
                    ))}
                  </button>
                  <span>{day.slice(0, 3)}</span>
                </div>
              ))}
            </div>
            <div className={styles.weekReadout} aria-live="polite">
              {weekday === null
                ? "HOVER, TAP OR FOCUS A DAY TO INSPECT"
                : `${weekdays[weekday]} · ${categories.map((c) => `${c.name} ${c.values[weekday].toFixed(1)}h`).join("  /  ")}`}
            </div>
            <div className={styles.legend}>
              {categories.map((c) => (
                <span key={c.name}>
                  <i style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
            <details>
              <summary>Show as a table</summary>
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    {categories.map((c) => (
                      <th key={c.name}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weekdays.map((d, i) => (
                    <tr key={d}>
                      <td>{d}</td>
                      {categories.map((c) => (
                        <td key={c.name}>{c.values[i].toFixed(1)} h</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            <p className={styles.method}>
              Based on {activity.eventCount.toLocaleString()} events in the full
              export, through{" "}
              {dateLabel(activity.days[activity.days.length - 1].date)}. Time is
              estimated from consecutive heartbeats within the{" "}
              {activity.timeoutSeconds / 60}-minute timeout; isolated events
              contribute no time. WakaTime totals may differ. Only daily totals
              and approved language and activity categories are included.{" "}
              {year === "all"
                ? `All-time overview: ${profile.live ? "WakaTime public stats" : `WakaTime snapshot from ${dateLabel(profile.observedDate)}`}.`
                : "Yearly overview figures are estimates from the export."}
            </p>
            <div className={styles.profileLinks}>
              <a
                href="https://wakatime.com/@pravindia"
                target="_blank"
                rel="noreferrer"
              >
                WakaTime ↗
              </a>
              <a
                href="https://github.com/pravindia"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </section>
        </main>
      </div>
      <div className={styles.footerPanel}>
        <Footer textEnter={() => {}} textLeave={() => {}} />
      </div>
    </>
  );
}
