// import { Store } from "@subsquid/typeorm-store";
// import { Market, OrderSide, Position } from "../../model";

// export class LiquidationPriceCalculator {
//   public static async calculate(
//     position: Position,
//     store: Store,
//     quantityDelta: bigint
//   ) {
//     let shortsideLiquidationPrice = await store.findOne(LiquidationPrice, {
//       where: {
//         market: { id: position.market.id },
//         user: position.short,
//         side: OrderSide.SHORT,
//       },
//       relations: { market: true },
//     });
//     let longsideLiquidationPrice = await store.findOne(LiquidationPrice, {
//       where: {
//         market: { id: position.market.id },
//         user: position.long,
//         side: OrderSide.LONG,
//       },
//       relations: { market: true },
//     });
//     shortsideLiquidationPrice = LiquidationPriceCalculator.processPositionSide(
//       shortsideLiquidationPrice,
//       quantityDelta,
//       position,
//       OrderSide.SHORT
//     );
//     longsideLiquidationPrice = LiquidationPriceCalculator.processPositionSide(
//       longsideLiquidationPrice,
//       quantityDelta,
//       position,
//       OrderSide.LONG
//     );

//     return await store.save([
//       longsideLiquidationPrice,
//       shortsideLiquidationPrice,
//     ]);
//   }
//   private static processPositionSide(
//     liquidationPrice: LiquidationPrice | undefined,
//     quantityDelta: bigint,
//     position: Position,
//     side: OrderSide
//   ): LiquidationPrice {
//     if (!liquidationPrice) {
//       liquidationPrice = new LiquidationPrice({
//         id: position.id + (side === OrderSide.LONG ? "01" : "00"),
//         user: side === OrderSide.LONG ? position.long : position.short,
//         side: side,
//         cumulativeValue: quantityDelta * position.price,
//         cumulativeQuantity: quantityDelta,
//         market: position.market,
//       });
//       liquidationPrice.liquidationPrice = this.calculateLiquidationPrice(
//         liquidationPrice,
//         side
//       );
//     }
//     if (
//       liquidationPrice.cumulativeQuantity === BigInt(0) ||
//       liquidationPrice.cumulativeQuantity + quantityDelta <= BigInt(0)
//     ) {
//       liquidationPrice.liquidationPrice = BigInt(0);
//       liquidationPrice.cumulativeQuantity = BigInt(0);
//       liquidationPrice.cumulativeValue = BigInt(0);
//     } else {
//       liquidationPrice.cumulativeValue += quantityDelta * position.price;
//       liquidationPrice.cumulativeQuantity += quantityDelta;
//       liquidationPrice.liquidationPrice = this.calculateLiquidationPrice(
//         liquidationPrice,
//         side
//       );
//     }
//     return liquidationPrice;
//   }

//   private static calculateBase(market: Market, side: OrderSide) {
//     const multiplier = side === OrderSide.LONG ? -1 : 1;
//     return (
//       ((100 + multiplier * Number(market.initialMargin)) *
//         (100 + multiplier * Number(market.maintenanceMargin))) /
//       10_000
//     );
//   }
//   private static calculateLiquidationPrice(
//     liquidationPrice: LiquidationPrice,
//     side: OrderSide
//   ) {
//     return BigInt(
//       Math.round(
//         Number(
//           liquidationPrice.cumulativeValue / liquidationPrice.cumulativeQuantity
//         ) * this.calculateBase(liquidationPrice.market, side)
//       )
//     ); // TODO: zastanowić się jak to zmienić żeby nie powodowało problemów (za mała dokładność)
//   }
// }
