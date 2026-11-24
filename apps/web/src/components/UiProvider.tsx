import { createSignal } from 'solid-js'
import type { JSX } from 'solid-js'
import { goTo } from '../lib/motion'
import type { Kind } from '../lib/content'
import { UiContext } from '../lib/ui'
import { BookingTray } from './BookingTray'

export function UiProvider(props: { children: JSX.Element }) {
  const [kind, setKindSignal] = createSignal<Kind>('saas')
  const [slots, setSlots] = createSignal('2 build slots')
  const [caseId, setCaseId] = createSignal<string | null>(null)

  const setKind = (next: Kind) => setKindSignal(next)

  const openCase = (id: string) => setCaseId(id)
  const closeCase = () => setCaseId(null)

  const openBooking = () => {
    setCaseId(null)
    const cal = document.getElementById('cal')
    if (!cal) return
    setTimeout(() => goTo(cal), 0)
  }

  return (
    <UiContext.Provider
      value={{ kind, setKind, slots, setSlots, caseId, openCase, closeCase, openBooking }}
    >
      {props.children}
      <BookingTray />
    </UiContext.Provider>
  )
}
