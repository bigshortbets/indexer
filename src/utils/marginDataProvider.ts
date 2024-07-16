import { HttpProvider } from "@polkadot/api";
import * as ss58 from "@subsquid/ss58-codec";
import { convertStringValueToHexBigEndian } from "./encodersUtils";
const { ApiPromise } = require("@polkadot/api");

export class MarginDataProvider {
  private static api: any;

  public static async getMarginDataForMarket(
    marketId: string,
    walletAddress: string,
  ): Promise<string> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    MarginDataProvider.api = await ApiPromise.create({ provider });

    // Convert marketId using convertStringValueToHexBigEndian
    console.log(`Converting marketId to hex: ${marketId}`);
    const encodedMarketId = convertStringValueToHexBigEndian(marketId);
    console.log(`Encoded MarketId: ${encodedMarketId}`);

    // Decode the wallet address using SS58 and ensure it's 32 bytes
    console.log(`Decoding wallet address: ${walletAddress}`);
    let decodedWalletAddress = ss58.decode(walletAddress);

    // Convert the decoded address to a hex string without the '0x' prefix
    let hexWalletAddress = Buffer.from(decodedWalletAddress.bytes).toString(
      "hex",
    );
    console.log(`Hex WalletAddress: ${hexWalletAddress}`);
    const dataBytes = encodedMarketId + hexWalletAddress;
    // Ensure the hexWalletAddress is used directly in the rpc call
    try {
      const marginData = await MarginDataProvider.api.rpc.state.call(
        "MarketApi_margin_data",
        dataBytes,
      );
      const margin = MarginDataProvider.api.createType("Balance", marginData);

      return margin;
    } catch (error) {
      throw error;
    }
  }
}
