import { EventProcessor } from "./eventProcessor";
import { MarketCreatedEventProcessor } from "./market/marketCreatedEventProcessor";
import { OrderCreatedEventProcessor } from "./market/orderCreatedEventProcessor";
import { PositionCreatedEventProcessor } from "./market/positionCreatedEventProcessor.ts";
import { OrderCanceledEventProcessor } from "./market/orderCanceledEventProcessor";
import { OrderFilledEventProcessor } from "./market/orderFilledEventProcessor";
import { OrderReducedEventProcessor } from "./market/orderReducedEventProcessor";
import { MarketClosedEventProcessor } from "./market/marketClosedEventProcessor";
import { MarketRemovedEventProcessor } from "./market/marketRemovedEventProcessor";
import { PositionClosedEventProcessor } from "./market/positionClosedEventProcessor";
import { PositionReducedEventProcessor } from "./market/positionReducedEventProcessor";
import { PositionMarkedToMarketEventProcessor } from "./market/positionMarkedToMarketEventProcessor";
import { LatestOraclePriceProcessor } from "./market/latestOraclePriceProcessor";
import { OrderExtendedEventProcessor } from "./market/orderExtendedEventProcessor";
import { WithdrawRequestedEventProcessor } from "./bridge/withdrawRequestedEventProcessor";
import { WithdrawCanceledEventProcessor } from "./bridge/withdrawCanceledEventProcess";
import { WithdrawApprovedEventProcessor } from "./bridge/withdrawApprovedEventProcessor";
import { ReserveRepatriatedEventProcessor } from "./balances/reserveRepatriatedEventProcessor";

const processors: EventProcessor[] = [
  new MarketCreatedEventProcessor(),
  new OrderCreatedEventProcessor(),
  new PositionCreatedEventProcessor(),
  new OrderCanceledEventProcessor(),
  new OrderFilledEventProcessor(),
  new OrderReducedEventProcessor(),
  new MarketClosedEventProcessor(),
  new MarketRemovedEventProcessor(),
  new PositionClosedEventProcessor(),
  new PositionReducedEventProcessor(),
  new PositionMarkedToMarketEventProcessor(),
  new LatestOraclePriceProcessor(),
  new OrderExtendedEventProcessor(),
  new WithdrawCanceledEventProcessor(),
  new WithdrawRequestedEventProcessor(),
  new WithdrawApprovedEventProcessor(),
  new ReserveRepatriatedEventProcessor(),
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
