import { HttpProvider } from "@polkadot/api";
import { safeMode as storage } from "../types/storage";

const { ApiPromise } = require("@polkadot/api");
export class BlockchainSafeModeProvider {
  private static api: any;
  public static async getSafeMode(blockhash?: string): Promise<BigInt> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    BlockchainSafeModeProvider.api = await ApiPromise.create({ provider });

    const signedBlock =
      await BlockchainSafeModeProvider.api.rpc.chain.getBlock(blockhash);

    const isInSafeMode = await storage.enteredUntil.v2.get(signedBlock);

    const optionType = BlockchainSafeModeProvider.api.createType(
      "Option<SafeMode>",
      isInSafeMode
    );
    return optionType.unwrapOr(0).toString();
  }
}
