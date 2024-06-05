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
import { encodeUserValue } from "../../utils/encodersUtils";

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
    const found = block.events.find(
      (element) =>
        element.index === event.index + 1 &&
        element.extrinsicIndex === event.extrinsicIndex &&
        (element.name === "Market.PositionMarkedToMarket" ||
          element.name === "Market.PositionReduced" ||
          element.name === "Market.PositionClosed"),
    );
    if (reserveRepatriatedEvent.is(event)) {
      const parsedEvent = reserveRepatriatedEvent.decode(event);
      const marketId = found?.args.market;

      const userFromAddress = encodeUserValue(parsedEvent.from);
      const userToAddress = encodeUserValue(parsedEvent.to);

      let market = await ctx.store.get(Market, marketId);
      let reserveRepatriatedFrom = new MarketSettlements({
        id: `${event.id}.0`,
        amount: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        user: userFromAddress,
        market: market,
        type: TransferType.OUTGOING,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedFrom);
      let reserveRepatriatedTo = new MarketSettlements({
        id: `${event.id}.1`,
        amount: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        user: userToAddress,
        market: market,
        type: TransferType.INGOING,
        // @ts-ignore
        timestamp: new Date(block.header.timestamp),
      });
      await ctx.store.save(reserveRepatriatedTo);
      const userFrom = await ctx.store.findOne(UserBalance, {
        where: {
          user: userFromAddress,
          market: { id: marketId },
        },
        relations: { market: true },
      });
      if (userFrom) {
        userFrom.balanceChange = userFrom.balanceChange.sub(
          BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        );
        await ctx.store.save(userFrom);
      } else {
        const newUser = new UserBalance({
          id: `${event.id}.0`,
          user: userFromAddress,
          balanceChange: BigDecimal(parsedEvent.amount, USDC_DECIMALS).times(
            -1,
          ),
          market: market,
        });
        await ctx.store.save(newUser);
      }
      const userTo = await ctx.store.findOne(UserBalance, {
        where: {
          user: userToAddress,
          market: { id: marketId },
        },
        relations: { market: true },
      });
      if (userTo) {
        userTo.balanceChange = userTo.balanceChange.add(
          BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        );
        await ctx.store.save(userTo);
      } else {
        const newUser = new UserBalance({
          id: `${event.id}.1`,
          user: userToAddress,
          balanceChange: BigDecimal(parsedEvent.amount, USDC_DECIMALS),
          market: market,
        });
        await ctx.store.save(newUser);
      }
    } else {
      console.error("Unsupported spec");
    }
  }
}
