export const TAU = Math.PI * 2;
export function random(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function createWorld(seed = 42) {
  return { seed, rng: random(seed), mode: 'start', night: 1, time: 0, nightTime: 0, hp: 3, maxHp: 3, energy: 100, score: 0, coins: 0, kills: 0, angle: -0.55, width: 0.56, cooldown: 0, fireDelay: 0.44, enemies: [], pulses: [], sparks: [], spawn: 0, remaining: 0, levels: [0,0,0], combo: 0, comboTime: 0, flash: 0, message: '', paused: false };
}
export function angleDelta(a,b) { return Math.atan2(Math.sin(a-b), Math.cos(a-b)); }
