import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import {
  MarketSettlements,
  UserBalance,
  Market,
  TransferType,
} from "../../model";
import {
  DataHandlerContext,
  Block,
  Event,
  Call,
} from "@subsquid/substrate-processor";
import * as events from "../../types/events";
import { BigDecimal } from "@subsquid/big-decimal";
import { USDC_DECIMALS } from "../../utils";

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
      let reserveRepatriatedFrom = new MarketSettlements({
        id: `${block.header.id}.${event.id}.0`,
        amount: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        user: parsedEvent.from,
        market: market,
        type: TransferType.OUTGOING,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedFrom);
      let reserveRepatriatedTo = new MarketSettlements({
        id: `${block.header.id}.${event.id}.1`,
        amount: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        user: parsedEvent.to,
        market: market,
        type: TransferType.INGOING,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedTo);
      const userFrom = await ctx.store.findOne(UserBalance, {
        where: { user: parsedEvent.from, market: { id: marketId } },
        relations: { market: true },
      });
      if (userFrom) {
        userFrom.balanceChange = userFrom.balanceChange.sub(
          BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        );
        await ctx.store.save(userFrom);
      } else {
        const newUser = new UserBalance({
          id: `${block.header.id}.${event.id}.0`,
          user: parsedEvent.from,
          balanceChange: BigDecimal(parsedEvent.amount, USDC_DECIMALS).times(
            -1,
          ),
        });
        await ctx.store.save(newUser);
      }
      const userTo = await ctx.store.findOne(UserBalance, {
        where: { user: parsedEvent.to, market: { id: marketId } },
        relations: { market: true },
      });
      if (userTo) {
        userTo.balanceChange = userTo.balanceChange.add(
          BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        );
        await ctx.store.save(userTo);
      } else {
        const newUser = new UserBalance({
          id: `${block.header.id}.${event.id}.1`,
          user: parsedEvent.to,
          balanceChange: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
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
