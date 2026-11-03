import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { agentPrompt, endpointGroups, siteUrl } from '../lib/developers';
import styles from '../styles/Developers.module.scss';

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('Copied!');
    } catch {
      setStatus('Select and copy the text');
    }
  }
  return <button type="button" className={styles.copy} onClick={copy} aria-label={`Copy ${label === 'Copy' ? 'request' : 'agent prompt'}`}><span aria-live="polite">{status || label}</span></button>;
}

const requests = [
  { comment: '# Get to know the human', command: `curl ${siteUrl}/llms.txt` },
  { comment: '# Explore what I build', command: `curl ${siteUrl}/api/v1/projects` },
  { comment: '# Fetch the latest writing', command: `curl ${siteUrl}/api/v1/posts` },
];

export default function Developers() {
  return <>
    <Head>
      <title>Developers — Pravin Kumar</title>
      <meta name="description" content="Connect your tools and AI agents to Pravin Kumar's portfolio. Public JSON APIs, plain-text context, RSS, and an OpenAPI specification." />
      <link rel="canonical" href={`${siteUrl}/developers`} />
      <link rel="alternate" type="text/markdown" href={`${siteUrl}/developers.md`} />
      <link rel="alternate" type="application/rss+xml" title="Pravin Kumar — Writing" href="/api/rss.xml" />
      <meta property="og:title" content="Developers — Pravin Kumar" />
      <meta property="og:description" content="A human behind the code. An interface for your agent." />
      <meta property="og:url" content={`${siteUrl}/developers`} />
      <meta property="og:type" content="website" />
    </Head>
    <Header />
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.breadcrumb}><a href="/">~/pravindia</a><span>/</span><span>developers</span></div>
        <section className={styles.hero} aria-labelledby="developers-title">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">❯</span> hello, developers</p>
            <h1 id="developers-title">Built for humans.<br /><span>Readable by agents.</span></h1>
            <p className={styles.intro}>I&apos;m Pravin. I build backend systems, products, and AI integrations. Here&apos;s an interface to my corner of the internet, for whatever you&apos;re building next.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#quickstart">Make your first request <span aria-hidden="true">↗</span></a>
              <a className={styles.secondary} href="/openapi.json">OpenAPI spec <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.badges}><span><i /> Public access</span><span>No API key</span><span>Read-only</span></div>
          </div>
          <div className={styles.terminal} id="quickstart">
            <div className={styles.terminalHeader}><span className={styles.dots} aria-hidden="true"><i /><i /><i /></span><span>pravindia — quickstart</span><span aria-hidden="true">⌘</span></div>
            <div className={styles.terminalBody}>{requests.map(request => <div className={styles.request} key={request.command}>
              <span className={styles.comment}>{request.comment}</span>
              <div className={styles.command}><code><span aria-hidden="true">$ </span>{request.command}</code><CopyButton value={request.command} /></div>
            </div>)}<p className={styles.terminalNote}><span aria-hidden="true">✓</span> No setup. Just HTTP.</p></div>
          </div>
        </section>

        <section className={styles.endpoints} aria-labelledby="endpoints-title">
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>/01 — the interface</span><h2 id="endpoints-title">Less scraping. More building.</h2></div><p>Small, predictable endpoints.<br />Pick the format that fits your workflow.</p></div>
          <div className={styles.endpointGrid}>{endpointGroups.map((group, index) => <article className={styles.group} key={group.title}>
            <div className={styles.groupHeading}><span className={styles.groupNumber}>0{index + 1}</span><h3>{group.title}</h3></div>
            <p>{group.description}</p>
            <ul>{group.endpoints.map(endpoint => <li key={endpoint.path}><div className={styles.endpointLabel}><span className={styles.method}>GET</span><a href={endpoint.path}>{endpoint.path}<span aria-hidden="true"> ↗</span></a></div><p>{endpoint.description}</p><span className={styles.format}>{endpoint.format}</span></li>)}</ul>
          </article>)}</div>
        </section>

        <section className={styles.agent} aria-labelledby="agent-title">
          <div><span className={styles.eyebrow}>/02 — bring your agent</span><h2 id="agent-title">Let your assistant do the reading.</h2><p>Give it a starting point. Ask about my stack, explore a project, or find something to read.</p><div className={styles.agentLinks}>
            <a href={`https://claude.ai/new?q=${encodeURIComponent(agentPrompt)}`} target="_blank" rel="noopener noreferrer">Ask Claude ↗</a>
            <a href={`https://chatgpt.com/?q=${encodeURIComponent(agentPrompt)}`} target="_blank" rel="noopener noreferrer">Ask ChatGPT ↗</a>
            <a href={`https://www.perplexity.ai/search?q=${encodeURIComponent(agentPrompt)}`} target="_blank" rel="noopener noreferrer">Ask Perplexity ↗</a>
          </div></div>
          <div className={styles.promptBox}><div><span>starter-prompt.txt</span><CopyButton value={agentPrompt} label="Copy prompt" /></div><p>{agentPrompt}</p></div>
        </section>

        <section className={styles.reference} aria-labelledby="reference-title">
          <div><span className={styles.eyebrow}>/03 — good to know</span><h2 id="reference-title">A few implementation notes.</h2><a className={styles.textLink} href="/developers.md">Read the Markdown guide ↗</a></div>
          <div className={styles.notes}>
            <details open><summary>Authentication &amp; access</summary><p>All documented resources are public and read-only. Use GET requests; the JSON API also supports HEAD and OPTIONS. There are no API keys or accounts to configure.</p></details>
            <details><summary>Response format &amp; errors</summary><p>JSON endpoints return a <code>data</code> property. Unknown API resources return HTTP 404 with an <code>error</code> object; unsupported methods return 405. Blog results contain metadata and article links, rather than full article bodies.</p></details>
            <details><summary>Caching &amp; considerate use</summary><p>JSON responses are cacheable for five minutes, with stale content served during revalidation. Cache responses in your application and avoid repeated polling. No fixed request quota is promised by this API.</p></details>
            <details><summary>Using the content</summary><p>Link back to the original page when referencing my work or writing. The plain-text and Markdown resources use their own URLs; standard pages continue to serve HTML.</p></details>
          </div>
        </section>
        <div className={styles.signoff}><code><span>❯</span> build something interesting<span className={styles.cursor}>_</span></code><a href="https://github.com/pravindia" target="_blank" rel="noopener noreferrer">Find me on GitHub ↗</a></div>
      </main>
      <Footer textEnter={() => {}} textLeave={() => {}} />
    </div>
  </>;
}
