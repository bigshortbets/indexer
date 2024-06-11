import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Withdraw, WidthdrawStatus } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class WithdrawCanceledEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Bridge.WithdrawCanceled";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
  ) {
    console.log("Bridge withdraw canceled event");
    const withdrawCnceledEvent = events.bridge.withdrawCanceled.v1;
    if (withdrawCnceledEvent.is(event)) {
      const parsedEvent = withdrawCnceledEvent.decode(event);
      let withdraw = await ctx.store.findOne(Withdraw, {
        where: { id: parsedEvent.identifier.toString() },
      });
      if (withdraw) {
        withdraw.status = WidthdrawStatus.CANCELLED;
        await ctx.store.save(withdraw);
      } else {
        console.warn("No withdraw found");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
