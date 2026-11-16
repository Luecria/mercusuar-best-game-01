import { TAU,DIFF } from './world.js';
import { inBeam } from './beam.js';
export const TRAIL_LIFE=2.5,TRAIL_LIMIT=8,TRAIL_SPACING=14;
export function spawnEnemy(w) {
 const roll=w.rng(); const kind=w.night>5&&roll>.76?'hollow':w.night>2&&roll>.55?'skimmer':'drifter';
 w.enemies.push({id:w.night+':'+w.remaining,kind,angle:w.rng()*TAU,radius:370,hp:kind==='hollow'?3:1,speed:((kind==='skimmer'?32:kind==='hollow'?13:19)+w.night*1.15)*DIFF[w.difficulty].speed,flash:0,dead:false,trail:[]});
}
export function updateTrail(w,e,dt){
 e.trail=(e.trail||[]).map(p=>({...p,life:p.life-dt})).filter(p=>p.life>0);
 if(!inBeam(w,e))return;
 const last=e.trailAnchor;
 const distance=last?Math.hypot(Math.cos(e.angle)*e.radius-Math.cos(last.angle)*last.radius,Math.sin(e.angle)*e.radius-Math.sin(last.angle)*last.radius):Infinity;
 if(distance>=TRAIL_SPACING){const p={angle:e.angle,radius:e.radius,life:TRAIL_LIFE};e.trail.push(p);e.trailAnchor={angle:e.angle,radius:e.radius};if(e.trail.length>TRAIL_LIMIT)e.trail.shift();}
}
export function updateEnemies(w,dt) {
 for(const e of w.enemies) {
  if(e.dead) continue;
  e.radius-=e.speed*dt; e.flash=Math.max(0,e.flash-dt);
  if(e.kind==='skimmer') e.angle+=Math.sin(w.time*2+e.speed)*dt*.12;
  if(e.kind==='boss'&&w.night===10)e.angle+=Math.sin(w.time)*dt*.08;
  updateTrail(w,e,dt);
  if(e.radius<45){const damage=e.kind==='boss'?2:1;e.dead=true;e.trail=[];const lost=Math.min(w.hp,damage);w.hp=Math.max(0,w.hp-damage);w.nightStats.leaks++;w.nightStats.hpLost+=lost;w.campaign.leaks++;w.combo=0;w.flash=e.kind==='boss'?.9:.5;if(w.hp<=0)w.mode='over';}
 }
 w.enemies=w.enemies.filter(e=>!e.dead);
}
