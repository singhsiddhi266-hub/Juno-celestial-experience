# JUNO — The Wish That Fell From the Stars
### An Interactive Celestial Fantasy Experience for the haX.baby Hackathon

> **Main Tagline:** *“Every wish hides a world. Juno knows the way.”*  
> **Supporting Tagline:** *“A little genie. A lot of dreams.”*

---

##  Overview

**Juno — The Wish That Fell From the Stars** is an interactive storybook experience built around an original character: **Juno**, a tiny celestial baby genie born when a shooting star collided with an ancient golden lamp in a forgotten desert.

Visitors don't just read Juno's story—they actively **bring her into existence**, make wishes, mix alchemical cosmic ingredients, explore dream worlds, play games, and uncover hidden stars.

---

##  Features & Sections

| Section | Feature | Description |
|---|---|---|
| **Section A: The Hero** | **Living 2D Juno** | Interactive 2D layered SVG character with smooth cursor eye-tracking, natural randomized blinking, gentle idle floating, and click reactions with dialogue bubbles. |
| **Section B: Birth Story** | **Cinematic 6 Chapters** | Interactive centerpiece where the visitor awakens sleeping stars, guides the falling star, brushes away desert sand to reveal the lamp, gathers three sparks to awaken Juno, chooses her first wish (transforming the sky), and crowns her turban with the first star. |
| **Section C: Meet Juno** | **Dialogue Console** | Interactive prompt buttons allowing visitors to ask Juno questions about her past, favorite places, and forgotten wishes. |
| **Section D: Wish Machine** | **Star Sky of Wishes** | Enter a wish, pick a mood (*Hopeful, Adventurous, Peaceful, Mysterious*), receive a sweet note from Juno, and see your star added to the sky constellation. |
| **Section E: Magic Toolbox** | **The Magic Toolbox** | Pick 3 of 6 ingredients (*Moon dust, Stardust, Dream petals, Cloud drop, Old memory, Golden spark*) to discover 20+ magical items with cute notes from Juno. |
| **Section F: Dream Worlds** | **4 Dream Worlds** | Interactive places Juno loves: *Wishfall Kingdom* (build light bridge), *Moonlit Garden* (open moon flower), *Dream Library* (read old storybook), and *Stardust Observatory* (draw star pattern). |
| **Section G: Delivery Map** | **Dream Delivery Map** | An interactive map with a traveling star navigating between worlds. |
| **Section H: Music Box** | **The Music Box** | Gentle browser-synthesized chime player with 8 notes, 3 peaceful moods, and an auto-playing star lullaby. Completely silent until played. |
| **Section I: Nightlight** | **Flashlight Spotlight Mode** | Pointer-following dark mask that reveals hidden runes, constellations, and secret easter eggs in the darkness. |
| **Section J: Storybook** | **6-Page Illustrated Book** | Turnable storybook with keyboard navigation, touch gestures, illustrations, and a secret ribbon bookmark. |
| **Section K: Mini-Game** | **Catch the Falling Dreams** | Canvas arcade mini-game where you guide Juno's basket to catch glowing stars and dream orbs while avoiding stormy thunderclouds. |
| **Section L: Hidden Stars** | **The Place Between Wishes** | 7 discoverable golden stars scattered across the universe. Finding all seven unlocks a secret cosmic sanctuary with Juno's crown and certificate. |

---

## 🎨 2D Character Animation (Strictly 2D, No Voice)

- **Pure Layered 2D SVG:** Constructed from separately controllable layers (tail, body, arms, head, turban, eye whites, clipped pupils, eyelids, mouth, and sparkles).
- **Cursor Tracking Eyes:** Pupils lerp smoothly toward cursor coordinates, constrained strictly within eye whites, and return to center upon leaving the window. Disabled gracefully on touch devices.
- **Natural Blinking:** Randomized blinks every 2–5 seconds with a 25% chance of a double blink.
- **Text-Only Dialogue:** No speech synthesis or audio voiceovers. All responses appear as whimsical floating speech bubbles.

---

## 🚀 How to Run

1. Open the project folder:
   ```bash
   cd /Users/riddhi/.gemini/antigravity/scratch/juno-celestial-experience
   ```
2. Simply double-click `index.html` to open it in your favorite browser (Chrome, Safari, Edge, Firefox), or serve it with Python:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

---

## 🗺️ Seven Hidden Stars Guide (Spoiler Warning)

1. **Star #1:** Click the small golden star near the glowing moon in the Hero section (peeking behind a cloud).
2. **Star #2:** Send a wish into the Wish Machine containing the word `"star"`, `"juno"`, or `"dream"`.
3. **Star #3:** In the Magic Toolbox, mix **Old Memory + Golden Spark + Stardust** to make the *Ancient Wish Fragment*.
4. **Star #4:** Finish the 6-chapter birth story and click the glowing star to crown Juno's turban.
5. **Star #5:** Turn on **Nightlight Mode** and click the secret star in the bottom right corner of the nightlight card.
6. **Star #6:** Read the **Storybook** to Page 4 and click the gold star on the ribbon bookmark.
7. **Star #7:** Score **100+ points** in the **Catch the Falling Dreams** mini-game.
