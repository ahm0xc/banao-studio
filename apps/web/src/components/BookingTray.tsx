import { For, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { CASES } from '../lib/content'
import type { CaseStudy } from '../lib/content'
import { EASE, EASE_IN, anim, fin } from '../lib/motion'
import { useUi } from '../lib/ui'
import { Shot } from './shots'

export function BookingTray() {
  const ui = useUi()
  const [visible, setVisible] = createSignal(false)
  const [current, setCurrent] = createSignal<CaseStudy | null>(null)

  let trayRef!: HTMLDivElement
  let scrimRef!: HTMLDivElement
  let isOpen = false
  let lastFocus: HTMLElement | null = null

  createEffect(() => {
    const id = ui.caseId()

    if (id) {
      const study = CASES.find((item) => item.id === id)
      if (!study || isOpen) return
      lastFocus = document.activeElement as HTMLElement | null
      setCurrent(study)
      isOpen = true
      setVisible(true)
      document.body.classList.add('tray-open')

      requestAnimationFrame(() => {
        if (!trayRef || !scrimRef) return
        anim(
          trayRef,
          [{ transform: 'translate(-50%, calc(100% + 48px))' }, { transform: 'translate(-50%, 0)' }],
          { duration: 520, easing: EASE },
        )
        anim(scrimRef, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: EASE })
        trayRef.querySelector<HTMLButtonElement>('#tray-close')?.focus({ preventScroll: true })
      })
      return
    }

    if (!isOpen) return
    isOpen = false
    const tray = trayRef
    const scrim = scrimRef
    if (!tray || !scrim) {
      setVisible(false)
      document.body.classList.remove('tray-open')
      return
    }

    const out = anim(
      tray,
      [{ transform: 'translate(-50%, 0)' }, { transform: 'translate(-50%, calc(100% + 48px))' }],
      { duration: 260, easing: EASE_IN, fill: 'forwards' },
    )
    fin(
      anim(scrim, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: EASE_IN, fill: 'forwards' }),
      () => {
        scrim.getAnimations().forEach((animation) => animation.cancel())
      },
    )
    fin(out, () => {
      out.cancel()
      setVisible(false)
      document.body.classList.remove('tray-open')
      lastFocus?.focus({ preventScroll: true })
    })
  })

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!visible()) return
      if (event.key === 'Escape') {
        event.preventDefault()
        ui.closeCase()
        return
      }
      if (event.key !== 'Tab' || !trayRef) return
      const focusable = Array.from(
        trayRef.querySelectorAll<HTMLElement>('button:not([disabled]):not([hidden]), input, textarea'),
      ).filter((el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    onCleanup(() => document.removeEventListener('keydown', onKey))
  })

  const buildSomethingLikeThis = () => {
    ui.closeCase()
    setTimeout(() => ui.openBooking(), 320)
  }

  return (
    <Show when={visible() && current()}>
      {(study) => (
        <>
          <div class="scrim" ref={scrimRef} onClick={() => ui.closeCase()} />
          <div
            class="tray"
            ref={trayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tray-title"
            data-size="lg"
          >
            <div class="tray-head">
              <span class="ib" aria-hidden="true" style={{ visibility: 'hidden' }} />
              <h2 class="tray-title" id="tray-title">
                {study().name}
              </h2>
              <button class="ib" type="button" id="tray-close" aria-label="Close" onClick={() => ui.closeCase()}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <div class="tray-body">
              <div class="cs">
                <div class="cs-media">
                  <Shot deep={study().deep}>
                    <Dynamic component={study().shot} />
                  </Shot>
                </div>
                <p class="label">{study().metaLong}</p>
                <div class="cs-res">
                  <strong>{study().metric}</strong>
                  <span>{study().win}</span>
                </div>
                <div class="cs-block">
                  <span class="label">The problem</span>
                  <p>{study().problem}</p>
                </div>
                <div class="cs-block">
                  <span class="label">What we built</span>
                  <p>{study().built}</p>
                </div>
                <div class="tags">
                  <For each={study().stack}>{(tech) => <span>{tech}</span>}</For>
                </div>
              </div>
            </div>
            <div class="tray-foot">
              <button class="cta" type="button" onClick={buildSomethingLikeThis}>
                <span>Build something like this</span>
              </button>
            </div>
          </div>
        </>
      )}
    </Show>
  )
}
