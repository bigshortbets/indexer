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
    event: Event
  ) {
    console.log("Lates oracle price event");
    const receivedEvent = oracle.newFeedData.v10;
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
        const marketPrice = await storage.values.v10.get(
          block.header,
          marketId
        );

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
            `Price for market with market Id ${marketId} is not available.`
          );
          continue;
        }

        market.oraclePrice = marketPrice.value;
        await ctx.store.save(market);
      }
    }
  }
}
