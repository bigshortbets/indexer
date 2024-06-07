import { EventProcessor } from "../eventProcessor";
import { Store } from "@subsquid/typeorm-store";
import {
  MarketSettlements,
  UserBalance,
  Market,
  TransferType,
  GeneralLeaderboard,
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
        (element.index === event.index + 1 ||
          element.index === event.index + 2 ||
          element.index === event.index + 3) &&
        element.callAddress?.toString() === event.callAddress?.toString() &&
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

      if (!market) {
        console.error(`Skipped - market does not exists: ${marketId}`);
        return;
      }

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

      await this.saveUserBalance(
        ctx,
        userFromAddress,
        marketId,
        BigDecimal(parsedEvent.amount, USDC_DECIMALS).times(-1),
        market,
        event.id,
        "0",
      );
      await this.saveUserBalance(
        ctx,
        userFromAddress,
        marketId,
        BigDecimal(parsedEvent.amount, USDC_DECIMALS),
        market,
        event.id,
        "1",
      );
      await this.saveGeneralRanking(
        ctx,
        userFromAddress,
        BigDecimal(parsedEvent.amount, USDC_DECIMALS).times(-1),
      );
      await this.saveGeneralRanking(
        ctx,
        userToAddress,
        BigDecimal(parsedEvent.amount, USDC_DECIMALS),
      );
    } else {
      console.error("Unsupported spec");
    }
  }

  private async saveGeneralRanking(
    ctx: DataHandlerContext<Store, any>,
    userAddress: string,
    amount: BigDecimal,
  ) {
    const user = await ctx.store.findOne(GeneralLeaderboard, {
      where: {
        id: userAddress,
      },
    });
    if (user) {
      user.balanceChange = user.balanceChange.add(amount);
      await ctx.store.save(user);
    } else {
      const newUser = new GeneralLeaderboard({
        id: userAddress,
        balanceChange: amount,
      });
      await ctx.store.save(newUser);
    }
  }

  private async saveUserBalance(
    ctx: DataHandlerContext<Store, any>,
    userAddress: string,
    marketId: string,
    amount: BigDecimal,
    market: Market,
    eventId: string,
    idSufix: string,
  ) {
    const user = await ctx.store.findOne(UserBalance, {
      where: {
        user: userAddress,
        market: { id: marketId },
      },
      relations: { market: true },
    });
    if (user) {
      user.balanceChange = user.balanceChange.add(amount);
      await ctx.store.save(user);
    } else {
      const newUser = new UserBalance({
        id: `${eventId}.${idSufix}`,
        user: userAddress,
        balanceChange: amount,
        market: market,
      });
      await ctx.store.save(newUser);
    }
  }
}
