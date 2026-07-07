# NegotiateAR

Practice salary negotiation face-to-face with Wii-style 3D characters in your browser. Choose dialogue options, track rapport and assertiveness, and work toward the best deal.

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

- [A-Frame 1.5](https://aframe.io/) + WebXR
- Procedural geometry (no external 3D models)
- Static site — no build step