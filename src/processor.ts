import {
    BatchContext,
    BatchProcessorCallItem,
    BatchProcessorEventItem,
    BatchProcessorItem,
    SubstrateBatchProcessor,
} from '@subsquid/substrate-processor'
const eventData =
    {
        data: {
            event: {
                args: true,
                    call: true,
                    extrinsic: {
                    hash: true,
                        fee: true,
                },
            },
        },
    }
export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        chain: '127.0.0.1:9944',
        archive: 'http://localhost:8888/graphql'
    })
    .addEvent('Market.MarketCreated', eventData)
    .addEvent('Market.OrderCreated', eventData)
    .addEvent('Market.PositionCreated', eventData)

export type Item = BatchProcessorItem<typeof processor>
export type EventItem = BatchProcessorEventItem<typeof processor>
export type CallItem = BatchProcessorCallItem<typeof processor>
export type ProcessorContext<Store> = BatchContext<Store, Item>
