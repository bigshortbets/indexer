import { HttpProvider } from "@polkadot/api";
import * as ss58 from "@subsquid/ss58-codec";
import { convertStringValueToHexBigEndian } from "./encodersUtils";
const { ApiPromise } = require("@polkadot/api");

export class MarginDataProvider {
  private static api: any;

  public static async getMarginDataForMarket(
    marketId: string,
    walletAddress: string,
  ): Promise<[bigint, string | null]> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    MarginDataProvider.api = await ApiPromise.create({
      provider,
      types: {
        LiquidationStatus: {
          _enum: ["EverythingFine", "MarginCall", "Liquidation", "Underwater"],
        },
      },
    });

    const encodedMarketId = convertStringValueToHexBigEndian(marketId);

    let decodedWalletAddress = ss58.decode(walletAddress);

    let hexWalletAddress = Buffer.from(decodedWalletAddress.bytes).toString(
      "hex",
    );

    const dataBytes = encodedMarketId + hexWalletAddress;
    try {
      const marginData = await MarginDataProvider.api.rpc.state.call(
        "MarketApi_margin_data",
        dataBytes,
      );

      const result = MarginDataProvider.api.createType(
        "(Balance, Option<(Balance, LiquidationStatus)>)",
        marginData,
      );

      const jsonData = (result.toJSON() as [number, [number, string]?]) ?? [];

      const margin = jsonData[0];
      const requiredDepositOption = jsonData[1];
      if (requiredDepositOption) {
        return [BigInt(requiredDepositOption[0]), requiredDepositOption[1]];
      }

      return [BigInt(margin), null];
    } catch (error) {
      throw error;
    }
  }
}
