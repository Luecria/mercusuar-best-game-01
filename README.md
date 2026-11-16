# Mercusuar — The Last Light

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/Luecria/mercusuar-best-game-01/rank.svg)](https://make.fun/bounty/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/Luecria/mercusuar-best-game-01/reward.svg)](https://make.fun/bounty/best-game-01)

Keep the last lighthouse alive for ten nights. Your beam is both sight and weapon:
shadows outside it are hidden except for their eyes, and immune to damage.
Original Canvas 2D art and synthesized WebAudio; no dependencies, external assets,
network calls, or build step. Three enemy types, pulse energy, chain scoring, and
three four-level upgrade paths make each watch a test of priorities. Choose EASY,
NORMAL or HARD; face the Drowned Warden on night 5 and the Hollow Tide on night 10.
Boss impacts cost two lights and grant no reward. Phosphor dots mark last-seen
positions without exposing or damaging hidden enemies. Keeper journal lines and
final titles reflect your watch; cracked glass and quiet smoke show lighthouse damage.

## Play

Requires Node 22.18+ and desktop Chrome (or a current equivalent).

```sh
node serve.ts
```

Open http://127.0.0.1:8080. Mouse or arrow keys aim. Hold left mouse or Space to
fire. P pauses; M toggles sound. Enter starts, restarts, or continues the next
night. Choose difficulty with 1 / 2 / 3 on the title screen; restart preserves it.
In the workshop, click a purchase or press 1 / 2 / 3; press 4 for REPAIR ONE LIGHT
(40 embers). Repair restores one missing light and produces a brief warm glow. Enemies reaching the
island consume a light; losing every light ends the watch. Survive all ten nights
to win. Embers buy wider beams, faster opening bursts, or reserve lanterns between nights.
Pulse regeneration remains 25 energy/s and each shot costs 18, so faster bursts
do not necessarily shorten a long boss fight. Final upgrade prices by level:
Lens 57/113/170/226; Pulse 50/107/163/220; Lantern 70/125/182/238.

## Verify

```sh
node tests/game.mjs
node tests/render.mjs
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The first test runs mechanics, burst timing, boss kill times and nine campaigns:
perfect aim, 0.25-second re-aim, and no shooting, across all difficulties.
The typical controller buys at most two items per shop, repairs first, then buys
the cheapest upgrade. Seed 23 is the fixed acceptance case, not a human playtest. The render test checks Canvas command execution, not browser pixels.
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
`shots.js` deterministic scenes; `main.js` input and loop; `actions.js` shared
menu actions; `boss.js` finales; `journal.js` pure keeper narration.

`vendor/makefun-game.ts` is the unchanged official kit library. `main.ts` copies
assets and builds the exact official dossier. v1 was submitted; this v2 revision
has not been submitted. The existing screenshots still show v1 until GGMU
provides fresh start, boss, shop and victory renders from this revision.
