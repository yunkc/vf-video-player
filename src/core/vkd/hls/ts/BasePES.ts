/**
 * PES解析基类
 */
import Stream from '../../Stream';
import RuntimeLog from '../../../../log/RuntimeLog';

class BasePES {
    protected _stream: Stream;
    protected _bodyType:string;

    get stream(): Stream {
        return this._stream;
    }

    constructor(stream: Stream) {
        this._stream = stream;
    }

    protected parse() {
        RuntimeLog.getInstance().log(`BasePes parse() called. it's maybe a mistake ,please check code.`)
    }
}

export default BasePES;