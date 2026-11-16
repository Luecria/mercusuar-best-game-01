export const upgrades=[
 {name:'FRESNEL LENS',text:'Widen the beam. Find more shadows.',costs:[57,113,170,226]},
 {name:'QUICKENED PULSE',text:'Faster opening bursts. Energy still needs time.',costs:[50,107,163,220]},
 {name:'RESERVE LANTERN',text:'Repair one light. Add one life.',costs:[70,125,182,238]}
];
export function upgradeCost(w,i){return upgrades[i]?.costs[w.levels[i]]??Infinity;}
export function buyUpgrade(w,i){if(w.mode!=='shop'||!upgrades[i]||w.levels[i]>=4||w.coins<upgradeCost(w,i))return false;w.coins-=upgradeCost(w,i);w.levels[i]++;if(i===0)w.width+=.15;if(i===1)w.fireDelay*=.80;if(i===2){w.maxHp++;w.hp=Math.min(w.maxHp,w.hp+1);}return true;}
export function buyRepair(w){if(w.mode!=='shop'||w.hp>=w.maxHp||w.coins<40)return false;w.coins-=40;w.hp++;w.campaign.repairs++;w.repairFlash=.6;return true;}
