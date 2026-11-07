import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppInstall } from '@/components/AppInstall';
vi.mock('@/lib/pwa', () => ({ initializeAppWorker: vi.fn(async () => {}) }));
afterEach(cleanup);
describe('Device installation', () => {
  it('hands installation to the browser prompt and handles dismissal', async () => {
    render(<AppInstall />);
    const prompt = vi.fn(async () => {});
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome: 'dismissed' }) });
    act(() => { window.dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Home Screen' }));
    await waitFor(() => expect(prompt).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Add to Home Screen' })).toBeEnabled());
    expect(screen.queryByLabelText('App installed')).not.toBeInTheDocument();
  });
  it('recognizes browser-confirmed installation', () => {
    render(<AppInstall />);
    act(() => { window.dispatchEvent(new Event('appinstalled')); });
    expect(screen.queryByRole('button', { name: 'Add to Home Screen' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('App installed')).toBeInTheDocument();
  });
});