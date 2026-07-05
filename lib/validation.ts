export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d+]/g, '')
  return digits.length >= 7
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export type FieldError = string | null

export function validateField(
  kind: 'email' | 'phone' | 'required' | 'minLength',
  value: string,
  opts?: { minLength?: number; label?: string },
): FieldError {
  const label = opts?.label ?? 'This field'

  if (kind === 'required') {
    return isRequired(value) ? null : `${label} is required.`
  }
  if (kind === 'email') {
    if (!isRequired(value)) return `${label} is required.`
    return isValidEmail(value) ? null : 'Enter a valid email address.'
  }
  if (kind === 'phone') {
    if (!isRequired(value)) return `${label} is required.`
    return isValidPhone(value) ? null : 'Enter a valid phone number.'
  }
  if (kind === 'minLength') {
    const min = opts?.minLength ?? 1
    if (!isRequired(value)) return `${label} is required.`
    return value.trim().length >= min
      ? null
      : `${label} must be at least ${min} characters.`
  }
  return null
}
