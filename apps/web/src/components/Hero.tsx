import { useUi } from '../lib/ui'
import { Line, MorphText, SkyVideo } from './primitives'

export function Hero() {
  const ui = useUi()
  return (
    <section class="hero" id="hero">
      <div class="hero-in">
        <div class="hero-media" aria-hidden="true">
          <img src="/assets/hero-sky.webp" alt="" width="1344" height="752" />
          <SkyVideo src="/assets/hero-sky.mp4" poster="/assets/hero-sky.webp" preload="auto" />
        </div>
        <div class="wrap hero-body">
          <div class="hero-grid">
            <h1>
              <Line delay={0}>Build it.</Line>
              <Line delay={130}>Launch in six weeks.</Line>
            </h1>
            <div class="hero-side">
              <p>
                Banao is an MVP studio that turns ideas into market-ready digital products with fast
                delivery, fixed pricing, and full ownership.
              </p>
              <button class="cta light" type="button" onClick={() => ui.openBooking()}>
                Book a free intro call <i aria-hidden="true">→</i>
              </button>
            </div>
          </div>
          <div class="hero-foot">
            <span>SaaS · Mobile apps · Custom software</span>
            <span>
              <span class="dot" aria-hidden="true" />
              <b>
                <MorphText text={ui.slots()} />
              </b>{' '}
              open for December
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
