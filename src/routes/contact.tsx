import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/BottomNav";
import { PHONE_NUMBER, whatsappLink } from "@/lib/shop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact – Charity's Cure Corner, Agbor" },
      { name: "description", content: "Visit, call or WhatsApp Charity's Cure Corner at No. 58, Alibuba Street, Uromi Junction, Agbor. Open 8am–8pm." },
      { property: "og:title", content: "Contact Charity's Cure Corner" },
      { property: "og:description", content: "No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State. Open 8am–8pm." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

const ADDRESS = "No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State, Nigeria";

function Contact() {
  return (
    <div className="mx-auto max-w-md pb-28">
      <PageHeader title="Contact Us" />
      <div className="space-y-3 px-5 pt-5">
        <div className="space-y-3 rounded-2xl bg-card p-4 text-sm shadow-sm">
          <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0 text-primary" />{ADDRESS}</p>
          <p className="flex gap-2"><Clock className="h-5 w-5 text-primary" />Open daily, 8am – 8pm</p>
        </div>
        <a href={whatsappLink("Hello Charity's Cure Corner, I have a question.")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-accent-foreground"><MessageCircle className="h-5 w-5" />Chat on WhatsApp</a>
        <a href={`tel:${PHONE_NUMBER}`} className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground"><Phone className="h-5 w-5" />Call the shop</a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-primary py-3 font-semibold text-primary"><MapPin className="h-5 w-5" />Get directions</a>
      </div>
    </div>
  );
}
