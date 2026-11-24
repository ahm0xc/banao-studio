import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { trackPageView } from './lib/analytics'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  // The Umami script already tracks the initial page load, so seed this with
  // the current URL and only report real page changes after hydration.
  let lastTrackedUrl = window.location.pathname + window.location.search

  router.subscribe('onResolved', ({ toLocation }) => {
    const url = toLocation.pathname + toLocation.searchStr
    if (url === lastTrackedUrl) return

    lastTrackedUrl = url
    trackPageView(url)
  })

  return router
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
