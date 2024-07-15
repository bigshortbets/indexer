import { Provider } from "./provider";

export class BlockchainSafeModeProvider {
  public static async getSafeMode(blockhash?: string): Promise<bigint> {
    if (!Provider.api) {
      await Provider.initializeApi();
    }
    const api = Provider.api;

    const lastHeader = await api.rpc.chain.getHeader();
    let lastBlockHash = lastHeader.hash;

    if (blockhash) {
      lastBlockHash = blockhash;
    }

    const isInSafeMode = await api.rpc.state.getStorage(
      "SafeMode.EnteredUntil",
      lastBlockHash,
    );

    const enteredUntil = api.createType("Option<u32>", isInSafeMode);
    return enteredUntil.unwrapOr(null)?.toNumber();
  }
}
