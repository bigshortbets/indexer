import {
    BatchContext,
    BatchProcessorCallItem,
    BatchProcessorEventItem,
    BatchProcessorItem,
    SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'
import { EventProcessorProvider } from "./eventprocessor/eventProcessorProvider";
const eventData =
    {
        data: {
            event: {
                args: true,
                    call: true,
                    extrinsic: {
                    	hash: true,
                        fee: true,
                        indexInBlock: true
                },
            },
        },
    }
console.log(process.env.DATA_SOURCE_ARCHIVE)
export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        chain: process.env.DATA_SOURCE_CHAIN,
        archive: process.env.DATA_SOURCE_ARCHIVE + '/graphql'
    })
const provider = new EventProcessorProvider();
provider
    .getEventProcessors()
    .forEach(p => processor.addEvent(p.getHandledItemName(), eventData));

export type Item = BatchProcessorItem<typeof processor>
export type EventItem = BatchProcessorEventItem<typeof processor>
export type CallItem = BatchProcessorCallItem<typeof processor>
export type ProcessorContext<Store> = BatchContext<Store, Item>
