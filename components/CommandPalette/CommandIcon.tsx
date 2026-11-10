export type IconName = "home" | "book" | "code" | "chart" | "work" | "keyboard" | "learn" | "file" | "search" | "close" | "arrow";
const paths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z",
  book: "M12 5v16M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
  chart: "M4 3v17h17M8 15v-4m5 4V7m5 8V4",
  work: "M8 7V4h8v3M3 7h18v13H3ZM3 12a23 23 0 0 0 18 0M12 11v4",
  keyboard: "M2 5h20v14H2ZM6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M8 16h8",
  learn: "m2 9 10-5 10 5-10 5ZM6 11v6q6 5 12 0v-6M22 9v8",
  file: "M14 2H5v20h14V7ZM14 2v6h5M8 12h8M8 16h6",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  close: "m6 6 12 12M6 18 18 6",
  arrow: "M4 12h15m-6-6 6 6-6 6",
};
export default function CommandIcon({ name }: { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
