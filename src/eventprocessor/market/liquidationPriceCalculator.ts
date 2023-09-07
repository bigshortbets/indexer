import {Store} from "@subsquid/typeorm-store";
import {LiquidationPrice, OrderSide, Position} from "../../model";

export class LiquidationPriceCalculator {
    public static async calculateLiquidationPrice(position: Position, store: Store, quantityDelta: bigint) {
        let shortsideLiquidationPrice = await store.findOne(LiquidationPrice,
            { where: {
                        market: {id: position.market.id},
                        user: position.short,
                        side: OrderSide.SHORT
                },
                relations: {market: true}
            })
        let longsideLiquidationPrice = await store.findOne(LiquidationPrice,
            { where: {
                    market: {id: position.market.id},
                    user: position.long,
                    side: OrderSide.LONG
                },
                relations: {market: true}
            })
        if(shortsideLiquidationPrice) {
            shortsideLiquidationPrice.cumulativeValue += quantityDelta * position.price
            shortsideLiquidationPrice.cumulativeQuantity += quantityDelta
        } else {
            shortsideLiquidationPrice = new LiquidationPrice({
                id: position.id + position.short,
                user: position.short,
                side: OrderSide.SHORT,
                cumulativeValue: quantityDelta * position.price,
                cumulativeQuantity: quantityDelta,
                market: position.market
            })
        }
        shortsideLiquidationPrice.liquidationPrice =
            shortsideLiquidationPrice.cumulativeValue / shortsideLiquidationPrice.cumulativeQuantity *
            BigInt(Math.round(1.0 + Number(position.market.initialMargin) / 100) *
                Math.round(1.0 + Number(position.market.maintenanceMargin) / 100))
        if(longsideLiquidationPrice) {
            longsideLiquidationPrice.cumulativeValue += quantityDelta * position.price
            longsideLiquidationPrice.cumulativeQuantity += quantityDelta
        } else {
            longsideLiquidationPrice = new LiquidationPrice({
                id: position.id + position.long,
                user: position.long,
                side: OrderSide.LONG,
                cumulativeValue: quantityDelta * position.price,
                cumulativeQuantity: quantityDelta,
                market: position.market
            })
        }
        longsideLiquidationPrice.liquidationPrice =
            longsideLiquidationPrice.cumulativeValue / longsideLiquidationPrice.cumulativeQuantity *
            BigInt(Math.round((1.0 - Number(position.market.initialMargin) / 100)) *
                Math.round(1.0 - Number(position.market.maintenanceMargin) / 100))
        return await store.save([longsideLiquidationPrice, shortsideLiquidationPrice])
    }
}