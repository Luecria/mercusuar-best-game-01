import {createWorld} from '../game/src/world.js';
import {beginNight,stepWorld} from '../game/src/waves.js';
import {firePulse,inBeam} from '../game/src/beam.js';
import {buyUpgrade,buyRepair,upgradeCost} from '../game/src/upgrades.js';
export function campaign(difficulty,controller,seed=23){
 const w=createWorld(seed,difficulty);beginNight(w);let frames=0,fullMaxNight=null;const shops=[],bosses=[];let target=null;
 while(!['over','victory'].includes(w.mode)&&frames<60000){
  if(w.mode==='shop'){
   let purchases=0;
   if(controller==='typical'){while(w.hp<w.maxHp&&purchases<2&&buyRepair(w))purchases++;}
   else if(w.hp<=1)buyRepair(w);
   while(purchases<(controller==='typical'?2:12)){
    const order=[0,1,2].sort((a,b)=>upgradeCost(w,a)-upgradeCost(w,b));const i=order.find(i=>w.coins>=upgradeCost(w,i));if(i===undefined||!buyUpgrade(w,i))break;purchases++;
   }
   if(w.levels.every(v=>v===4)&&fullMaxNight===null)fullMaxNight=w.night;
   shops.push({night:w.night,levels:[...w.levels],coins:w.coins,hp:w.hp,repairs:w.campaign.repairs});w.night++;beginNight(w);target=null;
  }
  const boss=w.enemies.find(e=>e.kind==='boss');if(boss&&!bosses.includes(boss.id))bosses.push(boss.id);
  if(controller!=='none'){
   if(controller==='perfect'||frames%15===0){target=[...w.enemies].sort((a,b)=>a.radius-b.radius)[0];if(target)w.angle=target.angle;}
   if(controller==='perfect'?w.enemies.length>0:target&&!target.dead&&inBeam(w,target))firePulse(w);
  }
  stepWorld(w,1/60);frames++;
 }
 return {difficulty,controller,seed,mode:w.mode,night:w.night,seconds:frames/60,kills:w.kills,leaks:w.campaign.leaks,repairs:w.campaign.repairs,levels:w.levels,coins:w.coins,fullMaxNight,bosses,shops};
}
if(import.meta.url===new URL(process.argv[1],'file:').href){for(const d of ['easy','normal','hard'])for(const c of ['perfect','typical','none'])console.log(JSON.stringify(campaign(d,c)));}
