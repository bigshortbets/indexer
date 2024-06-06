import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { market } from "../../types/events";
import { EntityManager } from "typeorm";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import { UserBalance, GeneralLeaderboard } from "../../model";
export class MarketRemovedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.MarketRemoved";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Market removed event");
    const marketRemovedEvent = market.marketRemoved.v1;
    if (marketRemovedEvent.is(event)) {
      let parsedEvent = marketRemovedEvent.decode(event);
      const marketLeaderboard = await ctx.store.find(UserBalance, {
        where: {
          market: { id: parsedEvent.marketId.toString() },
        },
      });
      for (const element of marketLeaderboard) {
        const user = await ctx.store.findOne(GeneralLeaderboard, {
          where: {
            id: element.user,
          },
        });
        if (user) {
          user.balanceChange = user.balanceChange.sub(element.balanceChange);
          await ctx.store.save(user);
        }
      }

      const em = (ctx.store as unknown as { em: () => EntityManager }).em;
      await (
        await em()
      ).query(
        `DELETE FROM "user_balance" WHERE market_id = '${parsedEvent.marketId}';
        DELETE FROM "market_settlements" WHERE market_id = '${parsedEvent.marketId}';
        DELETE FROM "aggregated_orders_by_price" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "position" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "order" WHERE market_id = '${parsedEvent.marketId}';
                        DELETE FROM "market" WHERE id = '${parsedEvent.marketId}';
            `,
      );
    } else {
      console.error("Unsupported spec");
    }
  }
}
