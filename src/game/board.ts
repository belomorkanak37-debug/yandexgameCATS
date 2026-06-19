import type { BasicItemType, BoardLayout, Item } from './types';
import { BOARD_SIZE } from './config';
import { createItem, randomItem } from './items';

export class Board {
  grid: Item[][] = [];
  activeItems: BasicItemType[] = ['coffee','tea','milk'];
  specialChance = 0.012;
  constructor(){ this.reset(this.activeItems); }
  reset(activeItems: BasicItemType[], magnetLevel=0){
    this.activeItems = activeItems;
    this.specialChance = 0.012 + magnetLevel * 0.003;
    this.grid=[];
    for(let y=0;y<BOARD_SIZE;y++){ this.grid[y]=[]; for(let x=0;x<BOARD_SIZE;x++) this.grid[y][x]=randomItem(activeItems,x,y,this.specialChance); }
  }
  update(dt:number){
    for(const row of this.grid) for(const it of row){ it.animationTime += dt; it.x += (it.targetX-it.x)*Math.min(1,dt*12); it.y += (it.targetY-it.y)*Math.min(1,dt*12); it.scale += ((it.selected?1.13:1)-it.scale)*Math.min(1,dt*14); it.falling = Math.abs(it.y-it.targetY)>.02; }
  }
  cellAt(px:number,py:number,layout:BoardLayout): Item | null {
    const x=Math.floor((px-layout.x)/layout.cell), y=Math.floor((py-layout.y)/layout.cell);
    return x>=0&&x<BOARD_SIZE&&y>=0&&y<BOARD_SIZE?this.grid[y][x]:null;
  }
  areNeighbors(a:Item,b:Item){ return Math.abs(a.gridX-b.gridX)<=1 && Math.abs(a.gridY-b.gridY)<=1 && a.id!==b.id; }
  canChain(a:Item,b:Item){ return this.areNeighbors(a,b) && (a.type===b.type || a.type==='goldenFish' || b.type==='goldenFish'); }
  clearSelection(){ for(const row of this.grid) for(const it of row){ it.selected=false; it.state='idle'; } }
  removeChain(chain:Item[]): {type:string,count:number,createdSpecial?:Item} {
    if(chain.length<3) return {type:'', count:0};
    const primary = chain.find(i=>i.type!=='goldenFish')?.type || chain[0].type;
    for(const it of chain) this.grid[it.gridY][it.gridX] = null as any;
    let createdSpecial: Item|undefined;
    if(chain.length>=6){ const base=chain[Math.floor(chain.length/2)]; createdSpecial=createItem('sugarBomb',base.gridX,base.gridY); this.grid[base.gridY][base.gridX]=createdSpecial; }
    this.collapse();
    return {type: primary, count: chain.length, createdSpecial};
  }
  clearAround(item: Item): Item[] {
    const removed:Item[]=[];
    for(let y=Math.max(0,item.gridY-1);y<=Math.min(BOARD_SIZE-1,item.gridY+1);y++) for(let x=Math.max(0,item.gridX-1);x<=Math.min(BOARD_SIZE-1,item.gridX+1);x++){ const it=this.grid[y][x]; if(it){ removed.push(it); this.grid[y][x]=null as any; } }
    this.collapse(); return removed;
  }
  collapse(){
    for(let x=0;x<BOARD_SIZE;x++){
      let write=BOARD_SIZE-1;
      for(let y=BOARD_SIZE-1;y>=0;y--){ const it=this.grid[y][x]; if(it){ this.grid[write][x]=it; it.gridX=x; it.gridY=write; it.targetX=x; it.targetY=write; write--; } }
      for(let y=write;y>=0;y--){ const it=randomItem(this.activeItems,x,y,this.specialChance); it.y = y-(write+1); it.targetY=y; it.falling=true; this.grid[y][x]=it; }
    }
  }
  shuffle(){
    const flat=this.grid.flat().map(i=>i.type).sort(()=>Math.random()-.5);
    let n=0; for(let y=0;y<BOARD_SIZE;y++) for(let x=0;x<BOARD_SIZE;x++){ const it=this.grid[y][x]; it.type=flat[n++]; it.scale=.6; }
  }
}
