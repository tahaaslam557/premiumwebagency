# LIGHT / DARK MODE — AI LAMP ROPE INTERACTION

## Goal

Add a premium physical lamp-rope theme switcher to the AI-native agency website.

This must NOT look like a normal light/dark toggle.

Core interaction:

**GRAB → PULL / STRETCH → RELEASE → THEME CHANGES → ROPE SNAPS BACK**

The experience should reinforce:

# WE ARE AI.

The website should feel like an intelligent physical interface.

---

## 1. Placement

Place the lamp rope at the **TOP-RIGHT CORNER**, visually attached to the **bottom edge of the header/navigation**.

Desktop:

```text
┌───────────────────────────────────────────────────────────────┐
│ LOGO                  NAVIGATION              START PROJECT   │
└───────────────────────────────────────────────────────────────┘
                                                   │
                                                   │
                                                   │
                                                   ◉
                                                PULL
```

The rope must feel physically attached to the header, not like a floating widget.

---

## 2. Visual Concept

Build:

1. Header mounting point
2. Flexible hanging rope/cable
3. Lamp/pull handle
4. Small ambient glow
5. Optional interaction label

Style:

**architectural pull cord + futuristic interface + luxury product detail**

Avoid cartoon lamps, emoji icons, oversized lightbulbs, generic switches, or cheap neon effects.

---

## 3. Dark Mode

Dark mode should use:

- near-black background
- subtle gray/white rope
- very subtle glowing handle
- understated mounting point
- controlled electric blue/cyan accent

Suggested variables:

```css
:root {
  --background: #050505;
  --foreground: #f5f5f5;
  --surface: #0d0d0d;
  --muted: #8a8a8a;
  --border: rgba(255,255,255,.12);
  --accent: #7dd3fc;
}
```

---

## 4. Light Mode

Do not simply invert colors.

Create a deliberate premium editorial light theme:

```css
[data-theme="light"] {
  --background: #f4f2ed;
  --foreground: #111111;
  --surface: #ffffff;
  --muted: #666666;
  --border: rgba(0,0,0,.12);
  --accent: #2563eb;
}
```

Light mode should feel warm, sophisticated and editorial rather than plain white.

---

## 5. Interaction

### Idle

The rope hangs naturally.

### Hover

When the pointer approaches:

- lamp subtly responds to pointer
- rope develops slight tension
- cursor becomes a grab state
- optionally show:

**PULL TO CHANGE REALITY**

Keep this label tiny and elegant.

### Grab

On pointer down:

- handle attaches to pointer movement
- rope stretches
- mounting point remains fixed
- handle follows primarily vertically
- horizontal movement is limited
- movement has physical inertia

### Pull

As the user drags downward:

- rope length increases
- rope develops a subtle curve
- handle has spring/inertia behavior
- glow increases slightly
- interaction feels physical

---

## 6. Threshold

Use a configurable threshold:

```ts
const PULL_THRESHOLD = 120;
const PULL_THRESHOLD_MOBILE = 90;
```

Suggested states:

```text
0–70px      normal
70–110px    tension
110px+      trigger zone
```

Theme should switch deliberately on release after the threshold is reached.

Do not accidentally switch from tiny movements.

---

## 7. Release

Preferred sequence:

```text
PULL
↓
REACH THRESHOLD
↓
RELEASE
↓
THEME SWITCH
↓
ROPE SNAP
↓
SETTLE
```

Use spring/elastic easing.

The snap should feel like a real pull cord, not a cartoon bounce.

---

## 8. Rope Implementation

Preferred approach: **SVG path + GSAP**.

The rope should not be a rigid CSS line.

Use an SVG path with dynamic control points:

```text
M x1 y1
C x2 y2, x3 y3, x4 y4
```

Update it based on:

- pull distance
- pointer X
- pointer Y
- movement velocity

GSAP can control:

- stretch
- tension
- inertia
- snap
- settling

Avoid a heavy physics engine unless truly necessary.

---

## 9. Theme Transition

The theme transition must be cinematic.

### Dark → Light

1. Pull rope
2. Handle reaches trigger
3. Lamp briefly intensifies
4. Soft warm/white illumination expands from the lamp
5. Website colors transition
6. Cards/surfaces transition
7. Typography transitions
8. 3D AI environment changes lighting/materials
9. Rope snaps back
10. Interface settles

### Light → Dark

Reverse the concept:

1. Pull
2. Energy pulse
3. Ambient darkness expands from lamp
4. UI transitions to dark
5. 3D environment changes
6. Rope snaps back

Target transition duration:

**500–900ms**

Do not make it slow.

---

## 10. Theme Architecture

Use one real theme system.

Do not create separate page implementations.

Recommended:

```html
<html data-theme="dark">
```

Use CSS variables throughout the application.

Example:

```css
:root {
  --background: #050505;
  --foreground: #f5f5f5;
  --surface: #0d0d0d;
  --muted: #8a8a8a;
  --border: rgba(255,255,255,.12);
}

[data-theme="light"] {
  --background: #f4f2ed;
  --foreground: #111111;
  --surface: #ffffff;
  --muted: #666666;
  --border: rgba(0,0,0,.12);
}
```

All major components must consume these variables.

Do not repeatedly hardcode theme colors.

---

## 11. Persistence

Persist the user's selected theme.

Use localStorage key:

```text
pwa-theme
```

Values:

```text
dark
light
```

Initial behavior:

1. Check saved preference.
2. If none exists, respect system preference.
3. If no system preference exists, default to dark.
4. Once user manually changes the theme, their choice takes priority.

Prevent a flash of the wrong theme during initial load.

---

## 12. Component Architecture

Suggested:

```text
components/
  theme/
    LampThemeToggle.tsx
    LampRope.tsx
    ThemeProvider.tsx
    theme.css
```

Use:

```tsx
<LampThemeToggle />
```

inside the header.

Keep theme state separate from header logic.

If the project already has a theme provider, integrate with it instead of duplicating it.

---

## 13. State Model

Use a clear state model:

```ts
type Theme = "dark" | "light";

type LampState =
  | "idle"
  | "hover"
  | "dragging"
  | "threshold"
  | "switching"
  | "returning";
```

Avoid scattering many unrelated booleans.

---

## 14. Pointer / Mouse

Use Pointer Events rather than mouse-only handling:

```text
pointerdown
pointermove
pointerup
pointercancel
```

Desktop:

- pointer approaches lamp
- lamp subtly reacts
- pointer down begins drag
- vertical movement controls pull
- horizontal movement is limited
- pointer up releases
- pointer leaving viewport safely returns/cancels

Integrate with the existing custom cursor system.

---

## 15. Mobile

The interaction must work with touch.

Use Pointer Events.

Mobile:

1. Touch lamp
2. Drag downward
3. Rope stretches
4. Release after threshold
5. Theme changes

Use a larger invisible hit area:

```text
visible lamp: ~20px
interactive area: 48px+
```

Do not require precise dragging.

When the mobile navigation menu is open, hide or temporarily disable the rope if necessary.

---

## 16. Accessibility

The lamp is an interactive control.

Provide accessible semantics, for example:

```html
<button aria-label="Switch between light and dark mode">
```

Keyboard:

- Enter
- Space

must toggle the theme without dragging.

Screen readers should understand the current state and action.

Example:

```text
Switch to light mode
```

when the current theme is dark.

Dragging is the premium interaction, not the only interaction.

---

## 17. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

- disable rope physics
- disable elastic snap
- disable large radial transitions
- minimize glow animation
- make the lamp behave as a simple accessible theme control
- preserve all functionality

---

## 18. Performance

Keep the component lightweight.

Use:

- SVG
- CSS
- GSAP
- Motion where useful

Do NOT create a separate Three.js canvas for the lamp.

Avoid:

- expensive React state updates on every pointer movement
- unnecessary renders
- continuous animation loops while idle
- expensive filters on mobile

Use refs for high-frequency pointer updates where appropriate.

---

## 19. 3D AI Integration

The lamp theme must also affect the site's existing 3D AI environment.

### Dark

- darker environment
- emissive cool lighting
- stronger contrast
- darker materials

### Light

- brighter environment
- softer material response
- lower contrast
- daylight-like lighting

Do not recreate the Three.js scene every time the theme changes.

Update lights/materials through state or refs.

---

## 20. Header Integration

Recommended structure:

```tsx
<header className="site-header">
  <Navigation />

  <div className="lamp-anchor">
    <LampThemeToggle />
  </div>
</header>
```

The lamp must remain visually attached to the header.

If the header becomes smaller on scroll:

- mounting point adapts
- rope can become slightly shorter
- alignment remains correct

Never allow the lamp to cover navigation or the main CTA.

---

## 21. Scroll Behavior

The lamp should remain accessible while scrolling.

A fixed or header-relative fixed implementation is acceptable.

The visual origin must still feel attached to the header.

When scrolling:

```text
normal header → compact header
normal rope   → slightly shorter rope
```

Keep the interaction elegant.

---

## 22. Microcopy

Preferred hover label:

# PULL TO CHANGE REALITY

Alternatives:

- CHANGE MODE
- SWITCH REALITY

The preferred version should appear only during interaction/hover and remain subtle.

---

## 23. Visual Feedback

Pull progress:

### 0–40%
Normal.

### 40–70%
Subtle tension.

### 70–90%
Lamp glow increases.

### 90–100%
Threshold state.

Optional tiny status:

```text
REALITY SHIFT READY
```

Do not use a large popup.

---

## 24. No Sound

Do not add automatic sound.

The interaction should be silent by default.

---

## 25. Signature Transition

The most important creative idea:

The lamp should appear to be the **physical source of the theme transition**.

When pulled:

```text
               ◉
              /              /               LIGHT
          expanding
             ↓
     ┌─────────────────┐
     │                 │
     │   PAGE SYSTEM   │
     │                 │
     └─────────────────┘
```

The user should feel:

> **I physically changed the environment of this website.**

---

## 26. Things Claude Must NOT Do

Do NOT:

- use a standard Sun/Moon icon
- create a generic toggle switch
- use a hamburger-style toggle
- use a huge lightbulb
- make the rope cartoonish
- use rainbow colors
- use excessive glow
- cover the header
- make dragging mandatory
- require precise pointer movement
- add a heavy physics library unnecessarily
- create a separate Three.js canvas
- break keyboard accessibility
- ignore reduced motion
- cause theme flashing on page load

---

## 27. Suggested Technical Stack

Use the existing project stack:

- Next.js
- TypeScript
- Tailwind CSS
- GSAP
- Motion
- Three.js / React Three Fiber

Recommended responsibility:

**Theme:** CSS variables + theme provider

**Drag:** Pointer Events

**Rope:** SVG path

**Physics:** GSAP / spring interpolation

**Theme transition:** CSS variables + GSAP/Motion

**Persistence:** localStorage

**Accessibility:** native button semantics + keyboard fallback

**Mobile:** Pointer Events + simplified physics

---

## 28. Example Logic

Conceptually:

```ts
const handlePointerDown = (event: PointerEvent) => {
  startDrag(event);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging) return;

  const pullDistance = Math.max(
    0,
    event.clientY - startY
  );

  updateRope(pullDistance);

  if (pullDistance >= PULL_THRESHOLD) {
    setLampState("threshold");
  }
};

const handlePointerUp = () => {
  if (pullDistance >= PULL_THRESHOLD) {
    switchTheme();
  }

  animateLampBack();
};
```

This is conceptual only.

Implement production-quality:

- pointer capture
- cancellation
- bounds
- cleanup
- touch handling
- keyboard fallback
- reduced-motion behavior

---

## 29. Final Quality Bar

Before considering the feature complete, verify:

### Physical

Does it actually feel like the user pulled something?

### AI-native

Does it feel like manipulating an intelligent interface?

### Premium

Does it avoid cheap UI effects?

### Memorable

Will a visitor remember:

> "That website had a lamp rope I pulled to change the theme."

### Integrated

Does it look designed as part of the website rather than added later?

---

# FINAL EXPERIENCE

The complete interaction should communicate:

```text
USER
  ↓
GRAB
  ↓
PULL
  ↓
TENSION
  ↓
ENERGY
  ↓
REALITY SHIFT
  ↓
LIGHT / DARK
  ↓
SNAP BACK
```

This lamp is not merely a theme toggle.

It is a **signature interaction** for the agency website.

The final feeling should be:

> **"I physically changed the reality of this website."**
