import { For, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type { JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { countUp, morph, reducedMotion } from '../lib/motion'

/** The Banao mark, drawn with a CSS mask so it inherits the current colour. */
export function Mark() {
  return <span class="mk" aria-hidden="true" />
}

export function Logo(props: { label?: string }) {
  return (
    <a class="logo" href="#top" aria-label="Banao Studio, back to top">
      <Mark />
      {props.label ?? 'banao'}
    </a>
  )
}

export function ArrowRight(props: { size?: number }) {
  const size = props.size ?? 14
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m-4-4 4 4-4 4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export function Chevron(props: { dir?: 'left' | 'right'; size?: number }) {
  const size = props.size ?? 14
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={props.dir === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

/** One masked line of a display heading; the delay staggers the line reveal. */
export function Line(props: { delay: number; children: JSX.Element }) {
  return (
    <span class="ln" style={{ '--d': `${props.delay}ms` }}>
      <span>{props.children}</span>
    </span>
  )
}

/** Text that morphs into a new value when `text` changes, keeping the shared prefix. */
export function MorphText(props: { text: string; class?: string }) {
  let ref!: HTMLSpanElement
  const initial = props.text
  createEffect(() => morph(ref, props.text))
  return (
    <span ref={ref} class={props.class}>
      {initial}
    </span>
  )
}

/** A number that counts up the first time it scrolls into view. */
export function CountUp(props: {
  text: string
  as?: 'b' | 'strong' | 'span'
  class?: string
  style?: JSX.CSSProperties
}) {
  let ref!: HTMLElement
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        countUp(ref, props.text)
      },
      { threshold: 0.4, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(ref)
    onCleanup(() => observer.disconnect())
  })
  return (
    <Dynamic component={props.as ?? 'b'} ref={ref} class={props.class} style={props.style}>
      {props.text}
    </Dynamic>
  )
}

/** Background video that only plays while on screen and disappears if it cannot load. */
export function SkyVideo(props: {
  src: string
  poster: string
  class?: string
  preload?: 'auto' | 'none' | 'metadata'
  parallax?: number
}) {
  let ref: HTMLVideoElement | undefined
  onMount(() => {
    const video = ref
    if (!video) return
    if (reducedMotion()) {
      video.remove()
      return
    }
    video.addEventListener('error', () => video.remove(), true)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      })
    })
    observer.observe(video)
    onCleanup(() => observer.disconnect())
  })
  return (
    <video
      ref={ref}
      class={`sky-video${props.class ? ` ${props.class}` : ''}`}
      autoplay
      muted
      loop
      playsinline
      preload={props.preload ?? 'none'}
      poster={props.poster}
      data-parallax={props.parallax}
      aria-hidden="true"
    >
      <source src={props.src} type="video/mp4" />
    </video>
  )
}

/** Fades a number between values (used for the pricing amount when the product changes). */
export function SwapText(props: { text: string; class?: string; delay?: number; direction?: number }) {
  let ref!: HTMLSpanElement
  const [shown, setShown] = createSignal(props.text)
  let previous = props.text
  let first = true

  createEffect(() => {
    const next = props.text
    if (first) {
      first = false
      previous = next
      return
    }
    if (next === previous) return
    const direction = props.direction ?? 1
    previous = next

    if (reducedMotion()) {
      setShown(next)
      return
    }

    ref.getAnimations?.().forEach((animation) => animation.cancel())
    const animation = ref.animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: `translateX(${-direction * 12}px)` },
      ],
      { duration: 150, delay: props.delay ?? 0, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    )
    animation.onfinish = () => {
      setShown(next)
      animation.cancel()
      ref.animate(
        [
          { opacity: 0, transform: `translateX(${direction * 12}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
      )
    }
  })

  return (
    <span ref={ref} class={props.class}>
      {shown()}
    </span>
  )
}

export function Ticks(props: { items: string[] }) {
  return (
    <ul class="ticks">
      <For each={props.items}>{(item) => <li>{item}</li>}</For>
    </ul>
  )
}
