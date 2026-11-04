import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, Clock, Pill, Thermometer, Sparkles, Baby, Cross, MessageCircle, ShoppingBag, HeartPulse, Plus } from "lucide-react";
import charity from "@/assets/charity.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Charity's Cure Corner – Your Neighbour Chemist, Agbor" },
      { name: "description", content: "Medicines, wellness and baby care from Charity's Cure Corner, Uromi Junction, Agbor, Delta State. Open 8am–8pm." },
      { property: "og:title", content: "Charity's Cure Corner – Your Neighbour Chemist" },
      { property: "og:description", content: "Your friendly local chemist in Agbor, Delta State. Open 8am–8pm." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "Pain Relief", icon: Pill },
  { name: "Malaria & Fever", icon: Thermometer },
  { name: "Vitamins", icon: Sparkles },
  { name: "Baby & Mother", icon: Baby },
  { name: "First Aid", icon: Cross },
];

const popular = [
  { name: "Paracetamol 500mg", note: "Pack of 10 tablets", price: "₦1,200" },
  { name: "Malaria Test Kit", note: "Rapid result, 15 mins", price: "₦2,500" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-28">
        <header className="rounded-b-[2rem] bg-primary px-5 pb-6 pt-8 text-primary-foreground">
          <div className="flex items-center gap-4">
            <img src={charity} alt="Charity, owner and chemist" className="h-20 w-20 rounded-full border-4 border-accent object-cover" />
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Charity's Cure Corner
              </h1>
              <p className="text-sm text-accent">Your Neighbour Chemist</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-xs opacity-90">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State, Nigeria</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4" /><span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">Open now</span> 8am – 8pm</p>
          </div>
        </header>

        <section className="px-5 pt-6">
          <p className="text-muted-foreground">Good Morning 👋</p>
          <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>How can we help you today?</h2>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input placeholder="Search medicines, wellness, baby care" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </label>
        </section>

        <section className="pt-7">
          <h3 className="px-5 text-lg font-bold text-primary">Shop by Category</h3>
          <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
            {categories.map(({ name, icon: Icon }) => (
              <button key={name} className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary"><Icon className="h-6 w-6" /></span>
                <span className="text-xs font-semibold leading-tight">{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-6">
          <h3 className="text-lg font-bold text-primary">Popular Near You</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {popular.map((p) => (
              <div key={p.name} className="flex flex-col rounded-2xl bg-card p-4 shadow-sm">
                <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-muted text-primary"><Pill className="h-8 w-8" /></div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.note}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">{p.price}</span>
                  <button aria-label={`Add ${p.name}`} className="rounded-full bg-accent p-1.5 text-accent-foreground"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-card">
        <div className="mx-auto flex max-w-md justify-around py-3">
          {[{ l: "Chat", i: MessageCircle }, { l: "Shop", i: ShoppingBag, active: true }, { l: "Health Tips", i: HeartPulse }].map(({ l, i: I, active }) => (
            <button key={l} className={`flex flex-col items-center gap-1 text-xs font-semibold ${active ? "text-accent" : "text-primary"}`}>
              <I className="h-6 w-6" />{l}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
