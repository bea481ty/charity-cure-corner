import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PRODUCTS, formatNaira, useCart, whatsappLink } from "@/lib/shop";
import { PageHeader } from "@/components/BottomNav";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout – Charity's Cure Corner" },
      { name: "description", content: "Send your order to Charity's Cure Corner for pickup or delivery in Agbor." },
      { property: "og:title", content: "Checkout – Charity's Cure Corner" },
      { property: "og:description", content: "Complete your order with your neighbour chemist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, total } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", method: "Pickup", address: "", note: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="mx-auto max-w-md pb-28">
        <PageHeader title="Order ready" />
        <div className="px-5 pt-10 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <p className="mt-4 font-semibold">Your order is ready. Tap Send in WhatsApp to send it to Charity.</p>
          <p className="mt-2 text-sm text-muted-foreground">Your cart is kept until you empty it. If WhatsApp didn't open, tap below.</p>
          <a href={sent} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground">Open WhatsApp</a>
          <div><Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary underline">Back home</Link></div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md pb-28">
        <PageHeader title="Checkout" />
        <div className="px-5 pt-10 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground">Start shopping</Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      setError("You're offline. Reconnect to send your order. Your cart and details are kept here.");
      return;
    }
    if (!form.name.trim() || !/^\+?\d{10,14}$/.test(form.phone.replace(/\s/g, ""))) {
      setError("Please enter your name and a valid phone number.");
      return;
    }
    if (form.method === "Delivery" && !form.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }
    const items = lines
      .flatMap((l) => { const p = PRODUCTS.find((x) => x.id === l.id); return p ? [`• ${l.qty} × ${p.name} – ${formatNaira(p.price * l.qty)}`] : []; })
      .join("\n");
    const msg = `New order – Charity's Cure Corner\n\n${items}\n\nTotal: ${formatNaira(total)}\n\nName: ${form.name}\nPhone: ${form.phone}\n${form.method}${form.method === "Delivery" ? `: ${form.address}` : ""}${form.note ? `\nNote: ${form.note}` : ""}`;
    const url = whatsappLink(msg);
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const field = "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title="Checkout" />
      <form onSubmit={submit} className="space-y-3 px-5 pt-5">
        <div className="rounded-2xl bg-card p-4 text-sm shadow-sm">
          {lines.map((l) => { const p = PRODUCTS.find((x) => x.id === l.id); return p ? <div key={l.id} className="flex justify-between py-0.5"><span>{l.qty} × {p.name}</span><span>{formatNaira(p.price * l.qty)}</span></div> : null; })}
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span className="text-primary">{formatNaira(total)}</span></div>
        </div>
        <input aria-label="Full name" placeholder="Full name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input aria-label="Phone number" type="tel" placeholder="Phone number e.g. 08012345678" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <div className="flex gap-2">
          {["Pickup", "Delivery"].map((m) => (
            <button type="button" key={m} onClick={() => setForm({ ...form, method: m })} className={`flex-1 rounded-full py-2 text-sm font-semibold ${form.method === m ? "bg-primary text-primary-foreground" : "bg-card text-primary shadow-sm"}`}>{m}</button>
          ))}
        </div>
        {form.method === "Delivery" && (
          <input aria-label="Delivery address" placeholder="Delivery address in Agbor" className={field} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        )}
        <textarea aria-label="Note" placeholder="Note for Charity (optional)" rows={2} className={field} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-accent py-3 font-semibold text-accent-foreground">Place order via WhatsApp</button>
        <p className="text-center text-xs text-muted-foreground">Pay on pickup or delivery. Charity will confirm your order.</p>
      </form>
    </div>
  );
}
