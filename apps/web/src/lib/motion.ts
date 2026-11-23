declare global {
  interface HTMLElement {
    _raf: number
  }
}

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'

export function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function anim(
  el: Element,
  frames: Keyframe[],
  opts: KeyframeAnimationOptions,
): Animation {
  const options = reducedMotion() ? { ...opts, duration: 1, delay: 0 } : opts
  return el.animate(frames, options)
}

export function fin(a: Animation, fn: () => void) {
  let done = false
  const timing = a.effect?.getTiming()
  const finish = () => {
    if (done) return
    done = true
    fn()
  }
  a.onfinish = finish
  setTimeout(finish, (Number(timing?.duration) || 0) + (Number(timing?.delay) || 0) + 60)
  return a
}

/** Morphs the current text of `el` into `next`, keeping the shared prefix in place. */
export function morph(el: HTMLElement | undefined, next: string) {
  if (!el) return
  const prev = el.dataset.text != null ? el.dataset.text : el.textContent || ''
  if (prev === next) return
  el.dataset.text = next

  if (reducedMotion()) {
    el.textContent = next
    return
  }

  let i = 0
  while (i < prev.length && i < next.length && prev[i] === next[i]) i++

  el.textContent = ''
  el.appendChild(document.createTextNode(prev.slice(0, i)))

  const swap = document.createElement('span')
  swap.className = 'm-swap'
  const out = document.createElement('span')
  out.textContent = prev.slice(i)
  const into = document.createElement('span')
  into.textContent = next.slice(i)
  swap.appendChild(out)
  swap.appendChild(into)
  el.appendChild(swap)

  const widthA = out.getBoundingClientRect().width
  const widthB = into.getBoundingClientRect().width
  swap.animate(
    [{ width: `${widthA}px` }, { width: `${widthB}px` }],
    { duration: 460, easing: EASE, fill: 'forwards' },
  )
  out.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(-0.45em)', opacity: 0 },
    ],
    { duration: 200, easing: EASE_IN, fill: 'forwards' },
  )
  fin(
    into.animate(
      [
        { transform: 'translateY(0.45em)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 420, delay: 60, easing: EASE, fill: 'backwards' },
    ),
    () => {
      if (el.dataset.text === next) el.textContent = next
    },
  )
}

/** Counts a formatted number up from zero. Keeps the prefix, suffix, decimals and grouping. */
export function countUp(el: HTMLElement, text: string) {
  const raw = text || el.textContent || ''
  el.dataset.count = raw
  const match = raw.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/)
  if (!match || reducedMotion()) {
    el.textContent = raw
    return
  }

  const prefix = match[1] ?? ''
  const number = match[2] ?? '0'
  const suffix = match[3] ?? ''
  const value = parseFloat(number.replace(/,/g, ''))
  const decimals = (number.split('.')[1] || '').length
  const grouped = number.indexOf(',') > -1
  const start = performance.now()
  const duration = 1400

  cancelAnimationFrame(el._raf)
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / duration)
    const eased = 1 - Math.pow(1 - p, 4)
    const v = value * eased
    el.textContent =
      prefix + (grouped ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals)) + suffix
    if (p < 1) el._raf = requestAnimationFrame(step)
    else el.textContent = raw
  }
  el._raf = requestAnimationFrame(step)
  setTimeout(() => {
    el.textContent = raw
  }, duration + 500)
}

/** Animates a money value stored on the element's `data-val`. */
export function tweenMoney(el: HTMLElement, to: number) {
  const from = Number(el.dataset.val) || to
  el.dataset.val = String(to)
  cancelAnimationFrame(el._raf)

  if (reducedMotion() || from === to) {
    el.textContent = money(to)
    return
  }

  const start = performance.now()
  const duration = 700
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = money(Math.round((from + (to - from) * eased) / 100) * 100)
    if (p < 1) el._raf = requestAnimationFrame(step)
    else el.textContent = money(to)
  }
  el._raf = requestAnimationFrame(step)
  setTimeout(() => {
    el.textContent = money(Number(el.dataset.val))
  }, duration + 400)
}

export function money(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

export function drawPath(path: SVGPathElement, duration = 1600) {
  if (reducedMotion() || !path.getTotalLength) return
  const length = path.getTotalLength()
  path.style.transition = 'none'
  path.style.strokeDasharray = String(length)
  path.style.strokeDashoffset = String(length)
  void path.getBoundingClientRect()
  path.style.transition = `stroke-dashoffset ${duration}ms ${EASE}`
  path.style.strokeDashoffset = '0'
}

export function fillRing(ring: SVGCircleElement) {
  if (reducedMotion()) return
  ring.style.transition = 'none'
  ring.style.strokeDashoffset = '301.6'
  void ring.getBoundingClientRect()
  ring.style.transition = `stroke-dashoffset 1500ms ${EASE} 200ms`
  ring.style.strokeDashoffset = '70'
}

export function confetti(x: number, y: number, count: number) {
  if (reducedMotion()) return
  const canvas = document.createElement('canvas')
  canvas.className = 'confetti'
  document.body.appendChild(canvas)

  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  ctx.scale(dpr, dpr)

  const colors = ['#3991DA', '#84BBE8', '#A4CCEE', '#1A6DCC', '#DCEBF8', '#FFFFFF']
  const particles: {
    x: number
    y: number
    vx: number
    vy: number
    r: number
    vr: number
    w: number
    h: number
    c: string
  }[] = []

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
    const speed = 5 + Math.random() * 9
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      c: colors[(Math.random() * colors.length) | 0] ?? '#3991DA',
    })
  }

  const start = performance.now()
  const life = 2200
  const frame = (t: number) => {
    const elapsed = t - start
    ctx.clearRect(0, 0, width, height)
    particles.forEach((p) => {
      p.vy += 0.25
      p.vx *= 0.986
      p.vy *= 0.986
      p.x += p.vx
      p.y += p.vy
      p.r += p.vr
      ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - elapsed / life)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.c
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, Math.max(2, p.h * Math.abs(Math.cos(p.r * 1.5))))
      ctx.restore()
    })
    if (elapsed < life) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
  setTimeout(() => {
    if (canvas.isConnected) canvas.remove()
  }, life + 800)
}

export function chime() {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    const context = new Ctor()
    ;[659.25, 987.77].forEach((frequency, index) => {
      const osc = context.createOscillator()
      const gain = context.createGain()
      const at = context.currentTime + index * 0.12
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0, at)
      gain.gain.linearRampToValueAtTime(0.05, at + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.7)
      osc.connect(gain)
      gain.connect(context.destination)
      osc.start(at)
      osc.stop(at + 0.75)
    })
    setTimeout(() => {
      void context.close()
    }, 1300)
  } catch {
    /* audio is optional */
  }
}

/** Scrolls an element into view, jumping when smooth scrolling is too slow. */
export function goTo(el: HTMLElement) {
  const target = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - Math.max(80, (window.innerHeight - el.offsetHeight) / 2),
  )
  if (reducedMotion()) {
    window.scrollTo(0, target)
    return
  }
  window.scrollTo({ top: target, behavior: 'smooth' })
  setTimeout(() => {
    if (Math.abs(window.scrollY - target) > 40) window.scrollTo({ top: target, behavior: 'instant' })
  }, 1100)
}
