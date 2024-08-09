import { HttpProvider } from "@polkadot/api";
import * as ss58 from "@subsquid/ss58-codec";
import { convertStringValueToHexBigEndian } from "./encodersUtils";
const { ApiPromise } = require("@polkadot/api");

export class MarginProvider {
  private static api: any;

  public static async getMarginForMarket(
    marketId: string,
    walletAddress: string,
  ): Promise<bigint> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    MarginProvider.api = await ApiPromise.create({ provider });
    // Convert marketId using convertStringValueToHexBigEndian
    const encodedMarketId = convertStringValueToHexBigEndian(marketId);
    // Decode the wallet address using SS58 and ensure it's 32 bytes
    let decodedWalletAddress = ss58.decode(walletAddress);

    // Convert the decoded address to a hex string without the '0x' prefix
    let hexWalletAddress = Buffer.from(decodedWalletAddress.bytes).toString(
      "hex",
    );
    console.log(`Hex WalletAddress: ${hexWalletAddress}`);
    const dataBytes = encodedMarketId + hexWalletAddress;
    // Ensure the hexWalletAddress is used directly in the rpc call
    try {
      const marginData = await MarginProvider.api.rpc.state.call(
        "MarketApi_margin",
        dataBytes,
      );

      console.log("Creating Balance type from margin");
      const margin = MarginProvider.api.createType("Balance", marginData);

      return BigInt(margin);
    } catch (error) {
      throw error;
    }
  }
}
