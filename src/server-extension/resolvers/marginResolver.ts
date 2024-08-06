// src/server-extension/resolvers/marginResolver.ts
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MarginProvider, USDC_DECIMALS } from "../../utils";
import { BigDecimal } from "@subsquid/big-decimal";

@ObjectType()
export class MarginDataForMarket {
  @Field(() => BigDecimal, { nullable: false })
  Margin!: BigDecimal;

  constructor(props: Partial<MarginDataForMarket>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class MarginResolver {
  @Query(() => MarginDataForMarket)
  async getMargin(
    @Arg("marketId", { nullable: false }) marketId: string,
    @Arg("walletAddress", { nullable: false }) walletAddress: string,
  ): Promise<MarginDataForMarket> {
    if (marketId.length === 0 || walletAddress.length === 0) {
      throw new Error("MarketId or WalletAddress is empty");
    }
    const marginForMarket = await MarginProvider.getMarginForMarket(
      marketId,
      walletAddress,
    );
    return new MarginDataForMarket({
      Margin: BigDecimal(marginForMarket, USDC_DECIMALS),
    });
  }
}
