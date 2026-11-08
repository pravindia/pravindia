import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackEvent } from '../lib/analytics'
import CommandPalette from '../components/CommandPalette/CommandPalette'
import { CommandPaletteProvider } from '../lib/CommandPaletteContext'
import PageLoader from '../components/PageLoader/PageLoader'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const { utm_source, utm_medium, utm_campaign } = router.query
    if (utm_source) {
      trackEvent('referral_landing', {
        source: String(utm_source),
        ...(utm_medium && { medium: String(utm_medium) }),
        ...(utm_campaign && { campaign: String(utm_campaign) }),
      })
    }
  }, [router.query])

  return (
  <>
    <Head>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png" />
      <meta name="theme-color" content="#071411" />
    </Head>
    <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-N0HZPFEXMB"></Script>
    <Script
      id="gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N0HZPFEXMB', {
          page_path: window.location.pathname,
        });`,
      }}
    />
    <CommandPaletteProvider>
      <PageLoader />
      <Component {...pageProps} />
      <CommandPalette />
    </CommandPaletteProvider>
    <Analytics />
  </>);
}
