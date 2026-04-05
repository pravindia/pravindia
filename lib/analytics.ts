import { track } from '@vercel/analytics'

type EventProperties = Record<string, string | number | boolean>

export const trackEvent = (name: string, properties?: EventProperties) => {
  track(name, properties)
}

// Pre-typed helpers for common events
export const Analytics = {
  /** Track a page CTA click, e.g. "See my work", "Resumé" */
  ctaClick: (label: string) => trackEvent('cta_click', { label }),

  /** Track a project card click */
  projectView: (slug: string) => trackEvent('project_view', { slug }),

  /** Track an external link click (GitHub, LinkedIn, etc.) */
  externalLink: (url: string) => trackEvent('external_link_click', { url }),

  /** Track resume download / view */
  resumeView: () => trackEvent('resume_view'),

  /** Track any custom event */
  custom: trackEvent,
}
