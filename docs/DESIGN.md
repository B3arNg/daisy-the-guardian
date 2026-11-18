---
version: 2.0
name: Pixel Hearth — Daisy the Guardian Design System
description: "An ultra-cozy, vibrant 16-bit retro pixel art interface inspired by classic Japanese RPGs, Stardew Valley, and Tamagotchi. Built on warm parchment tones, chunky chocolate ink outlines, stepped 4px pixel bevels, solid offset block shadows, and isolated transparent pixel food/snack sprites."

colors:
  # Night Hearth theme (2026-11): semantic tokens live in src/app/globals.css (:root = light "Dawn Hearth", .dark = dark "Night Hearth").
  # Components use token classes (bg-canvas, bg-surface, text-ink, text-muted, border-line, bg-gold, bg-joy-soft ...); never hardcode hex in components.
  canvas-dark: "#120E1C" # Indigo dusk
  surface-dark: "#221A33" # Plum card
  ink-dark: "#F4E8D0" # Cream text
  line-dark: "#E8D9BC" # Cream pixel stroke
  shade-dark: "#5B3FA0" # Violet hard shadow
  canvas-light: "#F7EEDC"
  surface-light: "#FFF6E4"
  ink-light: "#2A2038" # Plum ink (stroke + text)
  gold: "#F6B84A" # Lamp amber accent (light: #F2A93B)

  # Emotion palette (--emo-*): soft card / badge shades are derived with color-mix
  joy: "#F6B84A"
  sadness: "#7FA8E8"
  anger: "#EE7B6B"
  fear: "#B79AE8"
  surprise: "#F4935A"
  disgust: "#6FCF97"

typography:
  display-pixel:
    fontFamily: "Press Start 2P"
    use: "HUD title, hero badges, big action buttons, section headers"
  dialogue-vt:
    fontFamily: "VT323"
    use: "RPG dialogue box, reflection notes, input boxes, descriptions"
  micro-silk:
    fontFamily: "Silkscreen"
    use: "Status HUD counters, tags, timestamps, button subtext"
  body-sans:
    fontFamily: "Plus Jakarta Sans"
    use: "Accessible fallback body typography"

shapes:
  box-border: "3px solid #2B1E16"
  box-shadow: "4px 4px 0px 0px #2B1E16"
  box-shadow-lg: "6px 6px 0px 0px #2B1E16"
  button-press: "translate(3px, 3px) with 0px shadow"

components:
  rpg-dialogue-box:
    background: "{colors.surface-card}"
    border: "{shapes.box-border}"
    shadow: "{shapes.box-shadow-lg}"
    portrait: "Daisy Hamster Munching GIF (/pixel-assets/daisy_munching.gif)"
  treat-crafter-card:
    border: "{shapes.box-border}"
    shadow: "{shapes.box-shadow}"
    icon: "Isolated transparent PNG pixel snack"
---

## Overview

Daisy the Guardian is an emotional-wellness sanctuary styled after cozy 16-bit RPGs. Rather than cold corporate analytics, mood tracking is framed as **Treat Crafting** and **Quest Reflections** guided by Daisy the Hamster guardian.

## Key Visual Rules

1. **Clean Transparent Pixel Sprites**:
   - All pixel art assets (Daisy hamster portrait, animated munching GIF, and 15 food/snack sprites) are isolated with clean transparent alpha channels in `/public/pixel-assets/`.
   - Always rendered with `image-rendering: pixelated` (`.pixel-art`) to guarantee razor-sharp 16-bit fidelity.
2. **Hard-Edged 3D Block Elevation**:
   - No soft Gaussian blurs or gradient drop-shadows.
   - All shadows are hard offset blocks (`box-shadow: 4px 4px 0px #2B1E16`).
   - Interactive buttons depress physically on click (`translate(3px, 3px)`).
3. **Parchment & Chocolate Ink Theme**:
   - Default canvas uses warm parchment `#FFFDF0` with rich chocolate outline `#2B1E16`.
   - Dark mode switches to chocolate ground `#150F0B` with cream borders `#FDF6E2`.
