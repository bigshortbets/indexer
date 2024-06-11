import assert from "assert"
import * as marshal from "./marshal"

export class ClosingOrder {
    public readonly isTypeOf = 'ClosingOrder'
    private _type!: string
    private _value!: bigint

    constructor(props?: Partial<Omit<ClosingOrder, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._type = marshal.string.fromJSON(json.type)
            this._value = marshal.bigint.fromJSON(json.value)
        }
    }

    get type(): string {
        assert(this._type != null, 'uninitialized access')
        return this._type
    }

    set type(value: string) {
        this._type = value
    }

    get value(): bigint {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: bigint) {
        this._value = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            type: this.type,
            value: marshal.bigint.toJSON(this.value),
        }
    }
}
