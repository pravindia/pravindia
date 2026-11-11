import { useEffect, useId, useRef, useState } from "react";
import styles from "./LocalClock.module.scss";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

// Each activity can receive a cat GIF here when the assets are ready.
const activities = [
  { start: 0, end: 6, title: "Cat.exe is sleeping", caption: "Do not disturb. Dreaming of bug-free code.", hours: "10 pm - 6 am", cat: "(－ω－) z Z" },
  { start: 6, end: 7, title: "Booting up…", caption: "Eyes open. Brain still loading.", hours: "6 - 7 am", cat: "(=￣ω￣=)" },
  { start: 7, end: 8, title: "Coffee before code", caption: "One cup closer to being a functioning human.", hours: "7 - 8 am", cat: "(=^･ω･^=)" },
  { start: 8, end: 9, title: "Two wheels, nine lives", caption: "On the bike to the office. Keyboard paws on pause.", hours: "8 - 9 am", cat: "ฅ(•ω•)ฅ" },
  { start: 9, end: 13, title: "Professionally chasing bugs", caption: "If it works, the cat takes credit.", hours: "9 am - 1 pm", cat: "(=ↀωↀ=)" },
  { start: 13, end: 14, title: "Time to refuel", caption: "Currently debugging the lunch box.", hours: "1 - 2 pm", cat: "(=^ ◡ ^=)" },
  { start: 14, end: 18, title: "Back to chasing bugs", caption: "Turning coffee into commits, one paw at a time.", hours: "2 - 6 pm", cat: "(=ↀωↀ=)" },
  { start: 18, end: 19, title: "Lifting more than dependencies", caption: "Gym time. Training for the next heavy pull request.", hours: "6 - 7 pm", cat: "ᕦ(=•ω•=)ᕤ" },
  { start: 19, end: 20, title: "Away from the keyboard", caption: "A little downtime between side quests.", hours: "7 - 8 pm", cat: "(=^･ω･^=)" },
  { start: 20, end: 22, title: "Dark mode. Cat mode.", caption: "Lights off. Editor on. Just one more commit.", hours: "8 - 10 pm", cat: "(=✧ω✧=)" },
  { start: 22, end: 24, title: "Cat.exe is sleeping", caption: "Do not disturb. Dreaming of bug-free code.", hours: "10 pm - 6 am", cat: "(－ω－) z Z" },
];

export default function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [open]);
  const hour = now ? Number(formatter.formatToParts(now).find(part => part.type === "hour")?.value) : 0;
  const activity = activities.find(item => hour >= item.start && hour < item.end)!;

  return (
    <div className={styles.wrapper} ref={root} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button className={styles.trigger} type="button" aria-label="What am I probably doing now?" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)} onFocus={() => setOpen(true)}>
        <span className={styles.hint}>What’s this human up to?</span>
        <time dateTime={now?.toISOString()} aria-label="Local time in India">{now ? formatter.format(now) : "--:--:--"} <span>IST</span></time>
      </button>
      {open && now && <div id={id} className={styles.tooltip} role="region" aria-label="My likely activity">
        <div className={styles.cat} aria-hidden="true">{activity.cat}</div>
        <h4>{activity.title}</h4>
        <p>{activity.caption}</p>
        <div className={styles.meta}>{activity.hours} IST <span>· probably</span></div>
      </div>}
    </div>
  );
}
