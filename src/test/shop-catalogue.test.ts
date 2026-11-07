import { describe, expect, it } from 'vitest';
import { PHONE_NUMBER, PRODUCTS, validCartLines, whatsappLink } from '@/lib/shop';

describe('Shop contact and supplied catalogue', () => {
  it('sends calls to the number provided by the user', () => {
    expect(PHONE_NUMBER).toBe('+2348153515916');
  });
  it('sends WhatsApp messages to the number provided by the user', () => {
    expect(whatsappLink('Hello Charity')).toBe('https://wa.me/2348153515916?text=Hello%20Charity');
  });
  it('keeps only the two products and prices from the original brief', () => {
    expect(PRODUCTS.map(({ name, price }) => ({ name, price }))).toEqual([
      { name: 'Paracetamol 500mg', price: 1200 },
      { name: 'Malaria Test Kit', price: 2500 },
    ]);
  });
  it('removes invented products from previously saved carts', () => {
    expect(validCartLines([{ id: 'ibuprofen-400', qty: 2 }, { id: 'paracetamol-500', qty: 1 }]))
      .toEqual([{ id: 'paracetamol-500', qty: 1 }]);
  });
});