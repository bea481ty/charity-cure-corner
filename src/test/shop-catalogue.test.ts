import { describe, expect, it } from 'vitest';
import { PHONE_NUMBER, PRODUCTS, validCartLines, whatsappLink } from '@/lib/shop';
import suppliedCatalogue from './supplied-catalogue.json';
import additions from './november-9-catalogue.json';

describe('Shop contact and supplied catalogue', () => {
  it('sends calls to the number provided by the user', () => {
    expect(PHONE_NUMBER).toBe('+2348153515916');
  });
  it('sends WhatsApp messages to the number provided by the user', () => {
    expect(whatsappLink('Hello Charity')).toBe('https://wa.me/2348153515916?text=Hello%20Charity');
  });
  it('preserves all 97 supplied medicines and their November 7 prices', () => {
    expect(PRODUCTS.slice(0, 97).map(({ name, price }) => ({ name, price }))).toEqual(suppliedCatalogue);
  });
  it('keeps all 97 old items and adds exactly 92 unique goods', () => {
    expect(PRODUCTS).toHaveLength(189);
    expect(new Set(PRODUCTS.map(p => p.id)).size).toBe(189);
  });
  for (const item of additions) {
    it(`preserves the supplied price for ${item.name}`, () => {
      expect(PRODUCTS.find(p => p.id === item.id)?.price).toBe(item.price);
    });
    it(`preserves the supplied form and prescription status for ${item.name}`, () => {
      const product = PRODUCTS.find(p => p.id === item.id);
      expect(product?.form).toBe(item.form);
      expect(product?.prescriptionRequired).toBe(item.prescriptionRequired);
    });
  }
  it('removes invented products from previously saved carts', () => {
    expect(validCartLines([{ id: 'removed-product', qty: 2 }, { id: 'paracetamol-500', qty: 1 }]))
      .toEqual([{ id: 'paracetamol-500', qty: 1 }]);
  });
  it('provides a locally served real photograph for every medicine', () => {
    expect(PRODUCTS.filter(p => !p.image.startsWith('/__l5e/assets-v1/'))).toEqual([]);
  });
  it('marks every supplied antibiotic as prescription required', () => {
    expect(PRODUCTS.filter(p => p.category === 'Antibiotics')).toHaveLength(25);
    expect(PRODUCTS.filter(p => p.category === 'Antibiotics' && !p.prescriptionRequired)).toEqual([]);
  });
});