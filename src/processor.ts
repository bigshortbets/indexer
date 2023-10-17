import {
    SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'
import { EventProcessorProvider } from "./eventprocessor/eventProcessorProvider";

console.log(process.env.DATA_SOURCE_ARCHIVE)
const provider = new EventProcessorProvider();
export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        chain: process.env.DATA_SOURCE_CHAIN as string,
    })
    .addEvent({ name: provider.getAllProcessesNames() })
    .setFields({ event: {}, block: {timestamp: true} });
