import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import type { EntityManager } from "typeorm";
import { BlockchainTimestamp } from "../../model";

// Define custom GraphQL ObjectType of the query result
@ObjectType()
export class BlockchainTimestampResult {
  @Field(() => Number, { nullable: false })
  height!: number;

  constructor(props: Partial<BlockchainTimestampResult>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class BlockchainTimestampResolver {
  // Set by dependency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => BlockchainTimestampResult)
  async blockchainTimestamp(): Promise<BlockchainTimestampResult> {
    const manager = await this.tx();

    // execute custom SQL query
    const result: { height: number } = await manager
      .getRepository(BlockchainTimestamp)
      .query(
        `SELECT 
        MAX(timestamp) as timestamp
      FROM blockchain_timestamp`,
      );

    return new BlockchainTimestampResult(result);
  }
}
