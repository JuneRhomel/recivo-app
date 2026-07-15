---
name: loading-skeleton
description: >
  Use react-loading-skeleton (already installed in reciv-app) for any
  loading/pending UI state instead of a blank gap or a spinner-only screen.
  Covers sizing skeletons to match real content, avoiding layout shift, and
  the dark-mode CSS variables already wired in globals.css. Trigger whenever
  building or reviewing a component in reciv-app that has async data, a
  pending fetch, a script/widget that loads late, or any "loading"/"pending"
  boolean state.
---

Every pending state in the UI gets a skeleton shaped like the content that
will replace it — never a blank space, never a layout jump when the real
content arrives.

## Pattern

```tsx
import Skeleton from "react-loading-skeleton";

{ready ? <RealContent /> : <Skeleton width={200} height={40} />}
```

- Size the skeleton to match the real element's actual rendered dimensions
  (width/height, or `borderRadius` for rounded elements) — a skeleton that's
  the wrong size causes the exact layout shift it's meant to prevent.
- For repeated rows (lists, cards), use the `count` prop instead of mapping
  manually: `<Skeleton count={5} />`.
- For text, skip explicit sizing and let it flow — `<Skeleton />` alone
  matches a text line's natural height.

## Dark mode

Already wired: `globals.css` sets `--base-color`/`--highlight-color` on
`.react-loading-skeleton` inside the existing `prefers-color-scheme: dark`
media block. Don't pass `baseColor`/`highlightColor` props or add a
`SkeletonTheme` provider — that would create a second, conflicting source of
truth for the same colors.

## When not to use it

Don't wrap something that resolves synchronously on render (no real pending
state) or a one-off toggle with no visible delay — that's skeleton for
skeleton's sake, not a UX fix.
