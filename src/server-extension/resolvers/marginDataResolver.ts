// src/server-extension/resolvers/marginDataResolver.ts
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MarginDataProvider } from "../../utils";

@ObjectType()
export class MarginData {
  @Field(() => String, { nullable: false })
  data!: string;

  constructor(props: Partial<MarginData>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class MarginDataResolver {
  @Query(() => MarginData)
  async getMarginData(
    @Arg("marketId", { nullable: false }) marketId: string,
    @Arg("walletAddress", { nullable: false }) walletAddress: string,
  ): Promise<MarginData> {
    if (marketId.length === 0 || walletAddress.length === 0) {
      throw new Error("MarketId or WalletAddress is empty");
    }
    return new MarginData({
      data: await MarginDataProvider.getMarginDataForMarket(marketId, walletAddress),
    });
  }
}
