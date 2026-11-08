import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Route } from '@/routes/checkout';

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: object) => ({ options }),
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
vi.mock('@/components/BottomNav', () => ({ PageHeader: () => null }));
const clear = vi.fn();
vi.mock('@/lib/shop', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/shop')>(),
  useCart: () => ({ lines: [{ id: 'paracetamol-500', qty: 2 }], total: 1000, clear }),
}));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('does not hand off or clear an order while offline and retains customer details', () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  const open = vi.spyOn(window, 'open').mockImplementation(() => null);
  const Component = Route.options.component;
  if (!Component) throw new Error('Missing checkout page');
  render(<Component />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Full name' }), { target: { value: 'Test Customer' } });
  fireEvent.change(screen.getByRole('textbox', { name: 'Phone number' }), { target: { value: '08012345678' } });
  fireEvent.click(screen.getByRole('button', { name: 'Place order via WhatsApp' }));
  expect(open).not.toHaveBeenCalled();
  expect(clear).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Full name' })).toHaveValue('Test Customer');
  expect(screen.getAllByText('₦1,000')).toHaveLength(2);
});