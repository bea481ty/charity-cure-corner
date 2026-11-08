import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, formatNaira, useCart, whatsappLink } from "@/lib/shop";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} – Charity's Cure Corner` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} – Charity's Cure Corner` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Product unavailable – Charity's Cure Corner" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-8 text-center">
      <p>Product not found.</p>
      <Link to="/shop" className="mt-4 inline-block font-semibold text-accent">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="rounded-b-[2rem] bg-primary px-5 pb-6 pt-7 text-primary-foreground">
        <button onClick={() => router.history.back()} className="text-xs text-accent">← Back</button>
        <ProductImage product={p} className="mt-4 max-h-80" eager />
      </header>
      <div className="px-5 pt-5">
        <Link to="/shop" search={{ cat: p.category }} className="text-xs font-semibold text-accent">{p.category}</Link>
        <h1 className="mt-1 text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h1>
        <p className="text-sm text-muted-foreground">{p.note}</p>
        {p.representativeImage && <p className="mt-2 text-xs text-muted-foreground">Similar product photo. Brand, strength or packaging may differ; confirm with Charity.</p>}
        {p.prescriptionRequired && <p className="mt-2 text-sm font-semibold text-destructive">Prescription required</p>}
        <p className="mt-3 text-2xl font-bold text-primary">{formatNaira(p.price)}</p>
        <p className="mt-4 text-sm leading-relaxed">{p.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full bg-card px-2 py-1 shadow-sm">
            <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-full p-2 text-primary"><Minus className="h-4 w-4" /></button>
            <span className="w-6 text-center font-bold">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="rounded-full p-2 text-primary"><Plus className="h-4 w-4" /></button>
          </div>
          <button
            onClick={() => { add(p.id, qty); toast.success(`${qty} × ${p.name} added to cart`); }}
            className="flex-1 rounded-full bg-accent py-3 font-semibold text-accent-foreground"
          >
            Add to cart · {formatNaira(p.price * qty)}
          </button>
        </div>
        <a href={whatsappLink(`Hello, I'd like to ask about ${p.name}.`)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-primary py-3 text-sm font-semibold text-primary">
          <MessageCircle className="h-4 w-4" />Ask Charity on WhatsApp
        </a>
      </div>
    </div>
  );
}
