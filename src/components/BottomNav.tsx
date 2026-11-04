import { Link } from "@tanstack/react-router";
import { Home, MessageCircle, ShoppingBag, HeartPulse, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/shop";

const items = [
  { to: "/", l: "Home", i: Home },
  { to: "/shop", l: "Shop", i: ShoppingBag },
  { to: "/chat", l: "Chat", i: MessageCircle },
  { to: "/tips", l: "Health Tips", i: HeartPulse },
  { to: "/cart", l: "Cart", i: ShoppingCart },
] as const;

export function BottomNav() {
  const { count } = useCart();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md justify-around py-2">
        {items.map(({ to, l, i: I }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary"
            activeProps={{ className: "text-accent" }}
          >
            <I className="h-6 w-6" />
            {l}
            {to === "/cart" && count > 0 && (
              <span className="absolute -top-1 right-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">{count}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="rounded-b-[2rem] bg-primary px-5 pb-5 pt-7 text-primary-foreground">
      <Link to="/" className="text-xs text-accent">← Charity's Cure Corner</Link>
      <h1 className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
    </header>
  );
}
