import { createContext, useContext } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import type { Kind } from './content'

export type UiStore = {
  kind: Accessor<Kind>
  setKind: (kind: Kind) => void
  slots: Accessor<string>
  setSlots: Setter<string>
  caseId: Accessor<string | null>
  openCase: (id: string) => void
  closeCase: () => void
  openBooking: () => void
}

export const UiContext = createContext<UiStore>()

export function useUi() {
  const ui = useContext(UiContext)
  if (!ui) throw new Error('useUi must be used inside UiProvider')
  return ui
}
