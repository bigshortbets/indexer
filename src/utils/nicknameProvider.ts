import { Option, Tuple } from "@polkadot/types";
import { Provider } from "./provider";

interface DisplayName {
  info: {
    display: { Raw: string } | undefined;
  };
}

type DisplayNameResponse = [DisplayName] | null;

export class NicknameProvider {
  public static async getNickname(
    walletAddress: string,
  ): Promise<string | undefined> {
    try {
      if (!Provider.api) {
        await Provider.initializeApi();
      }
      const api = Provider.api;

      const identityInfoCodec = (await api.query.identity.identityOf(
        walletAddress,
      )) as Option<Tuple>;

      const data = identityInfoCodec.toHuman() as DisplayNameResponse;

      if (data?.[0]?.info?.display?.Raw) {
        return data[0].info.display.Raw;
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching display name:", error);
      throw error;
    }
  }
}
