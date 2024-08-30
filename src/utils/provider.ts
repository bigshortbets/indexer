import { HttpProvider } from "@polkadot/api";

import { ApiPromise } from "@polkadot/api";
export class Provider {
  static provider: any;
  static api: any;
  public static async initializeApi() {
    Provider.provider = new HttpProvider(process.env.NODE_RPC_URL);
    Provider.api = await ApiPromise.create({ provider: Provider.provider });
  }
}
