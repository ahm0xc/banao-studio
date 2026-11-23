import { For } from 'solid-js'
import { FAQ } from '../lib/content'
import { EASE, EASE_IN, anim, fin } from '../lib/motion'
import { useUi } from '../lib/ui'
import { Line } from './primitives'

function FaqItem(props: { question: string; answer: string; initiallyOpen?: boolean }) {
  let detailsRef!: HTMLDetailsElement
  let answerRef!: HTMLDivElement
  let open = Boolean(props.initiallyOpen)

  const toggle = (event: MouseEvent) => {
    event.preventDefault()
    answerRef.getAnimations().forEach((animation) => animation.cancel())

    if (open) {
      const height = answerRef.offsetHeight
      open = false
      detailsRef.classList.remove('is-open')
      fin(
        anim(
          answerRef,
          [
            { height: `${height}px`, opacity: 1 },
            { height: '0px', opacity: 0 },
          ],
          { duration: 260, easing: EASE_IN },
        ),
        () => {
          if (!open) detailsRef.open = false
        },
      )
      return
    }

    open = true
    detailsRef.open = true
    detailsRef.classList.add('is-open')
    const height = answerRef.offsetHeight
    anim(
      answerRef,
      [
        { height: '0px', opacity: 0 },
        { height: `${height}px`, opacity: 1 },
      ],
      { duration: 480, easing: EASE },
    )
  }

  return (
    <details
      ref={detailsRef}
      open={Boolean(props.initiallyOpen)}
      classList={{ 'is-open': Boolean(props.initiallyOpen) }}
    >
      <summary onClick={toggle}>
        {props.question}
        <i aria-hidden="true">+</i>
      </summary>
      <div class="faq-a" ref={answerRef}>
        <p>{props.answer}</p>
      </div>
    </details>
  )
}

export function Faq() {
  const ui = useUi()
  return (
    <section class="pad" id="faq" style={{ 'padding-top': '0' }}>
      <div class="wrap faq-grid">
        <div class="faq-side">
          <h2 class="h2">
            <Line delay={0}>Questions</Line>
          </h2>
          <p>Ask anything else on the call. It's free, and there's no pitch.</p>
          <button class="ghost" type="button" onClick={() => ui.openBooking()}>
            Ask on a call
          </button>
        </div>
        <div class="faq">
          <For each={FAQ}>
            {(item, index) => (
              <FaqItem question={item.q} answer={item.a} initiallyOpen={index() === 0} />
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
