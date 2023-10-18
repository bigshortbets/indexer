import {HttpProvider} from "@polkadot/api";
import {convertStringValueToHexBigEndian} from "./encodersUtils";

const { ApiPromise } = require('@polkadot/api');
export class OraclePriceProvider {
    private static api : any;
    public static async getLatestOraclePriceForMarketId(marketId : string) : Promise<BigInt> {
        const provider = new HttpProvider(process.env.NODE_RPC_URL);
        OraclePriceProvider.api = await ApiPromise.create({provider});
        const value = convertStringValueToHexBigEndian(marketId)
        const latestOraclePrice = await OraclePriceProvider.api.rpc.state.call('MarketApi_oracle_price', value);
        const optionType = OraclePriceProvider.api.createType('Option<Balance>', latestOraclePrice)
        return optionType.unwrapOr(0).toString();
    }
}