import { HttpProvider } from "@polkadot/api";
import { safeMode as storage } from "../types/storage";

const { ApiPromise } = require("@polkadot/api");
export class BlockchainSafeModeProvider {
  private static api: any;
  public static async getSafeMode(blockhash?: string): Promise<BigInt> {
    const provider = new HttpProvider(process.env.NODE_RPC_URL);
    BlockchainSafeModeProvider.api = await ApiPromise.create({ provider });

    const lastHeader =
      await BlockchainSafeModeProvider.api.rpc.chain.getHeader();
    let lastBlockHash = lastHeader.hash;

    if (blockhash) {
      lastBlockHash = blockhash;
    }

    const isInSafeMode =
      await BlockchainSafeModeProvider.api.rpc.state.getStorage(
        "SafeMode.EnteredUntil",
        lastBlockHash,
      );

    const enteredUntil = BlockchainSafeModeProvider.api.createType(
      "Option<u32>",
      isInSafeMode,
    );
    return enteredUntil.unwrapOr(null)?.toNumber();
  }
}
