import { For, createEffect, createSignal, on } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { BUILD_ROWS } from '../lib/content'
import type { Kind } from '../lib/content'
import { useUi } from '../lib/ui'
import { Line, Ticks } from './primitives'
import { Shot } from './shots'

export function Build() {
  const ui = useUi()
  const [openRow, setOpenRow] = createSignal<Kind | null>(ui.kind())

  createEffect(
    on(
      ui.kind,
      (kind) => {
        setOpenRow(kind)
      },
      { defer: true },
    ),
  )

  const toggle = (kind: Kind) => {
    if (openRow() === kind) {
      setOpenRow(null)
      return
    }
    if (ui.kind() === kind) setOpenRow(kind)
    else ui.setKind(kind)
  }

  return (
    <section class="pad" id="build">
      <div class="wrap">
        <div class="build-head">
          <h2 class="h2">
            <Line delay={0}>What we build</Line>
          </h2>
          <p>
            Each build includes design, development, launch and 30 days of support, at one fixed price
            agreed before we start.
          </p>
        </div>
        <div class="rows" id="rows">
          <For each={BUILD_ROWS}>
            {(row) => (
              <div class="row" classList={{ open: openRow() === row.kind }} data-kind={row.kind}>
                <button
                  class="row-head"
                  type="button"
                  aria-expanded={openRow() === row.kind}
                  onClick={() => toggle(row.kind)}
                >
                  <span class="row-t">{row.title}</span>
                  <span class="row-m">{row.meta}</span>
                  <span class="row-x" aria-hidden="true">
                    +
                  </span>
                </button>
                <div class="row-body">
                  <div class="row-inner">
                    <div class="row-grid">
                      <Shot active={openRow() === row.kind}>
                        <Dynamic component={row.shot} />
                      </Shot>
                      <div class="row-txt">
                        <p>{row.description}</p>
                        <Ticks items={row.ticks} />
                        <p class="row-ex">
                          Recent: <b>{row.recent.name}</b>
                          {row.recent.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
