import { HttpProvider } from "@polkadot/api";
import * as ss58 from "@subsquid/ss58-codec";
import { hexToLittleEndian, convertToU8a } from "./encodersUtils";
const { ApiPromise } = require("@polkadot/api");
import { nToHex } from "@polkadot/util";
export class MarginDataProvider {
  private static api: any;

  public static async getMarginDataForMarket(
    marketId: string,
    walletAddress: string
  ): Promise<[number, string | null]> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    MarginDataProvider.api = await ApiPromise.create({
      provider,
      types: {
        LiquidationStatus: {
          _enum: ["EverythingFine", "MarginCall", "Liquidation", "Underwater"],
        },
      },
    });

    const addressPayload = (
      await convertToU8a(MarginDataProvider.api, walletAddress)
    ).substring(2);

    // Ensure the hexWalletAddress is used directly in the rpc call
    try {
      const marginData = await MarginDataProvider.api.rpc.state.call(
        "MarketApi_margin_data",
        hexToLittleEndian(nToHex(BigInt(marketId))) + addressPayload
      );

      const result = MarginDataProvider.api.createType(
        "(Balance, Option<(Balance, LiquidationStatus)>)",
        marginData
      );

      const jsonData = (result.toJSON() as [number, [number, string]?]) ?? [];

      const margin = jsonData[0];
      const requiredDepositOption = jsonData[1];
      if (requiredDepositOption) {
        return requiredDepositOption;
      }
      console.log([margin, null]);
      return [margin, null];
    } catch (error) {
      throw error;
    }
  }
}
