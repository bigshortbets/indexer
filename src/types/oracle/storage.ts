import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v2 from '../v2'

export const values =  {
    /**
     *  Up to date combined value from Raw Values
     */
    v2: new StorageType('Oracle.Values', 'Optional', [sts.bigint()], v2.TimestampedValue) as ValuesV2,
}

/**
 *  Up to date combined value from Raw Values
 */
export interface ValuesV2  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v2.TimestampedValue | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v2.TimestampedValue | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v2.TimestampedValue | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v2.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v2.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v2.TimestampedValue | undefined)][]>
}
