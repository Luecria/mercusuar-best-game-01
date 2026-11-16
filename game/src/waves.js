import { spawnEnemy,updateEnemies } from './enemies.js';
import { updatePulses } from './beam.js';
export function beginNight(w) { w.mode='play'; w.remaining=6+w.night*2; w.spawn=1; w.nightTime=0; w.energy=100; w.pulses=[]; }
export function stepWorld(w,dt) {
 if(w.paused || w.mode!=='play')return;
 w.time+=dt;w.nightTime+=dt;w.cooldown=Math.max(0,w.cooldown-dt);w.energy=Math.min(100,w.energy+25*dt);w.flash=Math.max(0,w.flash-dt);
 w.comboTime-=dt;if(w.comboTime<=0)w.combo=0;
 w.spawn-=dt;
 if(w.remaining>0&&w.spawn<=0){spawnEnemy(w);w.remaining--;w.spawn=Math.max(.65,2.1-w.night*.1);}
 updatePulses(w,dt);updateEnemies(w,dt);
 for(const s of w.sparks){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;}
 w.sparks=w.sparks.filter(s=>s.life>0);
 if(w.mode==='play'&&w.remaining===0&&w.enemies.length===0){w.score+=w.hp*150;w.coins+=35;w.mode=w.night===10?'victory':'shop';}
}
