import { AggregatedOrdersByPrice, Order } from "../../model";
import { Store } from "@subsquid/typeorm-store";
import { Equal } from "typeorm";

export class AggregatedOrdersHandler {
  public static async addNewOrderToTheAggregatedOrders(
    store: Store,
    order: Order,
  ) {
    let orderSide = order.side;
    let aggregatedOrder = await store.findOne(AggregatedOrdersByPrice, {
      where: {
        market: { id: order.market.id },
        price: Equal(order.price),
        side: orderSide,
      },
    });
    if (aggregatedOrder === undefined) {
      await store.save(
        new AggregatedOrdersByPrice({
          id: order.id,
          price: order.price,
          quantity: order.quantity,
          market: order.market,
          side: orderSide,
        }),
      );
    } else {
      aggregatedOrder.quantity += order.quantity;
      await store.save(aggregatedOrder);
    }
  }

  public static async removeOrderFromAggregatedOrders(
    store: Store,
    order: Order,
  ) {
    const orderSide = order?.side;
    let aggregatedOrder = await store.findOne(AggregatedOrdersByPrice, {
      where: {
        market: { id: order.market.id },
        price: Equal(order.price),
        side: orderSide,
      },
    });
    if (aggregatedOrder) {
      aggregatedOrder.quantity -= order.quantity;
      if (aggregatedOrder.quantity === BigInt(0)) {
        await store.remove(AggregatedOrdersByPrice, aggregatedOrder.id);
      } else if (aggregatedOrder.quantity < BigInt(0)) {
        console.error("Quantity of aggregated orders is negative");
      } else {
        await store.save(aggregatedOrder);
      }
    } else {
      console.error("There is no aggregated order to subtract from");
    }
  }
  public static async removeQuantityFromAggregatedOrders(
    store: Store,
    order: Order,
    quantity: bigint,
  ) {
    const orderSide = order?.side;
    let aggregatedOrder = await store.findOne(AggregatedOrdersByPrice, {
      where: {
        market: { id: order.market.id },
        price: Equal(order.price),
        side: orderSide,
      },
    });
    if (aggregatedOrder) {
      aggregatedOrder.quantity -= quantity;
      if (aggregatedOrder.quantity <= BigInt(0)) {
        console.error("Quantity of aggregated orders are not positive");
      }
      await store.save(aggregatedOrder);
    } else {
      console.error("There is no aggregated order to subtract from");
    }
  }
}
