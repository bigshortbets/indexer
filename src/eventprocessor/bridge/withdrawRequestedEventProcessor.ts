import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Withdraw, WidthdrawStatus } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class WithdrawRequestedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Bridge.WithdrawRequested";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Bridge withdraw request event");
    const withdrawRequestedEvent = events.bridge.withdrawRequested.v1;
    if (withdrawRequestedEvent.is(event)) {
      const parsedEvent = withdrawRequestedEvent.decode(event);
      const withdraw = new Withdraw({
        id: parsedEvent.identifier.toString(),
        amount: parsedEvent.amount,
        user: parsedEvent.user,
        status: WidthdrawStatus.REQUESTED,
      });
      await ctx.store.save(withdraw);
    } else {
      console.error("Unsupported spec");
    }
  }
}
