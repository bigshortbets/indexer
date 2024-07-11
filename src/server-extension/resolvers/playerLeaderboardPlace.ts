import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { getUserPlace } from "../../utils/userLeaderboardPlaceProvider";
import type { EntityManager } from "typeorm";
import { GeneralLeaderboard } from "../../model";

@ObjectType()
export class PlayerLeaderBoardMode {
  @Field(() => Number, { nullable: true })
  rankingPlace?: number;
  constructor(props: Partial<PlayerLeaderBoardMode>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class PlayerLeaderBoardResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => PlayerLeaderBoardMode)
  async getPlayerLeaderboardPlace(
    @Arg("userAddress") userAddress: string
  ): Promise<PlayerLeaderBoardMode> {
    const manager = await this.tx();

    const allUsers = await manager.getRepository(GeneralLeaderboard).find();
    if (allUsers.length == 0) {
      throw new Error("Leaderboard is empty");
    }
    return new PlayerLeaderBoardMode({
      rankingPlace: await getUserPlace(allUsers, userAddress),
    });
  }
}
