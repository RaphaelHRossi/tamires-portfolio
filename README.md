# Tamires Da Pont — Portfolio

A motion-driven portfolio website for **Tamires Da Pont**, a 3D, Motion and UX designer based in São Paulo, Brazil.

The goal was simple: let the work speak first. Every interaction — from browsing projects to opening a case study — is designed to feel continuous, so visitors move through the portfolio the way they would flip through a physical book of work.

![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-0F172A?logo=tailwindcss&logoColor=38BDF8)
![Motion](https://img.shields.io/badge/Motion-000000?logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

---

## Highlights

**Infinite project carousel**
The home page is a full-screen, endless carousel. It responds to mouse wheel, trackpad, touch swipe, drag and keyboard, always settling on the nearest project with spring physics. The featured project stands out while the surrounding ones are softly desaturated, keeping focus without hiding context.

**Seamless transition into each project**
Selecting a project expands its cover image from the carousel into the page banner, with title and date rising into place. Going back reverses the motion and returns to the same project in the carousel.

**Modular case studies**
Each project page is assembled from content blocks — social media feeds, stories and reels, video players, 3D process steps, an interactive before/after comparison, results with animated figures, and credits. Different kinds of work get the layout that suits them, without custom pages for each one.

**Scroll animations in both directions**
Content reveals as it enters the screen and responds to the direction of scrolling, with subtle parallax on images, so the page stays alive whether the visitor is moving down or back up.

**Image and video lightbox**
Any image or video can be expanded from its exact position to a full view over a dimmed background, and closed with a click outside, the close button or the Esc key.

**Contact drawer**
A side panel with a validated contact form is available from every page, without leaving the content behind.

---

## Built for every screen

The layout was designed for desktop and adapted to tablet and mobile, with typography and spacing that scale fluidly between screen sizes instead of jumping at fixed breakpoints. Touch gestures, keyboard navigation and pointer input are supported throughout.

## Accessibility and performance

- Keyboard navigation across the carousel, dialogs and forms, with focus kept inside open panels
- Respects the operating system's *reduce motion* preference
- Descriptive alternative text and screen-reader announcements for the carousel
- Animations run on transforms and opacity, outside React's render cycle, to stay smooth
- Lazy-loaded media, with videos playing only while visible

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS 4 with design tokens |
| Animation | Motion |
| Routing | React Router |
| Hosting | Vercel |

## How it was made

1. **Design** — the visual direction and desktop layouts were sketched in Figma.
2. **Design system** — colors, typography and spacing were turned into reusable tokens, and the layouts were extended to tablet and mobile.
3. **Content model** — case studies were structured as typed, reusable blocks, so new projects are added as data rather than new code.
4. **Interaction** — motion was built as a core part of the experience: a physics-based carousel, shared element transitions between pages and direction-aware scroll animations.

---

## Credits

- **Client** — Tamires Da Pont

All artwork, images and videos are © Tamires Da Pont. All rights reserved.
