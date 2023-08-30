import {Store} from "@subsquid/typeorm-store";
import {DailyVolume, Position} from "../../model";
import {Raw} from "typeorm";

export class DailyVolumeHandler {
     public static async calculate24hVolume(store: Store) : Promise<void> {
          console.log('24h volume calculation scheduled event')
          const dailyPositions = await this.getAllDailyPositions(store);

          const volumeByMarketId = await this.calculateVolumePerMarket(dailyPositions)
          let volumesPerMarket =
              Array.from(volumeByMarketId.entries())
                  .map(entry => new DailyVolume({id: entry[0], volume: entry[1]}))
          await store.save(volumesPerMarket);
     }
     private static async calculateVolumePerMarket(positions: Position[]) : Promise<Map<string, bigint>> {
         let volumePerMarketIdMap = new Map<string, bigint>()
         positions.forEach(position => {
             const id = position.market.id;
             const volume = volumePerMarketIdMap.get(id) ?? BigInt(0);
             volumePerMarketIdMap.set(id, position.price * position.quantity * BigInt(position.market.contractUnit) + volume)
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