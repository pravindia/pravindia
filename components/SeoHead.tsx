import Head from "next/head";
import { siteUrl } from "../lib/developers";

type Props = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
};

const profileUrl = `${siteUrl}/`;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${profileUrl}#person`,
  name: "Pravin Kumar",
  alternateName: "pravindia",
  url: profileUrl,
  jobTitle: "Senior Software Developer",
  description:
    "Backend and applied AI engineer focused on distributed systems, TypeScript, Python, and production AI integrations.",
  sameAs: [
    "https://github.com/pravindia",
    "https://www.linkedin.com/in/pravindia",
    "https://codepen.io/pravindia",
  ],
};

export default function SeoHead({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  structuredData,
  noindex = false,
}: Props) {
  const canonical = new URL(path, `${siteUrl}/`).toString();
  const customData = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];
  const data = [
    {
      "@context": "https://schema.org",
      "@type": type === "article" ? "WebPage" : "WebPage",
      name: title,
      description,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: "Pravin Kumar", url: profileUrl },
    },
    ...customData,
  ];
  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={canonical} />
      {noindex && (
        <meta key="robots" name="robots" content="noindex, nofollow" />
      )}
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:url" property="og:url" content={canonical} />
      <meta key="og:site_name" property="og:site_name" content="Pravin Kumar" />
      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      {publishedTime && (
        <meta
          key="article:published_time"
          property="article:published_time"
          content={publishedTime}
        />
      )}
      {data.map((item, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </Head>
  );
}
