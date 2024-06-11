import {OpeningOrder} from "./_openingOrder"
import {ClosingOrder} from "./_closingOrder"

export type OrderType = OpeningOrder | ClosingOrder

export function fromJsonOrderType(json: any): OrderType {
    switch(json?.isTypeOf) {
        case 'OpeningOrder': return new OpeningOrder(undefined, json)
        case 'ClosingOrder': return new ClosingOrder(undefined, json)
        default: throw new TypeError('Unknown json object passed as OrderType')
    }
}
