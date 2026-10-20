---
version: 2.0
name: Pixel Hearth — Daisy the Guardian Design System
description: "An ultra-cozy, vibrant 16-bit retro pixel art interface inspired by classic Japanese RPGs, Stardew Valley, and Tamagotchi. Built on warm parchment tones, chunky chocolate ink outlines, stepped 4px pixel bevels, solid offset block shadows, and isolated transparent pixel food/snack sprites."

colors:
  canvas-light: "#FFFDF0" # Warm Parchment
  canvas-dark: "#150F0B" # Dark Chocolate Hearth
  surface-card: "#FDF6E2" # Aged Parchment Box
  outline-ink: "#2B1E16" # Dark Chocolate Pixel Stroke
  outline-light: "#FDF6E2" # Inverse Stroke

  # 16-Bit Emotional & Snack Palette
  joy: "#FBBF24" # Cheddar Gold (Bear Toast)
  sadness: "#60A5FA" # Raindrop Blue (Iced Coffee)
  anger: "#F87171" # Hot Ember Red (Hot Espresso)
  fear: "#C084FC" # Mystic Lavender (Boba Potion)
  surprise: "#FB923C" # Sweet Coral Orange (Strawberry Cake)
  disgust: "#4ADE80" # Mint Herb Green (Matcha Popsicle)

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
