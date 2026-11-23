import { reducedMotion } from './motion'

function show(el: Element) {
  if (el.classList.contains('pre')) {
    el.classList.add('in')
    el.classList.remove('pre')
    setTimeout(() => el.classList.remove('in'), 2200)
  }
  if (el.classList.contains('ln-pre')) {
    el.classList.add('ln-in')
    el.classList.remove('ln-pre')
    el.classList.add('seen')
  }
  if (el.classList.contains('clip-pre')) {
    el.classList.add('clip-in')
    el.classList.remove('clip-pre')
  }
}

/**
 * Progressive scroll reveals for `.reveal`, `.reveal-clip` and section headings.
 * Elements already in view on first paint are shown without animating.
 */
export function initReveals(root: ParentNode) {
  if (reducedMotion()) return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        show(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92
  const watch = (el: Element, cls: string) => {
    if (below(el)) el.classList.add(cls)
    observer.observe(el)
  }

  root.querySelectorAll('.reveal').forEach((el) => watch(el, 'pre'))
  root.querySelectorAll('.reveal-clip').forEach((el) => watch(el, 'clip-pre'))
  root.querySelectorAll('.chap .photo').forEach((el) => watch(el, 'clip-pre'))
  root
    .querySelectorAll('section:not(.hero) .h2, .final h2')
    .forEach((el) => watch(el, 'ln-pre'))

  let timer: ReturnType<typeof setTimeout> | undefined
  const sweep = () => {
    root.querySelectorAll('.pre, .ln-pre, .clip-pre').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
        observer.unobserve(el)
        show(el)
      }
    })
  }
  const onScroll = () => {
    clearTimeout(timer)
    timer = setTimeout(sweep, 140)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    observer.disconnect()
    clearTimeout(timer)
    window.removeEventListener('scroll', onScroll)
  }
}
