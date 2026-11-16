import { createWorld } from './world.js';
import { beginNight,stepWorld } from './waves.js';
import { firePulse } from './beam.js';
import { buyUpgrade } from './upgrades.js';
import { drawOcean,CENTER } from './ocean.js';
import { drawHud,buttons } from './hud.js';
import { LighthouseAudio } from './audio.js';
import { prepareShot } from './shots.js';
const canvas=document.querySelector('canvas'),c=canvas.getContext('2d');
const params=new URLSearchParams(location.search),shot=params.get('shot'),seed=Number(params.get('seed')||42);
let w=shot?prepareShot(shot,seed):prepareShot('start',seed),held=false,previous=0,accumulator=0;
const audio=new LighthouseAudio(),keys=new Set();
function draw(){drawOcean(c,w);drawHud(c,w);document.querySelector('#status').textContent=`${w.mode}, night ${w.night}, ${w.hp} lights, ${w.score} points`;}
function action(a){audio.unlock();if(a==='start'){w=createWorld(seed);beginNight(w);}else if(a==='next'){w.night++;beginNight(w);}else if(a.startsWith('buy')){if(buyUpgrade(w,Number(a.slice(3))))audio.play('buy');}draw();}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};}
canvas.addEventListener('pointermove',e=>{if(shot)return;const p=point(e);w.angle=Math.atan2(p.y-CENTER.y,p.x-CENTER.x);});
canvas.addEventListener('pointerdown',e=>{if(shot)return;const p=point(e),b=buttons.find(b=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h);if(b){if(!b.disabled)action(b.action);return;}audio.unlock();held=true;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointerup',()=>held=false);canvas.addEventListener('pointercancel',()=>held=false);
// Space can be the first interaction too: browsers require a gesture to enable audio.
canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('keydown',e=>{if(!shot&&e.code==='Space')audio.unlock();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&w.mode==='play'){w.paused=true;held=false;keys.clear();}});
window.addEventListener('keydown',e=>{if(shot)return;if(['Space','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='KeyP'&&w.mode==='play')w.paused=!w.paused;if(e.code==='KeyM')audio.muted=!audio.muted;if(e.code==='Enter'&&['start','over','victory'].includes(w.mode))action('start');if(e.code==='Enter'&&w.mode==='shop')action('next');if(w.mode==='shop'&&/^Digit[123]$/.test(e.code))action('buy'+(Number(e.code.slice(-1))-1));});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{held=false;keys.clear();if(w.mode==='play')w.paused=true;});
function frame(ms){if(!previous)previous=ms;accumulator+=Math.min(.1,(ms-previous)/1000);previous=ms;while(accumulator>=1/60){if(!w.paused){if(keys.has('ArrowLeft'))w.angle-=.045;if(keys.has('ArrowRight'))w.angle+=.045;if((held||keys.has('Space'))&&firePulse(w))audio.play('pulse');}const hp=w.hp;stepWorld(w,1/60);if(w.hp<hp)audio.play('hurt');accumulator-=1/60;}draw();requestAnimationFrame(frame);}
draw();if(shot){window.__shotReady=true;}else requestAnimationFrame(frame);
