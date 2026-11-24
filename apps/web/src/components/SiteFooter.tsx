import { createSignal } from 'solid-js'
import { confetti } from '../lib/motion'
import { Logo, MorphText } from './primitives'

export function SiteFooter() {
  const [caption, setCaption] = createSignal('Tap the word')
  let eggRef!: HTMLButtonElement

  const toggleEgg = () => {
    const found = eggRef.classList.toggle('found')
    if (found) {
      const rect = eggRef.getBoundingClientRect()
      confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 60)
      setCaption('বানাও (ba-NAO) is Bangla for build it')
      return
    }
    setCaption('Tap the word')
  }

  return (
    <footer>
      <div class="wrap">
        <div class="foot">
          <div>
            <Logo />
            <p>
              The studio that designs and builds first versions of SaaS, mobile apps and custom
              software.
            </p>
          </div>
          <div class="foot-cols">
            <div>
              <span class="label">Studio</span>
              <a href="#build">What we build</a>
              <a href="#work">Work</a>
              <a href="#process">Process</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div>
              <span class="label">Connect</span>
              <a href="#book">Book a call</a>
              <a
                href="https://www.instagram.com/banao.studio_"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://x.com/banao_studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </div>
          </div>
        </div>
        <div class="egg-row">
          <button
            class="egg"
            type="button"
            id="egg"
            ref={eggRef}
            aria-label="বানাও, the Bangla word for build. Tap to fill it in."
            onClick={toggleEgg}
          >
            <span class="egg-word" lang="bn">
              বানাও
            </span>
          </button>
          <p class="label" style={{ 'padding-bottom': '24px' }}>
            <MorphText text={caption()} />
          </p>
        </div>
        <div class="legal">
          <span>© 2026 Banao Studio</span>
          <span>Terms · Privacy</span>
        </div>
      </div>
    </footer>
  )
}
