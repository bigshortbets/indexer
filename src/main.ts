import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {EventProcessorProvider} from "./eventprocessor/eventProcessorProvider";
import {DailyVolumeHandler} from "./eventprocessor/market/dailyVolumeHandler";

const processorProvider = new EventProcessorProvider();
let lastUpdateTime = -1;
processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            let processor = processorProvider.getProcessorByName(item.name);
            await processor?.process(ctx, block, item);
        }
    }

    if(ctx.isHead) {
        const now = Date.now();
        if(now - lastUpdateTime >= 1000 * 15) { // TODO: set some manageable value
            await DailyVolumeHandler.calculate24hVolume(ctx.store)
            lastUpdateTime = now;
        }
    }
})
