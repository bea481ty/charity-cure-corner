import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, MessageCircle, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/BottomNav";
import { askHealthQuestion } from "@/lib/ask.functions";
import { PRODUCTS, whatsappLink } from "@/lib/shop";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask a Health Question – Charity's Cure Corner" },
      { name: "description", content: "Describe your health question and get helpful, safe guidance plus matching products from our Agbor chemist." },
      { property: "og:title", content: "Ask a Health Question – Charity's Cure Corner" },
      { property: "og:description", content: "Safe, friendly health guidance from your neighbour chemist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ask,
});

const examples = ["I have a headache and mild fever", "My child has diarrhoea", "What vitamins help my immunity?"];

function Ask() {
  const ask = useServerFn(askHealthQuestion);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (text: string) => {
    if (text.trim().length < 3 || busy) return;
    if (!navigator.onLine) { setError("You're offline. Please connect to the internet and try again."); return; }
    setBusy(true); setError(""); setAnswer("");
    try {
      const r = await ask({ data: { question: text } });
      if (r.error) setError(r.error); else setAnswer(r.answer);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const mentioned = PRODUCTS.filter((p) => answer.toLowerCase().includes(p.name.toLowerCase()));

  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title="Ask a Health Question" />
      <div className="space-y-4 px-5 pt-5">
        <p className="flex gap-2 rounded-xl bg-muted p-3 text-xs text-primary"><ShieldAlert className="h-4 w-4 shrink-0" />General advice only, not a diagnosis. In an emergency, go to the nearest hospital.</p>
        <form onSubmit={(e) => { e.preventDefault(); void submit(q); }} className="space-y-2">
          <textarea aria-label="Your health question" value={q} onChange={(e) => setQ(e.target.value)} maxLength={1000} rows={4} placeholder="Describe how you feel or what you need…" className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none" />
          <button type="submit" disabled={busy || q.trim().length < 3} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Sparkles className="h-4 w-4" />{busy ? "Thinking…" : "Get advice"}</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {examples.map((x) => <button key={x} onClick={() => { setQ(x); void submit(x); }} className="rounded-full border border-primary px-3 py-1 text-xs text-primary">{x}</button>)}
        </div>
        {error && <p role="alert" className="rounded-xl bg-muted p-3 text-sm text-destructive">{error}</p>}
        {answer && (
          <div className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
            <p className="whitespace-pre-line text-sm">{answer.replace(/\*\*/g, "")}</p>
            {mentioned.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mentioned.map((p) => <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">View {p.name}</Link>)}
              </div>
            )}
            <a href={whatsappLink(`Hello Charity, I asked: "${q}"`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-primary py-2 text-sm font-semibold text-primary"><MessageCircle className="h-4 w-4" />Confirm with Charity on WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  );
}
