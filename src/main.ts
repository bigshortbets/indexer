import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { processor } from "./processor";
import { EventProcessorProvider } from "./eventprocessor/eventProcessorProvider";
import { DataHandlerContext } from "@subsquid/substrate-processor";
import { CheckIfMarketClosed } from "./eventprocessor/market/checkIfMarketClosed";
import { searchInArray } from "./utils";
import { update24Volume } from "./utils/update24Volume";

const processorProvider = new EventProcessorProvider();
let lastUpdateTime = -1;
processor.run(
  new TypeormDatabase(),
  async (ctx: DataHandlerContext<Store, {}>) => {
    for (let block of ctx.blocks) {
      await CheckIfMarketClosed.closeMarket(ctx, block);
      for (let event of block.events) {
        let processor = processorProvider.getProcessorByName(event.name);
        await processor?.process(
          ctx,
          block,
          event,
          searchInArray(block.calls, "extrinsicIndex", event.extrinsicIndex),
        );
      }
    }

    if (ctx.isHead) {
      const now = Date.now();
      if (now - lastUpdateTime >= 1000 * 15) {
        // do envów
        lastUpdateTime = now;
        await update24Volume(ctx.store);
      }
    }
  },
);
