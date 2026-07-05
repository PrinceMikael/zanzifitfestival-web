import { AccordionItem } from '@/components/accordion-item'

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item) => (
        <AccordionItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}
