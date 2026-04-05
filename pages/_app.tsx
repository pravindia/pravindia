import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackEvent } from '../lib/analytics'

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
    <Component {...pageProps} />
    <Analytics />
  </>);
}
