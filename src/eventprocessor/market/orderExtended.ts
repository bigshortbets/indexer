import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Order, OrderStatus } from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class OrderExtendedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.OrderExtended";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event
  ) {
    console.log("Order extended event");
    const orderCreatedEvent = events.market.orderExtended.v13;
    if (orderCreatedEvent.is(event)) {
      const parsedEvent = orderCreatedEvent.decode(event);
      let order = await ctx.store.findOne(Order, {
        where: { id: parsedEvent.orderId.toString() },
        relations: { market: true },
      });
      if (order) {
        const firstOrder = new Order({
          id: parsedEvent.newOrderId.toString(),
          market: order.market,
          price: order.price,
          side: order.side,
          quantity: BigInt(parsedEvent.quantity),
          initialQuantity: BigInt(parsedEvent.quantity),
          who: order.who,
          blockHeight: BigInt(block.header.height),
          // @ts-ignore
          timestamp: new Date(block.header.timestamp),
          status: OrderStatus.ACTIVE,
        });
        await ctx.store.save(firstOrder);
        order.status = OrderStatus.AUTOMATICALLY_MODIFIED;
        await ctx.store.save(order);
        await AggregatedOrdersHandler.addNewOrderToTheAggregatedOrders(
          ctx.store,
          order
        );
      } else {
        console.warn("Order was not found");
      }
    }
  }
}
