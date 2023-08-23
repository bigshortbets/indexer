import {describe, it} from "node:test";
import {Market} from "../../src/model";
import {AddEventItem, EventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketCreatedEventProcessor} from "../../src/eventprocessor/market/marketCreatedEventProcessor";
import mock = jest.mock;

describe('process function', () => {
    it('should save new Market to the database upon receiving Market.MarketCreated event', async () => {
        const mockCtx = mock()

        const mockBlock = {
            header: {
                extrinsicsRoot: '0x953f4d8f1457aa85731a0a967df0469ce23efcdacf86c396a8f783374f2a0638',
                hash: '0xbb89ae8a57a35f09c57e864612d4853c1d9bb55c0988296b2e3c6570666f2d2d',
                height: 1106,
                id: '0000001106-bb89a',
                parentHash: '0x0d5de5aca2fed9974da601c7037ae74323c5ae5471099b7ad84d29c354ad8e19',
                specId: 'BigSB Node@1',
                stateRoot: '0x7bd7de7f5d82badb6ba8fb03ce68d8fefbb695471470955bd592a3f870f6a56c',
                timestamp: 1691485977001,
                validator: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
            },
            items: [Object, Object]
        } as BatchBlock<any>;

        const mockItem =
                {
                    kind: 'event',
                    name: 'Market.MarketCreated',
                    event: {
                        args: {
                            contractUnit: 230,
                            initialMargin: 10,
                            lifetime: 1106,
                            maintenanceMargin: 1,
                            marketId: '1',
                            tickSize: '10',
                            ticker: '0x534f4d455448494e'
                        },
                        id: '0000001106-000003-bb89a',
                        name: 'Market.MarketCreated',
                        pos: 7,
                        extrinsic: Object,
                        call: [Object]
                    }
                } as AddEventItem<any, any>;

        const mockParsedEvent = {
            isXTypeOfEvent: true,
            asX: {
                market: 'market123',
                price: 100,
            },
        };

        jest.spyOn(SomeEvent.prototype, 'isV1').mockReturnValue(true);
        jest.spyOn(SomeEvent.prototype, 'asV1').mockReturnValue(mockParsedEvent);

        await MarketCreatedEventProcessor.process(mockCtx, mockBlock, mockItem); // todo fix

        expect(mockCtx.store.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: mockItem.event.args.marketId,
                ticker: mockItem.event.args.ticker, // możliwe że trzeba przerobić
                tickerSize: mockItem.event.args.tickerSize,
                lifetime: mockItem.event.args.lifetime,
                initialMargin: mockItem.event.args.initialMargin,
                maintananceMargin: mockItem.event.args.maintenanceMargin,
                contractUnit: mockItem.event.args.contractUnit
            })
        );
    });

    // it('should throw an error for unsupported spec', async () => {
    //     const mockCtx = {
    //         store: {
    //             save: jest.fn(),
    //             get: jest.fn(),
    //         },
    //     } as unknown as Context<Store, EventItem<any, any>>;
    //
    //     const mockBlock = {} as Block<Item>;
    //
    //     const mockItem = {
    //         event: {
    //             id: 'event123',
    //         },
    //     } as EventItem<any, any>;
    //
    //     jest.spyOn(SomeEvent.prototype, 'isXTypeOfEvent').mockReturnValue(false);
    //
    //     await expect(process(mockCtx, mockBlock, mockItem)).rejects.toThrowError('Unsupported spec');
    // });
});