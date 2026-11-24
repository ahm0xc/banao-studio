import { Line, SkyVideo } from './primitives'

const BOOKING_URL = 'https://cal.com/banao-studio/30min'

export function Book() {
  return (
    <section class="final" id="book">
      <div class="final-in">
        <div class="hero-media" aria-hidden="true">
          <img src="/assets/sky-sea.webp" alt="" width="1344" height="752" loading="lazy" />
          <SkyVideo src="/assets/sky-sea.mp4" poster="/assets/sky-sea.webp" />
        </div>
        <div class="wrap final-body2">
          <div class="final-top">
            <h2>
              <Line delay={0}>Let's build it.</Line>
            </h2>
            <p>Pick a time for a 30-minute call. Leave with a scope, a fixed price and a launch date.</p>
          </div>

          <div class="calw cal-embed" id="cal">
            <iframe
              class="cal-frame"
              src={`${BOOKING_URL}?embed=true&theme=light`}
              title="Book a 20-minute intro call with Banao Studio"
              loading="lazy"
            />
            <p class="cal-fallback">
              Calendar not loading?{' '}
              <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                Open it on Cal.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
