export const upgrades=[{name:'FRESNEL LENS',text:'Widen the beam. Find more shadows.',base:45},{name:'QUICKENED PULSE',text:'Fire faster. Hold back the tide.',base:40},{name:'RESERVE LANTERN',text:'Repair one light. Add one life.',base:55}];
export function upgradeCost(w,i){return upgrades[i].base+w.levels[i]*30;}
export function buyUpgrade(w,i){if(w.mode!=='shop'||w.levels[i]>=3||w.coins<upgradeCost(w,i))return false;w.coins-=upgradeCost(w,i);w.levels[i]++;if(i===0)w.width+=.19;if(i===1)w.fireDelay*=.77;if(i===2){w.maxHp++;w.hp=Math.min(w.maxHp,w.hp+1);}return true;}
