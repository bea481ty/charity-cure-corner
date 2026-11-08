import type { Product } from "@/lib/shop";
import { cn } from "@/lib/utils";

export function ProductImage({ product, className, eager = false }: { product: Product; className?: string; eager?: boolean }) {
  return (
    <div className={cn("product-photo flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl", className)}>
      <img
        src={product.image}
        alt={`${product.name}${product.representativeImage ? " — similar product photo; packaging may differ" : " — product packaging"}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={400}
        height={400}
        className="h-full w-full object-contain p-3"
      />
    </div>
  );
}