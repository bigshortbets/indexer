import {
    SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'
import { EventProcessorProvider } from "./eventprocessor/eventProcessorProvider";

console.log(process.env.DATA_SOURCE_ARCHIVE)
const provider = new EventProcessorProvider();
export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        chain: process.env.DATA_SOURCE_CHAIN as string,
        archive: process.env.DATA_SOURCE_ARCHIVE + '/graphql' // TODO: Możliwe że to trzeba zmienić ale nie wiem jak - step 2
    })
    .addEvent({ name: provider.getAllProcessesNames() })
    .setFields({ event: {} });
