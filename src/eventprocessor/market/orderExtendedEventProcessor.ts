import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { ClosingOrder, Order, OrderStatus } from "../../model";
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
    event: Event,
  ) {
    console.log("Order extended event");
    const orderExtendedEvent = events.market.orderExtended.v1;
    if (orderExtendedEvent.is(event)) {
      const parsedEvent = orderExtendedEvent.decode(event);
      let existingOrder = await ctx.store.findOne(Order, {
        where: { id: parsedEvent.orderId.toString() },
        relations: { market: true },
      });
      if (existingOrder) {
        const newOrder = new Order({
          id: parsedEvent.newOrderId.toString(),
          market: existingOrder.market,
          price: existingOrder.price,
          side: existingOrder.side,
          quantity: BigInt(parsedEvent.quantity),
          initialQuantity: BigInt(parsedEvent.quantity),
          who: existingOrder.who,
          blockHeight: BigInt(block.header.height),
          // @ts-ignore
          timestamp: new Date(block.header.timestamp),
          status: OrderStatus.ACTIVE,
          type: new ClosingOrder({
            type: existingOrder.type.type,
            value: parsedEvent.newPositionId,
          }),
        });
        await ctx.store.save(newOrder);
        existingOrder.status = OrderStatus.AUTOMATICALLY_MODIFIED;
        await ctx.store.save(existingOrder);
        await AggregatedOrdersHandler.addNewOrderToTheAggregatedOrders(
          ctx.store,
          newOrder,
        );
      } else {
        console.warn("Order was not found");
      }
    }
  }
}
