import {EventProcessor} from "./eventProcessor";
import {MarketCreatedEventProcessor} from "./marketCreatedEventProcessor";
import {OrderCreatedEventProcessor} from "./orderCreatedEventProcessor";
import {PositionCreatedEventProcessor} from "./postionCreatedEventProcessor";
import {OraclePriceEventProcessor} from "./oraclePriceEventProcessor";
import {OrderCanceledEventProcessor} from "./orderCanceledEventProcessor";
import {OrderFilledEventProcessor} from "./orderFilledEventProcessor";
import {OrderReducedEventProcessor} from "./orderReducedEventProcessor";

const processors: EventProcessor[] = [
    new MarketCreatedEventProcessor(),
    new OrderCreatedEventProcessor(),
    new PositionCreatedEventProcessor(),
    new OraclePriceEventProcessor(),
    new OrderCanceledEventProcessor(),
    new OrderFilledEventProcessor(),
    new OrderReducedEventProcessor(),
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
    getEventProcessors() : EventProcessor[] {
        return processors;
    }
}
