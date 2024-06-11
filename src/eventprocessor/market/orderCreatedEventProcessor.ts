import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import {
  ClosingOrder,
  Market,
  OpeningOrder,
  Order,
  OrderSide,
  OrderStatus,
  OrderType,
} from "../../model";
import { AggregatedOrdersHandler } from "./aggregatedOrdersHandler";
import {
  DataHandlerContext,
  Block,
  Event,
  Call,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";
import { encodeUserValue } from "../../utils/encodersUtils";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";

export class OrderCreatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.OrderCreated";
  }

  callName = "Market.create_order";

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
    call: Call,
  ) {
    const orderCreatedEvent = events.market.orderCreated.v1;
    console.log(event);
    if (orderCreatedEvent.is(event)) {
      const parsedEvent = orderCreatedEvent.decode(event);
      const market = await ctx.store.get(Market, parsedEvent.market.toString());
      const quantity = parsedEvent.quantity;
      let order: Order;
      order = new Order({
        id: parsedEvent.orderId.toString(),
        market: market,
        price: BigDecimal(parsedEvent.price, USDC_DECIMALS),
        side:
          parsedEvent.side.__kind === "Long" ? OrderSide.LONG : OrderSide.SHORT,
        quantity: BigInt(quantity),
        initialQuantity: BigInt(quantity),
        who: encodeUserValue(parsedEvent.who),
        blockHeight: BigInt(block.header.height),
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
        status: OrderStatus.ACTIVE,
        type:
          parsedEvent.orderType.__kind === "Opening"
            ? new OpeningOrder({ type: "OpeningOrder" })
            : new ClosingOrder({
                type: "ClosingOrder",
                value: parsedEvent.orderType.value,
              }),
      });

      await ctx.store.save(order);
      await AggregatedOrdersHandler.addNewOrderToTheAggregatedOrders(
        ctx.store,
        order,
      );
    } else {
      console.error("Unsupported spec");
    }
  }
}
