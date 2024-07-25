import { DataHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { OracleChartFeed15Min, OracleChartFeed1H, Market } from "../../model";
import { BigDecimal } from "@subsquid/big-decimal";

type CandleType = OracleChartFeed15Min | OracleChartFeed1H;

export async function updateCandle<T extends CandleType>(
  ctx: DataHandlerContext<Store, any>,
  market: Market,
  price: BigDecimal,
  timestamp: bigint,
  CandleClass: { new (): T },
) {
  let candle: T | undefined;

  candle = await ctx.store.findOne(CandleClass, {
    where: { market: { id: market.id }, timestamp: timestamp } as any,
  });
  if (!candle) {
    candle = new CandleClass();
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
