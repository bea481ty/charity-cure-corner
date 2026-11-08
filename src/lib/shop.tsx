import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SUPPLIED_CATALOGUE } from "@/lib/catalogue";
import { PRODUCT_PHOTOS } from "@/lib/product-photos";

// Current shop contact; all customer-facing links share this number.
export const WHATSAPP_NUMBER = "2348153515916";
export const PHONE_NUMBER = "+2348153515916";

export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export type Product = {
  id: string;
  name: string;
  note: string;
  price: number;
  category: string;
  description: string;
  popular?: boolean;
  form: string;
  prescriptionRequired: boolean;
  image: string;
  representativeImage: boolean;
};

export const CATEGORIES = ["Pain Relief", "Malaria & Fever", "Vitamins", "Baby & Mother", "First Aid", "Antibiotics", "Stomach Care", "Worm Treatment", "Cough & Cold", "Allergy & Other Medicines"] as const;

export const PRODUCTS: Product[] = SUPPLIED_CATALOGUE.map((item) => {
  const photo = PRODUCT_PHOTOS[item.photoKey];
  if (!photo) throw new Error(`Missing product photo: ${item.photoKey}`);
  return {
    ...item,
    image: photo.url,
    representativeImage: photo.representative,
    note: item.form,
    description: `${item.name}. Confirm the available brand, pack size and suitability with Charity. Follow the supplied label and professional advice.${item.prescriptionRequired ? " Prescription required; do not use antibiotics without a valid prescription." : ""}`,
  };
});

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export type CartLine = { id: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ccc-cart";

export function validCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.filter((line): line is CartLine => line !== null && typeof line === 'object'
    && PRODUCTS.some(product => product.id === line.id)
    && Number.isSafeInteger(line.qty) && line.qty > 0);
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + (PRODUCTS.find((p) => p.id === l.id)?.price ?? 0) * l.qty, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(validCartLines(JSON.parse(raw)));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const setQty = (id: string, qty: number) =>
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))));
  const add = (id: string, qty = 1) =>
    setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, qty }]));

  return (
    <Ctx.Provider
      value={{
        lines,
        add,
        setQty,
        remove: (id) => setLines((ls) => ls.filter((l) => l.id !== id)),
        clear: () => setLines([]),
        count: lines.reduce((s, l) => s + l.qty, 0),
        total: cartTotal(lines),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
