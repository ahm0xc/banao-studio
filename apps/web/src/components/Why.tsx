import { For, createSignal, onCleanup, onMount } from 'solid-js'
import { RIVALS } from '../lib/content'
import type { Rival } from '../lib/content'
import { reducedMotion } from '../lib/motion'
import { Line, MorphText, SwapText } from './primitives'

const COMPARISONS = [
  {
    label: 'Cost',
    freelancer: 'Hourly, and the scope creeps',
    agency: 'Six figures, plus change requests',
  },
  {
    label: 'Who builds it',
    freelancer: 'One person, one point of failure',
    agency: 'Juniors behind an account manager',
  },
  {
    label: 'Visibility',
    freelancer: 'Updates when you chase',
    agency: 'Monthly status decks',
  },
  {
    label: 'Ownership',
    freelancer: 'Depends on the contract',
    agency: 'Sometimes licensed back to you',
  },
]

const US_POINTS = [
  { label: 'Cost', text: 'One fixed price, agreed in writing' },
  { label: 'Who builds it', text: 'Senior designers and engineers' },
  { label: 'Visibility', text: 'A live demo every Friday' },
  { label: 'Ownership', text: 'Yours from the first commit' },
]

export function Why() {
  const [rival, setRival] = createSignal<Rival>('freelancer')
  const [direction, setDirection] = createSignal(1)
  const [themReady, setThemReady] = createSignal(false)
  const [usReady, setUsReady] = createSignal(false)

  let vsRef!: HTMLDivElement

  onMount(() => {
    if (reducedMotion()) {
      setThemReady(true)
      setUsReady(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setTimeout(() => setThemReady(true), 200)
        setTimeout(() => setUsReady(true), 500)
      },
      { threshold: 0.2 },
    )
    observer.observe(vsRef)
    onCleanup(() => observer.disconnect())
  })

  const pick = (next: Rival) => {
    if (next === rival()) return
    setDirection(next === 'agency' ? 1 : -1)
    setRival(next)
  }

  return (
    <section class="pad" id="why" style={{ 'padding-top': '0' }}>
      <div class="wrap">
        <div class="vs-head">
          <h2 class="h2">
            <Line delay={0}>Six weeks,</Line>
            <Line delay={110}>
              <span class="soft strike">not six months</span>
            </Line>
          </h2>
          <p class="vs-q">
            Compared with a{' '}
            <button
              type="button"
              aria-pressed={rival() === 'freelancer'}
              onClick={() => pick('freelancer')}
            >
              freelancer
            </button>{' '}
            or a{' '}
            <button type="button" aria-pressed={rival() === 'agency'} onClick={() => pick('agency')}>
              large agency
            </button>
          </p>
        </div>
        <div class="vs-cols" id="vs" ref={vsRef}>
          <div class="vs-col them">
            <span class="label">
              The usual way, with a <MorphText text={RIVALS[rival()].who} />
            </span>
            <div class="vs-big">
              <MorphText text={RIVALS[rival()].weeks} />
              <small>weeks</small>
            </div>
            <div class="vs-bar">
              <i style={{ transform: `scaleX(${themReady() ? RIVALS[rival()].scale : 0})` }} />
            </div>
            <div class="vs-list">
              <For each={COMPARISONS}>
                {(row, index) => (
                  <div>
                    <span class="label">{row.label}</span>
                    <span class="vs-them">
                      <SwapText
                        class="v"
                        text={row[rival()]}
                        delay={index() * 50}
                        direction={direction()}
                      />
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div class="vs-col us sky-panel clouds">
            <span class="label">With Banao</span>
            <div class="vs-big">
              6<small>weeks</small>
            </div>
            <div class="vs-bar">
              <i style={{ transform: `scaleX(${usReady() ? 0.167 : 0})` }} />
            </div>
            <div class="vs-list">
              <For each={US_POINTS}>
                {(row) => (
                  <div>
                    <span class="label">{row.label}</span>
                    <span>{row.text}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
