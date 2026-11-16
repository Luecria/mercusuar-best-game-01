import { random,TAU } from './world.js';
import { inBeam } from './beam.js';
export const CENTER={x:720,y:366};
const stars=Array.from({length:150},(_,i)=>{const r=random(i*917+3);return [r()*1280,r()*720,r()];});
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
export function drawOcean(c,w) {
 const {x,y}=CENTER;c.fillStyle='#06151e';c.fillRect(0,0,1280,720);
 const sea=c.createRadialGradient(x,y,30,x,y,650);sea.addColorStop(0,'#17424a');sea.addColorStop(.55,'#09242e');sea.addColorStop(1,'#030d16');c.fillStyle=sea;c.fillRect(0,0,1280,720);
 for(const [sx,sy,s]of stars){c.strokeStyle=`rgba(94,166,172,${.07+s*.12})`;c.lineWidth=1;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+12,sy-4+Math.sin(w.time+s*5),sx+25+s*15,sy);c.stroke();}
 c.save();c.translate(x,y);c.strokeStyle='#38656b';c.globalAlpha=.28;c.setLineDash([3,12]);
 for(const r of [110,210,310]){c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();}
 c.setLineDash([]);c.restore();
 // The beam and its reflection share one physical cone.
 c.save();c.translate(x,y);c.rotate(w.angle);
 const light=c.createRadialGradient(0,0,15,0,0,460);light.addColorStop(0,'rgba(255,242,169,.72)');light.addColorStop(.38,'rgba(249,219,116,.19)');light.addColorStop(1,'rgba(249,219,116,0)');
 c.fillStyle=light;c.beginPath();c.moveTo(0,0);c.arc(0,0,480,-w.width/2,w.width/2);c.closePath();c.fill();
 c.strokeStyle='rgba(255,225,137,.24)';for(const a of [-w.width/2,w.width/2]){c.beginPath();c.moveTo(25,0);c.lineTo(Math.cos(a)*440,Math.sin(a)*440);c.stroke();}c.restore();
 for(const e of w.enemies){const ex=x+Math.cos(e.angle)*e.radius,ey=y+Math.sin(e.angle)*e.radius;const visible=inBeam(w,e);c.save();c.translate(ex,ey);c.rotate(e.angle+Math.PI/2);
 if(visible){c.shadowBlur=18;c.shadowColor='#70e7dd';c.fillStyle=e.flash>0?'#fff8dc':e.kind==='hollow'?'#546d7c':'#183e4c';c.strokeStyle=e.kind==='hollow'?'#dea673':'#8cdbce';c.lineWidth=2;c.beginPath();const size=e.kind==='hollow'?22:14;c.moveTo(0,-size);c.bezierCurveTo(-size*1.4,-8,-size,14,-8,25);c.lineTo(0,16);c.lineTo(8,25);c.bezierCurveTo(size,14,size*1.4,-8,0,-size);c.fill();c.stroke();if(e.kind==='hollow'){c.strokeStyle='#f4c47b';for(let i=0;i<e.hp;i++){c.beginPath();c.moveTo(-12+i*9,-28);c.lineTo(-6+i*9,-28);c.stroke();}}}
 circle(c,-5,-2,2,visible?'#fff4bc':'#577d82');circle(c,5,-2,2,visible?'#fff4bc':'#577d82');c.restore();}
 for(const p of w.pulses){c.save();c.translate(x,y);c.strokeStyle=`rgba(255,240,175,${p.life})`;c.lineWidth=4;c.shadowBlur=20;c.shadowColor='#ffe5a0';c.beginPath();c.arc(0,0,p.radius,p.angle-p.width/2,p.angle+p.width/2);c.stroke();c.restore();}
 for(const s of w.sparks){circle(c,x+Math.cos(s.angle)*s.radius+s.x,y+Math.sin(s.angle)*s.radius+s.y,2*s.life,'#ffe6a0');}
 // Hand-built islet silhouette and a raised, striped lighthouse.
 c.save();c.translate(x,y);c.fillStyle='#08171c';c.beginPath();c.moveTo(-60,26);c.lineTo(-36,-18);c.lineTo(-9,-28);c.lineTo(27,-16);c.lineTo(54,22);c.lineTo(36,48);c.lineTo(-24,52);c.closePath();c.fill();c.strokeStyle='#54706a';c.lineWidth=2;c.stroke();
 c.fillStyle='#d1c9ac';c.beginPath();c.moveTo(-17,21);c.lineTo(-11,-58);c.lineTo(10,-58);c.lineTo(20,21);c.closePath();c.fill();c.fillStyle='#304d55';c.fillRect(-13,-33,26,13);c.fillRect(-16,-5,33,12);c.fillStyle='#152c37';c.fillRect(-7,8,12,16);c.fillStyle='#f3d087';c.fillRect(-13,-70,26,15);c.fillStyle='#182b36';c.fillRect(-19,-74,38,5);c.fillRect(-20,-54,40,5);c.beginPath();c.moveTo(-19,-76);c.lineTo(0,-90);c.lineTo(19,-76);c.fill();
 c.shadowBlur=35;c.shadowColor='#ffe9ac';circle(c,0,-62,7,'#fff1be');c.restore();
 c.strokeStyle='#75918c';c.lineWidth=1;c.strokeRect(22,22,1236,676);
 c.font='11px monospace';c.fillStyle='#789291';c.fillText('06° 12′ S  /  106° 49′ E',48,675);c.fillText('THE JAVA SEA     ·     KEEP THE LIGHT',925,675);
 if(w.flash>0){c.fillStyle=`rgba(255,100,80,${w.flash*.35})`;c.fillRect(0,0,1280,720);}
}
