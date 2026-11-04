import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Pill } from "lucide-react";
import { PRODUCTS, formatNaira, useCart } from "@/lib/shop";
import { PageHeader } from "@/components/BottomNav";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart – Charity's Cure Corner" },
      { name: "description", content: "Review the medicines in your cart before checkout." },
      { property: "og:title", content: "Your Cart – Charity's Cure Corner" },
      { property: "og:description", content: "Review your order from Charity's Cure Corner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { lines, setQty, remove, total, clear } = useCart();

  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title="Your Cart" />
      <div className="px-5 pt-5">
        {lines.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground">Start shopping</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map((l) => {
                const p = PRODUCTS.find((x) => x.id === l.id);
                if (!p) return null;
                return (
                  <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
                    <Link to="/product/$id" params={{ id: p.id }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Pill className="h-6 w-6" /></Link>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNaira(p.price)} each</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button aria-label={`Decrease ${p.name}`} onClick={() => setQty(p.id, l.qty - 1)} className="rounded-full bg-muted p-1.5"><Minus className="h-3 w-3" /></button>
                        <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                        <button aria-label={`Increase ${p.name}`} onClick={() => setQty(p.id, l.qty + 1)} className="rounded-full bg-muted p-1.5"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-primary">{formatNaira(p.price * l.qty)}</span>
                      <button aria-label={`Remove ${p.name}`} onClick={() => remove(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-center justify-between text-lg font-bold">
              <span>Total</span><span className="text-primary">{formatNaira(total)}</span>
            </div>
            <Link to="/checkout" className="mt-4 block rounded-full bg-accent py-3 text-center font-semibold text-accent-foreground">Proceed to checkout</Link>
            <button onClick={clear} className="mt-3 w-full text-sm text-muted-foreground underline">Empty cart</button>
          </>
        )}
      </div>
    </div>
  );
}
