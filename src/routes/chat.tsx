import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/BottomNav";
import { whatsappLink } from "@/lib/shop";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with Charity – Charity's Cure Corner" },
      { name: "description", content: "Ask Charity, your neighbour chemist in Agbor, about medicines and orders." },
      { property: "og:title", content: "Chat with Charity – Charity's Cure Corner" },
      { property: "og:description", content: "Ask your neighbour chemist a question." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Chat,
});

type Msg = { from: "me" | "shop"; text: string };
const quick = ["Do you have this drug in stock?", "Do you deliver?", "What are your opening hours?", "Where are you located?"];

function autoReply(t: string) {
  const s = t.toLowerCase();
  if (s.includes("hour") || s.includes("open")) return "We're open every day from 8am to 8pm.";
  if (s.includes("where") || s.includes("locat") || s.includes("address")) return "No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State.";
  if (s.includes("deliver")) return "Yes, we deliver within Agbor. Choose Delivery at checkout.";
  return "Thanks! Tap 'Send to Charity on WhatsApp' below so she can reply to you personally.";
}

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "shop", text: "Hello 👋 I'm Charity. How can I help you today?" }]);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "shop", text: autoReply(t) }]);
    setText("");
  };
  const lastMine = [...msgs].reverse().find((m) => m.from === "me")?.text ?? "Hello Charity";

  return (
    <div className="mx-auto max-w-md pb-44">
      <PageHeader title="Chat with Charity" />
      <div className="space-y-2 px-5 pt-5">
        <Link to="/ask" className="mb-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground"><Sparkles className="h-4 w-4" />Ask a health question (instant advice)</Link>
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.from === "me" ? "ml-auto bg-primary text-primary-foreground" : "bg-card shadow-sm"}`}>{m.text}</div>
        ))}
        <div ref={end} />
        <div className="flex flex-wrap gap-2 pt-2">
          {quick.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-primary px-3 py-1 text-xs text-primary">{q}</button>)}
        </div>
        <a href={whatsappLink(lastMine)} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-accent-foreground"><MessageCircle className="h-4 w-4" />Send to Charity on WhatsApp</a>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="fixed inset-x-0 bottom-[72px] z-30 mx-auto flex max-w-md gap-2 bg-background px-5 py-2">
        <input aria-label="Message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none" />
        <button type="submit" aria-label="Send" className="rounded-full bg-primary p-2.5 text-primary-foreground"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
