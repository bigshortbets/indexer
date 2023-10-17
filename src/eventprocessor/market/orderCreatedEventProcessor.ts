import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {Market, Order, OrderSide, OrderStatus} from "../../model";
import * as ss58 from '@subsquid/ss58'
import {AggregatedOrdersHandler} from "./aggregatedOrdersHandler";
import {DataHandlerContext, Block, Event} from "@subsquid/substrate-processor";
import * as events from "../../types/events"

export class OrderCreatedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.OrderCreated";
    }


    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Order created event')
        const orderCreatedEvent = events.market.orderCreated.v1;
        if (orderCreatedEvent.is(event)) {
            const parsedEvent = orderCreatedEvent.decode(event)

            const market = await ctx.store.get(Market, parsedEvent.market.toString());
            const quantity = BigInt(parsedEvent.quantity);
            const order = new Order({
                id: parsedEvent.orderId.toString(),
                market: market,
                price: parsedEvent.price,
                side: parsedEvent.side.__kind === 'Long' ? OrderSide.LONG : OrderSide.SHORT,
                quantity: quantity,
                initialQuantity: quantity,
                who: ss58.codec(42).encode((new TextEncoder).encode(parsedEvent.who)),
                blockHeight: BigInt(block.header.height),
                // @ts-ignore
                timestamp: new Date(block.header.timestamp),
                status: OrderStatus.ACTIVE
            });
            await ctx.store.save(order);
            await AggregatedOrdersHandler.addNewOrderToTheAggregatedOrders(ctx.store, order)
        } else {
            console.error('Unsupported spec')
        }
    }

}
