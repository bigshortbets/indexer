import {EventProcessor} from "../eventProcessor";
import {Store} from "@subsquid/typeorm-store";
import {Market, Position, PositionStatus} from "../../model";
import * as events from "../../types/events"
import * as ss58 from '@subsquid/ss58'
import {LiquidationPriceCalculator} from "./liquidationPriceCalculator";
import {DataHandlerContext, Event, Block} from "@subsquid/substrate-processor";

export class PositionCreatedEventProcessor implements EventProcessor{
    getHandledEventName(): string {
        return "Market.PositionCreated";
    }

    async process(ctx: DataHandlerContext<Store, any>, block: Block<any>, event: Event) {
        console.log('Position created event')
        const positionCreatedEvent = events.market.positionCreated.v1;
        if (positionCreatedEvent.is(event)) {
            let parsedEvent = positionCreatedEvent.decode(event)
            let market = await ctx.store.get(Market, parsedEvent.market.toString())
            if(market) {
                // const positionTimestamp = new Date(block.header.timestamp)
                let position = new Position({
                    id: parsedEvent.positionId.toString(),
                    market: market,
                    quantity: BigInt(parsedEvent.quantity),
                    long: ss58.codec(42).encode((new TextEncoder).encode(parsedEvent.long)),
                    short: ss58.codec(42).encode((new TextEncoder).encode(parsedEvent.short)),
                    blockHeight: BigInt(block.header.height),
                    // timestamp: positionTimestamp,
                    status: PositionStatus.OPEN,
                    quantityLeft: BigInt(parsedEvent.quantity),
                    price: parsedEvent.price // temporary - set in the next event
                })
                const delta = position.quantityLeft
                await LiquidationPriceCalculator.calculate(position, ctx.store, delta)
                await ctx.store.save(position);
            } else {
                console.warn('Market undefined')
            }
        } else {
            console.error('Unsupported spec')
        }
    }

}