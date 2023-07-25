import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {Item} from "../processor";

export interface EventProcessor {
    process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>): Promise<void>;
    getHandledItemName(): string;
}
