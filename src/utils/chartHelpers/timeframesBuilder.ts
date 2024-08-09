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
    where: { market: { id: market.id }, time: timestamp } as any,
  });
  if (!candle) {
    candle = new CandleClass();
    candle.id = `${market.id}.${timestamp}`;
    candle.market = market;
    candle.time = timestamp;
    candle.open = price;
    candle.low = price;
    candle.high = price;
  } else {
    if (price.lt(candle.low)) candle.low = price;
    if (price.gt(candle.high)) candle.high = price;
  }

  candle.close = price;
  await ctx.store.save(candle);
}
