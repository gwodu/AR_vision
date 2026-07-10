# NegotiateAR

Practice salary negotiation face-to-face with expressive 3D characters in your browser. Choose your words carefully, read the room through body language and expressions, and work toward the best deal.

The characters are built procedurally from simple shapes. This keeps the experience lightweight, fast-loading, and reliable — especially good for WebAR on mobile. You can optionally swap in real glTF human models (see below).

## What's in the demo

- **Live 3D preview** on the landing page — two rotating Mii-style figures
- **"The Raise" scenario** — negotiate with Alex, your manager
- **Branching dialogue** — your choices change the conversation and outcome
- **3D meeting room** — table, characters, speech bubbles, idle animations
- **AR mode** — place the meeting on a real surface (Android Chrome)

## Run locally

```bash
cd AR_vision
python3 -m http.server 8080
```

Open http://localhost:8080 → click **Start 3D Negotiation**.

## Deploy to Vercel

```bash
# Install Vercel CLI (once)
npm i -g vercel

# From project root
cd AR_vision
vercel
```

Or connect the GitHub repo in the [Vercel dashboard](https://vercel.com/new) — zero config needed, it's all static files.

Vercel gives you HTTPS automatically, which is required for AR on mobile.

## Test AR on your phone

1. Deploy to Vercel (or use any HTTPS host)
2. Open the URL in **Chrome on Android**
3. Tap **Launch AR on Phone**
4. Allow camera access
5. Point at a flat floor/desk and **tap** to place the meeting room
6. Choose dialogue options at the bottom

> iOS Safari has limited WebXR AR support. Android Chrome is recommended.

## Controls

| Mode | How it works |
|------|-------------|
| 3D | Characters visible immediately across a virtual table. Drag to look around. |
| AR | Miniature meeting room placed on a real surface via hit-test. |

## Project structure

```
AR_vision/
├── index.html
├── vercel.json
├── css/style.css
└── js/
    ├── mii-character.js   # Procedural Wii-style avatars
    ├── scenario.js        # Branching negotiation script
    ├── scene-renderer.js  # 3D meeting room
    ├── ar-hit-test.js     # WebXR surface placement
    └── app.js             # Game flow
```

## Tech

- [A-Frame 1.8](https://aframe.io/) + WebXR
- Procedural characters (easy to animate, zero assets)
- Optional: real glTF/GLB human models (see js/mii-character.js and js/scenario.js)
- Static site — no build step

## Using better human models

The current characters are built from basic shapes for performance and simplicity in WebAR.

You can replace them with proper human models:

1. Download a .glb (glTF binary) file (low-poly recommended for mobile).
2. Put it in a `models/` folder (e.g. `models/you.glb`).
3. In `js/scenario.js`, uncomment and set the `model` property on the character:
   ```js
   you: {
     ...
     model: 'models/you.glb'
   }
   ```
4. The model will be loaded via A-Frame's gltf-model.

Good free sources:
- Sketchfab (search "human gltf", filter license)
- Mixamo (rigged characters)
- Kenney or other free asset sites

Note: Complex models can impact performance on phones in AR. Procedural shapes are often the "best" choice for reliable WebAR experiences.