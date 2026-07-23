import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { RegisterForm } from '@/components/register-form'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your interest for ZanziFit Festival: road cycling, HYROX-style, and corporate team categories.',
}

export default function RegisterPage() {
  return (
    <main>
      <PageHero
        title={<>Claim your place on the start line.</>}
        intro="Official registration hasn't opened yet. Tell us which category you want, and we'll email you the moment entries go live, with pricing, cutoffs and early-bird windows."
      />
      <section className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <RegisterForm />
      </section>
    </main>
  )
}
