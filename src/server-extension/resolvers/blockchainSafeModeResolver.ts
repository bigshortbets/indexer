import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { BlockchainSafeModeProvider } from "../../utils/blockchainSafeModeProvider";

@ObjectType()
export class BlockchainSafeMode {
  @Field(() => BigInt, { nullable: true })
  block?: bigint;
  constructor(props: Partial<BlockchainSafeMode>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class BlockchainSafeModeResolver {
  @Query(() => BlockchainSafeMode)
  async getBlockchainSafeMode(
    @Arg("blockhash", { nullable: true }) blockhash: string
  ): Promise<BlockchainSafeMode> {
    return new BlockchainSafeMode({
      block: await BlockchainSafeModeProvider.getSafeMode(blockhash),
    });
  }
}
