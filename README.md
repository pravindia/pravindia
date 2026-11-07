# Hi there 👋

I'm **Pravin Kumar**, Senior Software Engineer · 8.4 Years · Backend Architecture, AI Engineering & Distributed Systems · TypeScript & Python · Node.js · Angular, React.js, AWS, System Design, Applied AI, RAG & LLMOps

---

## 🚀 About Me

* 💼 Current role: Senior Software Developer
* 🌱 Currently learning: Cloud architecture, AI systems, distributed systems
* 🔭 Working on: Open-source projects and backend platforms
* ⚡ Interests: System design, AI automation, developer tooling
* 📫 Reach me at: `hello [at] pravindia [dot] com`
* 🌐 Portfolio: [https://pravindia.com](https://pravindia.com)


## 🤝 Connect With Me

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github)](https://github.com/pravindia)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge\&logo=linkedin)](https://linkedin.com/in/pravindia)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge\&logo=x)](https://x.com/pravindia_)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge\&logo=gitlab)](https://gitlab.com/pravindia)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge\&logo=firefox-browser)](https://pravindia.com)

### Coding activity data

The coding dashboard uses `data/coding-activity.json`, a compact, public-safe aggregate generated locally from a private WakaTime heartbeat export. To refresh it, run:

```sh
python3 scripts/import-wakatime.py /path/to/wakatime-export.json
```

The importer reads one export day at a time, processes the complete history, and uses the export's timezone and activity timeout. It estimates time between consecutive heartbeats when their gap is within the timeout, splitting intervals at local midnight. Isolated heartbeats add no time; estimates may differ from WakaTime's server-calculated summaries. Daily time, counts, and allowlisted language and activity-category totals are the only exported fields. Unknown labels are grouped as Other; filenames, projects, branches, machine identifiers, user details, and raw events never enter the aggregate. The original export should remain outside the website repository. The dashboard is a snapshot, not a live connection.

The all-time overview fetches the public WakaTime profile statistics on the server, cached for an hour; it falls back to the checked-in public snapshot if WakaTime is unavailable. WakaTime only exposes the configured public range, so individual years and daily charts continue to use the export-based estimates.

### Typing dashboard

`/typing` reads the public Monkeytype profile for personal bests and all-time stats. To show a history chart, create an ApeKey in Monkeytype account settings and set `MONKEYTYPE_APE_KEY` as a **server-side** environment variable (locally in `.env.local` and in your hosting provider). The page shows matching 60-second English tests from the latest 1,000 results; the key is never sent to the browser. Without a key, the public profile and personal bests still work. Responses are cached by supporting shared caches for an hour, with stale responses permitted while revalidating. The ApeKey results endpoint allows up to 30 requests per day, so local development or cache misses can exhaust that limit.

The Keybr section fetches the public profile’s lesson data server-side and falls back to the snapshot retrieved on 7 November 2026 if the request or parsing fails. This is an internal Keybr endpoint and binary format, not a supported public API, so it may change. Daily speed is calculated from total characters and time for valid lessons, with five characters per word; this is not necessarily identical to Keybr’s own filters or charts.
