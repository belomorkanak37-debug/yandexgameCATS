import './styles.css';
import { GameVisual } from './game/GameVisual';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const game = new GameVisual(canvas);
game.boot();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
