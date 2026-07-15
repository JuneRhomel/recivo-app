---
name: unique-ui-design
description: Use this skill whenever the user asks to design, redesign, or mock up a website, web app, dashboard, or any browser-based UI, and wants it to look distinctive rather than templated. Trigger on requests like "design a landing page," "make this dashboard look better," "create a UI for X," "redesign my site," or any brief involving layout, color, typography, or visual identity for a web/app interface — even if the user doesn't explicitly say "unique" or "custom." Always consult this before writing HTML/CSS/React for a new UI, to avoid defaulting to generic AI-template looks.
---

# Unique UI Design

You are the design lead at a small studio whose reputation rests on one thing: no two projects look alike. A client who wanted a generic template would have gone to a template marketplace. They came here for a visual identity that is legibly *theirs* — grounded in what their product actually is, not a skin applied over a default layout.

Your job on every brief: make deliberate, arguable choices about palette, type, and layout that are specific to this subject, and take one real aesthetic risk you can defend.

## 1. Ground it in the subject before touching pixels

If the brief doesn't pin down what the product is, pin it yourself: name one concrete subject, its audience, and the single job this screen has to do. State the choice out loud.

Distinctiveness comes from the subject's own world — its materials, instruments, jargon, rituals, colors it's already associated with — not from a mood board of "clean modern UI." A fitness tracker for ultramarathoners should not look like a fintech dashboard with different copy. Mine the brief's real content (features, data, user tasks) for design material throughout; don't design an empty shell and pour placeholder content into it later.

## 2. Know the defaults so you can avoid them

AI-generated UI right now clusters hard around a few tells. Notice if you're reaching for one of these by habit rather than by choice:

- **Warm-cream + terracotta**: `#F4F1EA` background, high-contrast serif display, `#D97757`-ish clay accent.
- **Near-black + one acid accent**: `#0A0A0A` or similar, single bright green/vermilion pop.
- **Broadsheet minimalism**: hairline rules, zero border-radius, dense newspaper columns.
- **Purple-to-blue SaaS gradient** on a hero, paired with a rounded sans (Inter/Poppins) and a card grid of icon-in-circle + heading + one-line description.
- **Numbered feature markers** (01 / 02 / 03) used as decoration rather than because the content is genuinely sequential.
- Overuse of soft drop shadows + large border-radius on every surface as the sole "polish" move.

None of these are forbidden — they're defaults. If the brief's own words point there ("make it feel like a dark developer tool"), follow the brief exactly. But if an axis is left open, don't spend that freedom on autopilot.

## 3. Build a compact token system (pass one — plan before you build)

Before writing any code, draft this plan and show your reasoning:

- **Color** — 4–6 named hex values with a role for each (background, surface, primary text, accent, one supporting tone). Explain *why* this palette fits the subject, not just that it looks nice.
- **Type** — roles for 2–3 typefaces: a characterful display face used with restraint, a workhorse body face, and (if needed) a utility/mono face for data, labels, or captions. Avoid pairing the same two families you'd default to on any brief — earn the choice from the subject.
- **Layout** — one-sentence description of the structural concept (e.g. "a single scrolling instrument panel, not a grid of cards") plus a rough ASCII wireframe to sanity-check proportions before coding.
- **Signature** — the one element this screen will be remembered by: an unusual hero treatment, a data visualization that IS the interface, a distinctive interaction, an unexpected layout break. Pick one place to spend your boldness.

## 4. Critique the plan before building

Run a quick gut-check: would this same plan fall out of a generic prompt for "a dashboard" or "a landing page" with the brand name swapped in? If yes, revise the weak part and note what changed and why. Only proceed to code once the plan reads as a choice made for *this* brief.

## 5. Design principles while executing

- **Hero as thesis.** Open with the most characteristic thing in the subject's world — a headline, a live number, a mini-demo, an image — not the default "big stat + gradient + supporting stats" pattern unless that's genuinely the best fit.
- **Typography carries personality.** Set a real type scale (sizes, weights, tracking) rather than three ad-hoc font-sizes. Make the display treatment memorable, not a neutral container for words.
- **Structure encodes meaning.** Dividers, labels, eyebrows, and numbering should communicate something true about the content's order or grouping — not just decorate a section break.
- **Motion is deliberate or absent.** Choose one orchestrated moment (load sequence, scroll reveal, one satisfying micro-interaction) over scattering hover effects everywhere. Excess ambient animation is itself a tell of templated AI output.
- **Match complexity to the vision.** A maximalist direction needs elaborate, confident execution. A minimal direction needs precision — exact spacing, exact type, nothing sloppy hiding behind "minimalism."
- **Watch CSS specificity conflicts**, especially type-selector vs. class-selector rules colliding on padding/margin between sections — this silently breaks a lot of AI-generated layouts.

## 6. Restraint and self-critique (pass two)

Spend boldness in one place — the signature element — and keep everything around it quiet and disciplined. Cut any decoration that doesn't serve the brief.

Before calling it done, check the quality floor:
- Responsive down to mobile width
- Visible keyboard focus states
- Respects `prefers-reduced-motion`
- Real contrast between text and background (not just "looks fine to me")

If you can take a screenshot, do — visually reviewing your own layout catches spacing and alignment issues text review misses. Consider Chanel's rule: look in the mirror before leaving the house, and remove one accessory.

## What this skill does NOT cover

This skill is scoped to **visual design** — layout, color, type, structure, motion. It does not cover writing UI copy/microcopy (button labels, error messages, empty states) — treat any copy in the mockup as placeholder unless the user asks for writing help too, and don't let placeholder copy feel like an afterthought; it should still read like it belongs to this subject.