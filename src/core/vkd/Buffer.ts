import NormalUtils from "../../utils/NormalUtils";
import RuntimeLog from "../../log/RuntimeLog";



class Buffer {
    private _buffer: Uint8Array;

    constructor() {
        this._buffer = new Uint8Array(0);
    }

    get buffer(): Uint8Array {
        return this._buffer;
    }

    write(...buffer: Uint8Array[]) {
        buffer.forEach(item => {
            if (item) {
                // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._buffer, item);
                this._buffer = NormalUtils.concatUint8Array(this._buffer, item);
            } else {
                RuntimeLog.getInstance().error('undefined buffer: ', item);
            }
        })
    }

    static writeUint32(value: number) {
        return new Uint8Array([
            value >> 24,
            (value >> 16) & 0xff,
            (value >> 8) & 0xff,
            value & 0xff
        ])
    }
}

export default Buffer;