import { HttpProvider } from "@polkadot/api";
import { ApiPromise } from "@polkadot/api";
import { Option, Tuple } from "@polkadot/types";

interface DisplayName {
  info: {
    display: { Raw: string } | undefined;
  };
}

type DisplayNameResponse = [DisplayName] | null;

export class NicknameProvider {
  private static api: any;

  public static async getNickname(
    walletAddress: string,
  ): Promise<string | undefined> {
    try {
      const provider = new HttpProvider(process.env.NODE_RPC_URL);
      NicknameProvider.api = await ApiPromise.create({ provider });

      const identityInfoCodec =
        (await NicknameProvider.api.query.identity.identityOf(
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
