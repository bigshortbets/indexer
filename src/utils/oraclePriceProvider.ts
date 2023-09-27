const { ApiPromise } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
export class OraclePriceProvider {
    private static api : any;
    private static keyring : any;
    private static owner: any;
    public static async initializeApi(){
        // Todo: envy
        OraclePriceProvider.api = await ApiPromise.create();
        OraclePriceProvider.keyring = new Keyring({ type: 'sr25519'})
        OraclePriceProvider.owner = OraclePriceProvider.keyring.addFromUri('//Bob')
    }
    public static async getLatestOraclePriceForMarketId(marketId : string) : Promise<BigInt> {
        const value = OraclePriceProvider.convertStringValueToHexBigEndian(marketId)
        return await OraclePriceProvider.api.rpc.state.call('state-call', ['MarketApi_oracle_price', value]) // TODO: marketID prawdopodobnie trzeba dostosować
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
                return '0' + bigEndianHex;
            }
            return bigEndianHex;
        }
        return '';
    }
}