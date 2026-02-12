# Design Prompt for "The Real You"

---

## PROJECT BRIEF

**App name:** The Real You
**Type:** Progressive Web App (mobile-first, responsive)
**Domain:** Mental health / eating disorder recovery
**Language:** Dutch (primary), English (secondary)
**Tagline:** "Helpt jou op weg richting een gezondere relatie met eten."

**Core purpose:** A food diary app for people recovering from eating disorders. Users log meals, emotions, behaviors, and thoughts. Unlike calorie-tracking apps, this app deliberately avoids calorie counts, nutritional scores, or anything that could trigger disordered eating patterns. It focuses on awareness and self-reflection, not restriction.

**Target users:**

- People with eating disorders (anorexia, bulimia, binge eating)
- Their healthcare providers / therapists
- Age range: 16-45, predominantly female
- Emotionally vulnerable users who may feel shame around food logging

---

## DESIGN PRINCIPLES

1. **Clean & minimal** — Reduce cognitive load. White space is your friend.
2. **Supportive, not clinical** — Warm and human, like talking to a gentle friend. NOT a medical app, NOT a tech product.
3. **Trigger-free** — No numbers, no scores, no progress bars, no red/green judgments on food choices. Never imply "good" or "bad" food.
4. **Modern but soft** — Rounded corners, gentle transitions, organic feel. Think wellness brand, not SaaS dashboard.
5. **Accessible** — WCAG AA compliant, high contrast text, clear touch targets (min 44px).

---

## COLOR PALETTE (Hex Primitives — must use these)

### Brand Colors

| Name      | Hex       | Role                                                    |
| --------- | --------- | ------------------------------------------------------- |
| Sage      | `#93B19A` | Support/secondary, subtle backgrounds, zen/calm feel    |
| Sky Light | `#B5E0F7` | Soft primary accent, gentle highlights, gradient starts |
| Sky       | `#5FA9D1` | Primary brand, interactive elements, buttons, links     |
| Slate     | `#788C90` | Neutral brand tone, borders, muted UI                   |
| Teal      | `#3E6168` | Strong primary, hover states, emphasis                  |
| Navy      | `#091C40` | Deepest ink, headings, dark surfaces                    |

### Accent Colors

| Name        | Hex       | Role                             |
| ----------- | --------- | -------------------------------- |
| Lime        | `#9FDF1E` | Success (gentle, not judgmental) |
| Lime Dark   | `#79B00B` | Strong success                   |
| Sand        | `#C8AB90` | Warm accent, earthy warmth       |
| Amber Light | `#FFD193` | Soft warning, warm highlight     |
| Amber       | `#FEA228` | Warning states                   |
| Red Soft    | `#FF6E6E` | Error (soft)                     |
| Red         | `#FF4B4B` | Error (strong)                   |

### Neutral Scale

| Name        | Hex               |
| ----------- | ----------------- |
| White       | `#FFFFFF`         |
| Neutral 50  | `#FAFAFA`         |
| Neutral 100 | `#F5F5F5`         |
| Neutral 200 | `#E5E5E5`         |
| Neutral 300 | `#D4D4D4`         |
| Neutral 500 | `#737373`         |
| Neutral 700 | `#404040`         |
| Neutral 900 | `rgba(0,0,0,0.7)` |
| Black       | `#000000`         |

### Gradients to consider

- Soft: `#B5E0F7` → `#5FA9D1`
- Zen: `#93B19A` → `#3E6168`

---

## TYPOGRAPHY DIRECTION

Propose 3 font pairings using the above color palette. The app needs three font roles:

1. **Body** (sans-serif) — All UI text, form labels, chat messages. Must be highly legible at small sizes.
2. **Display** (sans-serif or soft serif) — Headings, hero text. Should feel warm and confident, not corporate.
3. **Script/accent** (cursive or handwritten) — Used sparingly for the brand wordmark and quotes. Should feel personal and authentic, not decorative.

The overall typographic feel should be: approachable, warm, modern, and easy to read for users who may be in emotional distress. Avoid anything that feels techy, cold, or overly playful.

---

## SCREENS TO DESIGN

### Screen 1: Landing Page (mobile + desktop)

A public marketing page that introduces the app. Sections (top to bottom):

1. **Navigation** — Logo/wordmark "The Real You" (script font), nav links: Meer info, Aan de slag, Feedback, Inloggen
2. **Hero section** — Large, emotionally resonant. Heading: "Helpt jou op weg richting een gezondere relatie met eten." + supporting text. Design the visual treatment freely — it could be illustration, photography, abstract shapes, gradients, or a combination. The mood should be calm, safe, and inviting.
3. **Primary CTA** — "Je kunt direct beginnen" (You can start right away) + description about it being a web app + action button
4. **USP section** — 3 value propositions:
   - Eenvoudig (Simple) — Minimal fields, clear structure
   - Toegankelijk (Accessible) — Works on any device
   - Veilig (Safe) — Privacy-first
5. **Feedback CTA** — "Onze focus" — The app is actively developed in collaboration with users and therapists. Button: "Geef jouw feedback"
6. **Features section** — 6 features:
   - (Eet)momenten — Log moments, not just meals
   - Zonder triggers — No calorie counting, no judgment
   - Gevoelens — Emoji-based emotion logging
   - Gedragingen — Track behaviors gently
   - Export — PDF export to share with therapist
   - Bewaarde momenten — Bookmark moments for later discussion
7. **Footer** — Personal creator story, inspirational quote, brand mark, copyright

Feel free to propose visual treatments, illustration styles, imagery direction, and layout approaches.

---

### Screen 2: Entry Form as Conversational Coach (mobile + desktop)

**Concept:** The entry form is disguised as a gentle chat conversation with a supportive coach character. The coach asks questions one at a time, the user responds using form inputs embedded in the chat. There is always a visible "opt-out" to switch to traditional form input ("Liever zelf invullen?" / "Prefer to fill it in yourself?").

**Coach character:**

- Small, friendly avatar (abstract or illustrated, not a real person, not explicitly gendered)
- Warm, supportive tone. Never clinical.

**Conversation flow (each step appears after the previous is answered):**

1. **Coach:** "Hoi! Laten we even bijhouden hoe je moment was. Wat heb je gegeten of gedronken?"
   → Free text input for food eaten

2. **Coach:** "Op welk moment was dit?"
   → Date + time picker, pre-filled with now

3. **Coach:** "Waar was je?"
   → Chip/pill selector: Thuis, Werk, Restaurant, Bij vrienden, Onderweg, Familiefeest

4. **Coach:** "Was je alleen of met anderen?"
   → Chip/pill selector: Alleen, Partner, Familie, Vrienden, Collega's, Kinderen

5. **Coach:** "Hoe voelde je je?"
   → Emotion picker (emoji/icon grid, multi-select)

6. **Coach:** "Is er iets wat je wilt opschrijven over dit moment?"
   → Optional expandable textarea

7. **Coach:** "Was er iets bijzonders aan dit moment?"
   → Optional multi-select chips for behaviors: Maaltijd overgeslagen, Eetbui, Te weinig gegeten, Overgegeven. These must be presented VERY gently — neutral colors, no alarm styling. The coach should reassure: "Dit hoef je niet in te vullen."

8. **Coach:** "Wil je dit moment bewaren om later te bespreken?"
   → Simple toggle

9. **Coach:** "Goed gedaan! Je moment is opgeslagen."
   → Gentle success state (no confetti, no celebration — just calm confirmation)

**Key UX requirements:**

- Chat scrolls naturally, new messages fade/slide in
- User can scroll back to edit previous answers
- "Liever zelf invullen?" always visible — collapses chat into a traditional stacked form
- Optional fields have a "Skip" option
- Coach messages have a brief typing indicator (3 dots) before appearing
- Behavior question (#7) should feel especially safe and optional
- Large touch targets, generous input padding, clear focus states
- On mobile, active input stays above keyboard

**Visual treatment:**

- Coach bubbles: left-aligned, subtle background
- User answer bubbles: right-aligned, soft brand-colored background
- Active input area: clean card, pinned to bottom on mobile
- Background: clean, light
- Progress: subtle and non-numerical (thin line or dots — no percentages)

**Traditional form fallback (opt-out view):**

- All fields visible at once, clean card layout
- Same fields, same order, standard form UI
- Coach questions repurposed as section labels
- Related fields grouped (When: date+time, Where: location+company, How: emotions+behaviors)

---

## WHAT TO AVOID

- No calorie counts, macros, or nutritional information
- No red/green food judgments
- No weight or body measurements
- No gamification (streaks, badges, scores, leaderboards)
- No aggressive celebration
- No clinical/medical aesthetic
- No stock photos of "perfect" food or bodies
- No dark patterns or guilt-inducing copy
- No tech-heavy UI (dashboards, data tables, complex charts)
- No dark mode (light only for now)

---

## DELIVERABLES

1. Mobile (375px) and desktop (1440px) for both screens
2. Font pairing recommendation with rationale
3. Component sheet: buttons, inputs, chips, cards, coach bubble, user bubble, emotion picker, navigation states
4. Art direction proposal: illustration style, imagery mood, visual motifs
