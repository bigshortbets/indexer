// src/server-extension/resolvers/marginResolver.ts
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MarginProvider } from "../../utils";

@ObjectType()
export class MarginDataForMarket {
  @Field(() => String, { nullable: false })
  data!: string;

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
    return new MarginDataForMarket({
      data: await MarginProvider.getMarginForMarket(marketId, walletAddress),
    });
  }
}
