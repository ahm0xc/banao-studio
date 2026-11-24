import { For, createSignal, onCleanup, onMount } from 'solid-js'
import { PROCESS_STEPS } from '../lib/content'
import { reducedMotion } from '../lib/motion'
import { Mark, MorphText } from './primitives'
import { EvolutionPanel } from './shots'

export function Process() {
  const [stage, setStage] = createSignal(0)
  let stepsRef!: HTMLDivElement

  onMount(() => {
    if (
      !('IntersectionObserver' in window) ||
      reducedMotion() ||
      window.innerWidth <= 860
    ) {
      setStage(3)
      return
    }

    stepsRef.classList.add('live')
    const steps = Array.from(stepsRef.querySelectorAll<HTMLElement>('.step'))
    let frame = 0

    // Pick the last step whose top has crossed the viewport's mid-line. This is
    // position-based rather than intersection-based, so it gives the same answer
    // scrolling up as it does scrolling down.
    const measure = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let next = 0
      for (let i = 0; i < steps.length; i++) {
        if (steps[i]!.getBoundingClientRect().top <= mid) next = i
        else break
      }
      setStage(next)
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measure()

    onCleanup(() => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    })
  })

  const current = () => PROCESS_STEPS[stage()] ?? PROCESS_STEPS[0]!

  return (
    <section class="pad" id="process" style={{ 'padding-top': '0' }}>
      <div class="wrap proc">
        <div class="proc-side sky-panel clouds" id="proc-side" data-stage={stage()}>
          <p class="label">How it works</p>
          <div class="wk-row">
            <div class="wk">
              <MorphText text={current().week} />
            </div>
            <span>of 6 weeks</span>
          </div>
          <div class="wk-bar">
            <i style={{ transform: `scaleX(${current().progress})` }} />
          </div>
          <EvolutionPanel stage={stage()} />
          <div class="evo-caps">
            <span>Week 0 · the scope, in writing</span>
            <span>Week 1 · a prototype users can click</span>
            <span>Weeks 2 to 5 · real software, demoed every Friday</span>
            <span>Week 6 · live, with real customers</span>
          </div>
        </div>
        <div class="steps" id="steps" ref={stepsRef}>
          <For each={PROCESS_STEPS}>
            {(step, index) => (
              <div
                class="step"
                classList={{ on: stage() === index(), launch: step.launch }}
              >
                <span class="label">{step.label}</span>
                <h3>
                  {step.launch ? <Mark /> : null}
                  {step.title}
                </h3>
                <p>{step.body}</p>
                <span class="gets">{step.gets}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
