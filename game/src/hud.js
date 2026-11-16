import { upgrades,upgradeCost } from './upgrades.js';
import { journalLine,keeperTitle } from './journal.js';
export let buttons=[];
function text(c,s,x,y,size=16,color='#e6e3cf',font='monospace'){c.fillStyle=color;c.font=`${size}px ${font}`;c.fillText(s,x,y);}
function button(c,label,x,y,width,action,disabled=false,selected=false){c.fillStyle=selected?'#fff0bf':disabled?'#183139':'#e6c67f';c.fillRect(x,y,width,46);text(c,label,x+18,y+29,15,disabled?'#738b8b':'#122832');buttons.push({x,y,w:width,h:46,action,disabled});}
export function drawHud(c,w){buttons=[];
 text(c,'MERCUSUAR',48,62,21,'#eacb87');text(c,'THE LAST LIGHT',48,84,10,'#819b9e');
 text(c,`NIGHT ${String(w.night).padStart(2,'0')} / 10 - ${w.difficulty.toUpperCase()}`,380,60,15);text(c,`LIGHT ${'●'.repeat(Math.max(0,w.hp))}${'○'.repeat(Math.max(0,w.maxHp-w.hp))}`,700,60,16,'#eacb87');text(c,`${String(w.score).padStart(6,'0')}  PTS`,1030,60,18);
 if(w.mode==='play'){
 text(c,'PULSE',48,133,12,'#91a5a4');c.fillStyle='#18343c';c.fillRect(48,145,180,8);c.fillStyle='#f0cd7c';c.fillRect(48,145,180*w.energy/100,8);
 text(c,`${Math.floor(w.energy)}%  ·  RECHARGING`,48,175,11);text(c,`SHADOWS ${w.remaining+w.enemies.length}`,48,218,13);text(c,`${Math.floor(w.nightTime)}s  ·  ${w.coins} EMBERS`,48,244,12,'#a5b5b0');
 text(c,'Only light can wound them.',48,588,16,'#e9d39a','Georgia');text(c,'AIM mouse   FIRE hold click / Space',48,622,12);text(c,'P pause   M sound   ← → aim',48,645,12,'#8ca6a7');if(w.combo>1)text(c,`${w.combo} CHAIN`,1020,600,24,'#eacb87');
 }
 if(w.mode==='start'){
 const shade=c.createLinearGradient(20,0,640,0);shade.addColorStop(0,'rgba(3,14,23,.97)');shade.addColorStop(1,'rgba(3,14,23,0)');c.fillStyle=shade;c.fillRect(24,100,630,530);
 text(c,'A BEACON AGAINST THE ABYSS',58,190,12,'#b9ae83');text(c,'MERCUSUAR',54,258,58,'#f3e2b5','Georgia');text(c,'The Last Light',58,300,30,'#d0b77d','Georgia');
 text(c,'Ten nights. One lighthouse. Your watch.',58,350,16);text(c,'Reveal shadows with your beam.',58,389,15,'#9cb5b5');text(c,'Pulse to destroy them before they reach you.',58,414,14,'#9cb5b5');text(c,'Earn embers. Upgrade. Survive until dawn.',58,439,14,'#9cb5b5');
 ['easy','normal','hard'].forEach((d,i)=>button(c,(w.difficulty===d?'● ':'')+d.toUpperCase(),58+i*142,460,132,'mode:'+d,false,w.difficulty===d));
 button(c,'BEGIN THE WATCH  →',58,520,270,'start');text(c,'1 / 2 / 3 mode  ·  MOUSE aim  ·  HOLD CLICK fire',58,594,11,'#b4c6c3');text(c,'HEADPHONES RECOMMENDED  /  ORIGINAL PROCEDURAL AUDIO',58,617,10,'#6f9197');
 }
 if(w.mode==='shop'){
 c.fillStyle='rgba(3,15,23,.92)';c.fillRect(110,150,1060,455);text(c,`NIGHT ${w.night} SURVIVED`,148,199,14,'#eacb87');text(c,'Tend the light.',148,245,40,'#eee2bc','Georgia');text(c,`${w.coins} EMBERS AVAILABLE`,865,201,16,'#eacb87');
 c.fillStyle='#b9ae83';c.font='italic 14px Georgia';c.fillText(journalLine(w.nightStats,w.hp,w.maxHp),148,267);
 upgrades.forEach((u,i)=>{const x=148+i*325;c.strokeStyle='#35545a';c.strokeRect(x,277,304,197);text(c,'0'+(i+1)+' / LEVEL '+w.levels[i]+'/4',x+18,305,11,'#8aa4a5');text(c,u.name,x+18,340,17,'#e6d19b');text(c,u.text.split('. ')[0]+'.',x+18,369,12);text(c,u.text.split('. ')[1]||'',x+18,389,12);const max=w.levels[i]>=4;button(c,max?'FULLY UPGRADED':`BUY  ·  ${upgradeCost(w,i)} EMBERS`,x+18,411,268,'buy'+i,max||w.coins<upgradeCost(w,i));});
 button(c,'4  REPAIR ONE LIGHT · 40',148,490,340,'repair',w.hp>=w.maxHp||w.coins<40);button(c,'NEXT NIGHT  →',825,520,258,'next');text(c,'Choose your edge. Unspent embers carry over.',148,565,13,'#a8b7b3');
 }
 if(w.mode==='over'||w.mode==='victory'){
 c.fillStyle='rgba(3,15,23,.91)';c.fillRect(180,170,920,410);const win=w.mode==='victory';text(c,win?'ALL TEN NIGHTS SURVIVED':'THE WATCH HAS ENDED',230,217,14,'#d8bd80');text(c,win?'Dawn remembers you.':'The last light fades.',230,281,48,'#f3e2b5','Georgia');text(c,keeperTitle(w.campaign),230,310,14,'#d8bd80');text(c,win?'You held the darkness back. The coast lives on.':'Every ember was a promise. Take the watch again.',230,345,17,'#a9bdb9');text(c,`${w.score} POINTS     ${w.kills} SHADOWS     NIGHT ${w.night}/10 · ${w.difficulty.toUpperCase()}`,230,390,16,'#ebcf8d');button(c,'TAKE THE WATCH AGAIN  ↻',230,440,360,'start');
 }
 const boss=w.enemies.find(e=>e.kind==='boss'&&!e.dead);
 if(boss&&w.mode==='play'){text(c,boss.name,480,105,16,'#f0bb7b');c.fillStyle='#402f35';c.fillRect(480,118,420,9);c.fillStyle='#d9a15f';c.fillRect(480,118,420*Math.max(0,boss.hp)/boss.maxHp,9);text(c,`${boss.hp} / ${boss.maxHp}`,915,127,12,'#eccb91');}
 if(w.messageTime>0)text(c,w.message,470,650,14,'#f0bb7b');
 if(w.paused){c.fillStyle='rgba(2,10,18,.86)';c.fillRect(350,270,580,160);text(c,'WATCH PAUSED',425,326,30,'#eacb87');text(c,'Press P to return to the light',425,376,16);}
}
