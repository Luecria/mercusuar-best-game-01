export class LighthouseAudio {
 constructor(){this.context=null;this.muted=false;}
 unlock(){if(!this.context){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(Audio)this.context=new Audio();}this.context?.resume();}
 play(type){if(!this.context||this.muted)return;const c=this.context,o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type==='hurt'?'sawtooth':'sine';o.frequency.setValueAtTime(type==='pulse'?420:type==='hurt'?100:660,t);o.frequency.exponentialRampToValueAtTime(type==='hurt'?35:120,t+.24);g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.36);}
}
