import { TAU } from './world.js';
export function spawnEnemy(w) {
 const roll=w.rng(); const kind=w.night>5&&roll>.76?'hollow':w.night>2&&roll>.55?'skimmer':'drifter';
 w.enemies.push({id:w.night+':'+w.remaining,kind,angle:w.rng()*TAU,radius:370,hp:kind==='hollow'?3:1,speed:(kind==='skimmer'?32:kind==='hollow'?13:19)+w.night*1.15,flash:0,dead:false});
}
export function updateEnemies(w,dt) {
 for(const e of w.enemies) {
  if(e.dead) continue;
  e.radius-=e.speed*dt; e.flash=Math.max(0,e.flash-dt);
  if(e.kind==='skimmer') e.angle+=Math.sin(w.time*2+e.speed)*dt*.12;
  if(e.radius<45) {e.dead=true;w.hp--;w.combo=0;w.flash=.5; if(w.hp<=0)w.mode='over';}
 }
 w.enemies=w.enemies.filter(e=>!e.dead);
}
