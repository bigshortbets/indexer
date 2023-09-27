const { ApiPromise } = require('@polkadot/api');
export class OraclePriceProvider {
    private static api : any;
    public static async getLatestOraclePriceForMarketId(marketId : string) : Promise<BigInt> {
        OraclePriceProvider.api = await ApiPromise.create();
        const value = OraclePriceProvider.convertStringValueToHexBigEndian(marketId)
        const latestOraclePrice = await OraclePriceProvider.api.rpc.state.call('MarketApi_oracle_price', value);
        const optionType = OraclePriceProvider.api.createType('Option<Balance>', latestOraclePrice)
        return optionType.unwrapOr(0).toString();
    }

    private static convertStringValueToHexBigEndian(value : string) {
        const bigIntValue = BigInt(value);
        let littleEndianHex = bigIntValue.toString(16);
        if (littleEndianHex.length % 2 !== 0) {
            littleEndianHex = '0' + littleEndianHex;
        }
        const chunks = littleEndianHex.match(/.{1,2}/g);
        if (chunks) {
            chunks.reverse();
            const bigEndianHex = chunks.join('');
            if (bigEndianHex.length % 2 !== 0) {
                return '0x0' + bigEndianHex;
            }
            return '0x' + bigEndianHex;
        }
        return '';
    }
}