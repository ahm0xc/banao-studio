import { onCleanup, onMount } from 'solid-js'
import { useUi } from '../lib/ui'
import { Logo } from './primitives'

export function SiteHeader() {
  const ui = useUi()
  let headRef!: HTMLElement
  let lastY = 0

  onMount(() => {
    const onScroll = () => {
      const y = window.scrollY
      const hero = document.getElementById('hero')
      const overHero = hero ? hero.getBoundingClientRect().bottom > 76 : false
      const trayOpen = document.body.classList.contains('tray-open')

      headRef.classList.toggle('solid', !overHero)
      headRef.classList.toggle('away', y > lastY + 4 && y > 600 && !trayOpen)
      if (y < lastY - 4) headRef.classList.remove('away')
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    onCleanup(() => window.removeEventListener('scroll', onScroll))
  })

  return (
    <header class="head" id="head" ref={headRef}>
      <div class="wrap head-in">
        <Logo />
        <nav class="nav" aria-label="Primary">
          <a href="#build">What we build</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button class="book" type="button" onClick={() => ui.openBooking()}>
          Book a call
        </button>
      </div>
    </header>
  )
}
