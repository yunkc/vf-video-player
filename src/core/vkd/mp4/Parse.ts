/**
 * mp4 box解析类
 */
import Box from "./Box";
import NormalUtils from "../../../utils/NormalUtils";
import Stream from "../Stream";

class Parse {
    private _buffer: ArrayBuffer;
    private _boxes: Box[] = [];
    private _nextBox: Box = null;

    get boxes(): Box[] {
        return this._boxes;
    }

    get nextBox(): Box {
        return this._nextBox;
    }

    constructor(buffer: ArrayBuffer) {
        if (this._buffer) {
            NormalUtils.concatUint8Array(new Uint8Array(this._buffer), new Uint8Array(buffer));
        } else {
            this._buffer = buffer;
        }

        let bufferLength: number = buffer.byteLength;
        let stream: Stream = new Stream(buffer);
        while (bufferLength - stream.position >= 8) {
            let box = new Box();
            box.readHeader(stream);
            if (box.size - 8 <= (bufferLength - stream.position)) {
                box.readBody(stream);
                this._boxes.push(box);
            } else {
                if (box.type === 'mdat') {
                    box.readBody(stream);
                    this._boxes.push(box);
                } else {
                    this._nextBox = box;
                    stream.position -= 8;
                    break;
                }
            }
        }
        this._buffer = new Uint8Array(this._buffer.slice(stream.position));
    }
}

export default Parse;