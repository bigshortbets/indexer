import {Store} from "@subsquid/typeorm-store";
import {OraclePrice, Position, PositionStatus, UnrealizedProfitLose} from "../../model";

export class UnrealizedPLNet{
    public static async updateAfterOraclePriceChange(store: Store, oraclePrice: OraclePrice) {
        let positions = await store.find(Position,
            {
                where: {
                    market: {id: oraclePrice.market.id },
                    status: PositionStatus.OPEN
                },
                relations : {market: true}
            })
        const resultMap: Map<string, bigint> = positions.reduce((map, position) => {
            if(position.long && position.short){
                const delta = position.quantityLeft * (position.price - oraclePrice.price)

                if (map.has(position.long)) {
                    map.set(
                        position.long,
                        map.get(position.long) || BigInt(0) - delta);
                } else {
                    map.set(position.long, -delta)
                }

                if(map.has(position.short)) {
                    map.set(
                        position.short,
                        map.get(position.short) || BigInt(0) + delta);
                } else {
                    map.set(position.short, delta)
                }
            }
            return map;
        }, new Map<string, bigint>());

        let unrealizedPLNetListForMarket = await store.find(
            UnrealizedProfitLose, {where: {market: {id: oraclePrice.id}}})
        unrealizedPLNetListForMarket.forEach(elem => {
            const value = resultMap.get(elem.user)
            if(value) {
                elem.value = value
            } else {
                throw new Error('Unrealized profit/lose list and list of open positions do not match')
            }
        })
        await store.save(unrealizedPLNetListForMarket)
    }

    public static async updateAfterPositionChange(store: Store, position: Position, newQuantity: bigint) { // UPDATE/CREATION//REMOVAL
        let unrealizedPLNetShort = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.short)
        let unrealizedPLNetLong = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.long)

        if(unrealizedPLNetShort && unrealizedPLNetLong) {
            const delta = BigInt(position.quantityLeft - newQuantity) * position.price
            unrealizedPLNetShort.value -= delta
            unrealizedPLNetLong.value -= delta

            await store.save([unrealizedPLNetLong, unrealizedPLNetShort])
        } else {
            throw new Error('Unrealised profit/lose is bound to unknown users')
        }
    }

    public static async updateAfterPositionCreation(store: Store, position: Position) { // UPDATE/CREATION//REMOVAL
        let unrealizedPLNetShort = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.short)
        let unrealizedPLNetLong = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.long)
        const delta = position.quantityLeft * position.price

        if (unrealizedPLNetShort && unrealizedPLNetLong) {
            unrealizedPLNetShort.value += delta
            unrealizedPLNetLong.value += delta
        } else {
            unrealizedPLNetShort = new UnrealizedProfitLose({
                id: position.id,
                user: position.short,
                value: delta,
                market: position.market
            })
            unrealizedPLNetLong = new UnrealizedProfitLose({
                id: position.id,
                user: position.long,
                value: delta,
                market: position.market
            })
        }
        await store.save([unrealizedPLNetLong, unrealizedPLNetShort])
    }

    public static async updateAfterMarkedToMarket(store: Store, position: Position, oraclePrice: OraclePrice) {
        let unrealizedPLNetShort = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.short)
        let unrealizedPLNetLong = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.long)

        if(unrealizedPLNetShort && unrealizedPLNetLong) {
            const delta = (position.price - oraclePrice.price) * position.quantityLeft
            unrealizedPLNetShort.value += delta
            unrealizedPLNetLong.value -= delta
            store.save([unrealizedPLNetLong, unrealizedPLNetShort])
        } else {
            throw new Error('Position sides do not match entries in Unrealized Profit/Lose table')
        }
    }

    public static async updateAfterPositionClosure(store: Store, position: Position) {
        let unrealizedPLNetShort = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.short)
        let unrealizedPLNetLong = await UnrealizedPLNet.getUnrealisedPLNet(store, position.market.id, position.long)
        const delta = position.quantityLeft * position.price
        if(unrealizedPLNetShort && unrealizedPLNetLong) {
            await UnrealizedPLNet.processPositionRemoval(unrealizedPLNetShort, store, delta)
            await UnrealizedPLNet.processPositionRemoval(unrealizedPLNetLong, store, delta)
        } else {
            throw new Error('Unrealised profit/lose is bound to unknown users')
        }
    }

    private static async processPositionRemoval(unrealizedPLNet: UnrealizedProfitLose, store: Store, delta: bigint) {
        unrealizedPLNet.value -= delta
        if(unrealizedPLNet.value === BigInt(0)) {
            store.remove(unrealizedPLNet)
        } else {
            store.save(unrealizedPLNet)
        }
    }

    private static async getUnrealisedPLNet(store: Store, id: string, user: string){
        return await store.findOne(UnrealizedProfitLose, { where: { market: { id: id }, user: user }})
    }
}