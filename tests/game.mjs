import assert from 'node:assert/strict';
import {createWorld} from '../game/src/world.js';
import {firePulse} from '../game/src/beam.js';
import {beginNight,stepWorld} from '../game/src/waves.js';
import {buyUpgrade} from '../game/src/upgrades.js';
import {prepareShot} from '../game/src/shots.js';
const enemy=(angle=0)=>({id:'test',kind:'drifter',angle,radius:100,hp:1,speed:0,flash:0,dead:false});
let w=createWorld();beginNight(w);w.angle=0;w.remaining=0;w.enemies=[enemy(Math.PI)];firePulse(w);for(let i=0;i<60;i++)stepWorld(w,1/60);assert.equal(w.kills,0,'darkness grants immunity');
w.enemies=[enemy()];firePulse(w);for(let i=0;i<30;i++)stepWorld(w,1/60);assert.equal(w.kills,1);assert.equal(w.mode,'shop');
w.coins=200;assert.ok(buyUpgrade(w,0));assert.ok(w.width>.56);assert.ok(buyUpgrade(w,1));assert.ok(w.fireDelay<.44);w.hp=1;assert.ok(buyUpgrade(w,2));assert.equal(w.hp,2);
w=createWorld();beginNight(w);w.remaining=0;w.hp=1;w.enemies=[{...enemy(),radius:44}];stepWorld(w,1/60);assert.equal(w.mode,'over');
w=createWorld();w.night=10;beginNight(w);w.remaining=0;stepWorld(w,1/60);assert.equal(w.mode,'victory');
for(const scene of ['start','play','shop','victory','over']){const a=prepareShot(scene,7),b=prepareShot(scene,7);assert.equal(JSON.stringify(a),JSON.stringify(b));}
// Full campaign with a simple nearest-threat controller, exercising real pulses and spawns.
w=createWorld(23);beginNight(w);let frames=0;
while(!['over','victory'].includes(w.mode)&&frames<60000){
 if(w.mode==='shop'){for(const i of [0,1,2])buyUpgrade(w,i);w.night++;beginNight(w);}
 const target=[...w.enemies].sort((a,b)=>a.radius-b.radius)[0];if(target){w.angle=target.angle;firePulse(w);}stepWorld(w,1/60);frames++;
}
assert.equal(w.mode,'victory','a steady aim can survive the campaign');console.log(JSON.stringify({tests:'passed',campaign:{mode:w.mode,night:w.night,kills:w.kills,hp:w.hp,seconds:frames/60}},null,2));
