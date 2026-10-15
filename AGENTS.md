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

## Project rules
- All mail content, labels, folders and UI text live in `src/config/appConfig.ts`; components never hardcode content (so the owner can edit everything in one place).
- User actions persist as localStorage overrides merged over the config, never mutating the config (so config edits still show up).
