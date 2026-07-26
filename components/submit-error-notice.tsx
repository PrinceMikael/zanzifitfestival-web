const EMAIL_PATTERN = /[^\s]+@[^\s]+\.[^\s.,]+/

export function SubmitErrorNotice({ message }: { message: string }) {
  const match = message.match(EMAIL_PATTERN)
  if (!match) {
    return (
      <p role="alert" className="mt-4 text-sm text-destructive">
        {message}
      </p>
    )
  }

  const email = match[0]
  const [before, after] = [message.slice(0, match.index), message.slice((match.index ?? 0) + email.length)]

  return (
    <p role="alert" className="mt-4 text-sm text-destructive">
      {before}
      <a href={`mailto:${email}`} className="underline underline-offset-2 hover:text-destructive/80">
        {email}
      </a>
      {after}
    </p>
  )
}
