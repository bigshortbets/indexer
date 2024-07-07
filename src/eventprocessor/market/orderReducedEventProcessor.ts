import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Order, Position, OrderStatus, OrderSide } from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Block,
  Call,
  Event,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class OrderReducedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.OrderReduced";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Order reduced event");
    const orderReducedEvent = events.market.orderReduced.v2;
    if (orderReducedEvent.is(event)) {
      let parsedEvent = orderReducedEvent.decode(event);
      let persistedOrder = await ctx.store.findOne(Order, {
        where: { id: parsedEvent.orderId.toString() },
        relations: { market: true },
      });
      if (persistedOrder !== undefined) {
        let quantityDelta =
          persistedOrder.quantity - BigInt(parsedEvent.quantity);
        await AggregatedOrdersHandler.removeQuantityFromAggregatedOrders(
          ctx.store,
          persistedOrder,
          quantityDelta,
        );
        persistedOrder.quantity = BigInt(parsedEvent.quantity);
        if (persistedOrder.status === OrderStatus.AUTOMATICALLY_MODIFIED) {
          persistedOrder.status = OrderStatus.ACTIVE;
        }

        if (persistedOrder.type.isTypeOf === "ClosingOrder") {
          let offsetingPositionId = persistedOrder.type.value;
          let offsetingPosition = await ctx.store.findOne(Position, {
            where: { id: offsetingPositionId.toString() },
          });

          if (offsetingPosition) {
            const positionCreatedEvent = block.events.find(
              (element) =>
                element.index < event.index &&
                event.index - element.index <= 4 &&
                element.callAddress?.toString() ===
                  event.callAddress?.toString() &&
                element.name === "Market.PositionCreated",
            );
            if (positionCreatedEvent) {
              let newPosition = await ctx.store.findOne(Position, {
                where: { id: positionCreatedEvent?.args.positionId.toString() },
              });

              if (newPosition) {
                if (persistedOrder.side === OrderSide.LONG) {
                  newPosition.createPriceLong =
                    offsetingPosition.createPriceLong;
                } else {
                  newPosition.createPriceShort =
                    offsetingPosition.createPriceShort;
                }
                await ctx.store.save(newPosition);
              }
            }
          } else {
            console.warn("Position not found");
          }
        }

        await ctx.store.save(persistedOrder);
      } else {
        console.warn("Order doesn't exist");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
