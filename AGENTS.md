<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Loading states

Never render a blank gap while something is pending (script load, fetch, auth restore). Use `react-loading-skeleton` (already installed) sized to match the real content's dimensions, so nothing jumps when the content swaps in. Dark mode is already wired via `--base-color`/`--highlight-color` in `globals.css` — don't hardcode skeleton colors elsewhere. See `components/GoogleSignInButton.tsx` for the reference pattern. Full guidance: the `loading-skeleton` skill.
