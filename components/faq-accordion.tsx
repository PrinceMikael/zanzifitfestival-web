import { AccordionItem } from '@/components/accordion-item'
import { Reveal } from '@/components/reveal'

type Faq = { question: string; answer: string }
type Group = { category: string; items: Faq[] }

export function FaqAccordion({ groups }: { groups: Group[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {groups.map((group, i) => (
        <Reveal key={group.category} delay={i * 0.08}>
          <h2 className="eyebrow text-amber">{group.category}</h2>
          <div className="mt-2">
            {group.items.map((item) => (
              <AccordionItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
