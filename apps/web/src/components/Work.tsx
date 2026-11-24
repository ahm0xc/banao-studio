import { For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { CASES } from '../lib/content'
import { CountUp, Line } from './primitives'
import { Shot } from './shots'

export function Work() {
  return (
    <section class="pad" id="work" style={{ 'padding-top': '0' }}>
      <div class="wrap">
        <div class="work-head">
          <h2 class="h2">
            <Line delay={0}>Recent launches</Line>
          </h2>
          <p>Three founders who went from a first call to paying customers.</p>
        </div>
        <div class="cases">
          <For each={CASES}>
            {(study) => (
              <article class="case" data-case-id={study.id}>
                <Shot deep={study.deep}>
                  <Dynamic component={study.shot} />
                </Shot>
                <div class="case-txt">
                  <div class="case-name">
                    <Show when={study.logo} fallback={<i>{study.letter}</i>}>
                      <img class="case-logo" src={study.logo} alt="" width="34" height="34" />
                    </Show>
                    <b>{study.name}</b>
                    <span>{study.meta}</span>
                  </div>
                  <h3 class="case-h">{study.heading}</h3>
                  <div class="case-res">
                    <CountUp as="strong" class="case-num" text={study.metric} />
                    <span>{study.result}</span>
                  </div>
                  <div class="case-q">
                    <img
                      src={study.face}
                      alt={study.person}
                      loading="lazy"
                      width="1200"
                      height="1200"
                    />
                    <p>
                      "{study.quote}"
                      <cite>
                        {study.person}, {study.role}
                      </cite>
                    </p>
                  </div>
                </div>
              </article>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
