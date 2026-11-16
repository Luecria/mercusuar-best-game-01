export const TAU = Math.PI * 2;
export const DIFF = {
 easy:{speed:1,count:6,hp:3,killEmbers:8,clearBonus:35,bossHp:[12,20]},
 normal:{speed:1.25,count:8,hp:3,killEmbers:8,clearBonus:35,bossHp:[14,24]},
 hard:{speed:1.5,count:10,hp:2,killEmbers:8,clearBonus:25,bossHp:[18,30]}
};
export function random(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function createWorld(seed = 42, difficulty = 'normal') {
 const d=DIFF[difficulty]||DIFF.normal;
 return { seed, rng: random(seed), difficulty:DIFF[difficulty]?difficulty:'normal', mode:'start', night:1, time:0, nightTime:0, hp:d.hp, maxHp:d.hp, energy:100, score:0, coins:0, kills:0, angle:-.55, width:.56, cooldown:0, fireDelay:.44, enemies:[], pulses:[], sparks:[], spawn:0, remaining:0, levels:[0,0,0], combo:0, comboTime:0, flash:0, message:'', messageTime:0, paused:false, bossSpawned:false, repairFlash:0, nightStats:{leaks:0,kills:0,hpLost:0,embers:0}, campaign:{leaks:0,kills:0,nightsNoLeak:0,repairs:0} };
}
export function angleDelta(a,b) { return Math.atan2(Math.sin(a-b), Math.cos(a-b)); }
export function isBossNight(w){return w.night===5||w.night===10;}
