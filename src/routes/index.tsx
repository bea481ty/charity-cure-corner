import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Clock, Pill, Thermometer, Sparkles, Baby, Cross, Phone, MessageCircle } from "lucide-react";
import charity from "@/assets/charity.jpg";
import { PRODUCTS, whatsappLink, PHONE_NUMBER } from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";

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

export const categoryIcons = [
  { name: "Pain Relief", icon: Pill },
  { name: "Malaria & Fever", icon: Thermometer },
  { name: "Vitamins", icon: Sparkles },
  { name: "Baby & Mother", icon: Baby },
  { name: "First Aid", icon: Cross },
];

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const open = hour >= 8 && hour < 20;

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="rounded-b-[2rem] bg-primary px-5 pb-6 pt-8 text-primary-foreground">
        <div className="flex items-center gap-4">
          <img src={charity} alt="Charity, owner and chemist" className="h-20 w-20 rounded-full border-4 border-accent object-cover" />
          <div>
            <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>Charity's Cure Corner</h1>
            <p className="text-sm text-accent">Your Neighbour Chemist</p>
          </div>
        </div>
        <div className="mt-4 space-y-1.5 text-xs opacity-90">
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State, Nigeria</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4" /><span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">{open ? "Open now" : "Closed now"}</span> 8am – 8pm</p>
        </div>
        <div className="mt-4 flex gap-2">
          <a href={whatsappLink("Hello Charity's Cure Corner, I have a question.")} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-2 text-sm font-semibold text-accent-foreground"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          <a href={`tel:${PHONE_NUMBER}`} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-accent py-2 text-sm font-semibold text-accent"><Phone className="h-4 w-4" />Call</a>
          <Link to="/contact" className="flex items-center justify-center rounded-full border border-accent px-3 py-2 text-sm font-semibold text-accent">Contact</Link>
        </div>
      </header>

      <section className="px-5 pt-6">
        <p className="text-muted-foreground">{greeting} 👋</p>
        <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>How can we help you today?</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/shop", search: { q: q.trim() || undefined } }); }}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <input aria-label="Search medicines" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicines, wellness, baby care" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button type="submit" className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Go</button>
        </form>
      </section>

      <section className="pt-7">
        <h3 className="px-5 text-lg font-bold text-primary">Shop by Category</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
          {categoryIcons.map(({ name, icon: Icon }) => (
            <Link key={name} to="/shop" search={{ cat: name }} className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary"><Icon className="h-6 w-6" /></span>
              <span className="text-xs font-semibold leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">Popular Near You</h3>
          <Link to="/shop" className="text-sm font-semibold text-accent">See all</Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {PRODUCTS.filter((p) => p.popular).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}
