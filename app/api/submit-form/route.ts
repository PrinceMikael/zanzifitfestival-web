import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { isRequired, isValidEmail } from '@/lib/validation'

export const runtime = 'nodejs'

const TO_ADDRESS = 'info@zanzifit.com'
const FROM_ADDRESS = 'ZanziFit Festival <onboarding@resend.dev>'

type RegisterPayload = {
  kind: 'register'
  name: string
  email: string
  phone: string
  category: string
}

type ContactPayload = {
  kind: 'contact'
  name: string
  email: string
  message: string
}

type PartnershipPayload = {
  kind: 'partnership'
  name: string
  company: string
  email: string
  tier: string
  message: string
}

type NewsletterPayload = {
  kind: 'newsletter'
  email: string
}

type Payload = RegisterPayload | ContactPayload | PartnershipPayload | NewsletterPayload

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function buildEmail(payload: Payload): { subject: string; text: string } {
  if (payload.kind === 'register') {
    return {
      subject: `Registration interest — ${payload.category}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nCategory: ${payload.category}`,
    }
  }
  if (payload.kind === 'contact') {
    return {
      subject: `Website enquiry from ${payload.name}`,
      text: `${payload.message}\n\n— ${payload.name} (${payload.email})`,
    }
  }
  if (payload.kind === 'partnership') {
    return {
      subject: `Partnership enquiry — ${payload.company}`,
      text: `Name: ${payload.name}\nCompany: ${payload.company}\nEmail: ${payload.email}\nTier of interest: ${payload.tier}\nMessage: ${payload.message || '(none)'}`,
    }
  }
  return {
    subject: 'Newsletter signup',
    text: `Email: ${payload.email}`,
  }
}

function validate(payload: Payload): string | null {
  if (payload.kind === 'register') {
    if (!isRequired(payload.name)) return 'Name is required.'
    if (!isValidEmail(payload.email)) return 'A valid email is required.'
    if (!isRequired(payload.phone)) return 'Phone number is required.'
    if (!isRequired(payload.category)) return 'Category is required.'
    return null
  }
  if (payload.kind === 'contact') {
    if (!isRequired(payload.name)) return 'Name is required.'
    if (!isValidEmail(payload.email)) return 'A valid email is required.'
    if (!isRequired(payload.message) || payload.message.trim().length < 10) return 'Message must be at least 10 characters.'
    return null
  }
  if (payload.kind === 'partnership') {
    if (!isRequired(payload.name)) return 'Name is required.'
    if (!isRequired(payload.company)) return 'Company is required.'
    if (!isValidEmail(payload.email)) return 'A valid work email is required.'
    return null
  }
  if (payload.kind === 'newsletter') {
    if (!isValidEmail(payload.email)) return 'A valid email is required.'
    return null
  }
  return 'Unknown form type.'
}

export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = await request.json()
  } catch {
    return badRequest('Invalid request body.')
  }

  if (!payload || typeof payload !== 'object' || !('kind' in payload)) {
    return badRequest('Missing form type.')
  }

  const validationError = validate(payload)
  if (validationError) {
    return badRequest(validationError)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured; form submission was not sent.', payload)
    return NextResponse.json(
      { error: 'This form is temporarily unavailable. Please email info@zanzifit.com directly.' },
      { status: 503 },
    )
  }

  const resend = new Resend(apiKey)
  const { subject, text } = buildEmail(payload)

  const replyTo = 'email' in payload ? payload.email : undefined

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    replyTo,
    subject,
    text,
  })

  if (error) {
    console.error('Resend send failed:', error)
    return NextResponse.json(
      { error: 'We could not send your submission. Please email info@zanzifit.com directly.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
