import type { Button } from './types';

export class UIManager {
  buttons: Button[] = [];
  clear(){ this.buttons = []; }
  add(id:string,label:string,x:number,y:number,w:number,h:number,tag?:string,enabled=true){ this.buttons.push({id,label,x,y,w,h,tag,enabled}); }
  hit(x:number,y:number){ return this.buttons.find(b => b.enabled!==false && x>=b.x && x<=b.x+b.w && y>=b.y && y<=b.y+b.h) || null; }
}
