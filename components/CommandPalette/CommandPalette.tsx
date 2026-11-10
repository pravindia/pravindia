import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useCommandPalette } from "../../lib/CommandPaletteContext";
import { works } from "../../data/works";
import CommandIcon, { IconName } from "./CommandIcon";
import styles from "./CommandPalette.module.scss";

interface Command {
  id: string;
  title: string;
  description?: string;
  group: "Pages" | "Scribble" | "Projects";
  icon: IconName;
  href: string;
  external?: boolean;
  date?: string;
  tags?: string[];
}
interface Post {
  url: string;
  external?: boolean;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}
const pages: Command[] = [
  { id: "home", title: "Home", group: "Pages", icon: "home", href: "/" },
  {
    id: "blog",
    title: "Blog",
    description: "Essays, engineering insights, and notes",
    group: "Pages",
    icon: "book",
    href: "/blog",
  },
  {
    id: "coding",
    title: "Coding",
    description: "Coding activity and language history",
    group: "Pages",
    icon: "chart",
    href: "/coding",
  },
  {
    id: "works",
    title: "Works",
    description: "Projects and engineering case studies",
    group: "Pages",
    icon: "work",
    href: "/works",
  },
  {
    id: "typing",
    title: "How fast I type?",
    description: "Typing practice and progress",
    group: "Pages",
    icon: "keyboard",
    href: "/typing",
  },
  //   { id: "learning", title: "Learning", description: "What I’m exploring and learning", group: "Pages", icon: "learn", href: "/#learning" },
  {
    id: "developers",
    title: "Developers",
    description: "Public APIs, agent context, and resources",
    group: "Pages",
    icon: "code",
    href: "/developers",
  },
  {
    id: "resume",
    title: "Resume",
    description: "View my CV on Google Drive",
    group: "Pages",
    icon: "file",
    href: "https://drive.google.com/file/d/1i1xcgy1VaEw1n1eI4p9JeZ2hJDLsw17K/view?usp=sharing",
    external: true,
  },
];
const projects: Command[] = works.map((work) => ({
  id: `work-${work.slug}`,
  title: work.title,
  description: work.summary,
  group: "Projects",
  icon: "work",
  href: `/works/${work.slug}`,
  tags: work.tech,
}));
const quickCommands = ["home", "works", "blog", "resume"].map(
  (id) => pages.find((command) => command.id === id)!,
);
const resultPages = pages.filter((command) => !quickCommands.includes(command));

export default function CommandPalette() {
  const { isOpen, openPalette, closePalette } = useCommandPalette();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const loaded = useRef(false);
  const allCommands = useMemo(
    () => [
      ...resultPages,
      ...posts.map(
        (post): Command => ({
          id: `post-${post.slug}`,
          title: post.title,
          description: post.excerpt,
          date: post.date,
          tags: post.tags,
          group: "Scribble",
          icon: "file",
          href: post.external ? post.url : `/blog/${post.slug}`,
          external: post.external,
        }),
      ),
      ...projects,
    ],
    [posts],
  );
  const filtered = allCommands.filter((cmd) =>
    `${cmd.title} ${cmd.description || ""} ${cmd.tags?.join(" ") || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const selected = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, openPalette, closePalette]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setSearch("");
    setSelectedIndex(0);
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || loaded.current) return;
    const controller = new AbortController();
    setLoadState("loading");
    fetch("/api/v1/posts", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load writing");
        return response.json();
      })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid posts");
        setPosts(data);
        loaded.current = true;
        setLoadState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadState("error");
      });
    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    optionRefs.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected, search]);

  function choose(command: Command) {
    if (command.external)
      window.open(command.href, "_blank", "noopener,noreferrer");
    else void router.push(command.href);
    closePalette();
  }
  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    }
    if (
      (event.key === "ArrowDown" || event.key === "ArrowUp") &&
      filtered.length
    ) {
      event.preventDefault();
      setSelectedIndex(
        (selected + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) %
          filtered.length,
      );
    }
    if (
      event.key === "Enter" &&
      event.target === inputRef.current &&
      filtered[selected]
    ) {
      event.preventDefault();
      choose(filtered[selected]);
    }
    if (event.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  if (!isOpen) return null;
  return (
    <>
      <div className={styles.backdrop} onClick={closePalette} />
      <div
        ref={dialogRef}
        className={styles.container}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onKeyDown={onKeyDown}
      >
        <div className={styles.inputWrapper}>
          <CommandIcon name="search" />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search pages, writing, projects…"
            aria-label="Search pages, writing, and projects"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-results"
            aria-activedescendant={
              filtered[selected]
                ? `command-${filtered[selected].id}`
                : undefined
            }
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setSelectedIndex(0);
            }}
          />
          {search && (
            <button
              className={styles.iconButton}
              onClick={() => {
                setSearch("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <CommandIcon name="close" />
            </button>
          )}
          <button
            className={styles.closeButton}
            onClick={closePalette}
            aria-label="Close search"
          >
            <kbd>Esc</kbd>
          </button>
        </div>
        <nav className={styles.quickLinks} aria-label="Quick access">
          {quickCommands.map((command) => (
            <button
              key={command.id}
              data-accent={"tertiary"}
              onClick={() => choose(command)}
              aria-label={
                command.external
                  ? `${command.title} (opens in a new tab)`
                  : undefined
              }
            >
              <CommandIcon name={command.icon} />
              {command.title}
            </button>
          ))}
        </nav>
        <div
          id="command-results"
          className={styles.results}
          role="listbox"
          aria-label="Search results"
        >
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <CommandIcon name="search" />
              <p>No results for “{search}”</p>
              <span>Try a page, article topic, or technology.</span>
            </div>
          ) : (
            filtered.map((cmd, index) => (
              <div key={cmd.id}>
                {(index === 0 || filtered[index - 1].group !== cmd.group) && (
                  <div className={styles.group} data-group={cmd.group} role="presentation">
                    {cmd.group}
                  </div>
                )}
                <button
                  id={`command-${cmd.id}`}
                  role="option"
                  aria-selected={index === selected}
                  tabIndex={-1}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  className={`${styles.item} ${index === selected ? styles.selected : ""} ${cmd.group === "Scribble" ? styles.article : ""}`}
                  onClick={() => choose(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className={styles.icon}>
                    <CommandIcon name={cmd.icon} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.title}>{cmd.title}</span>
                    {cmd.description && (
                      <span className={styles.description}>
                        {cmd.description}
                      </span>
                    )}
                    {cmd.group === "Scribble" && (
                      <span className={styles.articleMeta}>
                        {cmd.external ? new URL(cmd.href).hostname.replace(/^www\./, "") : "pravindia.com"} <span aria-hidden="true">·</span>{" "}
                        {/^\d{4}$/.test(cmd.date || "") ? cmd.date : new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        }).format(new Date(cmd.date!))}
                      </span>
                    )}
                  </span>
                  {cmd.external ? (
                    <span className={styles.category}>External</span>
                  ) : (
                    <span className={styles.resultArrow}>
                      <CommandIcon name="arrow" />
                    </span>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
        {loadState === "loading" && (
          <div className={styles.notice} role="status">
            Loading articles…
          </div>
        )}
        {loadState === "error" && (
          <div className={styles.notice} role="status">
            Articles couldn’t load. Search pages and projects, or{" "}
            <button
              onClick={() => {
                closePalette();
                void router.push("/blog");
              }}
            >
              browse the blog
            </button>
            .
          </div>
        )}
        <div className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>Enter</kbd> Open
          </span>
          <span>
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </>
  );
}
