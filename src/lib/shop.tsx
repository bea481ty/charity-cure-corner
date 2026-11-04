import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Placeholder WhatsApp number in international format (no +). Replace with the shop's real number.
export const WHATSAPP_NUMBER = "2348000000000";
export const PHONE_NUMBER = "+2348000000000";

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
};

export const CATEGORIES = ["Pain Relief", "Malaria & Fever", "Vitamins", "Baby & Mother", "First Aid"] as const;

export const PRODUCTS: Product[] = [
  { id: "paracetamol-500", name: "Paracetamol 500mg", note: "Pack of 10 tablets", price: 1200, category: "Pain Relief", popular: true, description: "Relieves mild to moderate pain such as headache, toothache and body pain, and reduces fever. Adults: 1–2 tablets every 4–6 hours, max 8 in 24 hours." },
  { id: "malaria-test-kit", name: "Malaria Test Kit", note: "Rapid result, 15 mins", price: 2500, category: "Malaria & Fever", popular: true, description: "Rapid diagnostic test that checks for malaria from a small drop of blood. Results in about 15 minutes. Ask Charity if you need help using it." },
  { id: "ibuprofen-400", name: "Ibuprofen 400mg", note: "Pack of 10 tablets", price: 1500, category: "Pain Relief", description: "Anti-inflammatory pain reliever for muscle pain, period pain and swelling. Take with food." },
  { id: "artemether-lumefantrine", name: "Artemether/Lumefantrine", note: "Adult course, 24 tablets", price: 3500, category: "Malaria & Fever", description: "Full adult treatment course for uncomplicated malaria. Take with food or milk as directed by the pharmacist." },
  { id: "vitamin-c-1000", name: "Vitamin C 1000mg", note: "Tub of 30 tablets", price: 2000, category: "Vitamins", description: "Supports the immune system and general wellbeing. One tablet daily." },
  { id: "multivitamin", name: "Multivitamin Daily", note: "Tub of 30 tablets", price: 3000, category: "Vitamins", description: "A daily blend of essential vitamins and minerals for energy and health." },
  { id: "baby-diapers", name: "Baby Diapers (Size 3)", note: "Pack of 40", price: 6500, category: "Baby & Mother", description: "Soft, absorbent diapers that keep baby dry for up to 12 hours." },
  { id: "ors-sachets", name: "ORS Sachets", note: "Pack of 5", price: 800, category: "Baby & Mother", description: "Oral rehydration salts for replacing fluids lost through diarrhoea or vomiting. Safe for children and adults." },
  { id: "plaster-strips", name: "Plaster Strips", note: "Box of 20", price: 700, category: "First Aid", description: "Assorted sterile plasters for small cuts and grazes." },
  { id: "antiseptic-liquid", name: "Antiseptic Liquid", note: "250ml bottle", price: 1800, category: "First Aid", description: "Cleans cuts, wounds and skin to prevent infection. Dilute before use." },
];

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

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + (PRODUCTS.find((p) => p.id === l.id)?.price ?? 0) * l.qty, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
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
