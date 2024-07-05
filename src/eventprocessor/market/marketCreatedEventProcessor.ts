import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { market } from "../../types/events";
import { Market, MarketStatus } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import { encodeMarketTicker } from "../../utils/encodersUtils";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";

export class MarketCreatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Market.MarketCreated";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    let receivedEvent = market.marketCreated.v2;

    if (receivedEvent.is(event)) {
      const decodedEvent = receivedEvent.decode(event);
      const createdMarket = new Market({
        id: decodedEvent.marketId.toString(),
        ticker: encodeMarketTicker(decodedEvent.ticker),
        tickSize: BigDecimal(decodedEvent.tickSize, USDC_DECIMALS),
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
        status: MarketStatus.OPEN,
      });
      await ctx.store.save(createdMarket);
    } else {
      console.error("Unsupported spec");
    }
  }
}
