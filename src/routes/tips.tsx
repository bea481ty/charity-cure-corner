import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/BottomNav";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Health Tips – Charity's Cure Corner" },
      { name: "description", content: "Simple health tips on malaria, hydration, medicines and baby care from your neighbour chemist." },
      { property: "og:title", content: "Health Tips – Charity's Cure Corner" },
      { property: "og:description", content: "Everyday health advice from Charity's Cure Corner, Agbor." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tips,
});

const tips = [
  { t: "Prevent malaria", b: "Sleep under a treated mosquito net, clear stagnant water around your home, and test before treating any fever." },
  { t: "Stay hydrated", b: "Drink at least 8 glasses of clean water daily, more in hot weather. Use ORS if you have diarrhoea or vomiting." },
  { t: "Take medicines correctly", b: "Always finish your full course of antibiotics or antimalarials, even when you feel better. Never share prescription drugs." },
  { t: "Baby care", b: "Breastfeed exclusively for the first 6 months, keep up with immunisations, and see a health worker if baby has a high fever." },
  { t: "Store medicines safely", b: "Keep medicines in a cool, dry place away from sunlight and out of children's reach. Check expiry dates." },
];

function Tips() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title="Health Tips" />
      <div className="space-y-3 px-5 pt-5">
        {tips.map((x, i) => (
          <div key={x.t} className="rounded-2xl bg-card shadow-sm">
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-primary">
              {x.t}<ChevronDown className={`h-5 w-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm leading-relaxed">{x.b}</p>}
          </div>
        ))}
        <p className="pt-2 text-center text-xs text-muted-foreground">These tips are general advice. Speak to Charity or a doctor about your own health.</p>
      </div>
    </div>
  );
}
