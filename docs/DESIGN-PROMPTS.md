# Cojaunt design prompts

Copy-paste prompts for every visual asset in the app: the logo, the app icon, all 47 interface icons, the 6 trip cover illustrations and the profile placeholders.

Everything here is matched to what the app actually uses today (colours from `app/globals.css`, fonts from `app/layout.tsx`, icon list from `components/icon.tsx`).

---

## 1. Read this first

### Which tool for which job

| Job | Best kind of tool | Why |
|---|---|---|
| Logo symbol, interface icons | A vector generator that exports **SVG** (for example Recraft, or Illustrator's text-to-vector) | Logos and icons must be vector. A PNG logo goes blurry and cannot be recoloured for dark mode. |
| Wordmark (the word "Cojaunt") | **Do not generate it.** Type it yourself in the font **Fraunces** (free on Google Fonts) | Image generators misspell words and invent letter shapes. The app already uses Fraunces for headings. |
| Trip covers, social images | Any image generator (Midjourney, DALL-E / ChatGPT, Ideogram, Firefly) | These are illustrations, so a PNG or JPG is fine. |

### Rules that make the results look good

1. **One idea per prompt.** A prompt that asks for circles and a pin and people and a heart gives a messy logo. Each prompt below has exactly one concept.
2. **Generate at least 8 versions** of each prompt, then pick one. Do not expect the first image to be right.
3. **Refine, do not restart.** When one version is close, use the tool's "vary" or "edit" option with a refine prompt from section 3.6.
4. **Test small.** Shrink the logo to 32 x 32 pixels. If you cannot recognise it, it is too detailed.
5. **Colour codes can appear as text** in some tools. If you see "#1F4D3F" written inside the picture, delete the codes from the prompt and keep only the colour names.

### Brand sheet (the prompts already include this)

| Thing | Value |
|---|---|
| Name | Cojaunt ("co" = together, "jaunt" = a short pleasure trip) |
| Tagline | Plans, not profiles. |
| What it is | Verified people in India meet through small-group trips, travel buddies and optional dating |
| Feeling | Warm, calm, safe, trustworthy, grown-up. Not flashy, not childish, not a "hookup app". |
| Forest green (main) | `#1F4D3F` |
| Marigold (accent) | `#EDA02F` |
| Cream (background) | `#FAF6EF` |
| Ink (text) | `#17241F` |
| Spark red (dating only) | `#C9412D` |
| Dark-mode green | `#6CC39F` on background `#0F1613` |
| Heading font | Fraunces (soft serif) |
| Body font | Plus Jakarta Sans |

### Sizes and ratios

| Asset | Ratio | Generate at | Used for |
|---|---|---|---|
| Logo symbol | **1:1** | 1024 x 1024 or SVG | Header mark, favicon, app icon |
| Horizontal logo (symbol + name) | **4:1** | 2000 x 500 or SVG | Website header, emails, invoices |
| Stacked logo (symbol above name) | **1:1** | 1024 x 1024 or SVG | Splash screen, print, stickers |
| App icon | **1:1** | 1024 x 1024 | Phone home screen, app stores |
| Interface icon | **1:1** | SVG, 24 x 24 grid | Every button and label in the app |
| Trip cover | **5:3** (use 3:2 if 5:3 is not offered) | 2000 x 1200 | Plan cards and plan pages |
| Profile placeholder | **4:5** | 1200 x 1500 | People cards and profile gallery |
| Link preview image | **1.91:1** | 1200 x 630 | WhatsApp, Instagram, LinkedIn link previews |

---

## 2. Negative prompt (add to every logo and icon prompt)

Tools with a "negative prompt" box: paste this there. In Midjourney, put it after `--no`.

```
text, letters, words, watermark, signature, mockup, business card, paper texture, 3D, bevel, emboss, drop shadow, glow, gradient, photo, realistic, sketch lines, multiple logos, grid of options, border, frame, clutter, thin hairlines
```

---

## 3. Logo

The app now uses a "C" trail mark with a marigold dot (files in `public/brand/`, shown by the `Logo` component in `components/ui.tsx`). The concepts below are for exploring alternatives or refining it. Concept C is the one closest to the current mark.

### 3.1 Concept A: Two travellers, one journey (recommended, closest to the current mark)

Ratio 1:1

```
Minimal flat vector logo symbol, centered on a plain cream background. Two perfect circles of equal size overlap by one third, side by side. The left circle is solid deep forest green (#1F4D3F). The right circle is solid warm marigold orange (#EDA02F). The overlapping almond-shaped area is cream (#FAF6EF), like a shared space between two people. Perfect geometry, crisp edges, generous empty space around the symbol. Timeless, calm, trustworthy brand mark in the style of a professional identity designer. No text.
```

### 3.2 Concept B: Shared map pin

Ratio 1:1

```
Minimal flat vector logo symbol, centered on a plain cream background. A single rounded map location pin. Inside the round head of the pin, two small equal circles overlap slightly, like two people meeting. The pin is solid deep forest green (#1F4D3F), and one of the two inner circles is warm marigold orange (#EDA02F), the other cream. Simple bold shapes, thick even forms, perfectly symmetrical, crisp edges, lots of empty space around it. Friendly and trustworthy travel brand mark. No text.
```

### 3.3 Concept C: The trail

Ratio 1:1

```
Minimal flat vector logo symbol, centered on a plain cream background. One thick continuous line with rounded ends draws a gentle winding path that curls into the letter C. A single solid dot sits at the open end of the path, like a traveller arriving. The line is deep forest green (#1F4D3F) and the dot is warm marigold orange (#EDA02F). Even line thickness throughout, smooth curves, geometric, crisp edges, generous empty space around it. Calm, modern, premium travel brand mark. No text.
```

### 3.4 Concept D: Linked rings

Ratio 1:1

```
Minimal flat vector logo symbol, centered on a plain cream background. Two thick ring outlines of equal size interlock like two links of a chain, side by side. The left ring is deep forest green (#1F4D3F), the right ring is warm marigold orange (#EDA02F). Where they cross, one ring passes cleanly over the other. Even thick stroke, round and soft, perfect geometry, crisp edges, generous empty space around it. A symbol of two people travelling together, trustworthy and simple. No text.
```

### 3.5 Wordmark and lockups (make these yourself, no AI)

1. Open any design tool (Figma or Canva, both free).
2. Type **Cojaunt** with a capital C, in **Fraunces**, weight **SemiBold (600)**, colour forest green `#1F4D3F`, letter spacing about **-2%**.
3. **Horizontal lockup (4:1):** symbol on the left, name on the right. The symbol is as tall as the capital C. The gap between them equals half the symbol's width.
4. **Stacked lockup (1:1):** symbol on top, name centred below. The gap equals one third of the symbol's height.
5. Leave empty space around the whole logo equal to half the symbol's width. Never place anything inside that space.

If you still want an AI draft of the full lockup to compare, use a tool that is good at text and use this prompt. Ratio 4:1.

```
Clean horizontal brand logo on a plain cream background. On the left, a small flat symbol of two overlapping circles, one deep forest green and one marigold orange. On the right, the single word "Cojaunt" in an elegant soft serif typeface, semi-bold, deep forest green, capital C then lowercase letters. Perfectly spelled: C-o-j-a-u-n-t. Balanced spacing, nothing else on the canvas, no tagline. Professional identity design.
```

### 3.6 Refine prompts (use on a version you already like)

```
Keep this exact design. Make the shapes perfectly geometric and symmetrical, make all edges crisp, remove every small detail, and increase the empty space around the symbol.
```

```
Keep this exact design. Change only the colours: deep forest green #1F4D3F, marigold orange #EDA02F, cream background #FAF6EF. Flat solid colours, no gradients or shadows.
```

### 3.7 The versions you need of the final logo

Ask the tool (or a designer) for each of these once the symbol is chosen:

| Version | Description |
|---|---|
| Full colour on cream | The main version |
| Full colour on white | For documents and emails |
| Dark mode | Green becomes `#6CC39F`, marigold stays, background `#0F1613` |
| One colour, forest green | For stamps, embroidery, single-colour print |
| One colour, white | For placing over photos and coloured backgrounds |

Dark-mode prompt, ratio 1:1:

```
The same logo symbol, unchanged in shape, on a very dark green-black background (#0F1613). Replace the forest green with a light mint green (#6CC39F). Keep the marigold orange (#EDA02F). Flat, crisp, no glow, no text.
```

---

## 4. App icon and favicon

### 4.1 App icon

Ratio 1:1, 1024 x 1024. Phones crop the corners themselves, so give them a **full square** with no rounded corners and keep the symbol inside the middle 60% of the square.

```
App icon, full square canvas filled edge to edge with flat cream (#FAF6EF), no rounded corners, no border. In the exact center, occupying the middle 60 percent of the canvas, a flat logo symbol of two overlapping circles of equal size: the left one deep forest green (#1F4D3F), the right one marigold orange (#EDA02F), the overlap area cream. Perfect geometry, crisp edges, no shadow, no gloss, no text.
```

Alternative with a green background (stands out more on a phone home screen):

```
App icon, full square canvas filled edge to edge with flat deep forest green (#1F4D3F), no rounded corners, no border. In the exact center, occupying the middle 60 percent of the canvas, a flat logo symbol of two overlapping circles of equal size: the left one cream (#FAF6EF), the right one marigold orange (#EDA02F), the overlap area forest green. Perfect geometry, crisp edges, no shadow, no gloss, no text.
```

### 4.2 Export sizes from the final icon

| File | Size | Purpose |
|---|---|---|
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | 16 / 32 | Browser tab, one set per theme |
| `apple-icon.png` | 180 x 180 | iPhone home screen |
| `icon-192.png` | 192 x 192 | Android home screen |
| `icon-512.png` | 512 x 512 | Android splash and install prompt |
| `opengraph-image.png` | 1200 x 630 | Link previews (section 7) |

Favicons already exist in `public/favicon/light` and `public/favicon/dark` and are wired up in `app/layout.tsx`. The link preview image is not set up yet.

---

## 5. Interface icons (all 47)

### 5.1 Honest advice before you start

The app's icons are already a matching set: thin outlines, drawn as code in `components/icon.tsx`. Image generators are weak at this job. They draw each icon slightly differently (different line thickness, different corner roundness), and the set stops looking like a family.

Ways to get a professional result, best first:

1. **Keep the current set.** It is already consistent. Replace only the few icons you dislike.
2. **Use a free professional icon library** drawn in the same outline style (for example Lucide or Phosphor). Thousands of matching icons, free for commercial use.
3. **Generate them** with a vector tool that exports SVG, using the prompts below. Generate **a whole group in one image** (section 5.4) so the icons in it match each other.

### 5.2 The exact style of the app's icons

Any new icon must follow this or it will look out of place:

- Square 24 x 24 grid, with about 2.5 units of empty margin on every side
- Outline only, no filled shapes (the heart and star may also be shown filled)
- Line thickness 1.75 units, the same everywhere
- Rounded line ends and rounded corners
- One colour only (the app recolours icons in code)
- Simple enough to read at 16 pixels

### 5.3 Single icon prompt

Replace `[SUBJECT]` with the text from the "What to draw" column in section 5.5. Ratio 1:1.

```
A single user-interface icon of [SUBJECT]. Outline style: one continuous medium-thin line of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Drawn on a 24 by 24 pixel grid with a small even margin on all sides, centered. Colour: one solid deep forest green (#1F4D3F) line on a plain white background. Minimal, geometric, friendly, instantly readable at very small size. Vector icon, flat. Only one icon, no text, no label.
```

### 5.4 Group prompts (recommended: one image per group, icons match each other)

After generating, cut each icon out separately and export it as its own SVG.

**Shared ending** used by every group prompt below (it is already included in each one):

> Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.

**Group 1: Navigation (6 icons).** Ratio 3:2.

```
A consistent set of 6 user-interface icons arranged in a neat grid of 3 columns and 2 rows. In order: (1) a compass with a diamond-shaped needle, (2) an admission ticket with a notch on each side and a dashed tear line, (3) a rounded speech bubble with a small tail at the bottom left, (4) a notification bell, (5) one person as a circle head above rounded shoulders, (6) two people side by side, one in front and one partly behind. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 2: Trust and safety (9 icons).** Ratio 1:1.

```
A consistent set of 9 user-interface icons arranged in a neat grid of 3 columns and 3 rows. In order: (1) a plain shield, (2) the same shield with a check mark inside, (3) a closed padlock, (4) an open eye, (5) an eye crossed out by one diagonal line, (6) an identity card with a small person on the left and two short lines on the right, (7) a warning triangle with an exclamation mark, (8) a flag on a pole, (9) a telephone handset. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 3: Dating and social (4 icons).** Ratio 2:1.

```
A consistent set of 4 user-interface icons arranged in one neat row. In order: (1) a soft rounded heart, (2) a four-pointed sparkle star with curved inward sides, (3) a five-pointed star with slightly rounded tips, (4) a paper plane pointing to the upper right. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 4: Travel and planning (5 icons).** Ratio 5:2.

```
A consistent set of 5 user-interface icons arranged in one neat row. In order: (1) a teardrop map location pin with a small circle inside, (2) a folded paper map with three panels, (3) a wall calendar with two binder rings on top and one horizontal line below them, (4) a round clock face with two hands, (5) a push pin thumbtack pointing down. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 5: Actions (9 icons).** Ratio 1:1.

```
A consistent set of 9 user-interface icons arranged in a neat grid of 3 columns and 3 rows. In order: (1) a plus sign, (2) a minus sign, (3) a check mark tick, (4) a diagonal cross X, (5) a pencil drawn diagonally, (6) a waste bin with a lid and a small handle, (7) an arrow pointing down onto a horizontal line, meaning download, (8) an arrow pointing up out of an open-topped tray, meaning share, (9) a magnifying glass. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 6: Arrows (5 icons).** Ratio 5:2.

```
A consistent set of 5 user-interface icons arranged in one neat row. In order: (1) a chevron pointing left, (2) a chevron pointing right, (3) a chevron pointing up, (4) a chevron pointing down, (5) a long horizontal arrow with a shaft, pointing right. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

**Group 7: Everything else (9 icons).** Ratio 1:1.

```
A consistent set of 9 user-interface icons arranged in a neat grid of 3 columns and 3 rows. In order: (1) a camera with a round lens, (2) a wallet with a small clasp dot, (3) three vertical bars of different heights, like a poll chart, (4) two horizontal slider controls with a small knob on each, (5) a circle with a lowercase letter i shape inside made of a dot and a short line, meaning information, (6) a light bulb, (7) three dots stacked vertically, (8) a sun with eight short rays, (9) a crescent moon. Outline style: medium-thin lines of perfectly even thickness, rounded line ends, rounded corners, no filled areas, no shading. Every icon the same size, the same line thickness and the same visual weight, each centered in its own equal square cell with even spacing. One solid deep forest green (#1F4D3F) on a plain white background. Minimal, geometric, friendly, readable at very small size. Flat vector icon set. No text, no labels, no numbers.
```

### 5.5 Full icon list

The "Name in code" must stay exactly as written, because the app looks icons up by this name.

**Navigation**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 1 | `compass` | Discover tab, travel request | a compass with a diamond-shaped needle |
| 2 | `ticket` | My plans tab | an admission ticket with a notch on each side and a dashed tear line |
| 3 | `chat` | Chats tab, open a chat | a rounded speech bubble with a small tail at the bottom left |
| 4 | `bell` | Requests tab | a notification bell |
| 5 | `user` | You tab, travel buddy | one person: a circle head above rounded shoulders |
| 6 | `people` | Group trip, who is going | two people side by side, one in front and one partly behind |

**Trust and safety**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 7 | `shield` | Safety tools | a plain shield |
| 8 | `shieldCheck` | Verified person, safety centre | a shield with a check mark inside |
| 9 | `lock` | Private, hidden until accepted | a closed padlock |
| 10 | `eye` | Preview, what others can see | an open eye |
| 11 | `eyeOff` | Hidden details | an eye crossed out by one diagonal line |
| 12 | `id` | ID verification | an identity card with a small person on the left and two short lines on the right |
| 13 | `alert` | Warning, error | a warning triangle with an exclamation mark |
| 14 | `flag` | Report a person or a plan | a flag on a pole |
| 15 | `phone` | Emergency call, trusted contact | a telephone handset |

**Dating and social**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 16 | `heart` | Dating, save a plan | a soft rounded heart |
| 17 | `spark` | Send a Spark, "fits you" hint | a four-pointed sparkle star with curved inward sides |
| 18 | `star` | Host rating | a five-pointed star with slightly rounded tips |
| 19 | `send` | Send a message | a paper plane pointing to the upper right |

**Travel and planning**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 20 | `pin` | Location, distance | a teardrop map location pin with a small circle inside |
| 21 | `map` | Trips, overnight trip | a folded paper map with three panels |
| 22 | `calendar` | Dates | a wall calendar with two binder rings on top and one horizontal line |
| 23 | `clock` | Time, waiting | a round clock face with two hands |
| 24 | `pinned` | Pinned message in a chat | a push pin thumbtack pointing down |

**Actions**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 25 | `plus` | Add, host a plan, one more seat | a plus sign |
| 26 | `minus` | One fewer seat | a minus sign |
| 27 | `check` | Done, included, selected | a check mark tick |
| 28 | `x` | Close, remove, not included | a diagonal cross X |
| 29 | `edit` | Edit a listing | a pencil drawn diagonally |
| 30 | `trash` | Delete | a waste bin with a lid and a small handle |
| 31 | `download` | Download my data | an arrow pointing down onto a horizontal line |
| 32 | `share` | Share | an arrow pointing up out of an open-topped tray |
| 33 | `search` | Search | a magnifying glass |

**Arrows**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 34 | `left` | Back, previous | a chevron pointing left |
| 35 | `right` | Open, next | a chevron pointing right |
| 36 | `up` | Move up | a chevron pointing up |
| 37 | `down` | Move down, open a dropdown | a chevron pointing down |
| 38 | `arrow` | Go, continue | a long horizontal arrow with a shaft, pointing right |

**Everything else**

| # | Name in code | What it means in the app | What to draw |
|---|---|---|---|
| 39 | `camera` | Photos, selfie check | a camera with a round lens |
| 40 | `wallet` | Host earnings | a wallet with a small clasp dot |
| 41 | `poll` | Poll in a group chat | three vertical bars of different heights |
| 42 | `sliders` | Filters | two horizontal slider controls with a small knob on each |
| 43 | `info` | Information, prototype notice | a circle with a dot and a short vertical line inside |
| 44 | `bulb` | Tip | a light bulb |
| 45 | `more` | More options menu | three dots stacked vertically |
| 46 | `sun` | Switch to light theme | a sun with eight short rays |
| 47 | `moon` | Switch to dark theme | a crescent moon |

### 5.6 Check every icon before using it

- [ ] It is a real SVG, not a picture saved inside an SVG
- [ ] The canvas is square, `viewBox="0 0 24 24"`
- [ ] Lines only, no fill, and the line colour is `currentColor` (so the app can recolour it)
- [ ] Line thickness is 1.75
- [ ] It sits next to an existing icon and looks like the same family
- [ ] You can still recognise it at 16 pixels

---

## 6. Illustrations

### 6.1 Trip covers (6)

The app has six covers, one per kind of plan (`components/scene.tsx`). They are flat layered landscapes: a soft sky, a pale sun and three layers of land getting darker toward the front. No people, no buildings with detail, no text.

Ratio **5:3**. If your tool does not offer it, use **3:2** and crop a little off the top.

**Shared ending** (already included in each prompt below):

> Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers of land getting darker toward the front, a soft pale sun with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.

| Name in code | Used for |
|---|---|
| `hills` | Weekend getaway, the default for overnight trips |
| `coast` | Coastal trip |
| `peaks` | Day trek |
| `forest` | Nature plans |
| `city` | Cafe or games night, the default for day plans |
| `craft` | Workshop |

**hills**

```
Rolling green hills at golden hour. Warm peach and soft orange sky, a pale cream sun in the upper right. Three layers of gentle rounded hills: light sage green at the back, medium green in the middle, deep forest green in front. Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers of land getting darker toward the front, a soft pale sun with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.
```

**coast**

```
A quiet beach at sunset. Warm apricot to coral sky, a pale cream sun low over the sea just left of center. A terracotta headland on the right at the back, a calm teal sea across the middle, a curve of pale golden sand in front. Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers of land getting darker toward the front, a soft pale sun with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.
```

**peaks**

```
Sharp mountain peaks in the early morning. Pale blue sky fading to soft peach near the horizon, a white sun in the upper left. Three layers of angular jagged mountains: light blue-grey at the back, slate blue in the middle, dark navy-slate in front. Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers of land getting darker toward the front, a soft pale sun with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.
```

**forest**

```
A peaceful forest clearing in soft daylight. Very pale green sky fading to light leaf green, a pale cream sun in the upper right. Three layers of rounded wooded hills: fresh light green at the back, medium green in the middle, deep pine green in front, with three simple triangular pine trees standing on the middle layer. Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers of land getting darker toward the front, a soft pale sun with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.
```

**city**

```
A city skyline at dusk. Deep indigo sky fading to warm rose pink near the horizon, a soft pale peach moon in the upper right. Three layers of simple blocky building silhouettes of different heights with flat roofs: muted purple at the back, darker violet in the middle, a flat near-black indigo ground strip in front. No windows, no signs. Flat vector illustration, minimal layered paper-cut landscape, smooth soft shapes, 3 overlapping layers getting darker toward the front, a soft pale moon with a faint halo, gentle two-colour sky gradient, calm and warm, lots of open sky in the upper half, no people, no animals, no text, no outlines, no texture, no fine detail.
```

**craft**

```
A pottery workshop still life. Warm cream to soft terracotta-peach background, a pale cream sun circle in the upper left. Three simple handmade clay pots of different sizes standing in a row on a wide table: a small one, a tall wide one and a medium one. Sandy clay colour at the back, warm terracotta pots, a dark brown table edge in front. Flat vector illustration, minimal paper-cut style, smooth soft shapes, 3 overlapping layers getting darker toward the front, gentle two-colour background gradient, calm and warm, lots of open space in the upper half, no people, no hands, no text, no outlines, no texture, no fine detail.
```

### 6.2 Profile placeholders

The app ships **no photographs of real people**. Each person is an illustrated silhouette in their own colour (`components/photo.tsx`). Keep it that way: do not use AI-generated faces of realistic people as if they were real members. It misleads users and will hurt trust in a dating and travel app.

Ratio **4:5**.

```
Abstract profile placeholder illustration. A simple faceless head-and-shoulders silhouette, centered in the lower two thirds of the frame, made of one circle for the head and one wide rounded shape for the shoulders, in a deep muted colour. Soft pastel background in a lighter tint of the same colour, with one large pale translucent circle in the upper left corner as decoration. Flat vector, smooth shapes, no face, no features, no hair detail, no text, no outlines, calm and friendly.
```

Make 6 to 8 colour versions by adding one of these to the end: `Colour theme: teal.` / `warm sand.` / `dusty rose.` / `lavender.` / `sage green.` / `sky blue.` / `peach.` / `marigold.`

### 6.3 Empty-state illustrations (optional, not in the app yet)

Small friendly pictures for empty screens. Ratio 1:1. Replace `[SCENE]`.

```
Small spot illustration of [SCENE]. Flat vector, soft rounded shapes, limited palette of deep forest green (#1F4D3F), marigold orange (#EDA02F) and cream (#FAF6EF), with one lighter sage green for depth. Centered, lots of empty cream space around it, no people's faces, no text, no outlines, calm and warm.
```

| Screen | Use this for `[SCENE]` |
|---|---|
| No trips found | an open paper map with a small location pin standing on it |
| No chats yet | two overlapping speech bubbles |
| No requests yet | a small bell resting on a folded letter |
| No plans booked | a single ticket leaning against a small backpack |
| Nobody nearby | a compass on a gentle hill |

---

## 7. Social and link preview image

Shown when someone shares a Cojaunt link. Ratio **1.91:1**, 1200 x 630. Generate the background only, then add the logo and tagline yourself so the text is sharp and correctly spelled.

```
Wide flat vector landscape banner. Rolling layered hills at golden hour, warm peach to soft orange sky, a pale cream sun on the right side. Three layers of gentle hills: light sage green, medium green, deep forest green (#1F4D3F) in front. The left half of the image is calm open sky with nothing in it, leaving empty space for a logo and a headline. Minimal paper-cut style, smooth shapes, no people, no text, no outlines, no texture.
```

Then place on the empty left half:

- The horizontal logo, in cream or white
- The tagline **Plans, not profiles.** in Fraunces SemiBold
- Keep everything at least 60 pixels from every edge

---

## 8. Putting the results into the app

| Asset | Where it goes |
|---|---|
| Logo symbol | `components/ui.tsx` (the `Logo` component) |
| Favicon | `public/favicon/light` and `public/favicon/dark`, linked in `app/layout.tsx` |
| App icons and link preview | New files in `app/` (not set up yet) |
| Interface icons | `components/icon.tsx`, one entry per name in section 5.5 |
| Trip covers | `components/scene.tsx` |
| Profile placeholders | `components/photo.tsx` |

What to hand over when the assets are ready:

1. **Logo:** one SVG of the symbol, and tell me which concept you chose.
2. **Icons:** one SVG per icon, named exactly as in section 5.5 (for example `shieldCheck.svg`).
3. **Covers:** six files named `hills`, `coast`, `peaks`, `forest`, `city`, `craft`.
