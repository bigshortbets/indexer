import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {EventProcessorProvider} from "./eventprocessor/eventProcessorProvider";

const processorProvider = new EventProcessorProvider();
processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            let processor = processorProvider.getProcessorByName(item.name);
            await processor?.process(ctx, item);
        }
    }
})
