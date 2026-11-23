import { For, Show, createEffect, onCleanup, onMount } from 'solid-js'
import { KINDS, KIND_ORDER, PLANS } from '../lib/content'
import type { Kind } from '../lib/content'
import { money, tweenMoney } from '../lib/motion'
import { useUi } from '../lib/ui'
import { CountUp, Line, MorphText, Ticks } from './primitives'

const TAB_LABELS: Record<Kind, string> = {
  saas: 'SaaS platform',
  app: 'Mobile app',
  software: 'Custom software',
}

function Price(props: { value: number }) {
  let ref!: HTMLElement
  createEffect(() => tweenMoney(ref, props.value))
  return <strong ref={ref}>{money(props.value)}</strong>
}

export function Pricing() {
  const ui = useUi()
  let tabsRef!: HTMLDivElement
  let barRef!: HTMLSpanElement
  let mounted = false

  const placeBar = (animate: boolean) => {
    if (!tabsRef || !barRef) return
    const active = tabsRef.querySelector<HTMLButtonElement>(`button[data-kind="${ui.kind()}"]`)
    if (!active) return
    if (!animate) barRef.style.transition = 'none'
    barRef.style.width = `${active.offsetWidth}px`
    barRef.style.transform = `translateX(${active.offsetLeft}px)`
    if (!animate) {
      void barRef.offsetWidth
      barRef.style.transition = ''
    }
  }

  onMount(() => {
    mounted = true
    placeBar(false)
    const onResize = () => placeBar(false)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => placeBar(false)).catch(() => {})
    onCleanup(() => window.removeEventListener('resize', onResize))
  })

  createEffect(() => {
    ui.kind()
    if (mounted) placeBar(true)
  })

  return (
    <section class="pad" id="pricing" style={{ 'padding-top': '0' }}>
      <div class="wrap">
        <div class="price-head">
          <h2 class="h2">
            <Line delay={0}>One price,</Line>
            <Line delay={110}>
              <span class="soft">agreed before we start</span>
            </Line>
          </h2>
          <div class="tabs" id="tabs" role="tablist" aria-label="What are you building" ref={tabsRef}>
            <For each={KIND_ORDER}>
              {(kind) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={ui.kind() === kind}
                  data-kind={kind}
                  onClick={() => ui.setKind(kind)}
                >
                  {TAB_LABELS[kind]}
                </button>
              )}
            </For>
            <span class="bar" aria-hidden="true" ref={barRef} />
          </div>
        </div>
        <div class="plans">
          <For each={PLANS}>
            {(plan) => (
              <div class="plan reveal" classList={{ feat: plan.featured }}>
                <Show when={plan.featured}>
                  <span class="feat-flag">Most founders pick this</span>
                </Show>
                <p class="label">
                  <b>{plan.label}</b>
                </p>
                <div class="amt">
                  <Show
                    when={plan.featured}
                    fallback={<CountUp as="strong" text={plan.amount ?? ''} />}
                  >
                    <Price value={KINDS[ui.kind()].price} />
                  </Show>
                  <span>{plan.unit}</span>
                </div>
                <Show when={plan.anchor}>
                  <p class="anchor">{plan.anchor}</p>
                </Show>
                <Show
                  when={plan.featured}
                  fallback={<p class="sub">{plan.sub}</p>}
                >
                  <p class="sub">
                    Price for a <MorphText class="morph" text={KINDS[ui.kind()].long} />, live in 4 to 6
                    weeks
                  </p>
                </Show>
                <button
                  class={plan.featured ? 'cta' : 'ghost'}
                  type="button"
                  onClick={() => ui.openBooking()}
                >
                  {plan.action}
                  {plan.featured ? <i aria-hidden="true">→</i> : null}
                </button>
                <Ticks items={plan.ticks} />
              </div>
            )}
          </For>
        </div>
        <div class="promise">
          <span>10% back for every week we're late</span>
          <span>Sprint fee comes off your build</span>
          <span>NDA signed before the first call</span>
          <span>Paid in milestones: 40, 40, 20</span>
        </div>
      </div>
    </section>
  )
}
