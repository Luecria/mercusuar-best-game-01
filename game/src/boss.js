import { DIFF,TAU } from './world.js';
export function spawnBoss(w){
 const last=w.night===10,hp=DIFF[w.difficulty].bossHp[last?1:0];
 const boss={id:'boss'+w.night,kind:'boss',name:last?'THE HOLLOW TIDE':'THE DROWNED WARDEN',angle:w.rng()*TAU,radius:370,hp,maxHp:hp,speed:9+w.night*.6,size:last?40:34,flash:0,dead:false,trail:[]};
 w.enemies.push(boss);w.bossSpawned=true;w.message=last?'THE HOLLOW TIDE RISES':'THE DROWNED WARDEN APPROACHES';w.messageTime=3;return boss;
}
export function bossDefeated(w){w.message=w.night===10?'THE TIDE BREAKS':'THE WARDEN FALLS';w.messageTime=3;}
