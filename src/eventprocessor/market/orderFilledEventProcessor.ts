import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Order, OrderStatus } from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Event,
  Block,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class OrderFilledEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.OrderFilled";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Order filled event");
    const orderFilledEvent = events.market.orderFilled.v1;
    if (orderFilledEvent.is(event)) {
      let parsedEvent = orderFilledEvent.decode(event);

      let order = await ctx.store.findOne(Order, {
        where: { id: parsedEvent.orderId.toString() },
        relations: { market: true },
      });
      if (order) {
        await AggregatedOrdersHandler.removeOrderFromAggregatedOrders(
          ctx.store,
          order,
        );
        order.status = OrderStatus.COMPLETED;
        order.quantity = BigInt(0);
        await ctx.store.save(order);
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
