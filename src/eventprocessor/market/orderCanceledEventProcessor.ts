import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Order, OrderStatus } from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Event,
  Block,
} from "@subsquid/substrate-processor";
import { market } from "../../types/events";

export class OrderCanceledEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.OrderCanceled";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event
  ) {
    console.log("Order canceled event");
    const orderCanceledEvent = market.orderCanceled.v2;
    if (orderCanceledEvent.is(event)) {
      let parsedEvent = orderCanceledEvent.decode(event);
      let order = await ctx.store.findOne(Order, {
        where: { id: parsedEvent.orderId.toString() },
        relations: { market: true },
      });
      if (order) {
        await AggregatedOrdersHandler.removeOrderFromAggregatedOrders(
          ctx.store,
          order
        );
        if (order.status === OrderStatus.AUTOMATICALLY_MODIFIED) {
          order.status = OrderStatus.AUTOMATICALLY_CANCELLED;
        } else {
          order.status = OrderStatus.CANCELLED;
        }
        await ctx.store.save(order);
      } else {
        console.warn("No order found");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
