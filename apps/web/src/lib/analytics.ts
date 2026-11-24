type UmamiPayload = Record<string, unknown>

type UmamiTrack = (
  event?: string | ((props: UmamiPayload) => UmamiPayload),
  data?: Record<string, unknown>,
) => void

declare global {
  interface Window {
    umami?: { track: UmamiTrack }
  }
}

/**
 * The Umami script in index.html records the first page load on its own.
 * Call this for subsequent SPA navigations so each route change is a page view.
 */
export function trackPageView(url: string) {
  window.umami?.track((props) => ({
    ...props,
    url,
    title: document.title,
  }))
}
