import type { GameSettings } from './types';

export class AudioManager {
  private ctx?: AudioContext;
  constructor(private settings: GameSettings) {}
  update(settings: GameSettings){ this.settings = settings; }
  private ensure(){ if(!this.ctx) this.ctx = new AudioContext(); return this.ctx; }
  tone(freq:number, dur=0.08, type:OscillatorType='sine'){
    if(!this.settings.sound) return;
    const ac=this.ensure(), osc=ac.createOscillator(), gain=ac.createGain();
    osc.type=type; osc.frequency.value=freq; gain.gain.value=.055;
    gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime+dur);
    osc.connect(gain); gain.connect(ac.destination); osc.start(); osc.stop(ac.currentTime+dur);
  }
  pop(){ this.tone(640,.07,'triangle'); }
  success(){ this.tone(820,.08,'triangle'); setTimeout(()=>this.tone(1040,.1,'sine'),70); }
  fail(){ this.tone(180,.14,'sawtooth'); }
}
