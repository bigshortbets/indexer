import { DataHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { OracleChartFeed15Min, OracleChartFeed1H, Market } from "../../model";
import { BigDecimal } from "@subsquid/big-decimal";

export async function update15MinCandle(
  ctx: DataHandlerContext<Store, any>,
  market: Market,
  price: BigDecimal,
  timestamp: bigint,
) {
  let candle: any;

  candle = await ctx.store.findOne(OracleChartFeed15Min, {
    where: { market: { id: market.id }, timestamp: timestamp },
    relations: { market: true },
  });
  if (!candle) {
    candle = new OracleChartFeed15Min();
    candle.id = `${market.id}.${timestamp}`;
    candle.market = market;
    candle.timestamp = timestamp;
    candle.openPrice = price;
    candle.lowPrice = price;
    candle.highPrice = price;
  } else {
    if (price.lt(candle.lowPrice)) candle.lowPrice = price;
    if (price.gt(candle.highPrice)) candle.highPrice = price;
  }

  candle.closePrice = price;
  await ctx.store.save(candle);
}

export async function update1HCandle(
  ctx: DataHandlerContext<Store, any>,
  market: Market,
  price: BigDecimal,
  timestamp: bigint,
) {
  let candle: any;

  candle = await ctx.store.findOne(OracleChartFeed1H, {
    where: { market: { id: market.id }, timestamp: timestamp },
    relations: { market: true },
  });
  if (!candle) {
    candle = new OracleChartFeed1H();
    candle.id = `${market.id}.${timestamp}`;
    candle.market = market;
    candle.timestamp = timestamp;
    candle.openPrice = price;
    candle.lowPrice = price;
    candle.highPrice = price;
  } else {
    if (price.lt(candle.lowPrice)) candle.lowPrice = price;
    if (price.gt(candle.highPrice)) candle.highPrice = price;
  }

  candle.closePrice = price;
  await ctx.store.save(candle);
}
