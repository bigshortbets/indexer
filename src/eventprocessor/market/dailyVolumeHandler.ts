import {Store} from "@subsquid/typeorm-store";
import {DailyVolume, Position} from "../../model";
import {Raw} from "typeorm";

export class DailyVolumeHandler {
     public static async calculate24hVolume(store: Store) : Promise<void> {
          console.log('24h volume calculation scheduled event')
          const dailyPositions = await this.getAllDailyPositions(store);
          const volumeByMarketId = this.calculateVolumePerMarket(dailyPositions)
          let volumesPerMarket =
              Array.from(volumeByMarketId.entries())
                  .map(entry => new DailyVolume({id: entry[0], volume: entry[1]}))
          await store.save(volumesPerMarket);
     }
     private static calculateVolumePerMarket(positions: Position[]) : Map<string, bigint>{
         let volumePerMarketIdMap = new Map<string, bigint>()
         positions.forEach(position => {
             const id = position.market.id;
             const volume = volumePerMarketIdMap.get(id) ?? BigInt(0);
             volumePerMarketIdMap.set(id, BigInt(position.price * position.quantityLeft) + volume)
         })
         return volumePerMarketIdMap;
     }
     private static async getAllDailyPositions(store: Store) : Promise<Position[]> {
         const ONE_DAY = 1000 * 60 * 60 * 24;
         return await store.find(
             Position,
             {
                 where: {
                     timestamp: Raw((alias) =>
                         `${alias} > :date`, {date: new Date(Date.now() - ONE_DAY)})
                 },
                 relations: {
                     market: true
                 }
             });
     }
}