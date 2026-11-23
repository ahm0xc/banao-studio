import { createFileRoute } from '@tanstack/solid-router'
import { onCleanup, onMount } from 'solid-js'
import { About } from '../components/About'
import { Book } from '../components/Book'
import { Build } from '../components/Build'
import { DemoBand } from '../components/DemoBand'
import { Faq } from '../components/Faq'
import { Hero } from '../components/Hero'
import { Pricing } from '../components/Pricing'
import { Process } from '../components/Process'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { UiProvider } from '../components/UiProvider'
import { Why } from '../components/Why'
import { Work } from '../components/Work'
import { initReveals } from '../lib/reveal'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  onMount(() => {
    const dispose = initReveals(document)
    onCleanup(dispose)
  })

  return (
    <UiProvider>
      <SiteHeader />
      <main id="top">
        <Hero />
        <About />
        <DemoBand />
        <Build />
        <Work />
        <Why />
        <Process />
        <Pricing />
        <Faq />
        <Book />
      </main>
      <SiteFooter />
    </UiProvider>
  )
}
