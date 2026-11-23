import { For, createSignal, onCleanup, onMount } from 'solid-js'
import { reducedMotion } from '../lib/motion'
import { CountUp } from './primitives'

const BODY =
  'is Bangla for "build it". We\'re a small studio of senior designers and engineers who take founders from an idea to a launched product in six weeks, for one fixed price, with nothing lost in translation.'

const WORDS = BODY.split(' ')

export function About() {
  let statementRef!: HTMLParagraphElement
  const [lit, setLit] = createSignal(0)
  const reduced = reducedMotion()

  onMount(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = statementRef.getBoundingClientRect()
      const vh = window.innerHeight
      let progress = (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)
      progress = Math.max(0, Math.min(1, progress))
      setLit(Math.round(progress * WORDS.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    onCleanup(() => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    })
  })

  return (
    <section class="pad" id="about">
      <div class="wrap">
        <p class="label" style={{ 'margin-bottom': '28px' }}>
          About Banao
        </p>
        <p class="statement" id="statement" ref={statementRef} classList={{ dim: !reduced }}>
          <em>Banao</em>{' '}
          <For each={WORDS}>
            {(word, index) => (
              <>
                <span class="wd" classList={{ on: index() < lit() }}>
                  {word}
                </span>{' '}
              </>
            )}
          </For>
        </p>
        <div class="about">
          <div class="photo reveal-clip">
            <img
              src="/assets/founder-phone.webp"
              alt="A founder laughing at something on her phone on a city rooftop"
              loading="lazy"
              width="1200"
              height="1600"
            />
          </div>
          <div class="tiles">
            <div class="tile t-sky sky-panel clouds reveal">
              <div class="tile-top">
                <span class="label">Time to launch</span>
                <span>W0 → W6</span>
              </div>
              <div>
                <CountUp text="6 weeks" />
                <p>From the first call to a product your customers can use</p>
              </div>
            </div>
            <div class="tile t-white reveal">
              <span class="label">Every Friday</span>
              <div>
                <b>Live demo</b>
                <p>A staging link and a 15-minute walkthrough, so you always see real progress</p>
              </div>
            </div>
            <div class="tile t-white reveal">
              <span class="label">Ownership</span>
              <div>
                <CountUp text="100%" />
                <p>Code, designs, domains and accounts are yours from day one</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
