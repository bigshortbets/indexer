import { Store } from "@subsquid/typeorm-store";
import {
  Block,
  DataHandlerContext,
  Event,
  Call,
} from "@subsquid/substrate-processor";

export interface EventProcessor {
  process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event<any> | Call<any>,
  ): Promise<void>;
  getHandledEventName(): string;
}
