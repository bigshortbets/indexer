import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import {
  Withdraw,
  WidthdrawStatus,
  ReserveRepatriated,
  UserBalance,
  Market,
} from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
  Call,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";
import { timeStamp } from "console";
import { BigDecimal } from "@subsquid/big-decimal";

export class ReserveRepatriatedEventProcessor implements EventProcessor {
  getHandledEventName(): string {
    return "Balances.ReserveRepatriated";
  }

  async process(
    ctx: DataHandlerContext<Store, any>,
    block: Block<any>,
    event: Event,
    call: Call,
  ) {
    console.log("Reserve repatriated event");
    const reserveRepatriatedEvent = events.balances.reserveRepatriated.v1;
    if (reserveRepatriatedEvent.is(event)) {
      const parsedEvent = reserveRepatriatedEvent.decode(event);
      const marketId = call.args.market;
      let market = await ctx.store.get(Market, marketId);
      let reserveRepatriatedFrom = new ReserveRepatriated({
        amount: BigDecimal(parsedEvent.amount).mul(-1),
        user: parsedEvent.from,
        market: market,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedFrom);
      let reserveRepatriatedTo = new ReserveRepatriated({
        amount: BigDecimal(parsedEvent.amount),
        user: parsedEvent.to,
        market: market,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedTo);
      const userFrom = await ctx.store.findOne(UserBalance, {
        where: { user: parsedEvent.from, market: { id: marketId } },
        relations: { market: true },
      });
      if (userFrom) {
        userFrom.balanceChange =
          userFrom.balanceChange - this.convertWeiToNumber(parsedEvent.amount);
        await ctx.store.save(userFrom);
      } else {
        const newUser = new UserBalance({
          user: parsedEvent.from,
          balanceChange: this.convertWeiToNumber(parsedEvent.amount) * -1,
        });
        await ctx.store.save(newUser);
      }
      const userTo = await ctx.store.findOne(UserBalance, {
        where: { user: parsedEvent.to, market: { id: marketId } },
        relations: { market: true },
      });
      if (userTo) {
        userTo.balanceChange =
          userTo.balanceChange + this.convertWeiToNumber(parsedEvent.amount);
        await ctx.store.save(userTo);
      } else {
        const newUser = new UserBalance({
          user: parsedEvent.to,
          balanceChange: this.convertWeiToNumber(parsedEvent.amount),
        });
        await ctx.store.save(newUser);
      }
    } else {
      console.error("Unsupported spec");
    }
  }

  convertWeiToNumber(weiValue: bigint): number {
    const weiToEtherConversionFactor: bigint = 1000000000000000000n;

    const etherValue: bigint = weiValue / weiToEtherConversionFactor;

    return Number(etherValue);
  }
}
