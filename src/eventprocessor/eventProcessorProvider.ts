import { EventProcessor } from "./eventProcessor";
import { MarketCreatedEventProcessor } from "./market/marketCreatedEventProcessor";
import { OrderCreatedEventProcessor } from "./market/orderCreatedEventProcessor";
import { PositionCreatedEventProcessor } from "./market/postionCreatedEventProcessor";
import { OrderCanceledEventProcessor } from "./market/orderCanceledEventProcessor";
import { OrderFilledEventProcessor } from "./market/orderFilledEventProcessor";
import { OrderReducedEventProcessor } from "./market/orderReducedEventProcessor";
import { MarketRemovedEventProcessor } from "./market/marketRemovedEventProcessor";
import { PositionClosedEventProcessor } from "./market/positionClosedEventProcessor";
import { PositionsReducedEventProcessor } from "./market/positionsReducedEventProcessor";
import { PositionMarkedToMarketEventProcessor } from "./market/positionMarkedToMarketEventProcessor";
import { LatestOraclePriceProcessor } from "./market/latestOraclePriceProcessor";

const processors: EventProcessor[] = [
  new MarketCreatedEventProcessor(),
  new OrderCreatedEventProcessor(),
  new PositionCreatedEventProcessor(),
  new OrderCanceledEventProcessor(),
  new OrderFilledEventProcessor(),
  new OrderReducedEventProcessor(),
  new MarketRemovedEventProcessor(),
  new PositionClosedEventProcessor(),
  new PositionsReducedEventProcessor(),
  new PositionMarkedToMarketEventProcessor(),
  new LatestOraclePriceProcessor(),
];

export class EventProcessorProvider {
  processorMap = new Map<String, EventProcessor>();

  constructor() {
    processors.map((processor) => {
      this.processorMap.set(processor.getHandledEventName(), processor);
    });
  }

  getProcessorByName(name: String): EventProcessor | undefined {
    return this.processorMap.get(name);
  }
  getEventProcessors(): EventProcessor[] {
    return processors;
  }

  getAllProcessesNames(): string[] {
    return processors.map((p) => p.getHandledEventName());
  }
}
