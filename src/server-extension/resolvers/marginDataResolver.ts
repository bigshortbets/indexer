// src/server-extension/resolvers/marginDataResolver.ts
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MarginDataProvider } from "../../utils";

@ObjectType()
class MarginDataTuple {
  @Field(() => BigInt)
  balance!: bigint;

  @Field(() => String, { nullable: true })
  status!: string | null;
}

@ObjectType()
export class MarginData {
  @Field(() => MarginDataTuple, { nullable: false })
  MarginData!: MarginDataTuple;

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
    const response = await MarginDataProvider.getMarginDataForMarket(
      marketId,
      walletAddress,
    );
    const balance = BigInt(response[0]).toString();
    return new MarginData({
      MarginData: {
        balance: BigInt(balance),
        status: response[1],
      },
    });
  }
}
