import { createWorld,TAU } from './world.js';
import { beginNight,stepWorld } from './waves.js';
import { firePulse } from './beam.js';
import { spawnBoss } from './boss.js';
export function prepareShot(scene,seed){
 const w=createWorld(seed,'normal');beginNight(w);
 const regular=(i,angle,radius)=>({id:'shot'+i,kind:'hollow',angle,radius,hp:3,speed:20,flash:0,dead:false,trail:[]});
 if(scene==='boss'){
  w.night=5;beginNight(w);w.remaining=0;w.angle=-.45;w.width=.86;w.time=18;w.nightTime=18;w.score=5200;
  const boss=spawnBoss(w);boss.angle=w.angle;boss.radius=205;
  w.enemies.push(regular(0,w.angle-.27,250),regular(1,w.angle+.27,285));
  for(const e of w.enemies){e.trail=[0,1,2,3].map(i=>({angle:e.angle,radius:e.radius+18+i*16,life:2.4-i*.4}));e.trailAnchor={angle:e.angle,radius:e.radius+18};}
  firePulse(w);for(let i=0;i<19;i++)stepWorld(w,1/60);
 }else if(scene==='play'){
  w.night=7;w.coins=128;w.score=6840;w.kills=44;w.nightTime=19;w.time=19;w.remaining=5;w.angle=-.45;w.width=.94;
  w.enemies=Array.from({length:12},(_,i)=>regular(i,i<4?-.75+i*.2:w.rng()*TAU,140+w.rng()*185));
  firePulse(w);for(let i=0;i<19;i++)stepWorld(w,1/60);
 }else{
  w.enemies=Array.from({length:10},(_,i)=>regular(i,-.7+i*.57,210+w.rng()*100));
  w.mode=scene==='shop'?'shop':scene==='victory'?'victory':scene==='over'?'over':'start';
  if(w.mode==='shop'){w.night=4;w.coins=185;w.score=4280;w.levels=[2,1,1];w.width=.86;w.fireDelay=.44*.8;w.hp=2;w.maxHp=3;w.nightStats={leaks:2,kills:12,hpLost:1,embers:131};}
  if(w.mode==='victory'){w.night=10;w.score=29420;w.kills=192;w.enemies=[];w.campaign={leaks:3,kills:192,nightsNoLeak:7,repairs:3};}
  if(w.mode==='over'){w.night=6;w.hp=0;w.score=8320;w.kills=61;w.campaign={leaks:6,kills:61,nightsNoLeak:2,repairs:1};}
 }
 return w;
}
