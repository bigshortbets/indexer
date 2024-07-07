import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Order, OrderStatus, Position, OrderSide } from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Event,
  Block,
  Call,
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
    const orderFilledEvent = events.market.orderFilled.v2;
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

        if (order.type.isTypeOf === "ClosingOrder") {
          let offsetingPositionId = order.type.value;
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
                if (order.side === OrderSide.LONG) {
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

        order.status = OrderStatus.COMPLETED;
        order.quantity = BigInt(0);
        await ctx.store.save(order);
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
