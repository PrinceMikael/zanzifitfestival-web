# Client Feedback Fixes and De-templating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 12 client-reported issues (light-mode header, phone field, leadership photos/copy, logo crop, footer icons, Zanzibar/Fumba copy pass, favicon, mailto fallback, email correction) and apply a targeted de-templating pass to reduce the "AI-generated" feel, without changing the brand tokens, fonts, IA, or routes.

**Architecture:** This is a Next.js 16 App Router site (`app/*/page.tsx` routes, shared `components/*.tsx`), no backend/API routes, no test framework. Styling is Tailwind v4 via CSS custom properties in `app/globals.css`. Every task in this plan is a direct file edit; verification is manual, in-browser, via `pnpm dev` — consistent with how prior work in this repo was verified (see `docs/superpowers/plans/*`).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, `lucide-react` icons, `sharp` (already present transitively via Next.js/pnpm — used once, out-of-band, to regenerate image assets).

## Global Constraints

- Do not change color tokens, font families, page routes, or overall IA — this is a fix/polish pass, not a rebuild (per approved spec, "refine within current system").
- Correct email everywhere is `info@zanzifit.com` (replaces `hello@zanzifit.com` and `info@zanzifitfestival.com`).
- Every "Fumba"/"Fumba Town" reference is replaced — no exceptions — including travel-time badges and course-routing descriptions. Real proper nouns (e.g. the hotel "Fumba Beach Lodge") are the one exception already carved out in the spec: the hotel's name itself is not renamed, only its area/description text.
- No backend/API routes are to be added. Form "send" actions become `mailto:` links, mirroring the existing `wa.me` pattern in `components/enquiry-link.tsx`.
- No automated test suite exists in this repo. Verification is manual via the dev server, per step.
- Leadership photo *content* (asking the client for six consistent new photos) is explicitly out of scope for this plan — only a uniform CSS/image treatment is applied to what exists today.

---

## File structure (what changes and why)

- `components/site-header.tsx` — header becomes theme-aware in its unscrolled state (#1)
- `components/register-form.tsx` — add phone field (#2)
- `app/leadership/page.tsx` — name fix, remove image + governance section, redefine core team copy, photo-forward card treatment (#3–#6, Part B)
- `public/zfit-logo.png` — replaced with a tightly-cropped version (#7)
- `public/icon.png`, `public/apple-icon.png` (new/replaced) — real ZFit favicon assets (#10; discovered during research that current icon files are leftover Vercel v0 placeholder art, not ZFit branding)
- `app/layout.tsx` — wire favicon via `metadata.icons` (#10)
- `components/site-footer.tsx` — icon-based socials, email fix (#8, #12)
- `components/contact-form.tsx`, `components/register-form.tsx` — `mailto:` fallback on submit (#11)
- `app/contact/page.tsx`, `app/accommodation/page.tsx`, `app/partnership/page.tsx` — email fix, mailto links (#12)
- `app/about/page.tsx`, `app/festival/page.tsx`, `app/faq/page.tsx`, `app/gallery/page.tsx`, `app/experience/page.tsx`, `app/accommodation/page.tsx`, `components/disciplines.tsx`, `app/layout.tsx` — "Fumba" → "Zanzibar" copy sweep (#9)
- `app/about/page.tsx` (values/timeline sections), `app/festival/page.tsx` (booking-step-style cards), `app/accommodation/page.tsx` (booking-step cards) — de-templating layout variation (Part B)

---

### Task 1: Fix header visibility in light mode

**Files:**
- Modify: `components/site-header.tsx:46-145`

**Interfaces:**
- Consumes: existing semantic tokens `text-foreground`, `border-border` (already defined in `app/globals.css`, theme-aware via `:root[data-theme='light']`)
- Produces: no new exports; internal JSX/class changes only

- [ ] **Step 1: Reproduce the bug**

Run the dev server and confirm the problem before touching code:

```bash
pnpm dev
```

Visit `http://localhost:3000/leadership` (any interior page works — it uses `PageHero`, not the homepage `Hero`). Toggle to light mode via the theme button in the header. Confirm the nav links, logo, and mobile-menu icon are invisible or near-invisible against the light cream background at scroll position 0.

- [ ] **Step 2: Make the unscrolled header theme-aware**

The root cause: `SiteHeader` hardcodes `text-bone` (always-light text) and an unconditional `invert` on the logo, assuming the surface underneath is always dark. That assumption only holds on the homepage. Replace the hardcoded light-only classes with theme-aware semantic tokens so the header adapts to `data-theme` the same way page content already does.

In `components/site-header.tsx`, replace the logo `<Image>` classes (currently line 74, `className="h-10 w-auto invert lg:h-12"`):

```tsx
        <Link href="/" className="flex items-center gap-2" aria-label="ZanziFit Festival home">
          <Image
            src="/zfit-logo.png"
            alt="ZFit Festival"
            width={132}
            height={44}
            priority
            className="h-10 w-auto dark:invert lg:h-12"
          />
        </Link>
```

This makes the logo invert to white only when `.dark` is active (the `@custom-variant dark (&:is(.dark *))` in `globals.css` — check how `data-theme` maps to the `dark` class before this step; see Step 2a below if it doesn't).

- [ ] **Step 2a: Confirm the `dark` class variant actually toggles with `data-theme`**

Read `components/theme-script.tsx` and `components/theme-toggle.tsx` to check whether toggling theme sets a `dark` class on `<html>`, or only a `data-theme` attribute. Run:

```bash
grep -n "classList\|data-theme" components/theme-script.tsx components/theme-toggle.tsx
```

If only `data-theme` is set (no `.dark` class), the `@custom-variant dark (&:is(.dark *))` selector in `globals.css:5` will never match, and `dark:invert` in Step 2 will silently never apply. In that case, use an explicit selector instead — replace the logo `className` with:

```tsx
            className="h-10 w-auto invert lg:h-12 [:root[data-theme='light']_&]:invert-0"
```

This inverts (white mark) by default — correct for the dark theme, which is the site's default per `viewport.colorScheme = 'dark'` in `app/layout.tsx` — and cancels the invert (back to the logo's natural black mark) when `data-theme="light"` is set on `<html>`.

- [ ] **Step 3: Fix nav link and mobile-menu button colors**

Replace the nav `<Link>` className block (currently lines 85-90):

```tsx
                className={cn(
                  'font-utility text-[0.82rem] uppercase tracking-[0.14em] transition-colors',
                  active
                    ? 'text-amber'
                    : 'text-foreground/70 hover:text-foreground',
                )}
```

Replace the mobile-menu toggle button className (currently line 110):

```tsx
              className="inline-flex size-10 items-center justify-center rounded-sm border border-border text-foreground lg:hidden"
```

`text-foreground` already resolves correctly in both themes via the semantic token remap in `globals.css` (`--foreground: var(--bone)` in dark, `--foreground: var(--ink)` in light) — this is the same token every page body already relies on.

- [ ] **Step 4: Fix the mobile dropdown panel and its background**

The mobile menu panel (currently line 121) uses `bg-ink/95` which is correct as a literal dark surface *if* the header itself commits to always being dark when open — but since we just made the collapsed header theme-aware, check this panel too. Replace line 121-131:

```tsx
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-border/60 py-3 font-utility text-sm uppercase tracking-[0.14em] text-foreground/80"
              >
                {item.label}
                <Chevrons count={1} className="text-amber" />
              </Link>
            ))}
```

`bg-background/95` resolves to near-opaque ink in dark mode and near-opaque bone in light mode — correct in both.

- [ ] **Step 5: Manual verification**

With `pnpm dev` running:
1. Visit `/leadership` in light mode at scroll 0 — confirm nav text, logo, and menu button are all clearly visible (dark marks on the light page).
2. Scroll down — confirm the scrolled state (`bg-ink/85` background — check this still makes sense; if the scrolled bar is hardcoded dark-ink regardless of theme, that's a separate, smaller inconsistency — for this task, only fix the *unscrolled* state per the reported bug; leave the scrolled `bg-ink/85` as-is unless it's also unreadable in light mode. Confirm visually.
3. Toggle to dark mode, repeat on `/` (homepage) and `/leadership` — confirm no regression (logo still inverts to white, nav text still light, matches how it looked before this change).
4. Open the mobile menu (resize browser or use dev tools device toolbar) in both themes — confirm the dropdown panel and its text are legible in both.

- [ ] **Step 6: Commit**

```bash
git add components/site-header.tsx
git commit -m "Fix header visibility in light mode on interior pages"
```

---

### Task 2: Add phone field to registration form

**Files:**
- Modify: `components/register-form.tsx`

**Interfaces:**
- Consumes: `validateField('phone', value, { label })` from `lib/validation.ts` (already exists, already exported, currently unused — confirmed via `lib/validation.ts:16-42`)
- Produces: `RegisterForm`'s internal `Fields` type gains a `phone: string` member; no external interface changes (component is used with no props in `app/register/page.tsx:19`)

- [ ] **Step 1: Update the `Fields` and `Errors` types**

In `components/register-form.tsx`, replace line 16-17:

```tsx
type Fields = { name: string; email: string; phone: string; category: string }
type Errors = Partial<Record<'name' | 'email' | 'phone', FieldError>>
```

- [ ] **Step 2: Update `validate`, `handleChange`, `handleBlur` to cover `phone`**

Replace lines 29-42:

```tsx
  function validate(field: 'name' | 'email' | 'phone', value: string): FieldError {
    if (field === 'name') return validateField('required', value, { label: 'Name' })
    if (field === 'email') return validateField('email', value, { label: 'Email' })
    return validateField('phone', value, { label: 'Phone number' })
  }

  function handleChange(field: 'name' | 'email' | 'phone', value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validate(field, value) }))
  }

  function handleBlur(field: 'name' | 'email' | 'phone') {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((e) => ({ ...e, [field]: validate(field, values[field]) }))
  }
```

- [ ] **Step 3: Update initial state and `handleSubmit`**

Replace line 25:

```tsx
  const [values, setValues] = useState<Fields>({ name: '', email: '', phone: '+255 ', category: CATEGORIES[0] })
```

Replace line 27 (`touched` state type):

```tsx
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({})
```

Replace `handleSubmit` (lines 44-58):

```tsx
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      email: validate('email', values.email),
      phone: validate('phone', values.phone),
    }
    setErrors(nextErrors)
    setTouched({ name: true, email: true, phone: true })
    const firstInvalid = (Object.keys(nextErrors) as ('name' | 'email' | 'phone')[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus()
      return
    }
    setSent(true)
  }
```

- [ ] **Step 4: Add the phone `<label>` block to the JSX**

Insert after the email field's closing `</label>` (currently ending at line 102), before the Category `<label>` (currently starting at line 103):

```tsx
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Phone number</span>
        <input
          id="register-phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'register-phone-error' : undefined}
          className={`${FIELD} ${errors.phone ? FIELD_INVALID : ''}`}
          placeholder="+255 686 915 587"
        />
        {errors.phone ? <p id="register-phone-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.phone}</p> : null}
      </label>
```

- [ ] **Step 5: Manual verification**

Run `pnpm dev`, visit `/register`:
1. Confirm the phone field appears between Email and Category, pre-filled with `+255 `.
2. Clear the field entirely and blur — confirm "Phone number is required." appears.
3. Type `123` and blur — confirm "Enter a valid phone number." appears (fewer than 7 digits, per `isValidPhone` in `lib/validation.ts:5-8`).
4. Type a full number (e.g. `+255 686 915 587`) and submit with valid name/email — confirm the form succeeds and shows the "You're on the list" confirmation.
5. Submit with an invalid phone and valid name/email — confirm focus moves to the phone field and the error shows.

- [ ] **Step 6: Commit**

```bash
git add components/register-form.tsx
git commit -m "Add phone number field to registration form"
```

---

### Task 3: Fix email address everywhere (hello@/info@zanzifitfestival.com → info@zanzifit.com)

**Files:**
- Modify: `components/site-footer.tsx:113`
- Modify: `app/contact/page.tsx:27`
- Modify: `app/accommodation/page.tsx:280`

**Interfaces:**
- No component signatures change — text/content only.

- [ ] **Step 1: Confirm every occurrence**

```bash
grep -rn "hello@zanzifit\.com\|info@zanzifitfestival\.com" app components
```

Expected matches: `components/site-footer.tsx` (`hello@zanzifit.com`), `app/contact/page.tsx` and `app/accommodation/page.tsx` (`info@zanzifitfestival.com`).

- [ ] **Step 2: Fix the footer**

In `components/site-footer.tsx`, replace line 112-114:

```tsx
            <a
              href="mailto:info@zanzifit.com"
              className="font-utility text-xs uppercase tracking-[0.16em] text-bone/45 transition-colors hover:text-amber"
            >
              info@zanzifit.com
            </a>
```

(This changes the plain `<p>` into a working `mailto:` link, matching item #12's "correct address, and it should behave like the WhatsApp link" framing.)

- [ ] **Step 3: Fix the Contact page**

In `app/contact/page.tsx`, replace line 25-28:

```tsx
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                <a href="mailto:info@zanzifit.com" className="transition-colors hover:text-amber">
                  info@zanzifit.com
                </a>
              </p>
```

- [ ] **Step 4: Fix the Accommodation page**

In `app/accommodation/page.tsx`, replace line 279-281:

```tsx
          <p className="flex items-center gap-3">
            <Chevrons className="text-amber" count={1} />
            <a href="mailto:info@zanzifit.com" className="transition-colors hover:text-amber">
              info@zanzifit.com
            </a>
          </p>
```

- [ ] **Step 5: Confirm no stray occurrences remain**

```bash
grep -rn "hello@zanzifit\.com\|info@zanzifitfestival\.com" app components
```

Expected: no output. (Note: `partners@zanzifit.com` in `app/partnership/page.tsx:115` is a different, intentionally distinct mailbox for partnership enquiries — not part of this fix, leave as-is unless the client says otherwise.)

- [ ] **Step 6: Manual verification**

Run `pnpm dev`. Visit `/`, `/contact`, `/accommodation`. Confirm each shows `info@zanzifit.com` and clicking it opens the system mail client addressed to `info@zanzifit.com` (or shows the `mailto:` link target on hover).

- [ ] **Step 7: Commit**

```bash
git add components/site-footer.tsx app/contact/page.tsx app/accommodation/page.tsx
git commit -m "Correct festival email to info@zanzifit.com across footer, contact, and accommodation pages"
```

---

### Task 4: Footer social links as icons instead of text

**Files:**
- Modify: `components/site-footer.tsx:1-40, 99-111`

**Interfaces:**
- Consumes: `lucide-react` (already a dependency, already imported elsewhere e.g. `components/enquiry-link.tsx:1`)
- Produces: no external interface change

- [ ] **Step 1: Update imports and the `SOCIALS` data**

In `components/site-footer.tsx`, replace line 1-4:

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'
import { Chevrons } from '@/components/chevrons'
```

Replace the `SOCIALS` array (lines 35-40):

```tsx
const SOCIALS = [
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'Facebook', Icon: Facebook },
  { href: '#', label: 'YouTube', Icon: Youtube },
  { href: 'https://wa.me/255686915587', label: 'WhatsApp', Icon: MessageCircle },
]
```

(WhatsApp gets its real link, matching the number used everywhere else in the site, e.g. `components/enquiry-link.tsx:4`. Instagram/Facebook/YouTube stay `#` placeholders since no real URLs were provided — same as before this change, only the visual treatment changes.)

- [ ] **Step 2: Update the render to use icons**

Replace lines 100-111:

```tsx
            <div className="flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-bone/70 transition-colors hover:border-amber hover:text-amber"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
```

- [ ] **Step 3: Manual verification**

Run `pnpm dev`, visit `/`, scroll to footer. Confirm four icon buttons render (Instagram, Facebook, YouTube, WhatsApp glyphs) instead of `IG`/`FB`/`YT`/`WA` text. Hover each — confirm the amber hover state still works. Use browser dev tools accessibility inspector (or just view source) to confirm each `<a>` still has its `aria-label`. Click the WhatsApp icon — confirm it opens `https://wa.me/255686915587` in a new tab.

- [ ] **Step 4: Commit**

```bash
git add components/site-footer.tsx
git commit -m "Replace footer social text labels with icons"
```

---

### Task 5: Leadership page — name fix, remove image + governance section, redefine core team, photo-forward cards

**Files:**
- Modify: `app/leadership/page.tsx` (entire file restructured)

**Interfaces:**
- Consumes: `PageHero` (no `image` prop this time — confirmed optional in `components/page-hero.tsx:9,48-58`), `SectionHeading`
- Produces: no exports change (default page export)

- [ ] **Step 1: Fix the name typo**

In `app/leadership/page.tsx`, replace lines 44-48:

```tsx
  {
    name: 'Walter Mwacha',
    role: 'Board Secretary',
    image: '/images/leadership/walter-mwach.jpg',
    bio: 'Maintains board governance records and supports the formal decision-making process behind the festival.',
  },
```

(Only the displayed `name` field changes to "Walter Mwacha" — the image filename stays `walter-mwach.jpg` since it's an internal asset path, not user-visible text, per the spec's explicit call on this.)

- [ ] **Step 2: Remove the top image from `PageHero` and rewrite the intro to define "core team"**

Replace lines 54-59:

```tsx
      <PageHero
        eyebrow="The team"
        title={<>The people behind the horizon.</>}
        intro="ZanziFit's core team is the group of six who hold direct operating and governing responsibility for the festival — spanning event delivery, athlete and venue operations, and Zanzibari hospitality partnerships. Every decision on the festival's direction runs through this group."
      />
```

(No `image` prop is passed — `PageHero`'s conditional rendering at `components/page-hero.tsx:29-31,48-58` already handles the no-image case by rendering the text column full-width with no grid split, so no changes to `PageHero` itself are needed.)

- [ ] **Step 3: Give the team grid a photo-forward, borderless treatment**

Replace the team grid section (currently lines 61-82):

```tsx
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Leadership" title="Meet the core team." />
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <article key={m.name}>
              <div className="group relative aspect-[4/5] overflow-hidden">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-surface-dark-foreground">{m.name}</h3>
              <div className="mt-1 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{m.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
```

This removes the `rounded-lg border border-border` box and the bottom gradient scrim (`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent`) that made this card visually identical to every other card on the site — the photo now bleeds to its own edges with no frame, name/role/bio sitting directly on the page background. This is the "photo-forward, editorial" treatment the design spec calls for, distinct from the boxed `ExpandableCard` used on Accommodation/Experience.

- [ ] **Step 4: Remove the Governance section entirely**

Delete lines 84-97 (the closing `<section className="border-t border-border bg-surface-dark-soft py-20 md:py-28">...</section>` block) so the file ends right after the team grid's closing `</section>` from Step 3, followed by the closing `</main>` and function brace.

- [ ] **Step 5: Verify the full file compiles as expected**

Read back `app/leadership/page.tsx` and confirm: `PageHero` has no `image` prop, `Image` import is still used (team grid), `SectionHeading` import still used, no references to the removed governance copy remain, file ends with the team grid section then `</main>`.

```bash
grep -n "Governance\|One board, full accountability\|image={{ src: '/images/leader-1.png'" app/leadership/page.tsx
```

Expected: no output.

- [ ] **Step 6: Manual verification**

Run `pnpm dev`, visit `/leadership`:
1. Confirm the hero has no photo beside the intro text, and the intro text now explains what "core team" means.
2. Confirm "Walter Mwacha" (not "Mwach") appears in the team grid.
3. Confirm each team member's photo has no border/box/gradient — bleeds directly against the page background — while name/role/bio sit below it as before.
4. Confirm the page ends after the team grid; no "Governance" / "One board, full accountability" section remains.
5. Check both light and dark mode for text legibility (this page also benefits from Task 1's header fix — verify together).

- [ ] **Step 7: Commit**

```bash
git add app/leadership/page.tsx
git commit -m "Fix Leadership page: correct name, remove image and governance section, redefine core team, photo-forward cards"
```

---

### Task 6: Replace the ZFit logo with a tightly-cropped version

**Files:**
- Create/Replace: `public/zfit-logo.png`

**Interfaces:**
- No code changes — same file path, same aspect-ratio family, consumed identically by `components/site-header.tsx:66` and `components/site-footer.tsx:49`.

**Context:** Research during planning confirmed `public/zfit-logo.png` (842×296) has ~24% of its width and ~31% of its height as fully transparent/near-white padding around the actual wordmark — at the header/footer's fixed pixel heights (`h-9`–`h-12`) with `w-auto`, this padding makes the visible mark render smaller than it should, which reads as "zoomed"/awkwardly cropped rather than a clean tight logo. `sharp` (an existing transitive dependency, resolvable at `node_modules/.pnpm/sharp@0.34.5/node_modules/sharp`) can auto-trim this in one pass — no new dependency is added to `package.json` for this, it's a one-time asset-generation step.

- [ ] **Step 1: Generate the trimmed logo**

```bash
node -e "
const sharp = require('./node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js');
sharp('public/zfit-logo.png')
  .trim({ threshold: 20 })
  .toFile('public/zfit-logo-trimmed.png')
  .then(info => console.log(JSON.stringify(info, null, 2)));
"
```

Expected output shows new dimensions around `640x204` (down from `842x296`) with non-zero negative `trimOffsetLeft`/`trimOffsetTop`, confirming padding was actually removed.

- [ ] **Step 2: Visually confirm the trimmed logo looks correct**

Open `public/zfit-logo-trimmed.png` and visually confirm: the full "ZFIT FESTIVAL" wordmark is intact (nothing was clipped that shouldn't have been), and there's now minimal/no dead space around it.

- [ ] **Step 3: Replace the original file**

```bash
mv public/zfit-logo.png public/zfit-logo-original-padded.png
mv public/zfit-logo-trimmed.png public/zfit-logo.png
rm public/zfit-logo-original-padded.png
```

(The intermediate rename-then-delete is so a mistake in Step 1 doesn't destroy the only copy before you've confirmed Step 2 looks right — by the time you reach Step 3 you've already visually confirmed it, so it's safe to delete the original outright here.)

- [ ] **Step 4: Manual verification**

Run `pnpm dev`. Visit any page, maximize the browser window (or check at a wide viewport, e.g. 1920px). Confirm the header and footer logos now render as a tight, sharp mark with no excess surrounding whitespace, at both the header's `h-10`/`h-12` and the footer's `h-9` sizes. Compare against a screenshot from before this change if possible — the mark should visibly fill more of its box, no longer reading as "zoomed out into empty space."

- [ ] **Step 5: Commit**

```bash
git add public/zfit-logo.png
git commit -m "Replace ZFit logo with tightly-cropped version to fix apparent zoom on large screens"
```

---

### Task 7: Wire a real ZFit favicon (current icon files are leftover placeholder art)

**Files:**
- Create: `public/zfit-icon-source.png` (temporary working copy, deleted at end of task)
- Replace: `public/icon-dark-32x32.png`, `public/icon-light-32x32.png`, `public/apple-icon.png`
- Replace: `public/icon.svg` (or remove — see Step 4)
- Modify: `app/layout.tsx` (add `metadata.icons`)

**Interfaces:**
- Consumes: `public/zfit-logo.png` (post-Task-6 trimmed version) as the source mark to derive favicon crops from.
- Produces: `metadata.icons` field on the exported `Metadata` object in `app/layout.tsx` — read by Next.js's built-in favicon/head-tag generation.

**Context:** Research during planning found that `public/icon.svg`, `public/icon-dark-32x32.png`, `public/icon-light-32x32.png`, and `public/apple-icon.png` all contain a "v0" mark (Vercel's v0 tool logo) — leftover scaffolding from whatever tool originally generated this project, never replaced with real ZFit branding. `app/layout.tsx`'s `Metadata` object also has no `icons` field at all, so these files may not even be wired up regardless. This task fixes both problems: generates real ZFit-branded icon files, and wires them into the page metadata.

- [ ] **Step 1: Generate square icon crops from the logo mark**

The full "ZFIT FESTIVAL" wordmark is wide (roughly 640×204 post-Task-6) and won't read at 32×32 — a favicon needs a square, simplified mark. Use just the "Z" portion of the logo (the boldest, most recognizable shape at small sizes) rather than the full wordmark. Crop and pad to square:

```bash
node -e "
const sharp = require('./node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js');
const path = require('path');

async function run() {
  const meta = await sharp('public/zfit-logo.png').metadata();
  // The 'Z' glyph occupies roughly the first third of the trimmed wordmark's width.
  const cropWidth = Math.round(meta.width * 0.34);
  await sharp('public/zfit-logo.png')
    .extract({ left: 0, top: 0, width: cropWidth, height: meta.height })
    .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile('public/zfit-icon-source.png');
  console.log('done');
}
run();
"
```

- [ ] **Step 2: Visually confirm the crop**

Open `public/zfit-icon-source.png`. Confirm it shows a recognizable, roughly-centered "Z" mark on a transparent square canvas, not an off-center or clipped fragment. If the crop is off (e.g. `cropWidth` cut through the letter awkwardly), adjust the `0.34` fraction in Step 1 and re-run until the shape reads clearly at a glance.

- [ ] **Step 3: Generate the sized PNG variants**

```bash
node -e "
const sharp = require('./node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js');

async function run() {
  // Dark-mark-on-transparent version (for light browser chrome / icon-light)
  await sharp('public/zfit-icon-source.png')
    .resize(32, 32)
    .toFile('public/icon-light-32x32.png');

  // White-mark-on-dark-square version (for dark browser chrome / icon-dark, and apple-touch-icon)
  const black = await sharp('public/zfit-icon-source.png').resize(32, 32).toBuffer();
  await sharp({ create: { width: 32, height: 32, channels: 4, background: '#0b0e12' } })
    .composite([{ input: black, blend: 'dest-over' }])
    .png()
    .toFile('public/icon-dark-32x32.png');

  await sharp('public/zfit-icon-source.png')
    .resize(180, 180, { fit: 'contain', background: '#0b0e12' })
    .flatten({ background: '#0b0e12' })
    .toFile('public/apple-icon.png');

  console.log('done');
}
run();
"
```

- [ ] **Step 4: Replace or remove the SVG favicon**

The existing `public/icon.svg` (also v0 placeholder art, with light/dark media-query styling built in) is more effort to redo accurately as an SVG trace of the Z mark than it's worth for this pass — remove it so Next.js falls back to the PNG icons wired in Step 5, rather than shipping a wrong-brand SVG that could take priority in some browsers:

```bash
rm public/icon.svg
```

- [ ] **Step 5: Wire the icons into `app/layout.tsx` metadata**

In `app/layout.tsx`, add an `icons` field to the `metadata` export. Replace lines 28-44:

```tsx
export const metadata: Metadata = {
  title: {
    default: 'ZanziFit Festival — Zanzibar, 6 November 2026',
    template: '%s · ZanziFit Festival',
  },
  description:
    'A hybrid road-cycling and HYROX-style functional fitness festival on the coast of Zanzibar, Tanzania. 6 November 2026. 1,500+ athletes, 15 countries, one horizon.',
  keywords: [
    'ZanziFit',
    'Zanzibar fitness festival',
    'HYROX Africa',
    'road cycling Zanzibar',
    'endurance festival Tanzania',
  ],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'v0.app',
}
```

(Note: this edit also removes "Fumba Town" from the meta description and keyword list — that's Task 8's concern, but since this step already touches this exact block, it's folded in here rather than creating a second edit to the same lines. If Task 8 is done separately/later, re-check this block hasn't reverted.)

- [ ] **Step 6: Clean up the temporary source file**

```bash
rm public/zfit-icon-source.png
```

- [ ] **Step 7: Manual verification**

Run `pnpm dev`, open `http://localhost:3000` in a real browser (not just curl — favicon rendering needs an actual browser tab). Confirm the browser tab shows the ZFit "Z" mark, not a generic globe icon or the old "v0" mark. Test both OS-level light and dark browser themes if easy to toggle (e.g. via OS dark mode setting), confirming the correct-contrast variant loads. Check on a mobile device or responsive device toolbar "add to home screen" preview if feasible, to confirm the apple-touch-icon looks right (dark square background, Z mark visible).

- [ ] **Step 8: Commit**

```bash
git add public/icon-dark-32x32.png public/icon-light-32x32.png public/apple-icon.png app/layout.tsx
git rm public/icon.svg
git commit -m "Replace placeholder v0 favicon with real ZFit branding and wire it into page metadata"
```

---

### Task 8: "Fumba"/"Fumba Town" → Zanzibar copy sweep

**Files:**
- Modify: `app/layout.tsx` (description string — verify against Task 7's edit, may already be done)
- Modify: `components/site-footer.tsx:64`
- Modify: `components/hero.tsx:69`
- Modify: `app/about/page.tsx:31-33,42,65`
- Modify: `app/festival/page.tsx:20,55`
- Modify: `app/faq/page.tsx:7,14,24`
- Modify: `app/gallery/page.tsx:17`
- Modify: `app/experience/page.tsx:12,18,42,45,47,54,65,83,88,110,170,182,193`
- Modify: `app/accommodation/page.tsx:10,17,28-29,31,40,51,63-65,77,88,99,110,124,136,147,158,172,183,194,205`
- Modify: `app/partnership/page.tsx:116`
- Modify: `app/contact/page.tsx:9,23,35` (contact page's own "Fumba Town" instances — separate from the email fix in Task 3)
- Modify: `components/disciplines.tsx:12`

**Interfaces:**
- Content/copy-only changes across all files — no prop or type changes anywhere in this task.

- [ ] **Step 1: Confirm the full scope before starting**

```bash
grep -rn "Fumba" app components | wc -l
```

Note the count. This task's job is to bring that count to zero (except inside `docs/superpowers/*.md`, which the spec explicitly says to leave untouched as historical record).

- [ ] **Step 2: Fix `app/layout.tsx` (if not already done by Task 7)**

```bash
grep -n "Fumba" app/layout.tsx
```

If any match remains (i.e. Task 7 wasn't done, or its metadata edit was reverted), fix the `description` field to read:

```
'A hybrid road-cycling and HYROX-style functional fitness festival on the coast of Zanzibar, Tanzania. 6 November 2026. 1,500+ athletes, 15 countries, one horizon.'
```

and remove `'Fumba Town'` from the `keywords` array.

- [ ] **Step 3: Fix `components/site-footer.tsx`**

Replace line 64 (`Fumba Town, Zanzibar` in the footer tagline block):

```tsx
              Zanzibar, Tanzania
```

- [ ] **Step 4: Fix `components/hero.tsx`**

Replace lines 67-71 (the hero paragraph mentioning "the coast of Fumba Town, Zanzibar"):

```tsx
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/75 lg:text-xl">
            Where the ocean horizon meets the start line. A hybrid road-cycling
            and HYROX-style functional fitness festival on the coast of
            Zanzibar.
          </p>
```

- [ ] **Step 5: Fix `app/about/page.tsx`**

Replace the `TIMELINE` array's 2025/2026 entries (lines 31-32):

```tsx
  { year: '2025', label: 'Foundations', body: 'Courses mapped along the Zanzibar coastline, timing and medical partners secured, first sponsors on board.' },
  { year: '2026', label: 'Race day', body: 'Inaugural edition — 6 November. 1,500+ athletes across 15 countries.' },
```

Replace the `PageHero` `intro` (line 42):

```tsx
        intro="ZanziFit is a hybrid endurance festival on the coast of Zanzibar — road cycling and HYROX-style functional fitness racing across one unforgettable weekend."
```

Replace the "Fumba peninsula" reference in the story paragraph (line 65, inside the two-paragraph block starting line 59):

```tsx
              <p>
                We took two of the fastest-growing sports in the world — road cycling and HYROX-style functional
                racing — and set them against the turquoise water and closed coastal roads of Zanzibar.
                The result is equal parts competition and celebration.
              </p>
```

- [ ] **Step 6: Fix `app/festival/page.tsx`**

Replace line 20 (`DISCIPLINES[0].blurb`):

```tsx
    blurb:
      'Closed-road coastal racing along the Zanzibar coastline, from a fast community sprint to a punishing elite endurance loop.',
```

Replace line 55 (`PageHero` intro):

```tsx
        intro="6–8 November 2026 in Zanzibar. Race the discipline you love — or take on both — then recover on the same sand you started from."
```

- [ ] **Step 7: Fix `app/faq/page.tsx`**

Replace line 7 (metadata description):

```tsx
  description: 'Travel, visas, accommodation and spectator information for ZanziFit Festival, 6 November 2026, Zanzibar.',
```

Replace line 14 (first FAQ answer):

```tsx
      'Zanzibar is served by Abeid Amani Karume International Airport (ZNZ), with regular connections via mainland Tanzania and regional hubs. The festival venue is roughly 30–45 minutes from the airport by road — exact transfer options will be published closer to race day.',
```

Replace line 24 (accommodation FAQ answer):

```tsx
      'Zanzibar\'s coast offers accommodation from beach resorts to guesthouses. Recommended accommodation partners and athlete rate codes will be announced ahead of the registration window.',
```

- [ ] **Step 8: Fix `app/gallery/page.tsx`**

Replace line 17 (`PageHero` intro):

```tsx
        intro="Road cycling, HYROX-style competition, and the festival village on the Zanzibar coast — filter by discipline below."
```

- [ ] **Step 9: Fix `components/disciplines.tsx`**

Replace line 12 (`DISCIPLINES[0].copy`):

```tsx
    copy: 'Coastal road racing on closed circuits along the Zanzibar coastline — from a fast community sprint to a punishing elite endurance loop.',
```

- [ ] **Step 10: Fix `app/partnership/page.tsx`**

Replace line 116:

```tsx
              <p className="flex items-center gap-3"><Chevrons className="text-amber" count={1} /> Zanzibar, Tanzania</p>
```

- [ ] **Step 11: Fix `app/contact/page.tsx`**

Replace line 9 (metadata description):

```tsx
  description: 'Get in touch with ZanziFit Festival — Zanzibar, Tanzania.',
```

Replace line 23 (`SectionHeading` title):

```tsx
            <SectionHeading eyebrow="Get in touch" title="We're based in Zanzibar." align="left" />
```

Replace line 35 (address line):

```tsx
                Zanzibar, Tanzania
```

- [ ] **Step 12: Fix `app/experience/page.tsx` — the larger file, done in full**

Replace line 12 (metadata description):

```tsx
    'What to see, taste and understand on the island that hosts ZanziFit — Stone Town, the coast, the culture and the food, all a short ride from the festival venue.',
```

Replace all `badge` values referencing "from Fumba" (lines 18, 42, 54, 65, 88, 110) — change each to reference "the festival venue" instead. For example, line 18's `badge: '~45 min from Fumba'` becomes:

```tsx
    badge: '~45 min from the festival venue',
```

Apply the same `from Fumba` → `from the festival venue` substitution to lines 42, 54, 65, 88, 110 (their existing numeric values — `~10 min`, `~70–80 min`, `~50 min`, `~40 min`, `~75 min` — stay unchanged, only the place-name wording changes).

Replace line 45 (conservation-area description):

```tsx
      'The conservation area right on the festival venue\'s doorstep — dolphin encounters, snorkeling and sandbank boat trips.',
```

Replace line 47:

```tsx
      'Boat trips typically depart from nearby jetties close to the festival venue',
```

Replace line 83:

```tsx
      'Best combined with a full-day excursion given the distance from the festival venue',
```

Replace line 170 (`TRAVEL_INFO` array entry):

```tsx
  'The festival venue is roughly 30–45 minutes by road from the airport and Stone Town',
```

Replace line 182 (`PageHero` intro):

```tsx
        intro="ZanziFit is based on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."
```

Replace lines 190-197 (the "About Zanzibar" paragraph):

```tsx
            <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
              Zanzibar is an archipelago off the coast of mainland Tanzania, its culture
              layered by Swahili, Arab, Persian, Indian and European influence over
              hundreds of years of Indian Ocean trade. ZanziFit races on a quiet stretch
              of the west coast on Menai Bay — close enough to Stone
              Town for an afternoon of sightseeing, far enough to still feel like your
              own stretch of coastline.
            </p>
```

- [ ] **Step 13: Fix `app/accommodation/page.tsx` — the largest file, done in full**

Replace line 10 (metadata description):

```tsx
    'Where to stay for ZanziFit Festival — hotels, resorts, boutique stays and budget options around Zanzibar. We help you book.',
```

Replace all `badge: '~XX min from Fumba'` values (lines 17, 40, 51, 77, 88, 99, 110, 124, 136, 147, 158, 172, 183, 194, 205) with `badge: '~XX min from the festival venue'` — same numeric substitution pattern as Task 8, Step 12. Example, line 17:

```tsx
    badge: '~75 min from the festival venue',
```

For the two entries whose `area` field is literally `'Fumba'` (lines 28 and 64 — "Green Turaco" and "Fumba Beach Lodge"), per the spec's carve-out: the hotel name "Fumba Beach Lodge" itself stays unchanged (it's a real property's real name), but the `area` field and any prose describing "in Fumba" are reworded. Replace lines 27-35 ("Green Turaco" entry):

```tsx
  {
    title: 'Green Turaco',
    area: 'Near the festival venue',
    badge: '~5 min from the festival venue',
    image: '/images/festival-village.png',
    summary: 'A simple, business-friendly hotel close to the festival venue — the shortest possible commute to the start line.',
    details: [
      'Walkable or a short ride to the festival village',
      'Straightforward rooms, good for a no-frills race-weekend base',
    ],
  },
```

Replace lines 63-73 ("Fumba Beach Lodge" entry — note the hotel's `title` is intentionally left unchanged):

```tsx
  {
    title: 'Fumba Beach Lodge',
    area: 'Near the festival venue',
    badge: '~5 min from the festival venue',
    image: '/images/zanzibar-coast.png',
    summary: 'A secluded beach lodge inside the Menai Bay Conservation Area — the closest resort stay to the festival village.',
    details: [
      'Cottage and suite rooms with private terraces and ocean views',
      'On-site dive centre for reef trips and sandbank excursions',
      'Best paired with an early race-morning start given the short transfer',
    ],
  },
```

- [ ] **Step 14: Confirm the sweep is complete**

```bash
grep -rn "Fumba" app components
```

Expected: no output (excluding anything under `docs/`, which this command already doesn't search since it's scoped to `app components`).

- [ ] **Step 15: Manual verification**

Run `pnpm dev`. Visit `/`, `/about`, `/festival`, `/faq`, `/gallery`, `/experience`, `/accommodation`, `/partnership`, `/contact`. Read through each page's copy and confirm it reads naturally with "Zanzibar" / "the festival venue" in place of "Fumba" / "Fumba Town" — pay particular attention to the Accommodation page's travel-time badges (should read e.g. "~5 min from the festival venue") and the two reworded property entries.

- [ ] **Step 16: Commit**

```bash
git add app/layout.tsx components/site-footer.tsx components/hero.tsx app/about/page.tsx app/festival/page.tsx app/faq/page.tsx app/gallery/page.tsx app/experience/page.tsx app/accommodation/page.tsx app/partnership/page.tsx app/contact/page.tsx components/disciplines.tsx
git commit -m "Replace all Fumba/Fumba Town references with Zanzibar per client correction"
```

---

### Task 9: Add mailto fallback to Contact and Register forms

**Files:**
- Modify: `components/contact-form.tsx:37-58`
- Modify: `components/register-form.tsx` (`handleSubmit`, from Task 2's version)

**Interfaces:**
- Consumes: no new imports — uses `window.location.href` / an anchor click, same mechanism conceptually as `components/enquiry-link.tsx:21-22`'s `wa.me` link construction (URL + `encodeURIComponent`).
- Produces: no signature changes — internal `handleSubmit` behavior only.

- [ ] **Step 1: Add the mailto trigger to `ContactForm`**

In `components/contact-form.tsx`, replace `handleSubmit` (lines 37-52):

```tsx
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      email: validate('email', values.email),
      message: validate('message', values.message),
    }
    setErrors(nextErrors)
    setTouched({ name: true, email: true, message: true })
    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    const subject = `Website enquiry from ${values.name}`
    const body = `${values.message}\n\n— ${values.name} (${values.email})`
    window.location.href = `mailto:info@zanzifit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
```

- [ ] **Step 2: Add the mailto trigger to `RegisterForm`**

In `components/register-form.tsx`, extend `handleSubmit` from Task 2's version:

```tsx
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      email: validate('email', values.email),
      phone: validate('phone', values.phone),
    }
    setErrors(nextErrors)
    setTouched({ name: true, email: true, phone: true })
    const firstInvalid = (Object.keys(nextErrors) as ('name' | 'email' | 'phone')[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus()
      return
    }
    const subject = `Registration interest — ${values.category}`
    const body = `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nCategory: ${values.category}`
    window.location.href = `mailto:info@zanzifit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
```

- [ ] **Step 3: Manual verification**

Run `pnpm dev`.
1. Visit `/contact`, fill in valid Name/Email/Message, submit. Confirm the system's default mail client opens (or a "choose an app" prompt, depending on OS/browser config) addressed to `info@zanzifit.com` with the subject and body pre-filled from the form. Confirm the on-page "Message sent" confirmation still appears regardless.
2. Visit `/register`, fill in valid Name/Email/Phone, pick a category, submit. Confirm the same mailto behavior with a registration-specific subject/body, and the "You're on the list" confirmation still appears.
3. Confirm submitting with invalid fields does NOT trigger the mailto (validation still blocks first, as before).

- [ ] **Step 4: Commit**

```bash
git add components/contact-form.tsx components/register-form.tsx
git commit -m "Open a pre-filled mailto link to info@zanzifit.com on Contact and Register form submit"
```

---

### Task 10: De-templating pass — vary card and section treatments

**Files:**
- Modify: `app/about/page.tsx` (values cards, timeline section)
- Modify: `app/festival/page.tsx` (schedule cards)
- Modify: `app/accommodation/page.tsx` (booking-steps cards)

**Interfaces:**
- No prop/type changes — visual/layout changes only, within existing components (`SectionHeading`, plain `<div>`/`<article>` markup).

**Context:** Per the approved spec (Part B), the goal is to break the repeated `rounded-lg border border-border` card pattern used identically for unrelated content types (values, timeline steps, schedule days, booking steps), so the site stops reading as one template stamped out per section. This task touches three representative spots; it intentionally does not touch the Accommodation/Experience `ExpandableCard` listings (those stay boxed — genuinely list-like comparable items, per the spec) or the Leadership cards (already done in Task 5).

- [ ] **Step 1: Give About's "values" section a lighter, numbered-list treatment instead of three identical boxes**

In `app/about/page.tsx`, replace the values section (currently lines 73-86):

```tsx
      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="What we stand for" title="The principles behind ZanziFit." />
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} className="border-t-2 border-amber pt-6">
                <span className="font-utility text-sm font-semibold text-amber">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-surface-dark-foreground">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
```

This drops the `rounded-lg border border-border bg-background p-8` box (previously identical to the leadership cards, schedule cards, and booking-step cards) in favor of a thin top-rule + numeral treatment — same content, visually distinct object.

- [ ] **Step 2: Break the About page's spacing rhythm — tighten the timeline section**

The timeline section (currently lines 88-101) already has a distinct visual shape (connected grid with hairline dividers) — leave its internal structure, but vary its vertical rhythm so not every section on the page is `py-20 md:py-28`. Replace the opening `<section>` tag on line 88:

```tsx
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
```

- [ ] **Step 3: Give Festival's schedule cards a distinct treatment (numbered day markers, no uniform box)**

In `app/festival/page.tsx`, replace the schedule grid (currently lines 100-114, inside the `id="schedule"` section):

```tsx
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {SCHEDULE.map((s, i) => (
              <div key={s.day} className={i > 0 ? 'md:border-l md:border-border md:pl-6' : ''}>
                <div className="font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber">{s.day}</div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-surface-dark-foreground">{s.title}</h3>
                <ul className="mt-5 space-y-3">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
```

This replaces three identical `rounded-lg border border-border bg-background p-8` boxes with a continuous three-column layout separated by thin vertical rules (like a printed program schedule) — reads as a distinct, purpose-built layout instead of "the same card again."

- [ ] **Step 4: Give Accommodation's booking-steps section a numbered-line treatment**

In `app/accommodation/page.tsx`, replace the booking steps grid (currently lines 267-275):

```tsx
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {BOOKING_STEPS.map((s) => (
            <div key={s.step}>
              <div className="font-utility text-4xl font-semibold text-amber">{s.step}</div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-surface-dark-foreground">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
```

(Drops the `rounded-lg border border-border bg-surface-dark-soft p-8` box in favor of a large numeral treatment — distinct from both the values-section treatment in Step 1 and the schedule treatment in Step 3, so these three "explain N things" sections across the site no longer look identical to each other either.)

- [ ] **Step 5: Manual verification**

Run `pnpm dev`. Visit `/about`, `/festival` (scroll to `#schedule`), `/accommodation` (scroll to booking info at the bottom). Confirm:
1. Each of the three sections (About values, Festival schedule, Accommodation booking steps) now has a visually distinct treatment from the other two, and none of them use the uniform bordered-box card anymore.
2. The Accommodation/Experience `ExpandableCard` listings (hotel/resort cards) are untouched and still show their bordered-box treatment — confirm no regression there.
3. Leadership's photo-forward cards (Task 5) are also still distinct from all of these.
4. Check both light and dark mode for each changed section — confirm text contrast and the amber accent still read correctly (no section relies on the removed `bg-background`/`bg-surface-dark-soft` box fill for contrast in a way that breaks when removed).

- [ ] **Step 6: Commit**

```bash
git add app/about/page.tsx app/festival/page.tsx app/accommodation/page.tsx
git commit -m "De-templating pass: vary card treatments across About, Festival, and Accommodation sections"
```

---

## Final full-site smoke test

After all 10 tasks are complete, do one end-to-end pass:

- [ ] **Step 1: Full build check**

```bash
pnpm build
```

Expected: build completes with no type errors (this repo has `TypeScript build errors` enabled per the git log — confirm this catches any mistakes made across the many small edits in Tasks 8 and 10 especially).

- [ ] **Step 2: Full manual walkthrough**

Run `pnpm dev` and visit every route: `/`, `/about`, `/festival`, `/experience`, `/accommodation`, `/partnership`, `/leadership`, `/gallery`, `/faq`, `/contact`, `/register`. For each:
- Toggle light/dark mode and confirm the header (Task 1) stays legible throughout.
- Confirm no leftover "Fumba" text anywhere (Task 8).
- Confirm the favicon (Task 7) and logo crop (Task 6) look right.

Submit the Contact form and Register form once each (Task 9) to confirm the mailto behavior end-to-end one final time in combination with everything else.

- [ ] **Step 3: Final commit (if any stragglers found)**

If the smoke test finds anything left over, fix it and commit with a message describing exactly what was missed, e.g.:

```bash
git add -A
git commit -m "Fix remaining issues found during final smoke test"
```
