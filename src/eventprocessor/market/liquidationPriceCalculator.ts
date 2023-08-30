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
        let longsideLiquidationPrice = await store.get(LiquidationPrice, position.market.id)
        if(shortsideLiquidationPrice) {
            shortsideLiquidationPrice.cumulativeValue += quantityDelta * position.price
            shortsideLiquidationPrice.cumulativeQuantity += quantityDelta
            shortsideLiquidationPrice.liquidationPrice =
                shortsideLiquidationPrice.cumulativeValue / shortsideLiquidationPrice.cumulativeQuantity * BigInt((1 - position.market.initialMargin / 100) * (1 - position.market.maintenanceMargin / 100))
        } else {
            shortsideLiquidationPrice = new LiquidationPrice({
                id: position.id + position.short,
                user: position.short,
                side: OrderSide.SHORT,
                cumulativeValue: quantityDelta * position.price,
                cumulativeQuantity: quantityDelta
            })
            shortsideLiquidationPrice.liquidationPrice =
                shortsideLiquidationPrice.cumulativeValue / shortsideLiquidationPrice.cumulativeQuantity
        }
        if(longsideLiquidationPrice) {
            longsideLiquidationPrice.cumulativeValue += quantityDelta * position.price
            longsideLiquidationPrice.cumulativeQuantity += quantityDelta
            longsideLiquidationPrice.liquidationPrice =
                longsideLiquidationPrice.cumulativeValue / longsideLiquidationPrice.cumulativeQuantity * BigInt((1 - position.market.initialMargin / 100) * (1 - position.market.maintenanceMargin / 100))
        } else {
            longsideLiquidationPrice = new LiquidationPrice({
                id: position.id + position.long,
                user: position.long,
                side: OrderSide.LONG,
                cumulativeValue: quantityDelta * position.price,
                cumulativeQuantity: quantityDelta
            })
            longsideLiquidationPrice.liquidationPrice =
                longsideLiquidationPrice.cumulativeValue / longsideLiquidationPrice.cumulativeQuantity
        }
        return await store.save([longsideLiquidationPrice, shortsideLiquidationPrice])
    }
}