import { createEffect, onCleanup, onMount } from 'solid-js'
import type { JSX } from 'solid-js'
import { countUp, drawPath, fillRing } from '../lib/motion'

const d = (ms: number) => ({ '--d': `${ms}ms` })

/**
 * A coded product screen. Plays its contents in when it scrolls into view, and
 * again whenever `active` turns true (an accordion row opening).
 */
export function Shot(props: {
  class?: string
  deep?: boolean
  active?: boolean
  children: JSX.Element
}) {
  let ref!: HTMLDivElement
  let mounted = false

  const play = () => {
    const el = ref
    if (!el) return
    el.classList.remove('wait')
    el.classList.remove('play')
    void el.offsetWidth
    el.classList.add('play')
    el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) =>
      countUp(node, node.dataset.count || node.textContent || ''),
    )
    el.querySelectorAll<SVGPathElement>('path.draw').forEach((path) => {
      setTimeout(() => drawPath(path, 1600), 300)
    })
    el.querySelectorAll<SVGCircleElement>('circle.ring').forEach(fillRing)
  }

  onMount(() => {
    mounted = true
    const el = ref
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) el.classList.add('wait')
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        play()
      },
      { threshold: 0.18 },
    )
    observer.observe(el)
    onCleanup(() => observer.disconnect())
  })

  createEffect(() => {
    if (mounted && props.active) play()
  })

  return (
    <div ref={ref} class={`shot${props.deep ? ' deep' : ''}${props.class ? ` ${props.class}` : ''}`}>
      {props.children}
    </div>
  )
}

function WindowBar(props: { url: string; children?: JSX.Element }) {
  return (
    <div class="win-bar">
      {props.url}
      {props.children}
    </div>
  )
}

/** SaaS row: billing dashboard. */
export function TallyShot() {
  return (
    <div class="win ui-pop">
      <WindowBar url="app.tally.so/billing" />
      <div class="win-b">
        <div class="side">
          <b>
            <i />
            Tally
          </b>
          <span>Overview</span>
          <span class="on">Billing</span>
          <span>Customers</span>
          <span>Team</span>
          <span>Settings</span>
        </div>
        <div class="main">
          <div class="mh">
            <b>Billing</b>
            <span>Stripe connected</span>
          </div>
          <div class="kpis">
            <div class="kpi ui-pop" style={d(150)}>
              <small>Monthly revenue</small>
              <b data-count>$18,420</b>
              <em>+8.2% vs Oct</em>
            </div>
            <div class="kpi ui-pop" style={d(220)}>
              <small>Active plans</small>
              <b data-count>312</b>
              <em>+24 this month</em>
            </div>
            <div class="kpi ui-pop" style={d(290)}>
              <small>Churn</small>
              <b>1.9%</b>
              <em>−0.4 pts</em>
            </div>
          </div>
          <div class="tbl">
            <div class="tr th">
              <span>Customer</span>
              <span>Plan</span>
              <span>Status</span>
            </div>
            <div class="tr ui-pop" style={d(380)}>
              <span>Acme Studio</span>
              <span>Team, yearly</span>
              <span class="pill ok">Paid</span>
            </div>
            <div class="tr ui-pop" style={d(440)}>
              <span>Northwind</span>
              <span>Pro, monthly</span>
              <span class="pill ok">Paid</span>
            </div>
            <div class="tr ui-pop" style={d(500)}>
              <span>Halo Dental</span>
              <span>Team, monthly</span>
              <span class="pill">Trial, 4 days left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HabitRing(props: { day: string; streak: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#EAF2FB" stroke-width="11" />
      <circle
        class="ring"
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="#3991DA"
        stroke-width="11"
        stroke-linecap="round"
        stroke-dasharray="301.6"
        stroke-dashoffset="70"
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="64"
        text-anchor="middle"
        font-family="Geist, sans-serif"
        font-size="28"
        font-weight="500"
        fill="#0B2545"
      >
        {props.day}
      </text>
      <text
        x="60"
        y="81"
        text-anchor="middle"
        font-family="Geist, sans-serif"
        font-size="10"
        fill="#7186A6"
      >
        {props.streak}
      </text>
    </svg>
  )
}

/** Mobile app row: onboarding plus a streak screen. */
export function HabitPhones() {
  return (
    <>
      <div class="phone ui-pop">
        <div>
          <div class="ps">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <span class="pm">Step 2 of 3</span>
          <span class="pt">What do you want to build into a habit?</span>
          <span class="li done">
            <i />
            <span>Morning run</span>
            <em>15 min</em>
          </span>
          <span class="li">
            <i />
            <span>Stretching</span>
            <em>10 min</em>
          </span>
          <span class="li">
            <i />
            <span>Reading</span>
            <em>20 min</em>
          </span>
          <span class="btn">Continue</span>
        </div>
      </div>
      <div class="phone ui-pop" style={d(180)}>
        <div>
          <div class="ps">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <span class="pm">Tuesday</span>
          <span class="pt">Keep it going, Sara</span>
          <HabitRing day="21" streak="day streak" />
          <span class="wk7">
            <i class="on">M</i>
            <i class="on">T</i>
            <i class="on">W</i>
            <i class="on">T</i>
            <i>F</i>
            <i>S</i>
            <i>S</i>
          </span>
          <span class="btn">Start today's session</span>
        </div>
      </div>
      <div class="note-card ui-pop" style={{ ...d(420), top: '18px', right: '18px' }}>
        <i>P</i>
        <div>
          <b>Push notification</b>
          <span>15 minutes today keeps your streak alive</span>
        </div>
      </div>
    </>
  )
}

/** Custom software row: a request inbox with an AI summary. */
export function OpsShot() {
  return (
    <div class="win ui-pop">
      <WindowBar url="ops.yourcompany.com" />
      <div class="win-b">
        <div class="side">
          <b>
            <i />
            Ops board
          </b>
          <span>Inbox</span>
          <span class="on">Requests</span>
          <span>Customers</span>
          <span>Reports</span>
          <span>Automations</span>
        </div>
        <div class="main">
          <div class="mh">
            <b>Requests</b>
            <span>Synced with HubSpot and Slack</span>
          </div>
          <div class="ai ui-pop" style={d(160)}>
            <span>AI</span>
            <span>
              <b>Summary:</b> 3 refund requests mention late delivery from the Leeds warehouse.
            </span>
          </div>
          <div class="kan">
            <div class="ui-pop" style={d(240)}>
              <h5>New · 4</h5>
              <p>
                Refund request
                <small>Order 18342</small>
              </p>
              <p>
                Address change
                <small>Order 18355</small>
              </p>
            </div>
            <div class="ui-pop" style={d(320)}>
              <h5>In progress · 2</h5>
              <p>
                Damaged item
                <small>Assigned to Maya</small>
              </p>
            </div>
            <div class="ui-pop" style={d(400)}>
              <h5>Done · 18</h5>
              <p>
                Invoice copy
                <small>Closed by automation</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Case: the Ledgerly cash-flow dashboard. */
export function LedgerlyShot() {
  return (
    <div class="win ui-pop">
      <WindowBar url="app.ledgerly.co" />
      <div class="win-b">
        <div class="side">
          <b>
            <i />
            Ledgerly
          </b>
          <span class="on">Overview</span>
          <span>Cash flow</span>
          <span>Invoices</span>
          <span>Accounts</span>
          <span>Settings</span>
        </div>
        <div class="main">
          <div class="mh">
            <b>Overview</b>
            <span>November 2026</span>
          </div>
          <div class="kpis">
            <div class="kpi ui-pop" style={d(150)}>
              <small>Monthly revenue</small>
              <b data-count>$48,210</b>
              <em>+12.4% vs Oct</em>
            </div>
            <div class="kpi ui-pop" style={d(220)}>
              <small>Cash today</small>
              <b data-count>$212,480</b>
              <em>+$8,140</em>
            </div>
            <div class="kpi ui-pop" style={d(290)}>
              <small>Runway</small>
              <b data-count>19 mo</b>
              <em style={{ color: 'var(--ink-3)' }}>at current burn</em>
            </div>
          </div>
          <div class="chart ui-pop" style={d(340)}>
            <svg viewBox="0 0 400 110" aria-hidden="true">
              <g stroke="rgba(11,37,69,0.07)">
                <line x1="0" y1="15" x2="400" y2="15" />
                <line x1="0" y1="55" x2="400" y2="55" />
                <line x1="0" y1="95" x2="400" y2="95" />
              </g>
              <path
                d="M0 92 C 40 88, 60 84, 80 82 S 140 74, 160 70 S 220 64, 240 54 S 300 44, 320 34 S 370 22, 400 16 L 400 104 L 0 104 Z"
                fill="rgba(57,145,218,0.13)"
              />
              <path
                class="draw"
                d="M0 92 C 40 88, 60 84, 80 82 S 140 74, 160 70 S 220 64, 240 54 S 300 44, 320 34 S 370 22, 400 16"
                fill="none"
                stroke="#3991DA"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <circle cx="400" cy="16" r="4.5" fill="#1A6DCC" stroke="#fff" stroke-width="2" />
            </svg>
          </div>
          <div class="tbl">
            <div class="tr ui-pop" style={d(480)}>
              <span>Bank sync</span>
              <span>5 accounts</span>
              <span class="pill ok">Live</span>
            </div>
            <div class="tr ui-pop" style={d(540)}>
              <span>Invoice 0142, Acme Studio</span>
              <span>$4,200</span>
              <span class="pill ok">Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Case: the Fitloop habit app. */
export function FitloopShot() {
  return (
    <>
      <div class="phone ui-pop">
        <div>
          <div class="ps">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <span class="pm">Tuesday morning</span>
          <span class="pt">Keep it going, Sara</span>
          <HabitRing day="21" streak="day streak" />
          <span class="wk7">
            <i class="on">M</i>
            <i class="on">T</i>
            <i class="on">W</i>
            <i class="on">T</i>
            <i class="on">F</i>
            <i>S</i>
            <i>S</i>
          </span>
          <span class="btn">Start today's workout</span>
        </div>
      </div>
      <div class="phone ui-pop" style={d(180)}>
        <div>
          <div class="ps">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <span class="pm">This week</span>
          <span class="pt">Your plan</span>
          <span class="li done">
            <i />
            <span>Upper body</span>
            <em>40 min</em>
          </span>
          <span class="li done">
            <i />
            <span>Cardio intervals</span>
            <em>30 min</em>
          </span>
          <span class="li">
            <i />
            <span>Mobility</span>
            <em>25 min</em>
          </span>
          <span class="li">
            <i />
            <span>Lower body</span>
            <em>45 min</em>
          </span>
          <span class="btn">See full plan</span>
        </div>
      </div>
      <div class="note-card ui-pop" style={{ ...d(420), left: '18px', bottom: '18px' }}>
        <i>$</i>
        <div>
          <b>New subscriber</b>
          <span>Annual plan, via the App Store</span>
        </div>
      </div>
    </>
  )
}

/** Case: the Clinicflow booking calendar. */
export function ClinicflowShot() {
  return (
    <>
      <div class="win ui-pop">
        <WindowBar url="book.clinicflow.app" />
        <div class="win-b">
          <div class="side">
            <b>
              <i />
              Clinicflow
            </b>
            <span class="on">Calendar</span>
            <span>Patients</span>
            <span>Therapists</span>
            <span>Reminders</span>
            <span>Reports</span>
          </div>
          <div class="main">
            <div class="mh">
              <b>Downtown clinic</b>
              <span>Week of Dec 8</span>
            </div>
            <div class="cal">
              <span />
              <span class="dh">Mon</span>
              <span class="dh">Tue</span>
              <span class="dh">Wed</span>
              <span class="dh">Thu</span>
              <span class="dh">Fri</span>
              <span>9:00</span>
              <span class="c d ui-pop" style={d(200)}>
                A. Rivera
              </span>
              <span class="c a ui-pop" style={d(240)}>
                Intake
              </span>
              <span class="c" />
              <span class="c b ui-pop" style={d(280)}>
                J. Chen
              </span>
              <span class="c a ui-pop" style={d(320)}>
                M. Osei
              </span>
              <span>10:00</span>
              <span class="c a ui-pop" style={d(360)}>
                K. Patel
              </span>
              <span class="c b ui-pop" style={d(400)}>
                Rehab
              </span>
              <span class="c d ui-pop" style={d(440)}>
                L. Novak
              </span>
              <span class="c" />
              <span class="c b ui-pop" style={d(480)}>
                Follow-up
              </span>
              <span>11:00</span>
              <span class="c" />
              <span class="c a ui-pop" style={d(520)}>
                S. Ali
              </span>
              <span class="c a ui-pop" style={d(560)}>
                Intake
              </span>
              <span class="c d ui-pop" style={d(600)}>
                R. Diaz
              </span>
              <span class="c" />
              <span>12:00</span>
              <span class="c b ui-pop" style={d(640)}>
                T. Moyo
              </span>
              <span class="c" />
              <span class="c a ui-pop" style={d(680)}>
                Review
              </span>
              <span class="c a ui-pop" style={d(720)}>
                E. Park
              </span>
              <span class="c d ui-pop" style={d(760)}>
                N. Ito
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="note-card ui-pop" style={{ ...d(900), right: '18px', bottom: '18px' }}>
        <i>SMS</i>
        <div>
          <b>Reminder sent to R. Diaz</b>
          <span>Thu 11:00 with Dr. Rivera. Reply C to confirm</span>
        </div>
      </div>
    </>
  )
}

/** The product evolving from scope to launch, driven by the process step in view. */
export function EvolutionPanel(props: { stage: number }) {
  return (
    <div class="evo" data-stage={props.stage}>
      <div class="win-bar">
        app.ledgerly.co
        <span class="tag-demo pill">Friday demo 3 of 4</span>
        <span class="tag-live pill live">Live</span>
      </div>
      <div class="evo-body">
        <div class="evo-l l0">
          <div class="doc">
            <b>Ledgerly, scope v1</b>
            <span class="ok">Bank sync for five accounts</span>
            <span class="ok">13-week cash forecast</span>
            <span class="ok">Stripe billing and invoices</span>
            <span class="later">Later: multi-currency</span>
            <div class="doc-foot">Fixed price agreed · launch on Fri, Dec 12</div>
          </div>
        </div>
        <div class="evo-l l1">
          <div class="wf-grid">
            <div class="wf-side" />
            <div class="wf-main">
              <div class="wf-kpis">
                <i />
                <i />
                <i />
              </div>
              <div class="wf-chart">Clickable Figma prototype</div>
            </div>
          </div>
        </div>
        <div class="evo-l l2">
          <div class="win-b">
            <div class="side">
              <b>
                <i />
                Ledgerly
              </b>
              <span class="on">Overview</span>
              <span>Cash flow</span>
              <span>Invoices</span>
              <span>Accounts</span>
            </div>
            <div class="main">
              <div class="kpis">
                <div class="kpi">
                  <small>Monthly revenue</small>
                  <b>$48,210</b>
                </div>
                <div class="kpi">
                  <small>Cash today</small>
                  <b class="skel">$212,480</b>
                </div>
                <div class="kpi">
                  <small>Runway</small>
                  <b class="skel">19 mo</b>
                </div>
              </div>
              <div class="chart evo-chart">
                <svg viewBox="0 0 400 110" aria-hidden="true">
                  <g stroke="rgba(11,37,69,0.07)">
                    <line x1="0" y1="15" x2="400" y2="15" />
                    <line x1="0" y1="55" x2="400" y2="55" />
                    <line x1="0" y1="95" x2="400" y2="95" />
                  </g>
                  <path
                    class="line"
                    d="M0 92 C 40 88, 60 84, 80 82 S 140 74, 160 70 S 220 64, 240 54 S 300 44, 320 34 S 370 22, 400 16"
                    fill="none"
                    stroke="#3991DA"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="tbl">
                <div class="tr">
                  <span>Bank sync</span>
                  <span class="skel">5 accounts</span>
                  <span class="pill ok">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="toast">
          <b>First paying customer</b> · Acme Studio, Team plan
        </div>
      </div>
    </div>
  )
}
