import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Market } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import { oracle } from "../../types/events";
import { oracle as storage } from "../../types/storage";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";

type PriceData = { [key: string]: Set<bigint> };

export class LatestOraclePriceProcessor implements EventProcessor {
  private blockData: PriceData = {};
  private blockNumber = 0;

  getHandledEventName(): string {
    return "Oracle.NewFeedData";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    const receivedEvent = oracle.newFeedData.v2;
    if (receivedEvent.is(event)) {
      const decodedEvent = receivedEvent.decode(event);
      if (block.header.height != this.blockNumber) {
        delete this.blockData[this.blockNumber];
        this.blockNumber = block.header.height;
        this.blockData[this.blockNumber] = new Set<bigint>();
      }

      for (const eventTicker of decodedEvent.values) {
        this.blockData[this.blockNumber].add(eventTicker[0]);
      }

      for await (const marketId of this.blockData[this.blockNumber]) {
        const marketPrice = await storage.values.v2.get(block.header, marketId);

        let market = await ctx.store.findOne(Market, {
          where: {
            id: marketId.toString(),
          },
        });
        if (market === undefined) {
          console.error(`Market with market Id ${marketId} does not exist.`);
          continue;
        }
        if (marketPrice === undefined) {
          console.error(
            `Price for market with market Id ${marketId} is not available.`,
          );
          continue;
        }

        market.oraclePrice = BigDecimal(marketPrice.value, USDC_DECIMALS);
        await ctx.store.save(market);
      }
    }
  }
}
