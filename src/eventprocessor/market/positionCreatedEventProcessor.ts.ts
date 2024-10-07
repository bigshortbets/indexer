import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import {
  MarketChartFeed15Min,
  MarketChartFeed1H,
  Market,
  Position,
  PositionStatus,
  Order,
} from "../../model";
import * as events from "../../types/events";
import {
  DataHandlerContext,
  Event,
  Block,
} from "@subsquid/substrate-processor";
import { encodeUserValue } from "../../utils/encodersUtils";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";
import { updateCandle } from "../../utils/chartHelpers/timeframesBuilder";

export class PositionCreatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.PositionCreated";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    let buyOrder;
    let sellOrder;

    const call = event.getCall();

    if (call.name === "Market.create_position") {
      buyOrder = await ctx.store.get(Order, call.args.buyerId);
      sellOrder = await ctx.store.get(Order, call.args.sellerId);
    }

    const positionCreatedEvent = events.market.positionCreated.v2;
    if (positionCreatedEvent.is(event)) {
      let parsedEvent = positionCreatedEvent.decode(event);
      let market = await ctx.store.get(Market, parsedEvent.market.toString());
      if (market) {
        if (call.name === "Market.liquidate_position") {
          for (const callEvent of call.events) {
            if (callEvent.name === "Market.OrderCreated") {
              if (callEvent.args.side.__kind === "Long") {
                buyOrder = await ctx.store.get(Order, callEvent.args.orderId);
                sellOrder = await ctx.store.get(Order, call.args.orderId);
              } else {
                buyOrder = await ctx.store.get(Order, call.args.orderId);
                sellOrder = await ctx.store.get(Order, callEvent.args.orderId);
              }
            }
          }
        }

        const price = BigDecimal(parsedEvent.price, USDC_DECIMALS);
        let position = new Position({
          id: parsedEvent.positionId.toString(),
          market: market,
          quantity: BigInt(parsedEvent.quantity),
          long: encodeUserValue(parsedEvent.long),
          short: encodeUserValue(parsedEvent.short),
          blockHeight: BigInt(block.header.height),
          // @ts-ignore
          timestamp: new Date(block.header.timestamp),
          status: PositionStatus.OPEN,
          quantityLeft: BigInt(parsedEvent.quantity),
          createPrice: price,
          createPriceLong: price,
          createPriceShort: price,
          price: price, // temporary - set in the next event
          buyOrder: buyOrder,
          sellOrder: sellOrder,
        });
        await ctx.store.save(position);

        // @ts-ignore
        const timestamp = Math.floor(block.header.timestamp / 1000);
        const rounded15Min = BigInt(Math.floor(timestamp / 900)) * BigInt(900);
        const rounded1H = BigInt(Math.floor(timestamp / 3600)) * BigInt(3600);

        await updateCandle(
          ctx,
          market,
          price,
          rounded15Min,
          MarketChartFeed15Min,
        );
        await updateCandle(ctx, market, price, rounded1H, MarketChartFeed1H);
      } else {
        console.warn("Market undefined");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
