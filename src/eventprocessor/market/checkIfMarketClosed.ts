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
      if (market.lifetime < block.header.height) {
        market.status = MarketStatus.CLOSE;
        await ctx.store.save(market);
      }
    }
  }
}
