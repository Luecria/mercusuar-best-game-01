import { angleDelta,DIFF } from './world.js';
import { bossDefeated } from './boss.js';
export function inBeam(w, e) { return Math.abs(angleDelta(e.angle,w.angle)) < w.width / 2; }
export function firePulse(w) {
  if (w.mode !== 'play' || w.paused || w.cooldown > 0 || w.energy < 18) return false;
  w.energy -= 18; w.cooldown = w.fireDelay;
  w.pulses.push({radius: 24, angle: w.angle, width: w.width, hit: [], life: 1});
  return true;
}
export function updatePulses(w,dt) {
  for (const p of w.pulses) {
    const before=p.radius; p.radius += 580*dt; p.life -= dt*1.5;
    for (const e of w.enemies) {
      if(e.dead || p.hit.includes(e.id) || e.radius < before-20 || e.radius > p.radius+20 || Math.abs(angleDelta(e.angle,p.angle)) > p.width/2 || !inBeam(w,e)) continue;
      p.hit.push(e.id); e.hp--; e.flash=0.2;
      const count=e.kind==='boss'&&e.hp<=0?30:12;
      for(let i=0;i<count;i++) w.sparks.push({angle:e.angle,radius:e.radius,x:0,y:0,vx:(w.rng()-.5)*180,vy:(w.rng()-.5)*180,life:.5+w.rng()*.5});
      if(e.hp<=0){e.dead=true;e.trail=[];w.kills++;w.nightStats.kills++;w.campaign.kills++;w.combo++;w.comboTime=3;const embers=e.kind==='boss'?40:DIFF[w.difficulty].killEmbers;w.score+=e.kind==='boss'?500:100+Math.min(10,w.combo)*20;w.coins+=embers;w.nightStats.embers+=embers;if(e.kind==='boss')bossDefeated(w);}
    }
  }
  w.pulses=w.pulses.filter(p=>p.life>0);
}
