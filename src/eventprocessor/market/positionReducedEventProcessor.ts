import { EventProcessor } from "../eventProcessor";
import {
  Event,
  Block,
  DataHandlerContext,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Position } from "../../model";
import * as events from "../../types/events";

export class PositionReducedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.PositionReduced";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event
  ) {
    console.log("Position reduced event");
    const positionReducedEvent = events.market.positionReduced.v2;
    if (positionReducedEvent.is(event)) {
      let parsedEvent = positionReducedEvent.decode(event);
      let position = await ctx.store.findOne(Position, {
        where: {
          id: parsedEvent.positionId.toString(),
        },
        relations: { market: true },
      });
      if (position) {
        position.quantityLeft = BigInt(parsedEvent.quantity);
        await ctx.store.save(position);
      } else {
        console.warn("Position not found");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
