import { YandexSDK } from './yandex';
export class LeaderboardService {
  constructor(private sdk:YandexSDK) {}
  async submit(score:number){ await this.sdk.submitScore(score); }
  async top(best:number){
    const remote = await this.sdk.getLeaderboard();
    if(remote?.entries) return remote.entries.map((e:any,i:number)=>({rank:e.rank||i+1,name:e.player?.publicName||'Котик',score:e.score||0}));
    return [
      {rank:1,name:'Мурзик',score:Math.max(best,4200)}, {rank:2,name:'Белла',score:3100}, {rank:3,name:'Рыжик',score:2500}, {rank:4,name:'Ты',score:best}
    ].sort((a,b)=>b.score-a.score).map((r,i)=>({...r,rank:i+1}));
  }
}
