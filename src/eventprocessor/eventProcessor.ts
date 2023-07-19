import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";

export interface EventProcessor {
    process(ctx: BatchContext<Store, AddEventItem<any, any>>, item: AddEventItem<any, any>): Promise<void>;
    getHandledItemName(): string;
}
