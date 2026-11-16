import { spawnEnemy,updateEnemies } from './enemies.js';
import { updatePulses } from './beam.js';
import { DIFF,isBossNight } from './world.js';
import { spawnBoss } from './boss.js';
export function beginNight(w){w.mode='play';w.remaining=DIFF[w.difficulty].count+w.night*2;w.spawn=1;w.nightTime=0;w.energy=100;w.cooldown=0;w.pulses=[];w.bossSpawned=false;w.message='';w.messageTime=0;w.nightStats={leaks:0,kills:0,hpLost:0,embers:0};}
export function stepPresentation(w,dt){if(w.paused)return;w.repairFlash=Math.max(0,w.repairFlash-dt);if(w.mode!=='play')w.messageTime=Math.max(0,w.messageTime-dt);}
export function stepWorld(w,dt) {
 if(w.paused || w.mode!=='play')return;
 if(isBossNight(w)&&!w.bossSpawned&&w.remaining===0&&w.enemies.length<=3)spawnBoss(w);
 w.time+=dt;w.nightTime+=dt;w.messageTime=Math.max(0,w.messageTime-dt);w.cooldown=Math.max(0,w.cooldown-dt);w.energy=Math.min(100,w.energy+25*dt);w.flash=Math.max(0,w.flash-dt);
 w.comboTime-=dt;if(w.comboTime<=0)w.combo=0;
 w.spawn-=dt;
 if(w.remaining>0&&w.spawn<=0){spawnEnemy(w);w.remaining--;w.spawn=Math.max(.65,2.1-w.night*.1);}
 updatePulses(w,dt);updateEnemies(w,dt);
 for(const s of w.sparks){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;}
 w.sparks=w.sparks.filter(s=>s.life>0);
 // Kills and leaks accumulate at their events, including the final losing night.
 if(w.mode==='play'&&w.remaining===0&&w.enemies.length===0&&(!isBossNight(w)||w.bossSpawned)){
  w.score+=w.hp*150;const bonus=DIFF[w.difficulty].clearBonus;w.coins+=bonus;w.nightStats.embers+=bonus;if(w.nightStats.leaks===0)w.campaign.nightsNoLeak++;w.mode=w.night===10?'victory':'shop';
 }
}
