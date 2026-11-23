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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = steps.indexOf(entry.target as HTMLElement)
          if (index >= 0) setStage(index)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    steps.forEach((step) => observer.observe(step))
    setStage(0)
    onCleanup(() => observer.disconnect())
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
