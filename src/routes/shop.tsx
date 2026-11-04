import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/BottomNav";

type S = { q?: string | undefined; cat?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    cat: typeof s["cat"] === "string" && s["cat"] ? s["cat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Medicines – Charity's Cure Corner" },
      { name: "description", content: "Browse pain relief, malaria, vitamins, baby care and first aid at Charity's Cure Corner, Agbor." },
      { property: "og:title", content: "Shop Medicines – Charity's Cure Corner" },
      { property: "og:description", content: "Browse medicines and wellness products from your neighbour chemist in Agbor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const term = (q ?? "").toLowerCase();
  const list = PRODUCTS.filter(
    (p) => (!cat || p.category === cat) && (!term || `${p.name} ${p.note} ${p.category} ${p.description}`.toLowerCase().includes(term)),
  );

  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title={cat ?? "All Products"} />
      <div className="px-5 pt-5">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            aria-label="Search medicines"
            type="search"
            value={q ?? ""}
            onChange={(e) => navigate({ search: (s) => ({ ...s, q: e.target.value || undefined }), replace: true })}
            placeholder="Search medicines, wellness, baby care"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {[undefined, ...CATEGORIES].map((c) => (
            <button
              key={c ?? "all"}
              onClick={() => navigate({ search: (s) => ({ ...s, cat: c }) })}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${cat === c ? "bg-primary text-primary-foreground" : "bg-card text-primary shadow-sm"}`}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">No products found{q ? ` for "${q}"` : ""}. Try another word or ask Charity in Chat.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-2">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
