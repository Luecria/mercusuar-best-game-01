import assert from 'node:assert/strict';
import {drawOcean} from '../game/src/ocean.js';
import {drawHud,buttons} from '../game/src/hud.js';
import {prepareShot} from '../game/src/shots.js';
const methods=['fillRect','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','save','restore','translate','rotate','setLineDash','closePath','fillText'];
let count=0;const c={};for(const k of methods)c[k]=(...args)=>{assert.ok(args.every(a=>typeof a!=='number'||Number.isFinite(a)),k);count++;};
c.createRadialGradient=c.createLinearGradient=()=>({addColorStop(){}});
for(const scene of ['start','play','shop','victory','over']){const w=prepareShot(scene,42);drawOcean(c,w);drawHud(c,w);if(scene!=='play')assert.ok(buttons.length>0);}
console.log('Canvas command smoke test passed:',count,'calls; no screenshots generated.');
