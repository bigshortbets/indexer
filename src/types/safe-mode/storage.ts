import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const enteredUntil =  {
    /**
     *  Contains the last block number that the safe-mode will remain entered in.
     * 
     *   Set to `None` when safe-mode is exited.
     * 
     *  Safe-mode is automatically exited when the current block number exceeds this value.
     */
    v2: new StorageType('SafeMode.EnteredUntil', 'Optional', [], sts.number()) as EnteredUntilV2,
}

/**
 *  Contains the last block number that the safe-mode will remain entered in.
 * 
 *   Set to `None` when safe-mode is exited.
 * 
 *  Safe-mode is automatically exited when the current block number exceeds this value.
 */
export interface EnteredUntilV2  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(number | undefined)>
}
