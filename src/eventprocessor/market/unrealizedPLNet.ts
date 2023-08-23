import {Store} from "@subsquid/typeorm-store";
import {OraclePrice, Position, PositionStatus} from "../../model";

export class UnrealizedPLNet{
    async updateAfterOraclePriceChange(store: Store, oraclePrice: OraclePrice) {
        let positions = await store.find(Position,
            {
                where: {
                    market: {id: oraclePrice.market.id },
                    status: PositionStatus.OPEN
                },
                relations : {market: true}
            })
        const resultMap: Map<string, BigInt> = positions.reduce((map, position) => {
            if(position.long && position.short){
                const quantityLeft = position.quantityLeft;
                const lastPrice = position.price;
                const currentPrice = oraclePrice.price;
                if (position.long && map.has(position.long)) {
                    map.set(
                        position.long,
                        BigInt(map.get(position.long)) + (currentPrice - lastPrice) * quantityLeft);
                } else {
                    map.set(position.long, (currentPrice - lastPrice) * quantityLeft)
                }

                if(map.has(position.short)) {

                } else {
                    map.set(position.short, po.value);
                }
            }
            return map;
        }, new Map<string, BigInt>());

    }

    async updateAfterPositionChange(store: Store, position: Position) {

    }
}