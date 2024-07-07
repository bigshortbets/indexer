import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { OraclePriceProvider } from "../../utils";

@ObjectType()
export class LatestOraclePrice {
  @Field(() => String, { nullable: false })
  price!: BigInt;
  constructor(props: Partial<LatestOraclePrice>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class HistoricalOraclePrice {
  @Field(() => String, { nullable: false })
  price!: BigInt;

  @Field(() => Date, { nullable: false })
  timestamp!: Date;

  constructor(props: Partial<HistoricalOraclePrice>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class OraclePriceResolver {
  @Query(() => LatestOraclePrice)
  async getLatestOraclePrice(
    @Arg("marketId", { nullable: false }) marketId: string,
  ): Promise<LatestOraclePrice> {
    if (marketId.length == 0) {
      throw new Error("MarketId is empty");
    }
    return new LatestOraclePrice({
      price:
        await OraclePriceProvider.getLatestOraclePriceForMarketId(marketId),
    });
  }

  @Query(() => [HistoricalOraclePrice])
  async getHistoricalOraclePrices(
    @Arg("marketId", { nullable: false }) marketId: string,
    @Arg("startDate", () => Date, { nullable: false }) startDate: Date,
    @Arg("endDate", () => Date, { nullable: false }) endDate: Date,
  ): Promise<HistoricalOraclePrice[]> {
    if (marketId.length == 0) {
      throw new Error("MarketId is empty");
    }
    if (startDate >= endDate) {
      throw new Error("StartDate must be before EndDate");
    }
    const historicalPrices = await OraclePriceProvider.getHistoricalOraclePricesForMarketId(
      marketId,
      startDate,
      endDate
    );
    return historicalPrices.map(priceData => new HistoricalOraclePrice(priceData));
  }
}