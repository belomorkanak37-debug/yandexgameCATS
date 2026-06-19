type Item = 'coffee' | 'tea' | 'milk' | 'croissant' | 'cake' | 'cookie' | 'fish' | 'dessert';
type Cell = { t: Item; x: number; y: number; sel: boolean; px: number; py: number };
type Button = { id: string; x: number; y: number; w: number; h: number; text: string };
type Cat = { name: string; need: Item; count: number; got: number; pat: number; max: number };

const items: Item[] = ['coffee', 'tea', 'milk', 'croissant', 'cake', 'cookie', 'fish', 'dessert'];
const label: Record<Item, string> = { coffee: '☕', tea: '🍵', milk: '🥛', croissant: '🥐', cake: '🍰', cookie: '🍪', fish: '🐟', dessert: '🍓' };
const names = ['Рыжик', 'Белла', 'Мурзик', 'Пуша', 'Барсик'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export class GameVisual {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bg = new Image();
  w = 390;
  h = 844;
  dpr = 1;
  screen: 'menu' | 'game' | 'results' = 'menu';
  board: Cell[][] = [];
  chain: Cell[] = [];
  buttons: Button[] = [];
  drag = false;
  score = 0;
  coins = Number(localStorage.getItem('catCoins') || 120);
  best = Number(localStorage.getItem('catBest') || 0);
  day = Number(localStorage.getItem('catDay') || 1);
  time = 75;
  last = 0;
  cats: Cat[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.bg.onerror = () => {
      if (!this.bg.src.endsWith('menu-background.svg')) this.bg.src = 'menu-background.svg';
    };
    this.bg.src = 'menu-background.webp';
  }

  boot() {
    this.resize();
    addEventListener('resize', () => this.resize());
    this.bind();
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width || 390;
    this.h = rect.height || 844;
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.layout();
  }

  save() {
    localStorage.setItem('catCoins', String(this.coins));
    localStorage.setItem('catBest', String(this.best));
    localStorage.setItem('catDay', String(this.day));
  }

  availableItems() {
    return items.slice(0, this.day >= 15 ? 8 : this.day >= 7 ? 7 : this.day >= 5 ? 6 : this.day >= 3 ? 5 : this.day >= 2 ? 4 : 3);
  }

  metrics() {
    const cell = Math.min((this.w - 34) / 6, (this.h - 338) / 6, 72);
    return { cell, ox: (this.w - cell * 6) / 2, oy: this.h * 0.38 };
  }

  layout() {
    const m = this.metrics();
    for (const row of this.board) for (const it of row) {
      it.px = m.ox + it.x * m.cell + m.cell / 2;
      it.py = m.oy + it.y * m.cell + m.cell / 2;
    }
  }

  newCell(x: number, y: number): Cell {
    const m = this.metrics();
    return { t: pick(this.availableItems()), x, y, sel: false, px: m.ox + x * m.cell + m.cell / 2, py: m.oy + y * m.cell + m.cell / 2 };
  }

  newBoard() {
    this.board = [];
    for (let y = 0; y < 6; y++) {
      this.board[y] = [];
      for (let x = 0; x < 6; x++) this.board[y][x] = this.newCell(x, y);
    }
  }

  addCats() {
    while (this.cats.length < (this.day >= 10 ? 3 : 2)) {
      const need = pick(this.availableItems());
      this.cats.push({ name: pick(names), need, count: 1 + Math.floor(Math.random() * 3), got: 0, pat: 26, max: 26 });
    }
  }

  start() {
    this.score = 0;
    this.time = this.day < 3 ? 60 : 75;
    this.cats = [];
    this.newBoard();
    this.addCats();
    this.screen = 'game';
  }

  bind() {
    const pos = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    this.canvas.addEventListener('pointerdown', (e) => {
      const p = pos(e);
      if (this.hit(p.x, p.y)) return;
      if (this.screen !== 'game') return;
      const it = this.cellAt(p.x, p.y);
      if (it) {
        this.drag = true;
        this.chain = [it];
        it.sel = true;
      }
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      const p = pos(e);
      const it = this.cellAt(p.x, p.y);
      const last = this.chain[this.chain.length - 1];
      const prev = this.chain[this.chain.length - 2];
      if (!it || !last) return;
      if (it === prev) {
        last.sel = false;
        this.chain.pop();
        return;
      }
      if (it !== last && !it.sel && Math.abs(it.x - last.x) <= 1 && Math.abs(it.y - last.y) <= 1 && it.t === last.t) {
        it.sel = true;
        this.chain.push(it);
      }
    });
    addEventListener('pointerup', () => {
      if (!this.drag) return;
      this.drag = false;
      this.resolve();
      for (const it of this.chain) it.sel = false;
      this.chain = [];
    });
  }

  cellAt(px: number, py: number) {
    const m = this.metrics();
    const x = Math.floor((px - m.ox) / m.cell);
    const y = Math.floor((py - m.oy) / m.cell);
    return x >= 0 && y >= 0 && x < 6 && y < 6 ? this.board[y][x] : null;
  }

  resolve() {
    if (this.chain.length < 3) return;
    const t = this.chain[0].t;
    let gained = this.chain.length * 10 + (this.chain.length >= 5 ? 50 : 0);
    for (const cat of [...this.cats]) {
      if (cat.need === t && cat.got < cat.count) {
        const add = Math.min(cat.count - cat.got, this.chain.length);
        cat.got += add;
        if (cat.got >= cat.count) {
          gained += 100;
          this.coins += 10;
          this.cats.splice(this.cats.indexOf(cat), 1);
          this.addCats();
        }
      }
    }
    this.score += gained;
    for (const it of this.chain) this.board[it.y][it.x] = null as unknown as Cell;
    this.drop();
  }

  drop() {
    for (let x = 0; x < 6; x++) {
      let write = 5;
      for (let y = 5; y >= 0; y--) {
        const it = this.board[y][x];
        if (it) {
          this.board[write][x] = it;
          it.y = write;
          write--;
        }
      }
      for (let y = write; y >= 0; y--) this.board[y][x] = this.newCell(x, y);
    }
    this.layout();
  }

  loop(t: number) {
    const dt = Math.min(40, t - this.last || 16);
    this.last = t;
    if (this.screen === 'game') {
      this.time -= dt / 1000;
      for (const cat of this.cats) cat.pat -= dt / 1000;
      if (this.time <= 0) this.finish();
    }
    this.draw();
    requestAnimationFrame((next) => this.loop(next));
  }

  finish() {
    this.screen = 'results';
    if (this.score > this.best) this.best = this.score;
    this.day++;
    this.save();
  }

  drawBg() {
    const c = this.ctx;
    if (this.bg.complete && this.bg.naturalWidth) {
      const scale = Math.max(this.w / this.bg.naturalWidth, this.h / this.bg.naturalHeight);
      const dw = this.bg.naturalWidth * scale;
      const dh = this.bg.naturalHeight * scale;
      c.drawImage(this.bg, (this.w - dw) / 2, (this.h - dh) / 2, dw, dh);
    } else {
      const g = c.createLinearGradient(0, 0, 0, this.h);
      g.addColorStop(0, '#ffe0a8');
      g.addColorStop(1, '#9e572e');
      c.fillStyle = g;
      c.fillRect(0, 0, this.w, this.h);
    }
    const v = c.createRadialGradient(this.w / 2, this.h * 0.45, 20, this.w / 2, this.h * 0.45, this.h * 0.75);
    v.addColorStop(0, 'rgba(255,255,255,0)');
    v.addColorStop(1, 'rgba(45,20,8,.22)');
    c.fillStyle = v;
    c.fillRect(0, 0, this.w, this.h);
  }

  panel(x: number, y: number, w: number, h: number, r = 22) {
    const c = this.ctx;
    c.save();
    c.fillStyle = 'rgba(74,38,15,.24)';
    c.beginPath();
    c.ellipse(x + w / 2, y + h + 9, w * 0.38, 12, 0, 0, 7);
    c.fill();
    const g = c.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, 'rgba(255,246,220,.94)');
    g.addColorStop(1, 'rgba(255,200,124,.9)');
    roundRect(c, x, y, w, h, r);
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = 'rgba(103,52,20,.28)';
    c.lineWidth = 2;
    c.stroke();
    c.restore();
  }

  button(id: string, text: string, x: number, y: number, w: number, h: number) {
    this.buttons.push({ id, text, x, y, w, h });
    this.panel(x, y, w, h, 18);
    const c = this.ctx;
    c.fillStyle = '#fff';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '900 20px Arial';
    c.strokeStyle = 'rgba(92,46,14,.5)';
    c.lineWidth = 4;
    c.strokeText(text, x + w / 2, y + h / 2);
    c.fillText(text, x + w / 2, y + h / 2);
  }

  hit(x: number, y: number) {
    const b = this.buttons.find((item) => x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h);
    if (!b) return false;
    if (b.id === 'play' || b.id === 'again') this.start();
    if (b.id === 'menu') this.screen = 'menu';
    return true;
  }

  logo(y: number) {
    const c = this.ctx;
    c.textAlign = 'center';
    c.font = '900 46px Arial';
    c.strokeStyle = 'rgba(75,38,16,.55)';
    c.lineWidth = 7;
    c.strokeText('Котокафе', this.w / 2, y);
    c.fillStyle = '#fff4da';
    c.fillText('Котокафе', this.w / 2, y);
    c.font = '800 22px Arial';
    c.fillStyle = '#ffe26a';
    c.fillText('Match & Serve', this.w / 2, y + 36);
  }

  draw() {
    this.buttons = [];
    this.drawBg();
    if (this.screen === 'menu') {
      this.logo(118);
      this.panel(34, 162, this.w - 68, 64, 20);
      this.ctx.fillStyle = '#6d3b1f';
      this.ctx.textAlign = 'center';
      this.ctx.font = '800 18px Arial';
      this.ctx.fillText(`День ${this.day}   🪙 ${this.coins}   Рекорд ${this.best}`, this.w / 2, 202);
      this.button('play', 'Играть', this.w / 2 - 104, this.h * 0.62, 208, 60);
      this.button('menu', 'Улучшения', this.w / 2 - 104, this.h * 0.70, 208, 54);
      this.button('menu', 'Настройки', this.w / 2 - 104, this.h * 0.77, 208, 54);
      return;
    }
    if (this.screen === 'game') {
      this.hud();
      this.drawCats();
      this.drawBoard();
      return;
    }
    this.logo(150);
    this.panel(42, 220, this.w - 84, 180, 24);
    this.ctx.fillStyle = '#6d3b1f';
    this.ctx.textAlign = 'center';
    this.ctx.font = '900 25px Arial';
    this.ctx.fillText('Смена завершена!', this.w / 2, 275);
    this.ctx.font = '800 20px Arial';
    this.ctx.fillText(`Счёт: ${this.score}`, this.w / 2, 320);
    this.ctx.fillText(`Рекорд: ${this.best}`, this.w / 2, 352);
    this.button('again', 'Играть ещё', this.w / 2 - 108, 430, 216, 56);
    this.button('menu', 'Меню', this.w / 2 - 108, 498, 216, 52);
  }

  hud() {
    this.panel(12, 12, this.w - 24, 58, 18);
    const c = this.ctx;
    c.fillStyle = '#6d3b1f';
    c.font = '900 20px Arial';
    c.textAlign = 'left';
    c.fillText(`★ ${this.score}`, 30, 48);
    c.fillText(`⏱ ${Math.ceil(this.time)}`, this.w * 0.36, 48);
    c.fillText(`🪙 ${this.coins}`, this.w * 0.62, 48);
  }

  drawCats() {
    const c = this.ctx;
    const gap = this.w / (this.cats.length + 1);
    this.cats.forEach((cat, i) => {
      const x = gap * (i + 1);
      const y = 108;
      this.panel(x - 62, y - 24, 124, 92, 18);
      c.fillStyle = '#f49a35';
      c.beginPath();
      c.arc(x - 34, y + 22, 27, 0, 7);
      c.fill();
      c.fillStyle = '#fff7ef';
      c.beginPath();
      c.arc(x - 34, y + 22, 16, 0, 7);
      c.fill();
      c.fillStyle = '#4b2b19';
      c.font = '700 14px Arial';
      c.textAlign = 'center';
      c.fillText(cat.name, x - 34, y + 62);
      c.font = '24px Arial';
      c.fillText(label[cat.need], x + 24, y + 22);
      c.font = '800 14px Arial';
      c.fillText(`${cat.got}/${cat.count}`, x + 24, y + 52);
    });
  }

  drawBoard() {
    const m = this.metrics();
    const c = this.ctx;
    this.panel(m.ox - 8, m.oy - 8, m.cell * 6 + 16, m.cell * 6 + 16, 24);
    if (this.chain.length > 1) {
      c.strokeStyle = 'rgba(255,220,60,.9)';
      c.lineWidth = 8;
      c.lineCap = 'round';
      c.beginPath();
      this.chain.forEach((it, i) => (i ? c.lineTo(it.px, it.py) : c.moveTo(it.px, it.py)));
      c.stroke();
    }
    for (const row of this.board) for (const it of row) {
      c.fillStyle = it.sel ? 'rgba(83,188,255,.58)' : 'rgba(255,247,224,.72)';
      roundRect(c, it.px - m.cell * 0.43, it.py - m.cell * 0.43, m.cell * 0.86, m.cell * 0.86, 14);
      c.fill();
      c.font = `${Math.round(m.cell * 0.48)}px Arial`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(label[it.t], it.px, it.py + 2);
    }
  }
}
