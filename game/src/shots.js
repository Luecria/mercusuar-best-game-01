import { createWorld,TAU } from './world.js';
import { beginNight,stepWorld } from './waves.js';
import { firePulse } from './beam.js';
export function prepareShot(scene,seed){
 const w=createWorld(seed);beginNight(w);
 // These are seeded game states rendered by the same gameplay renderer.
 if(scene==='play'){
  w.night=7;w.coins=128;w.score=6840;w.kills=44;w.nightTime=19;w.time=19;w.remaining=5;w.angle=-.45;w.width=.94;
  w.enemies=Array.from({length:12},(_,i)=>({id:'shot'+i,kind:i%4===0?'hollow':i%3===0?'skimmer':'drifter',angle:i<4?-.75+i*.2:w.rng()*TAU,radius:140+w.rng()*185,hp:i%4===0?3:1,speed:20,flash:0,dead:false}));
  firePulse(w);for(let i=0;i<19;i++)stepWorld(w,1/60);
 }else{
  w.enemies=Array.from({length:10},(_,i)=>({id:'scene'+i,kind:i%3===0?'hollow':'drifter',angle:-.7+i*.57,radius:210+w.rng()*100,hp:1,speed:20,flash:0,dead:false}));
  w.mode=scene==='shop'?'shop':scene==='victory'?'victory':scene==='over'?'over':'start';
  if(w.mode==='shop'){w.night=4;w.coins=185;w.score=4280;w.levels=[1,1,0];}
  if(w.mode==='victory'){w.night=10;w.score=26420;w.kills=170;w.enemies=[];}
  if(w.mode==='over'){w.night=6;w.hp=0;w.score=8320;w.kills=61;}
 }
 return w;
}
