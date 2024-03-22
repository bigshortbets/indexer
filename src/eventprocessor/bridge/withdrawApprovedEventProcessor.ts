import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import { Withdraw, WidthdrawStatus } from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";

export class WithdrawApprovedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Bridge.WithdrawApproved";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event
  ) {
    console.log("Bridge withdraw canceled event");
    const withdrawApprovedEventv15 = events.bridge.withdrawApproved.v15;
    const withdrawApprovedEventv18 = events.bridge.withdrawApproved.v18;
    if (withdrawApprovedEventv15.is(event)) {
      const parsedEvent = withdrawApprovedEventv15.decode(event);
      let withdraw = await ctx.store.findOne(Withdraw, {
        where: { id: parsedEvent.identifier.toString() },
      });
      if (withdraw) {
        withdraw.status = WidthdrawStatus.APPROVED;
        await ctx.store.save(withdraw);
      } else {
        console.warn("No withdraw found");
      }
    } else if (withdrawApprovedEventv18.is(event)) {
      const parsedEvent = withdrawApprovedEventv18.decode(event);
      let withdraw = await ctx.store.findOne(Withdraw, {
        where: { id: parsedEvent.identifier.toString() },
      });
      if (withdraw) {
        withdraw.status = WidthdrawStatus.APPROVED;
        await ctx.store.save(withdraw);
      } else {
        console.warn("No withdraw found");
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
