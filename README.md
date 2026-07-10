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

## Using better human models (recommended)

**WebAR/WebXR is NOT limited to simple building blocks.**

A-Frame fully supports real 3D models using the glTF/GLB format (the standard for the web). The current characters look like "a bunch of cubes, circles and cylinders" only because we are building them procedurally with A-Frame primitives (`<a-box>`, `<a-sphere>`, `<a-cylinder>`) for zero-asset simplicity and easy custom animation.

### How to use a real connected human model
1. Go to the link: https://poly.pizza/m/JFrLIKqvCH (Business Man by Quaternius)
2. Click Download → choose GLTF (or GLB if offered). If it's a zip, extract.
3. Put the main model file in `models/business-man.glb` (rename if needed; if separate .gltf + .bin, put the whole folder contents in models/ and use 'models/business-man.gltf')
4. The code in `js/scene-renderer.js` already loads it by default. Refresh.

This replaces the primitive blocks with a proper low-poly connected mesh. Hands will be attached, looks like a real person.

Good free sources for low-poly humans:
- Poly Pizza (https://poly.pizza/ — direct GLTF downloads, very low poly)
- Sketchfab (search "low poly man gltf" or "lowpoly character", filter downloadable + free license)
- Quaternius packs (CC0, many low-poly + animated humans)

Note: For WebXR on phones, always prioritize small optimized models over high-detail ones. Procedural is "good enough" when you want zero downloads, but a proper glTF will look like an actual person with connected hands/mesh.

The code already supports both (see `model:` option and the glTF example in scene-renderer.js).