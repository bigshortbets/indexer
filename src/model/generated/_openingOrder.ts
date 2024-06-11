import assert from "assert"
import * as marshal from "./marshal"

export class OpeningOrder {
    public readonly isTypeOf = 'OpeningOrder'
    private _type!: string

    constructor(props?: Partial<Omit<OpeningOrder, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._type = marshal.string.fromJSON(json.type)
        }
    }

    get type(): string {
        assert(this._type != null, 'uninitialized access')
        return this._type
    }

    set type(value: string) {
        this._type = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            type: this.type,
        }
    }
}
