export const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
export function choice<T>(arr:T[]):T { return arr[Math.floor(Math.random()*arr.length)]; }
export function todayKey(){ return new Date().toISOString().slice(0,10); }
export function uid(){ return Math.floor(Math.random()*1e9); }
export function easeOutBack(t:number){ const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
