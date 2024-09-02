// src/server-extension/resolvers/marginResolver.ts
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { NicknameProvider } from "../../utils/nicknameProvider";

@ObjectType()
export class Nickname {
  @Field(() => String, { nullable: true })
  nickname!: string;

  constructor(props: Partial<Nickname>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class NicknameResolver {
  @Query(() => Nickname)
  async getNickname(
    @Arg("walletAddress", { nullable: false }) walletAddress: string,
  ): Promise<Nickname> {
    if (walletAddress.length === 0) {
      throw new Error("Wallet Address is empty");
    }

    return new Nickname({
      nickname: await NicknameProvider.getNickname(walletAddress),
    });
  }
}
