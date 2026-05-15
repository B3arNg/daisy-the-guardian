---
version: 1.0
name: Daisy-the-Guardian-Design-System
description: "A premium, meditative dark-mode interface that balances editorial elegance with high-tech glassmorphism. The design system uses deep slate surfaces, vibrant emotional accents, and a blend of modern sans-serif and timeless serif typography to create a sense of clarity and mindfulness."

colors:
  primary: "#8B5CF6" # Vivid Purple
  background-dark: "#0F172A" # Slate 900
  surface-dark: "rgba(30, 41, 59, 0.7)" # Slate 800 with 70% opacity
  border-dark: "rgba(51, 65, 85, 0.5)" # Slate 700 with 50% opacity
  text-primary: "#FFFFFF"
  text-secondary: "#94A3B8" # Slate 400
  
  # Emotional Palette
  joy: "#EAB308" # Yellow 500
  sadness: "#3B82F6" # Blue 500
  anger: "#EF4444" # Red 500
  fear: "#A855F7" # Purple 500
  surprise: "#F97316" # Orange 500
  disgust: "#10B981" # Emerald 500

typography:
  display-serif:
    fontFamily: "Instrument Serif"
    style: "italic"
    use: "Main headlines, hero sections, emotional volume titles"
  base-sans:
    fontFamily: "Plus Jakarta Sans"
    use: "Body text, UI labels, buttons"
  eyebrow:
    fontFamily: "Plus Jakarta Sans"
    fontWeight: "bold"
    textTransform: "uppercase"
    letterSpacing: "0.2em"
    fontSize: "xs"
    use: "Section markers, labels"

shapes:
  container: "2.5rem" # 40px - Large rounded corners for main cards
  card: "2rem" # 32px - Medium-large for inner elements
  button: "9999px" # Pill shape for CTAs

effects:
  glass: "backdrop-blur-xl" # High intensity background blur
  glow: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(15, 23, 42, 0) 70%)" # Primary cursor glow
  shimmer: "animate-pulse" # Used for skeleton loading states

components:
  glass-card:
    background: "{colors.surface-dark}"
    backdropBlur: "{effects.glass}"
    border: "1px solid {colors.border-dark}"
    borderRadius: "{shapes.container}"
    shadow: "2xl shadow-primary/5"
    
  emotion-boxed-item:
    borderRadius: "{shapes.card}"
    border: "2px solid" # Dynamic based on emotion color
    padding: "1.5rem"
    
  primary-button:
    background: "{colors.primary}"
    color: "{colors.text-primary}"
    borderRadius: "{shapes.button}"
    fontWeight: "bold"
    
  marquee-banner:
    background: "{colors.background-dark}"
    borderY: "1px solid rgba(51, 65, 85, 1)"
    textStyle: "{typography.eyebrow}"
---

## Overview

Daisy the Guardian is built on a **"Digital Sanctuary"** philosophy. The interface is intentionally dark to reduce eye strain and create a focused, quiet environment for self-reflection. 

The design leverages **Glassmorphism** to create depth without clutter—using layers of semi-transparent slate surfaces and high-intensity background blurs (`backdrop-blur-xl`). This makes the UI feel like physical glass overlays on a digital canvas.

## Typography

The system uses a sophisticated typographic pairing:
- **Instrument Serif (Italic)**: Provides a human, editorial, and almost poetic feel. It is used for the most important emotional cues and section headings.
- **Plus Jakarta Sans**: A clean, geometric sans-serif that ensures high readability for data and UI interactions. It is often used in all-caps with wide tracking for "eyebrow" labels.

## Color & Emotion

Color is functional, not just decorative. Each core emotion is mapped to a specific hue from the emotional palette:
- **Joy** is sunny and yellow.
- **Sadness** is a deep, reflective blue.
- **Anger** is a vibrant, intense red.
- **Fear** is a guarded, mystical purple.
- **Surprise** is a stunning orange.
- **Disgust** is an averse emerald green.

These colors are used for borders, icons, and gradients to provide immediate visual feedback on the user's emotional state.

## Interactive Elements

### The Cursor & Glow
The app features a custom interaction layer:
- A **Glowing Follower**: A large, soft radial gradient that follows the mouse, "illuminating" the dark interface.
- A **Custom Pointer**: A small, precise dot that scales up when hovering over interactive elements (buttons, logs).
- **Mobile Adaptive**: Both elements are automatically disabled on touch devices to prioritize native usability.

### Skeleton Loading
To prevent "layout shift" and provide a premium feel during data fetching, the app uses shimmering skeleton placeholders that exactly match the geometry of the final components.

## Layout Principles

- **Generous Padding**: Cards use `p-8` to `p-12` to give elements room to breathe.
- **The Boxed Grid**: Logs are displayed in a structured grid where each entry is a self-contained "box" with a thick border in the emotion's primary color.
- **Sticky Utilities**: Navigation and headers use `sticky` positioning with backdrop blurs to maintain context while scrolling.
