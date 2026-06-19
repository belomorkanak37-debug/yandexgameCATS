type AnySDK = any;

declare global { interface Window { YaGames?: { init: ()=>Promise<AnySDK> }; } }

export class YandexSDK {
  sdk: AnySDK = null;
  player: AnySDK = null;
  available = false;
  async init(){
    try { if(window.YaGames){ this.sdk = await window.YaGames.init(); this.available = true; try { this.player = await this.sdk.getPlayer({ scopes:false }); } catch {} } } catch { this.available = false; }
  }
  ready(){ try { this.sdk?.features?.LoadingAPI?.ready(); } catch {} }
  gameplayStart(){ try { this.sdk?.features?.GameplayAPI?.start(); } catch {} }
  gameplayStop(){ try { this.sdk?.features?.GameplayAPI?.stop(); } catch {} }
  async showFullscreenAd(){ if(!this.available) return false; this.gameplayStop(); return new Promise<boolean>(resolve=>{ try{ this.sdk.adv.showFullscreenAdv({callbacks:{onClose:()=>resolve(true),onError:()=>resolve(false)}}); }catch{resolve(false);} }); }
  async showRewardedAd(onReward:()=>void){ if(!this.available){ onReward(); return true; } this.gameplayStop(); return new Promise<boolean>(resolve=>{ let rewarded=false; try{ this.sdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>{rewarded=true;onReward();},onClose:()=>resolve(rewarded),onError:()=>resolve(false)}}); }catch{resolve(false);} }); }
  showStickyBanner(){ try { this.sdk?.adv?.showBannerAdv?.(); } catch {} }
  hideStickyBanner(){ try { this.sdk?.adv?.hideBannerAdv?.(); } catch {} }
  async saveData(data:any){ try { await this.player?.setData(data); } catch {} }
  async loadData(){ try { return await this.player?.getData(); } catch { return null; } }
  async submitScore(score:number){ try { await this.sdk?.leaderboards?.setLeaderboardScore('cat_cafe_score', score); } catch {} }
  async getLeaderboard(){ try { return await this.sdk?.leaderboards?.getLeaderboardEntries('cat_cafe_score', {quantityTop:10, includeUser:true}); } catch { return null; } }
}
