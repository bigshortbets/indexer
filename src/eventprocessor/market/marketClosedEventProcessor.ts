import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { market } from "../../types/events";
import { EntityManager } from "typeorm";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import { Market, MarketStatus } from "../../model";
export class MarketClosedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.MarketClosed";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Market closed event");
    const marketClosedEvent = market.marketClosed.v7;
    if (marketClosedEvent.is(event)) {
      let parsedEvent = marketClosedEvent.decode(event);
      let market = await ctx.store.findOne(Market, {
        where: { id: parsedEvent.marketId.toString() },
      });
      if (market) {
        market.status = MarketStatus.CLOSE;
        market.lifetime = BigInt(block.header.height);
        await ctx.store.save(market);
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
