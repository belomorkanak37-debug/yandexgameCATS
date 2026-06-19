import { YandexSDK } from './yandex';
export class AdsManager {
  constructor(private sdk:YandexSDK) {}
  async betweenSessions(){ return this.sdk.showFullscreenAd(); }
  async rewarded(onReward:()=>void){ return this.sdk.showRewardedAd(onReward); }
}
