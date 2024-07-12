import { convertStringValueToHexBigEndian } from "./encodersUtils";
import { Provider } from "./provider";
export class OraclePriceProvider {
  public static async getLatestOraclePriceForMarketId(
    marketId: string
  ): Promise<bigint> {
    if (!Provider.api) {
      await Provider.initializeApi();
    }
    const api = Provider.api;

    const value = convertStringValueToHexBigEndian(marketId);
    const latestOraclePrice = await api.rpc.state.call(
      "MarketApi_oracle_price",
      value
    );
    const optionType = api.createType("Option<Balance>", latestOraclePrice);
    return optionType.unwrapOr(0).toString();
  }
}
