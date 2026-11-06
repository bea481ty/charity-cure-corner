import { createServerFn } from "@tanstack/react-start";
import { PRODUCTS, formatNaira } from "@/lib/shop";

const catalogue = PRODUCTS.map(
  (p) => `- ${p.name} (${p.note}) – ${formatNaira(p.price)} [${p.category}]: ${p.description}`,
).join("\n");

const INSTRUCTIONS = `You are the friendly assistant for Charity's Cure Corner, "Your Neighbour Chemist", at No. 58, Alibuba Street, Uromi Junction, Agbor, Delta State, Nigeria (open 8am–8pm). The pharmacist is Charity.
Answer the customer's health question in simple, warm English, in under 180 words.
Rules:
- You are not a doctor. Give general guidance only; never diagnose.
- Only suggest products from the shop list below, with their Naira price. If nothing fits, say so.
- Mention key safety points (dosage limits, food, allergies, pregnancy, children).
- If there are danger signs (chest pain, trouble breathing, heavy bleeding, fainting, confusion, seizures, high fever in a baby, symptoms lasting over 3 days, pregnancy concerns), tell them to go to a hospital or see a doctor urgently.
- End by inviting them to confirm with Charity before buying.
Shop products:
${catalogue}`;

export const askHealthQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: { question: string }) => {
    const q = String(input?.question ?? "").trim();
    if (q.length < 3 || q.length > 1000) throw new Error("Please write a question between 3 and 1000 characters.");
    return { question: q };
  })
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: INSTRUCTIONS,
        input: data.question,
        reasoning: { effort: "low" },
      });
      let text = "";
      for (const item of res.output ?? []) {
        if (item.type === "message") {
          for (const c of item.content) if (c.type === "output_text") text += c.text;
        }
      }
      return { answer: text.trim() || "Sorry, I couldn't answer that. Please chat with Charity on WhatsApp.", error: null as string | null };
    } catch (e) {
      console.error("askHealthQuestion failed", e instanceof GatewayError ? e.code : e);
      return { answer: "", error: "The assistant is busy right now. Please try again or chat with Charity on WhatsApp." };
    }
  });
