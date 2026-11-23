import { onCleanup, onMount } from 'solid-js'
import { reducedMotion } from '../lib/motion'
import { SkyVideo } from './primitives'

export function DemoBand() {
  let bandRef!: HTMLDivElement
  let imageRef!: HTMLImageElement
  let chipOne!: HTMLDivElement
  let chipTwo!: HTMLDivElement

  onMount(() => {
    if (reducedMotion()) return
    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight
      const rect = bandRef.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > vh) return

      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.85)))
      const eased = 1 - Math.pow(1 - progress, 2)
      bandRef.style.clipPath = `inset(${((1 - eased) * 6).toFixed(2)}% ${((1 - eased) * 8).toFixed(2)}% round 24px)`

      const center = (rect.top + rect.height / 2 - vh / 2) / vh
      const media: HTMLElement[] = [imageRef]
      const video = bandRef.querySelector('video')
      if (video) media.push(video)
      media.forEach((el) => {
        el.style.transform = `translate3d(0, ${(center * -100 * 0.12).toFixed(2)}%, 0)`
      })

      const chips: [HTMLDivElement, number][] = [
        [chipOne, 0.5],
        [chipTwo, -0.4],
      ]
      chips.forEach(([chip, amount]) => {
        if (!chip) return
        if (chip.classList.contains('pre') || chip.classList.contains('in')) return
        chip.style.transform = `translate3d(0, ${(center * 120 * amount).toFixed(1)}px, 0)`
      })
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    onCleanup(() => window.removeEventListener('scroll', onScroll))
  })

  return (
    <section class="band" aria-label="Friday demos">
      <div class="band-in" ref={bandRef}>
        <img
          ref={imageRef}
          src="/assets/friday-demo.webp"
          alt="Two co-founders laughing at their desk during a Friday demo"
          loading="lazy"
          width="1600"
          height="900"
          data-parallax="0.12"
        />
        <SkyVideo
          class="band-video"
          src="/assets/friday-demo.mp4"
          poster="/assets/friday-demo.webp"
          parallax={0.12}
        />
        <div class="band-chip c1 reveal" ref={chipOne} style={{ '--d': '300ms' }}>
          <i>W3</i>
          <div>
            <b>
              <span class="live-dot" />
              Week 3 demo is live
            </b>
            <span>staging.ledgerly.co · 15 min walkthrough</span>
          </div>
        </div>
        <div class="band-chip c2 reveal" ref={chipTwo} style={{ '--d': '550ms' }}>
          <i>
            <img src="/assets/face-aarav.webp" alt="" />
          </i>
          <div>
            <b>"The new onboarding is perfect"</b>
            <span>Aarav, in the Friday thread</span>
          </div>
        </div>
        <div class="band-cap">
          <p>Every Friday you click through real progress.</p>
          <span class="label">No status decks, just a staging link</span>
        </div>
      </div>
    </section>
  )
}
