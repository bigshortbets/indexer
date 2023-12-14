import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v10 from '../v10'

export const values =  {
    /**
     *  Up to date combined value from Raw Values
     */
    v1: new StorageType('Oracle.Values', 'Optional', [v1.BoundedVec], v1.TimestampedValue) as ValuesV1,
    /**
     *  Up to date combined value from Raw Values
     */
    v10: new StorageType('Oracle.Values', 'Optional', [sts.bigint()], v10.TimestampedValue) as ValuesV10,
}

/**
 *  Up to date combined value from Raw Values
 */
export interface ValuesV1  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1.BoundedVec): Promise<(v1.TimestampedValue | undefined)>
    getMany(block: Block, keys: v1.BoundedVec[]): Promise<(v1.TimestampedValue | undefined)[]>
    getKeys(block: Block): Promise<v1.BoundedVec[]>
    getKeys(block: Block, key: v1.BoundedVec): Promise<v1.BoundedVec[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1.BoundedVec[]>
    getKeysPaged(pageSize: number, block: Block, key: v1.BoundedVec): AsyncIterable<v1.BoundedVec[]>
    getPairs(block: Block): Promise<[k: v1.BoundedVec, v: (v1.TimestampedValue | undefined)][]>
    getPairs(block: Block, key: v1.BoundedVec): Promise<[k: v1.BoundedVec, v: (v1.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1.BoundedVec, v: (v1.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1.BoundedVec): AsyncIterable<[k: v1.BoundedVec, v: (v1.TimestampedValue | undefined)][]>
}

/**
 *  Up to date combined value from Raw Values
 */
export interface ValuesV10  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v10.TimestampedValue | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v10.TimestampedValue | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v10.TimestampedValue | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v10.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v10.TimestampedValue | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v10.TimestampedValue | undefined)][]>
}
