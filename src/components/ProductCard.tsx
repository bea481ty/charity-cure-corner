import { Link } from "@tanstack/react-router";
import { Pill, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatNaira, useCart, type Product } from "@/lib/shop";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-card p-4 shadow-sm">
      <Link to="/product/$id" params={{ id: p.id }} className="flex min-w-0 flex-1 flex-col [overflow-wrap:anywhere]">
        <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-muted text-primary"><Pill className="h-8 w-8" /></div>
        <p className="text-sm font-bold">{p.name}</p>
        <p className="text-xs text-muted-foreground">{p.note}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-primary">{formatNaira(p.price)}</span>
        <button
          aria-label={`Add ${p.name}`}
          onClick={() => { add(p.id); toast.success(`${p.name} added to cart`); }}
          className="rounded-full bg-accent p-2 text-accent-foreground active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
