import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOrderCreatedEvent} from "../../types/events";
import {Market, Order, OrderSide, OrderStatus} from "../../model";
import * as ss58 from '@subsquid/ss58'
import {Item} from "../../processor";
import {AggregatedOrdersHandler} from "./aggregatedOrdersHandler";

export class OrderCreatedEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OrderCreated";
    }


    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Order created event')
        let e = new MarketOrderCreatedEvent(ctx, item.event)

        if (e.isV1) {
            const parsedEvent = e.asV1
            console.log(parsedEvent)
            const market = await ctx.store.get(Market, parsedEvent.market.toString());
            const quantity = BigInt(parsedEvent.quantity)
            const order = new Order({
                id: parsedEvent.orderId.toString(),
                market: market,
                price: parsedEvent.price,
                side: parsedEvent.side.__kind === 'Long' ? OrderSide.LONG : OrderSide.SHORT,
                quantity: quantity,
                initialQuantity: quantity,
                who: ss58.codec(42).encode(parsedEvent.who),
                blockHeight: BigInt(block.header.height),
                timestamp: new Date(block.header.timestamp),
                status: OrderStatus.ACTIVE
            });
            await ctx.store.save(order);
            await AggregatedOrdersHandler.addNewOrderToTheAggregatedOrders(ctx.store, order)
        } else {
            throw new Error('Unsupported spec')
        }
    }

}
