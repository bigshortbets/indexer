import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { market } from "../../types/events";
import { Market } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import { encodeMarketTicker } from "../../utils/encodersUtils";
import { BigDecimal } from "@subsquid/big-decimal";

export class MarketCreatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.MarketCreated";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Market created event");
    let receivedEventv1 = market.marketCreated.v1;
    let receivedEventv20 = market.marketCreated.v20;
    if (receivedEventv1.is(event)) {
      const decodedEvent = receivedEventv1.decode(event);
      const createdMarket = new Market({
        id: decodedEvent.marketId.toString(),
        ticker: encodeMarketTicker(decodedEvent.ticker),
        tickSize: BigInt(decodedEvent.tickSize),
        lifetime: BigInt(decodedEvent.lifetime),
        initialMargin: decodedEvent.initialMargin,
        maintenanceMargin: decodedEvent.maintenanceMargin,
        contractUnit: BigDecimal(decodedEvent.contractUnit, 0),
        blockHeight: BigInt(block.header.height),
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
        dailyVolume: BigInt(0),
      });
      await ctx.store.save(createdMarket);
    } else if (receivedEventv20.is(event)) {
      const decodedEvent = receivedEventv20.decode(event);
      const createdMarket = new Market({
        id: decodedEvent.marketId.toString(),
        ticker: encodeMarketTicker(decodedEvent.ticker),
        tickSize: BigInt(decodedEvent.tickSize),
        lifetime: BigInt(decodedEvent.lifetime),
        initialMargin: decodedEvent.initialMargin,
        maintenanceMargin: decodedEvent.maintenanceMargin,
        contractUnit: BigDecimal(
          decodedEvent.contractUnit.contractUnit,
          decodedEvent.contractUnit.decimals,
        ),
        blockHeight: BigInt(block.header.height),
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
        dailyVolume: BigInt(0),
      });
      await ctx.store.save(createdMarket);
    } else {
      console.error("Unsupported spec");
    }
  }
}
