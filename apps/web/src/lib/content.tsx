import type { Component } from 'solid-js'
import {
  FattybeeShot,
  FitloopShot,
  HabitPhones,
  JokuhShot,
  OpsShot,
  TallyShot,
} from '../components/shots'

export type Kind = 'saas' | 'app' | 'software'

export const KINDS: Record<Kind, { long: string; price: number; short: string }> = {
  saas: { long: 'SaaS platform', price: 7900, short: 'SaaS' },
  app: { long: 'mobile app', price: 8900, short: 'Mobile app' },
  software: { long: 'custom software build', price: 5900, short: 'Software' },
}

export const KIND_ORDER: Kind[] = ['saas', 'app', 'software']

export type BuildRow = {
  kind: Kind
  title: string
  meta: string
  description: string
  ticks: string[]
  recent: { name: string; text: string }
  shot: Component
}

export const BUILD_ROWS: BuildRow[] = [
  {
    kind: 'saas',
    title: 'SaaS platforms',
    meta: 'About 5 weeks',
    description:
      'Subscription products with sign-up, billing, dashboards and an admin panel, ready to charge customers on launch day.',
    ticks: ['Stripe subscriptions and invoicing', 'Teams, roles and single sign-on', 'Usage analytics and admin tools'],
    recent: { name: 'Ledgerly', text: ', a cash-flow SaaS built in 5 weeks' },
    shot: TallyShot,
  },
  {
    kind: 'app',
    title: 'Mobile apps',
    meta: 'About 6 weeks',
    description:
      'iOS and Android from one codebase, designed for retention and submitted to both stores for you.',
    ticks: ['React Native or Flutter', 'Push notifications and in-app purchases', 'App Store and Play Store launch'],
    recent: { name: 'Kabo AI', text: ', a grocery-scanning app built in 6 weeks' },
    shot: HabitPhones,
  },
  {
    kind: 'software',
    title: 'Custom software',
    meta: 'About 4 weeks',
    description:
      'Marketplaces, internal tools and AI workflows built around how your business actually runs.',
    ticks: ['Integrations with the tools you already use', 'Role-based access and audit logs', 'AI workflows and data migration'],
    recent: { name: 'Clinicflow', text: ', clinic scheduling built in 4 weeks' },
    shot: OpsShot,
  },
]

export type CaseStudy = {
  id: string
  name: string
  letter: string
  logo?: string
  meta: string
  metaLong: string
  heading: string
  metric: string
  result: string
  win: string
  quote: string
  person: string
  role: string
  face: string
  shot: Component
  deep?: boolean
  problem: string
  built: string
  stack: string[]
}

export const CASES: CaseStudy[] = [
  {
    id: 'ledgerly',
    name: 'Jokuh',
    letter: 'J',
    logo: '/assets/logo-jokuh.webp',
    meta: 'Personal AI - 5 Weeks',
    metaLong: 'Personal AI · built in 5 weeks',
    heading: 'A private, AI-native app and workspace featuring a built-in AI assistant named OO.',
    metric: '$1.2M',
    result: 'pre-seed raised on the first version',
    win: 'pre-seed raised on the first version, six weeks after launch',
    quote:
      'We went from a Notion doc to paying customers in five weeks. Our investors asked who our CTO was.',
    person: 'Sean Rock',
    role: 'Founder',
    face: '/assets/face-sean.webp',
    shot: JokuhShot,
    problem:
      'Agency owners were reconciling cash across five bank accounts in spreadsheets every Friday.',
    built:
      'A multi-tenant SaaS with bank sync, Stripe billing, a 13-week cash-flow forecast and a mobile app for checking cash on the go.',
    stack: ['Next.js', 'React Native', 'Supabase', 'Plaid', 'Stripe'],
  },
  {
    id: 'fitloop',
    name: 'Kabo AI',
    letter: 'K',
    logo: '/assets/logo-kabo.webp',
    meta: 'Mobile app · 6 weeks',
    metaLong: 'Mobile app · built in 6 weeks',
    heading: 'A food scanner that turns a label into a score you can read',
    metric: '10,000',
    result: 'downloads in the first 90 days',
    win: 'downloads in the first 90 days',
    quote:
      'The Friday demos changed everything. I always knew exactly where we were, and I never had to chase anyone.',
    person: 'Sara Kovac',
    role: 'co-founder',
    face: '/assets/face-sara.webp',
    shot: FitloopShot,
    deep: true,
    problem:
      'Shoppers stand in the aisle with a package in hand, and the label gives them nothing they can act on at a glance.',
    built:
      'An iOS app with barcode and meal scanning, a 0 to 100 product score, plain-language notes on ingredients and additives, saved allergen and diet preferences, and a scan history.',
    stack: ['React Native', 'Expo', 'Supabase', 'RevenueCat'],
  },
  {
    id: 'clinicflow',
    name: 'FattyBee',
    letter: 'F',
    logo: '/assets/logo-fattybee.webp',
    meta: 'Custom software · 4 weeks',
    metaLong: 'Custom software · built in 4 weeks',
    heading: 'Online ordering, menu, and reservation system for all restaurant chains',
    metric: '25%',
    result: 'New customer increase',
    win: 'new customer increase in the first quarter after launch',
    quote:
      'Restaurant POS systems felt so scary until we planned FattyBee with Banao Studio, And they shipped it in only 4 weeks.',
    person: 'Shafiqul',
    role: 'CEO of Helium',
    face: '/assets/face-daniel.webp',
    shot: FattybeeShot,
    problem:
      'Restaurant chains were taking orders by phone and running reservations, menus and pricing across three separate tools.',
    built:
      'An online ordering, menu and reservation system with a live kitchen queue, chain-wide menu management and a dashboard for every location.',
    stack: ['Next.js', 'Postgres', 'Stripe', 'Twilio'],
  },
]

export type Plan = {
  id: string
  label: string
  amount: string | null
  unit: string
  sub: string
  action: string
  featured: boolean
  anchor: string | null
  ticks: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'sprint',
    label: 'Design Sprint',
    amount: '$1,490',
    unit: 'one-time',
    sub: 'One week to validate the idea before you build it',
    action: 'Start with a sprint',
    featured: false,
    anchor: null,
    ticks: [
      'Scope and goals workshop',
      'User flows and wireframes',
      'Clickable Figma prototype',
      'Fully credited toward your build',
    ],
  },
  {
    id: 'build',
    label: 'MVP Build',
    amount: null,
    unit: 'fixed',
    sub: 'Price for a',
    action: 'Book a scoping call',
    featured: true,
    anchor: 'Typical agency quote: $60,000+',
    ticks: [
      'Everything in Design Sprint',
      'Full product design and development',
      'Auth, payments, admin and analytics',
      'Weekly demos and a shared Slack',
      'Launch and 30 days of support',
    ],
  },
  {
    id: 'growth',
    label: 'Growth Partner',
    amount: '$2,490',
    unit: 'per month',
    sub: 'After launch, keep shipping without hiring yet',
    action: 'Talk about growth',
    featured: false,
    anchor: null,
    ticks: [
      'New features every two weeks',
      'Monitoring, uptime and fixes',
      'Same-day replies on Slack',
      'Pause or cancel anytime',
    ],
  },
]

export const PROMISES = [
  "10% back for every week we're late",
  'Sprint fee comes off your build',
  'NDA signed before the first call',
  'Paid in milestones: 40, 40, 20',
]

export const FAQ = [
  {
    q: 'How much does a first version cost?',
    a: 'Most builds land between $5,900 and $8,900 depending on scope. You get one fixed price in writing within 48 hours of your scope call, and it only changes if you add features.',
  },
  {
    q: 'Can you really launch in six weeks?',
    a: 'Yes, because we scope hard. We build the smallest version that proves your idea to users and investors, and save the nice-to-haves for version two. The date is backed by our late-delivery refund.',
  },
  {
    q: 'Do I own the code?',
    a: 'Completely. The repository, designs, domains and cloud accounts are created in your name from day one. We take no equity and keep no licence.',
  },
  {
    q: "I'm not technical. Is that a problem?",
    a: "Not at all. Most of our founders aren't. We turn your idea into a plan in plain language. You make the product decisions and we handle the technical ones.",
  },
  {
    q: 'What happens after launch?',
    a: 'You get 30 days of free bug fixes. After that you can keep us on the Growth Partner plan, hire your own team with our handover docs, or both.',
  },
  {
    q: 'I already have designs. Can you just build?',
    a: 'Yes. If your Figma files are ready we skip the sprint and start building in week one, which usually brings both the price and the timeline down.',
  },
]

export const PROCESS_STEPS = [
  {
    week: 'W0',
    progress: 0.12,
    label: 'Week 0',
    title: 'Scope call',
    body: 'A free 20-minute call about your idea, your users and what has to be true at launch.',
    gets: 'You get a written scope and fixed price within 48 hours',
    launch: false,
  },
  {
    week: 'W1',
    progress: 0.3,
    label: 'Week 1',
    title: 'Design sprint',
    body: 'User flows, wireframes and a prototype you can put in front of real users before we write any code.',
    gets: 'You get a clickable Figma prototype',
    launch: false,
  },
  {
    week: 'W2–5',
    progress: 0.8,
    label: 'Weeks 2 to 5',
    title: 'Build',
    body: 'Weekly cycles. Every Friday you click through real progress on a staging link, with a 15-minute walkthrough.',
    gets: 'You get four live demos',
    launch: false,
  },
  {
    week: 'W6',
    progress: 1,
    label: 'Week 6',
    title: 'Launch',
    body: 'We deploy, submit to the stores and hand over the code, docs and every account.',
    gets: 'You get a live product and 30 days of support',
    launch: true,
  },
]

export const RIVALS = {
  freelancer: { weeks: '24', scale: 0.67, who: 'freelancer' },
  agency: { weeks: '36', scale: 1, who: 'large agency' },
} as const

export type Rival = keyof typeof RIVALS
