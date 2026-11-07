<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- App-shell service workers register only through the hydration-time PWA wrapper, which rejects dev, previews, frames, and the kill switch; unrelated messaging workers must remain untouched.
- Generate offline assets after TanStack's full multi-environment build; normal HTML navigation is NetworkFirst, with query-qualified precached documents used only as offline fallbacks.
- WhatsApp checkout is an external handoff, not a confirmed order; retain the cart and reject sending while offline to prevent lost orders.
- Validate restored cart entries against the active catalogue so removed products cannot remain orderable.
