import assert from 'node:assert/strict';
import {createWorld,DIFF} from '../game/src/world.js';
import {firePulse,inBeam,updatePulses} from '../game/src/beam.js';
import {beginNight,stepWorld,stepPresentation} from '../game/src/waves.js';
import {buyUpgrade,buyRepair,upgradeCost,upgrades} from '../game/src/upgrades.js';
import {spawnBoss} from '../game/src/boss.js';
import {spawnEnemy,updateEnemies,updateTrail} from '../game/src/enemies.js';
import {journalLine,keeperTitle} from '../game/src/journal.js';
import {damageLevel} from '../game/src/ocean.js';
import {applyAction} from '../game/src/actions.js';
import {prepareShot} from '../game/src/shots.js';
import {campaign} from './campaign.mjs';
const dt=1/60;
function world(night=1,difficulty='normal'){const w=createWorld(23,difficulty);w.night=night;beginNight(w);w.remaining=0;w.angle=0;return w;}
const enemy=(angle=0)=>({id:'test',kind:'drifter',angle,radius:100,hp:1,speed:0,flash:0,dead:false,trail:[]});
for(const difficulty of Object.keys(DIFF)){
 const d=DIFF[difficulty],w=world(3,difficulty);assert.equal(w.hp,d.hp);assert.equal(w.maxHp,d.hp);beginNight(w);assert.equal(w.remaining,d.count+6);w.rng=()=>0;spawnEnemy(w);assert.equal(w.enemies[0].speed,(19+3*1.15)*d.speed);
 w.enemies=[];w.remaining=0;stepWorld(w,dt);assert.equal(w.coins,d.clearBonus);
 for(const night of [5,10]){const b=world(night,difficulty);spawnBoss(b);assert.equal(b.enemies[0].speed,9+night*.6);assert.equal(b.enemies[0].hp,d.bossHp[night===10?1:0]);}
}
for(const n of [1,4,5,6,9,10]){
 const w=world(n);stepWorld(w,dt);assert.equal(w.bossSpawned,[5,10].includes(n));assert.equal(w.mode,[5,10].includes(n)?'play':'shop');
}
for(const n of [5,10]){
 for(const count of [0,3,4]){const w=world(n);w.enemies=Array.from({length:count},(_,i)=>({...enemy(),id:'e'+i}));stepWorld(w,dt);assert.equal(w.bossSpawned,count<=3);}
 const w=world(n);w.remaining=1;stepWorld(w,dt);assert.equal(w.bossSpawned,false);w.remaining=0;w.paused=true;stepWorld(w,dt);assert.equal(w.bossSpawned,false);w.paused=false;w.mode='shop';stepWorld(w,dt);assert.equal(w.bossSpawned,false);
 const clear=world(n);clear.enemies=Array.from({length:4},(_,i)=>({...enemy(),id:'e'+i}));firePulse(clear);for(let i=0;i<20;i++)stepWorld(clear,dt);assert.equal(clear.mode,'play');assert.equal(clear.enemies.filter(e=>e.kind==='boss').length,1);for(let i=0;i<30;i++)stepWorld(clear,dt);assert.equal(clear.enemies.filter(e=>e.kind==='boss').length,1);
 const dark=world(n);const boss=spawnBoss(dark);boss.angle=Math.PI;boss.radius=100;boss.trail=[{angle:0,radius:90,life:2}];const hp=boss.hp;firePulse(dark);for(let i=0;i<30;i++)updatePulses(dark,dt);assert.equal(boss.hp,hp);
 const impact=world(n);spawnBoss(impact).radius=44;updateEnemies(impact,dt);assert.equal(impact.hp,1);assert.equal(impact.enemies.length,0);assert.equal(impact.score,0);assert.equal(impact.coins,0);assert.equal(impact.campaign.leaks,1);
 const kill=world(n);const target=spawnBoss(kill);target.angle=0;target.radius=100;target.hp=1;firePulse(kill);for(let i=0;i<12;i++)updatePulses(kill,dt);assert.equal(kill.score,500);assert.equal(kill.coins,40);assert.equal(kill.sparks.length,30);assert.equal(kill.campaign.kills,1);assert.equal(target.trail.length,0);assert.equal(kill.message,n===5?'THE WARDEN FALLS':'THE TIDE BREAKS');
 const fatal=world(n);fatal.hp=1;spawnBoss(fatal).radius=44;stepWorld(fatal,dt);assert.equal(fatal.mode,'over');assert.equal(fatal.hp,0);
}
let w=world();w.mode='shop';w.coins=5000;const initial=w.coins;
for(let i=0;i<3;i++){for(let level=0;level<4;level++){assert.equal(upgradeCost(w,i),upgrades[i].costs[level]);assert.ok(buyUpgrade(w,i));}assert.equal(buyUpgrade(w,i),false);}
assert.equal(initial-w.coins,1721);assert.ok(Math.abs(w.width-1.16)<1e-10);assert.ok(Math.abs(w.fireDelay-.44*.8**4)<1e-10);assert.equal(buyRepair(w),false);w.hp=1;assert.ok(buyRepair(w));assert.equal(w.hp,2);assert.equal(w.repairFlash,.6);assert.equal(w.campaign.repairs,1);stepPresentation(w,.2);assert.ok(w.repairFlash<.6);w.coins=39;assert.equal(buyRepair(w),false);
for(const [hp,maxHp,expected] of [[3,3,0],[2,3,1],[2,4,2],[1,3,3]]){w=world();w.hp=hp;w.maxHp=maxHp;const before=[w.width,w.fireDelay,w.angle];assert.equal(damageLevel(w),expected);assert.deepEqual([w.width,w.fireDelay,w.angle],before);}
w=world();w.mode='shop';w.hp=2;w.coins=40;buyRepair(w);assert.equal(damageLevel(w),0);
w=createWorld(4);assert.equal(w.difficulty,'normal');w=applyAction(w,'mode:hard');assert.equal(w.difficulty,'hard');assert.equal(w.hp,2);w=applyAction(w,'start');assert.equal(w.mode,'play');w.mode='over';w=applyAction(w,'start');assert.equal(w.difficulty,'hard');
w=world();let e=enemy();updateTrail(w,e,0);assert.equal(e.trail.length,1);e.radius-=13;updateTrail(w,e,0);assert.equal(e.trail.length,1);e.radius--;updateTrail(w,e,0);assert.equal(e.trail.length,2);for(let i=0;i<15;i++){e.radius-=14;updateTrail(w,e,0);}assert.equal(e.trail.length,8);w.angle=Math.PI;updateTrail(w,e,2.6);assert.equal(e.trail.length,0);
w=world();e=enemy(Math.PI);e.trail=[{angle:0,radius:100,life:2}];w.enemies=[e];firePulse(w);for(let i=0;i<30;i++)stepWorld(w,dt);assert.equal(e.hp,1);e.radius=44;updateEnemies(w,dt);assert.equal(w.enemies.length,0);assert.equal(e.trail.length,0);
const stats={leaks:0,kills:25,hpLost:0,embers:0};assert.match(journalLine(stats,1,3),/every shadow/);assert.match(journalLine({...stats,leaks:3},1,3),/One light/);assert.match(journalLine({...stats,leaks:3},2,3),/Too many/);assert.match(journalLine({...stats,leaks:1},2,3),/Twenty/);assert.match(journalLine({...stats,leaks:1,kills:2},3,3),/whole again/);assert.match(journalLine({...stats,leaks:1,kills:2},2,3),/still have/);
for(const [c,title] of [[{leaks:0,repairs:9,kills:200},'THE UNBROKEN WATCH'],[{leaks:1,repairs:5,kills:200},'THE MENDING KEEPER'],[{leaks:1,repairs:0,kills:150},'THE RELENTLESS LIGHT'],[{leaks:1,repairs:0,kills:1},'THE LAST LIGHT KEEPER']]){const copy=JSON.stringify(c);assert.equal(keeperTitle(c),title);assert.equal(keeperTitle(c),title);assert.equal(JSON.stringify(c),copy);}
w=world();stepWorld(w,dt);assert.equal(w.campaign.nightsNoLeak,1);stepWorld(w,dt);assert.equal(w.campaign.nightsNoLeak,1);w.nightStats.kills=7;beginNight(w);assert.deepEqual(w.nightStats,{leaks:0,kills:0,hpLost:0,embers:0});
for(const scene of ['start','play','shop','victory','over','boss']){assert.equal(JSON.stringify(prepareShot(scene,7)),JSON.stringify(prepareShot(scene,7)));}
const shot=prepareShot('boss',42);assert.ok(shot.enemies.some(e=>e.kind==='boss'&&inBeam(shot,e)&&e.trail.length));assert.ok(shot.enemies.filter(e=>e.kind!=='boss'&&!e.dead&&inBeam(shot,e)).length>=2);assert.ok(shot.pulses.length);assert.equal(keeperTitle(prepareShot('victory',42).campaign),'THE RELENTLESS LIGHT');assert.match(journalLine(prepareShot('shop',42).nightStats,2,3),/still have/);
const burst=[];for(const level of [0,4]){w=world();w.remaining=999;w.spawn=999;w.fireDelay=.44*.8**level;const times=[];for(let frame=0;frame<180;frame++){if(firePulse(w))times.push(frame/60);stepWorld(w,dt);}burst.push({level,firstSecond:times.filter(t=>t<1).length,fifth:times[4]});}assert.equal(burst[0].firstSecond,3);assert.equal(burst[1].firstSecond,6);assert.ok(burst[1].fifth<burst[0].fifth);
const bossTimes=[];for(const difficulty of Object.keys(DIFF))for(const night of [5,10])for(const level of [0,4]){w=world(night,difficulty);const b=spawnBoss(w);w.fireDelay=.44*.8**level;let frames=0;while(w.mode==='play'&&frames<4000){w.angle=b.angle;firePulse(w);stepWorld(w,dt);frames++;}assert.equal(w.kills,1);bossTimes.push({difficulty,night,level,seconds:frames/60});}
// Upper bound includes every regular kill and the first boss, regardless of buying order.
const totalCost=upgrades.flatMap(u=>u.costs).reduce((a,b)=>a+b,0);
for(const d of Object.values(DIFF)){let earned=0;for(let night=1;night<=8;night++){earned+=(d.count+2*night)*d.killEmbers+d.clearBonus+(night===5?40:0);assert.ok(earned<totalCost);}}
const trailRun=()=>{const w=world(5);const b=spawnBoss(w);b.angle=0;for(let i=0;i<120;i++)updateEnemies(w,dt);return JSON.stringify(b.trail);};assert.equal(trailRun(),trailRun());
const campaigns=[];for(const difficulty of Object.keys(DIFF))for(const controller of ['perfect','typical','none']){const result=campaign(difficulty,controller);campaigns.push(result);assert.ok(['over','victory'].includes(result.mode));if(controller==='none')assert.equal(result.mode,'over');else{assert.equal(result.mode,'victory');assert.ok(result.fullMaxNight===null||result.fullMaxNight>=9);assert.deepEqual(result.bosses,['boss5','boss10']);if(controller==='typical')assert.deepEqual([...result.levels].sort(),[3,4,4]);}}
const losses=campaigns.filter(r=>r.controller==='none');assert.ok(losses[2].seconds<losses[1].seconds&&losses[1].seconds<losses[0].seconds);
assert.deepEqual(campaign('normal','typical'),campaign('normal','typical'));
console.log(JSON.stringify({tests:'passed',burst,bossTimes,campaigns},null,2));
