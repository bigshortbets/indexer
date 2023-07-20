import {EventProcessor} from "./eventProcessor";
import {MarketCreatedEventProcessor} from "./marketCreatedEventProcessor";
import {OrderCreatedEventProcessor} from "./orderCreatedEventProcessor";
import {PositionCreatedEventProcessor} from "./postionCreatedEventProcessor";

const processors: EventProcessor[] = [
    new MarketCreatedEventProcessor(),
    new OrderCreatedEventProcessor(),
    new PositionCreatedEventProcessor()
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
