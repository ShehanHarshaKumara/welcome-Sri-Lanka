# YouTube Hero Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display the provided Sri Lanka YouTube video as the homepage hero background.

**Architecture:** Replace the existing hosted MP4 video layer in `src/App.tsx` with a full-bleed YouTube iframe. Keep a gradient overlay above the embed and hero content above the overlay, preserving legibility and the existing responsive layout.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS.

## Global Constraints

- Use YouTube video ID `uiC8EGNC1EY`.
- Autoplay must be muted, inline, looping, and free of visible player controls.
- Do not change hero copy, actions, navigation, or page sections outside the video background.

---

### Task 1: Replace the hero video source

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: YouTube embed parameters and the existing hero stacking contexts.
- Produces: A responsive autoplaying YouTube video background within the hero section.

- [ ] **Step 1: Implement the iframe background**

Replace the MP4 `<video>` element and its fade-loop state/effect with an absolutely positioned iframe pointing to:

```text
https://www.youtube.com/embed/uiC8EGNC1EY?autoplay=1&mute=1&loop=1&playlist=uiC8EGNC1EY&controls=0&playsinline=1&rel=0&modestbranding=1
```

Set `title="Sri Lanka scenic video"`, `allow="autoplay; encrypted-media; picture-in-picture"`, and `allowFullScreen`. Size the iframe wider/taller than the section to maintain a full-bleed crop.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: Vite completes with exit code 0.
