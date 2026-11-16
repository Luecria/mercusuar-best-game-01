import {createWorld,DIFF} from './world.js';
import {beginNight} from './waves.js';
import {buyRepair,buyUpgrade} from './upgrades.js';
export function applyAction(w,action){
 if(action.startsWith('mode:')&&w.mode==='start'){const difficulty=action.slice(5);return DIFF[difficulty]?createWorld(w.seed,difficulty):w;}
 if(action==='start'&&['start','over','victory'].includes(w.mode)){const next=createWorld(w.seed,w.difficulty);beginNight(next);return next;}
 if(action==='next'&&w.mode==='shop'){w.night++;beginNight(w);}
 if(action==='repair')buyRepair(w);
 if(action.startsWith('buy'))buyUpgrade(w,Number(action.slice(3)));
 return w;
}
