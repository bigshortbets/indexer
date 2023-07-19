import {EventProcessor} from "./eventProcessor";
import {MarketCreatedEventProcessor} from "./marketCreatedEventProcessor";

const processors: EventProcessor[] = [
    new MarketCreatedEventProcessor()
];

export class EventProcessorProvider {

    processorMap = new Map<String, EventProcessor>;

    constructor() {
        processors.map(processor => {
            this.processorMap.set(processor.getHandledItemName(), processor);
        })
    }

    getProcessorByName(name: String): EventProcessor | undefined {
        return this.processorMap.get(name);
    }
}
