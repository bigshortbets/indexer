import { Store } from "@subsquid/typeorm-store";
import { DataHandlerContext, Block } from "@subsquid/substrate-processor";
import { Market, MarketStatus } from "../../model";

export class CheckIfMarketClosed {
  public static async closeMarket(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
  ) {
    const markets = await ctx.store.find(Market, {
      where: {
        status: MarketStatus.OPEN,
      },
    });
    for (const market of markets) {
      // @ts-ignore
      const blockTimestampInSec = BigInt(block.header.timestamp) / 1000n;
      if (market.lifetime < blockTimestampInSec) {
        market.status = MarketStatus.CLOSE;
        await ctx.store.save(market);
      }
    }
  }
}
