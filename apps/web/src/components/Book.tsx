import { For, createEffect, createMemo, createSignal, onMount } from 'solid-js'
import { KIND_ORDER } from '../lib/content'
import { EASE, EASE_IN, anim, chime, confetti, fin, reducedMotion } from '../lib/motion'
import { useUi } from '../lib/ui'
import { Chevron, Line, Mark, MorphText, SkyVideo } from './primitives'

type Step = 'pick' | 'form' | 'done'

const TZ = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Your time zone').replace(/_/g, ' ')

const TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

const TODAY = (() => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
})()

const FIRST = (() => {
  const date = new Date(TODAY)
  date.setDate(date.getDate() + 1)
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1)
  return date
})()

const LAST = (() => {
  const date = new Date(TODAY)
  date.setDate(date.getDate() + 45)
  return date
})()

const isAvailable = (date: Date) =>
  date.getTime() >= FIRST.getTime() &&
  date.getTime() <= LAST.getTime() &&
  date.getDay() !== 0 &&
  date.getDay() !== 6

const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime()

const taken = (date: Date, index: number) => (date.getDate() * 3 + index * 7) % 5 === 0

const longDate = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const clock = (time: string) => {
  const hours = Number(time.slice(0, 2))
  const minutes = time.slice(3)
  return `${((hours + 11) % 12) + 1}:${minutes}${hours < 12 ? 'am' : 'pm'}`
}

const kindLabel = (kind: string) =>
  kind === 'saas' ? 'SaaS' : kind === 'app' ? 'Mobile app' : 'Software'

function TimeButton(props: {
  label: string
  time: string
  off: boolean
  index: number
  onPick: (time: string) => void
}) {
  let ref!: HTMLButtonElement
  onMount(() => {
    anim(
      ref,
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 300, delay: props.index * 25, easing: EASE, fill: 'backwards' },
    )
  })
  return (
    <button
      ref={ref}
      type="button"
      disabled={props.off}
      aria-label={props.off ? `${props.label}, taken` : props.label}
      onClick={() => props.onPick(props.time)}
    >
      {props.label}
    </button>
  )
}

export function Book() {
  const ui = useUi()

  const [view, setView] = createSignal(new Date(FIRST.getFullYear(), FIRST.getMonth(), 1))
  const [selected, setSelected] = createSignal<Date>(FIRST)
  const [direction, setDirection] = createSignal(0)
  const [format, setFormat] = createSignal<'12' | '24'>('24')
  const [slot, setSlot] = createSignal<string | null>(null)
  const [step, setStep] = createSignal<Step>('pick')
  const [when, setWhen] = createSignal('')
  const [name, setName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [note, setNote] = createSignal('')
  const [error, setError] = createSignal('')
  const [invalid, setInvalid] = createSignal<'name' | 'email' | null>(null)
  const [doneName, setDoneName] = createSignal('')
  const [doneWhen, setDoneWhen] = createSignal('')
  const [doneWho, setDoneWho] = createSignal('')
  const [copyLabel, setCopyLabel] = createSignal('Copy')

  let calRef!: HTMLDivElement
  let mainRef!: HTMLDivElement
  let daysRef!: HTMLDivElement
  let nameRef: HTMLInputElement | undefined
  let emailRef: HTMLInputElement | undefined
  let codeRef!: HTMLElement
  let monthMounted = false

  const showTime = (time: string) => (format() === '12' ? clock(time) : time)

  const days = createMemo(() => {
    const current = view()
    const year = current.getFullYear()
    const month = current.getMonth()
    const lead = new Date(year, month, 1).getDay()
    const count = new Date(year, month + 1, 0).getDate()
    const out: (Date | null)[] = []
    for (let i = 0; i < lead; i++) out.push(null)
    for (let day = 1; day <= count; day++) out.push(new Date(year, month, day))
    return out
  })

  const times = createMemo(() =>
    TIMES.map((time, index) => ({
      time,
      index,
      off: taken(selected(), index),
      label: showTime(time),
    })),
  )

  const previousDisabled = createMemo(() => {
    const current = view()
    return current.getFullYear() === TODAY.getFullYear() && current.getMonth() <= TODAY.getMonth()
  })

  const nextDisabled = createMemo(() => {
    const current = view()
    return new Date(current.getFullYear(), current.getMonth() + 1, 1).getTime() > LAST.getTime()
  })

  createEffect(() => {
    view()
    const dir = direction()
    if (!monthMounted) {
      monthMounted = true
      return
    }
    if (!dir || !daysRef) return
    anim(
      daysRef,
      [
        { opacity: 0, transform: `translateX(${dir * 16}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 380, easing: EASE },
    )
  })

  const changeStep = (next: Step) => {
    if (step() === next) return
    const main = mainRef
    if (!main || reducedMotion()) {
      setStep(next)
      return
    }
    fin(
      anim(
        main,
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: 'translateX(-12px)' },
        ],
        { duration: 160, easing: EASE_IN, fill: 'forwards' },
      ),
      () => {
        setStep(next)
        main.getAnimations().forEach((animation) => animation.cancel())
        anim(
          main,
          [
            { opacity: 0, transform: 'translateX(16px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 420, easing: EASE },
        )
        if (next === 'form') {
          setTimeout(() => nameRef?.focus({ preventScroll: true }), 200)
        }
      },
    )
  }

  const chooseDay = (date: Date) => {
    setSelected(date)
    setSlot(null)
  }

  const chooseTime = (time: string) => {
    setSlot(time)
    setWhen(`${longDate(selected())} · ${showTime(time)} · 20 min`)
    changeStep('form')
  }

  const previousMonth = () => {
    const current = view()
    setDirection(-1)
    setView(new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    const current = view()
    setDirection(1)
    setView(new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  const submit = (event: Event) => {
    event.preventDefault()
    setInvalid(null)
    setError('')

    const nameValue = name().trim()
    const emailValue = email().trim()

    if (!nameValue) {
      setError("Add your name so we know who we're meeting")
      setInvalid('name')
      nameRef?.focus()
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("That email doesn't look right. Check it and try again")
      setInvalid('email')
      emailRef?.focus()
      return
    }

    const time = slot()
    if (!time) return

    setDoneName(nameValue.split(' ')[0] ?? '')
    setDoneWhen(`${longDate(selected())}, ${showTime(time)} (${TZ})`)
    setDoneWho(`${nameValue} and a Banao founder`)
    changeStep('done')

    setTimeout(() => {
      if (!calRef) return
      const rect = calRef.getBoundingClientRect()
      confetti(rect.left + rect.width / 2, rect.top + 80, 150)
      chime()
      ui.setSlots('1 build slot')
    }, 380)
  }

  const bookAnother = () => {
    setSlot(null)
    setError('')
    setInvalid(null)
    changeStep('pick')
  }

  const copyEmail = () => {
    const done = (label: string) => {
      setCopyLabel(label)
      setTimeout(() => setCopyLabel('Copy'), 1800)
    }
    const fallback = () => {
      const range = document.createRange()
      range.selectNodeContents(codeRef)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      done('Selected')
    }
    try {
      navigator.clipboard.writeText(codeRef.textContent ?? '').then(() => done('Copied'), fallback)
    } catch {
      fallback()
    }
  }

  return (
    <section class="final" id="book">
      <div class="final-in">
        <div class="hero-media" aria-hidden="true">
          <img src="/assets/sky-sea.webp" alt="" width="1344" height="752" loading="lazy" />
          <SkyVideo src="/assets/sky-sea.mp4" poster="/assets/sky-sea.webp" />
        </div>
        <div class="wrap final-body2">
          <div class="final-top">
            <h2>
              <Line delay={0}>Let's build it.</Line>
            </h2>
            <p>Pick a time for a 20-minute call. Leave with a scope, a fixed price and a launch date.</p>
          </div>

          <div class="calw" id="cal" data-step={step()} ref={calRef}>
            <div class="cal-info">
              <div class="cal-host">
                <span class="cal-av">
                  <Mark />
                </span>
                Banao Studio
              </div>
              <h3>Intro call</h3>
              <ul class="cal-meta">
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  20 min
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="6" width="13" height="12" rx="2" />
                    <path d="M16 10l5-3v10l-5-3z" />
                  </svg>
                  Google Meet
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
                  </svg>
                  <span>{TZ}</span>
                </li>
              </ul>
              <p>
                Tell us what you're building. Within 48 hours you get a written scope, a fixed price and
                a launch date.
              </p>
              <p class="cal-powered">Scheduling by Cal.com</p>
            </div>

            <div class="cal-main" ref={mainRef}>
              <div class="cal-pick">
                <div class="cal-month">
                  <div class="cal-mh">
                    <b id="cal-title">
                      {view().toLocaleDateString('en-US', { month: 'long' })}{' '}
                      <span>{view().getFullYear()}</span>
                    </b>
                    <div>
                      <button
                        class="ib"
                        type="button"
                        aria-label="Previous month"
                        disabled={previousDisabled()}
                        onClick={previousMonth}
                      >
                        <Chevron dir="left" />
                      </button>
                      <button
                        class="ib"
                        type="button"
                        aria-label="Next month"
                        disabled={nextDisabled()}
                        onClick={nextMonth}
                      >
                        <Chevron dir="right" />
                      </button>
                    </div>
                  </div>
                  <div class="cal-dow" aria-hidden="true">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                  <div class="cal-days" ref={daysRef} role="grid" aria-label="Available days">
                    <For each={days()}>
                      {(date) =>
                        date ? (
                          <button
                            type="button"
                            role="gridcell"
                            classList={{ av: isAvailable(date), today: sameDay(date, TODAY) }}
                            data-ts={date.getTime()}
                            disabled={!isAvailable(date)}
                            aria-selected={sameDay(date, selected())}
                            aria-label={`${longDate(date)}${isAvailable(date) ? '' : ', unavailable'}`}
                            onClick={() => chooseDay(date)}
                          >
                            {date.getDate()}
                          </button>
                        ) : (
                          <button type="button" class="blank" tabindex="-1" aria-hidden="true" />
                        )
                      }
                    </For>
                  </div>
                </div>
                <div class="cal-slots">
                  <div class="cal-sh">
                    <b id="cal-day">
                      {selected().toLocaleDateString('en-US', { weekday: 'short' })}{' '}
                      <span>{selected().getDate()}</span>
                    </b>
                    <div class="cal-fmt" role="group" aria-label="Time format">
                      <button
                        type="button"
                        aria-pressed={format() === '12'}
                        onClick={() => setFormat('12')}
                      >
                        12h
                      </button>
                      <button
                        type="button"
                        aria-pressed={format() === '24'}
                        onClick={() => setFormat('24')}
                      >
                        24h
                      </button>
                    </div>
                  </div>
                  <div class="cal-times">
                    <For each={times()}>
                      {(item) => (
                        <TimeButton
                          time={item.time}
                          label={item.label}
                          off={item.off}
                          index={item.index}
                          onPick={chooseTime}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </div>

              <form class="cal-form" novalidate onSubmit={submit}>
                <button class="cal-back" type="button" onClick={() => changeStep('pick')}>
                  <Chevron dir="left" />
                  Back
                </button>
                <div class="cal-when">{when()}</div>
                <label class="field">
                  <span>Your name</span>
                  <input
                    ref={nameRef}
                    name="name"
                    autocomplete="name"
                    placeholder="Priya Sharma"
                    value={name()}
                    aria-invalid={invalid() === 'name'}
                    onInput={(event) => setName(event.currentTarget.value)}
                  />
                </label>
                <label class="field">
                  <span>Work email</span>
                  <input
                    ref={emailRef}
                    name="email"
                    type="email"
                    autocomplete="email"
                    placeholder="priya@startup.com"
                    value={email()}
                    aria-invalid={invalid() === 'email'}
                    onInput={(event) => setEmail(event.currentTarget.value)}
                  />
                </label>
                <div class="field">
                  <span>What are you building?</span>
                  <div class="kseg" role="radiogroup" aria-label="Product type">
                    <For each={KIND_ORDER}>
                      {(kind) => (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={ui.kind() === kind}
                          data-kind={kind}
                          onClick={() => ui.setKind(kind)}
                        >
                          {kindLabel(kind)}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
                <label class="field">
                  <span>
                    Anything we should know? <em>(optional)</em>
                  </span>
                  <textarea
                    rows="2"
                    placeholder="Booking software for physio clinics"
                    value={note()}
                    onInput={(event) => setNote(event.currentTarget.value)}
                  />
                </label>
                <p class="err" hidden={!error()}>
                  {error()}
                </p>
                <button class="cta" type="submit">
                  Confirm booking <i aria-hidden="true">→</i>
                </button>
              </form>

              <div class="cal-done" aria-live="polite">
                <div class="done-mark">
                  <Mark />
                </div>
                <h3>You're booked{doneName() ? `, ${doneName()}` : ''}</h3>
                <div class="cal-rows">
                  <div>
                    <span>What</span>
                    <span>Intro call with Banao Studio</span>
                  </div>
                  <div>
                    <span>When</span>
                    <span>{doneWhen()}</span>
                  </div>
                  <div>
                    <span>Who</span>
                    <span>{doneWho()}</span>
                  </div>
                  <div>
                    <span>Where</span>
                    <span>Google Meet</span>
                  </div>
                </div>
                <p class="done-note">
                  Wireframe: nothing was sent. On the live site Cal.com sends the invite and reminders.
                </p>
                <button class="ghost" type="button" onClick={bookAnother}>
                  Book another time
                </button>
              </div>
            </div>
          </div>

          <div class="email">
            or email <code ref={codeRef}>hello@banao.studio</code>
            <button class="copy" type="button" onClick={copyEmail}>
              <MorphText text={copyLabel()} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
