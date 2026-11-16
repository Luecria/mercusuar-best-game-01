# Mercusuar — The Last Light

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/Luecria/mercusuar-best-game-01/rank.svg)](https://make.fun/bounty/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/Luecria/mercusuar-best-game-01/reward.svg)](https://make.fun/bounty/best-game-01)

Keep the last lighthouse alive for ten nights. Your beam is both sight and weapon:
shadows outside it are hidden except for their eyes, and immune to damage.
Original Canvas 2D art and synthesized WebAudio; no dependencies, external assets,
network calls, or build step. Three enemy types, pulse energy, chain scoring, and
three upgrade paths make each watch a test of priorities.

## Play

Requires Node 22.18+ and desktop Chrome (or a current equivalent).

```sh
node serve.ts
```

Open http://127.0.0.1:8080. Mouse or arrow keys aim. Hold left mouse or Space to
fire. P pauses; M toggles sound. Enter starts, restarts, or continues the next
night. In the workshop, click a purchase or press 1 / 2 / 3. Enemies reaching the
island consume a light; losing every light ends the watch. Survive all ten nights
to win. Embers buy wider beams, faster pulses, or reserve lanterns between nights.

## Verify

```sh
node tests/game.mjs
node tests/render.mjs
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The first test runs mechanics and a full campaign with an automated aiming
controller. The render test checks Canvas command execution, not browser pixels.
Desktop play-testing and screenshots are assigned to GGMU. `main.ts` requires
screenshots before the official dossier library can complete. There is no local
judge grade for this competition.

## GGMU screenshot handoff

Use the exact commit handed off, `node serve.ts`, and a 1280×720 desktop Chromium
viewport at deviceScaleFactor 1. Open each query in `shots.json`; wait for
`window.__shotReady === true`. Capture the browser render directly as JPEG (e.g.
quality 85), with no editing or compositing. Each image must be at most 256 KiB;
if needed, recapture at a lower browser JPEG quality. Save the four named images
under `screenshots/`. Never substitute starter images. Scenes use fixed seeded
game states and the real gameplay renderer. Screenshot mode is frozen; remove
the query to play. Also play-test mouse, keyboard, audio, pause, upgrades,
loss/restart and viewport scaling. Report any visual overflow before finalizing.

## Structure

`world.js` seeded state; `beam.js` pulse collisions and light immunity;
`enemies.js` movement; `waves.js` fixed-step progression; `upgrades.js` purchases;
`ocean.js` procedural drawing; `hud.js` menus; `audio.js` synthesis;
`shots.js` deterministic scenes; `main.js` input and loop.

`vendor/makefun-game.ts` is the unchanged official kit library. `main.ts` copies
assets and builds the exact official dossier. The entry is not submitted.
