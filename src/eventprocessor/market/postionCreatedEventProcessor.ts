import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Market, Position, PositionStatus } from "../../model";
import * as events from "../../types/events";
import {
  DataHandlerContext,
  Event,
  Block,
} from "@subsquid/substrate-processor";
import { encodeUserValue } from "../../utils/encodersUtils";

export class PositionCreatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.PositionCreated";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Position created event");
    const positionCreatedEvent = events.market.positionCreated.v1;
    if (positionCreatedEvent.is(event)) {
      let parsedEvent = positionCreatedEvent.decode(event);
      let market = await ctx.store.get(Market, parsedEvent.market.toString());
      if (market) {
        let position = new Position({
          id: parsedEvent.positionId.toString(),
          market: market,
          quantity: BigInt(parsedEvent.quantity),
          long: encodeUserValue(parsedEvent.long),
          short: encodeUserValue(parsedEvent.short),
          blockHeight: BigInt(block.header.height),
          // @ts-ignore
          timestamp: new Date(block.header.timestamp),
          status: PositionStatus.OPEN,
          quantityLeft: BigInt(parsedEvent.quantity),
          createPrice: parsedEvent.price,
          price: parsedEvent.price, // temporary - set in the next event
        });
        await ctx.store.save(position);
      } else {
        console.warn("Market undefined");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
