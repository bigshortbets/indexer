import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Position } from "../../model";
import {
  DataHandlerContext,
  Event,
  Block,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";

export class PositionMarkedToMarketEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.PositionMarkedToMarket";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event
  ) {
    console.log("Position marked to marked event");
    const positionMarkedToMarketEvent = events.market.positionMarkedToMarket.v2;
    if (positionMarkedToMarketEvent.is(event)) {
      let parsedEvent = positionMarkedToMarketEvent.decode(event);
      let position = await ctx.store.findOne(Position, {
        where: {
          id: parsedEvent.positionId.toString(),
          market: { id: parsedEvent.market.toString() },
        },
        relations: { market: true },
      });
      if (position) {
        position.price = BigDecimal(parsedEvent.price, USDC_DECIMALS);
        await ctx.store.save(position);
      } else {
        console.warn("Position not found");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
