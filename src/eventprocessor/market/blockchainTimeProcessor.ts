import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { BlockchainTimestamp } from "../../model";
import { DataHandlerContext, Call, Block } from "@subsquid/substrate-processor";
import { timestamp } from "../../types/calls";

export class BlockchainTimeProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Timestamp.set";
  }

  private id = "1";

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    call: Call,
  ) {
    try {
      // @ts-ignore
      const blockTimestamp = block.header.timestamp;
      if (blockTimestamp) {
        let blockchainTimestamps = await ctx.store.findOne(
          BlockchainTimestamp,
          {
            where: { id: this.id },
          },
        );
        if (blockchainTimestamps) {
          blockchainTimestamps.timestamp = blockTimestamp;
          await ctx.store.save(blockchainTimestamps);
        } else {
          const newTimestamp = new BlockchainTimestamp({
            id: this.id,
            timestamp: blockTimestamp,
          });
          await ctx.store.save(newTimestamp);
          console.log("Blockchain timestamp created");
        }
      }
    } catch (error) {
      console.error("Error while handling block timestamp");
    }
  }
}
