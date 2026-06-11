# 🔬 Liquid Glass Refraction Guide

This guide explains how the liquid glass refraction effect works and how to customize it.

## 📖 Table of Contents

1. [The Decoded Displacement Map](#the-decoded-displacement-map)
2. [How Displacement Works](#how-displacement-works)
3. [Controllable Parameters](#controllable-parameters)
4. [Understanding the Effect](#understanding-the-effect)
5. [Presets & Examples](#presets--examples)

---

## The Decoded Displacement Map

The inline SVG has been decoded and extracted to `components/ui/displacement-map.tsx`.

### Original Encoded Version:

```
data:image/svg+xml,%3Csvg%20class%3D%22displacement-image...
```

### Decoded Structure:

```xml
<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Horizontal gradient: Black → Red -->
    <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>

    <!-- Vertical gradient: Black → Blue -->
    <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>

  <!-- Layer 1: Black backdrop -->
  <rect width="200" height="80" fill="black"/>

  <!-- Layer 2: Red gradient (horizontal distortion) -->
  <rect width="200" height="80" rx="40" fill="url(#red)"/>

  <!-- Layer 3: Blue gradient (vertical distortion) -->
  <rect width="200" height="80" rx="40" fill="url(#blue)"
        style="mix-blend-mode: difference"/>

  <!-- Layer 4: Center blocker (reduces middle distortion) -->
  <rect x="2.8" y="2.8" width="194.4" height="74.4" rx="40"
        fill="hsl(0 0% 50% / 0.93)"
        style="filter:blur(11px)"/>
</svg>
```

### Visual Representation:

```
┌──────────────────────────────────────┐
│ Displacement Map (what it looks like)│
│                                      │
│  ███████████████████████████████    │ ← Dark edges
│  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██    │
│  ██▓░░░░░░░░░░░░░░░░░░░░░▓██    │ ← Lighter center
│  ██▓░░░░░░░░░░░░░░░░░░░░░▓██    │   (blocked)
│  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██    │
│  ███████████████████████████████    │
│                                      │
└──────────────────────────────────────┘
   ↑                              ↑
   More distortion              More distortion
   (darker = less red/blue)     (brighter = more red/blue)
```

---

## How Displacement Works

### The Concept

A displacement map tells pixels **how far to move**:

```
Pixel Color in Map → Movement Amount
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Black (0, 0, 0)     → No movement
Red (255, 0, 0)     → Move horizontally (X-axis)
Blue (0, 0, 255)    → Move vertically (Y-axis)
Gray (128,128,128)  → Half movement
```

### Visual Example

```
Original Content:
┌─────────┐
│ HELLO   │
│ WORLD   │
└─────────┘

Apply Horizontal Displacement (Red Channel):
┌─────────┐
│H E L L O│  ← Letters spread out
│W O R L D│  ← Based on red gradient
└─────────┘

The red gradient (black→red, left→right) means:
- Left pixels: Don't move (black = 0)
- Right pixels: Move right (red = 255)
```

### The Three-Channel Trick

By displacing **each RGB channel separately** with **different scales**:

```
Red Channel:   scale = -180  (moves MOST)
Green Channel: scale = -170  (moves MEDIUM)
Blue Channel:  scale = -160  (moves LEAST)

Result: Colors separate at edges!
        🔴🟢🔵 ← Chromatic aberration
```

This mimics how real glass refracts different wavelengths by different amounts.

---

## Controllable Parameters

### 1. **Displacement Scale Values** (RGB Channels)

Controls the **strength** of distortion for each color channel.

```tsx
<LiquidGlass.div
  refractionRed={-180}    // Red channel displacement
  refractionGreen={-170}  // Green channel displacement
  refractionBlue={-160}   // Blue channel displacement
>
```

**Effect of different values:**

| Value Range     | Effect                        |
| --------------- | ----------------------------- |
| `0`             | No distortion                 |
| `-50 to -100`   | Subtle, Apple-like distortion |
| `-150 to -200`  | Strong, dramatic distortion   |
| `-250+`         | Extreme warping               |
| Positive values | Reverses distortion direction |

**Chromatic Aberration:**

- **Same values** (e.g., all `-120`) = **Uniform distortion**, no color fringing
- **Different values** (e.g., `-180, -170, -160`) = **Color separation** at edges

---

### 2. **Saturation**

Boosts color intensity of content behind the glass.

```tsx
<LiquidGlass.div saturation={1.5}>
```

| Value   | Effect                  |
| ------- | ----------------------- |
| `0`     | Grayscale               |
| `1`     | Normal colors (default) |
| `1.5-2` | Vibrant, Apple-like     |
| `3+`    | Oversaturated           |

---

### 3. **Refraction Blur**

Adds Gaussian blur on top of the displacement effect.

```tsx
<LiquidGlass.div refractionBlur={2}>
```

| Value | Effect                     |
| ----- | -------------------------- |
| `0`   | Sharp refraction (default) |
| `1-3` | Slight soft-focus          |
| `5+`  | Heavy blur, less realistic |

---

### 4. **Displacement Map Configuration**

Controls **where** distortion happens (edges vs. center).

```tsx
<LiquidGlass.div
  displacementMap={{
    centerInset: 2.8,          // Distance from edges
    centerBlockOpacity: 0.93,  // How much to block center
    centerBlur: 11,            // Blur on the blocker
  }}
>
```

#### `centerInset`

How far the "clear zone" is from edges.

```
centerInset = 0:          centerInset = 10:
┌──────────┐              ┌──────────┐
│▓▓▓▓▓▓▓▓▓▓│              │▓▓▓░░░░▓▓▓│
│▓▓▓▓▓▓▓▓▓▓│              │▓▓░░░░░░▓▓│
│▓▓▓▓▓▓▓▓▓▓│              │▓▓░░░░░░▓▓│
│▓▓▓▓▓▓▓▓▓▓│              │▓▓▓░░░░▓▓▓│
└──────────┘              └──────────┘
Full distortion           Edge-only distortion
```

#### `centerBlockOpacity`

How strongly to suppress center distortion (0 = full distortion, 1 = no distortion).

#### `centerBlur`

Softens the transition between distorted edges and clear center.

---

## Understanding the Effect

### Why Does It Look Like Glass?

1. **Edges distort more than center** (realistic for curved glass)
2. **Chromatic aberration** (color fringing) mimics light refraction
3. **Saturation boost** makes colors "pop" through the glass
4. **Box-shadow reflections** (in CSS) add highlights/depth

### Apple's Approach vs. Default

| Aspect               | Apple Style              | This Implementation (Default) |
| -------------------- | ------------------------ | ----------------------------- |
| Distortion           | Subtle (`-50 to -80`)    | Strong (`-160 to -180`)       |
| Chromatic aberration | Minimal (similar scales) | Visible (different scales)    |
| Saturation           | High (`1.5-2`)           | Normal (`1`)                  |
| Center blocking      | Heavy (clear center)     | Moderate                      |

---

## Presets & Examples

### 🍎 Apple Style (Subtle)

```tsx
<LiquidGlass.div
  refractionRed={-60}
  refractionGreen={-58}
  refractionBlue={-56}
  saturation={1.5}
  displacementMap={{
    centerInset: 2.8,
    centerBlockOpacity: 0.93,
    centerBlur: 11,
  }}
>
```

### 💥 Dramatic

```tsx
<LiquidGlass.div
  refractionRed={-250}
  refractionGreen={-240}
  refractionBlue={-230}
  saturation={1.2}
>
```

### ⚖️ Uniform (No Color Fringing)

```tsx
<LiquidGlass.div
  refractionRed={-120}
  refractionGreen={-120}
  refractionBlue={-120}
  saturation={1}
>
```

### 🌊 Full Distortion (Everywhere)

```tsx
<LiquidGlass.div
  refractionRed={-150}
  refractionGreen={-145}
  refractionBlue={-140}
  displacementMap={{
    centerInset: 0,
    centerBlockOpacity: 0,
    centerBlur: 0,
  }}
>
```

---

## 🎮 Interactive Demo

Run the project and open `http://localhost:5173` to see the **Liquid Glass Refraction Lab** where you can:

- ✅ Adjust all parameters with sliders in real-time
- ✅ Try presets (Apple, Dramatic, etc.)
- ✅ See live preview of the refraction effect
- ✅ Export your custom settings as code

---

## 🧠 Key Takeaways

1. **Displacement maps** "push" pixels based on color values
2. **Red channel** = horizontal movement, **Blue channel** = vertical movement
3. **Different scales per RGB** = chromatic aberration (color fringing)
4. **Center blocker** = more distortion at edges (realistic glass)
5. **Negative values** = one direction, **Positive** = reverse direction
6. **Saturation** = makes colors more vibrant through glass

Experiment with the interactive demo to truly understand how each parameter affects the final result!
