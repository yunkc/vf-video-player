/**
 * 流读取类
 */
import VkdDataView from "./mp4/VkdDataView";
import EventCenter from "../../events/EventCenter";
import { ErrorTypeList } from "../../config/ErrorTypeList";

class Stream {
    private readonly _buffer: ArrayBuffer;
    private _dataView: VkdDataView;
    private _readTypeList: any;

    constructor(buffer: ArrayBuffer) {
        this._buffer = buffer;
        this._dataView = new VkdDataView(this._buffer);
        this._dataView.position = 0;
        this.initReadFunc();
    }

    set position(value: number) {
        this._dataView.position = value;
    }

    get position(): number {
        return this._dataView.position;
    }

    get buffer() {
        return this._buffer;
    }

    get dataView() {
        return this._dataView;
    }

    get length(){
        return this._dataView.byteLength;
    }

    /**
     * 初始化读取函数
     */
    private initReadFunc() {
        this._readTypeList = {
            1: (symbol: boolean) => {
                return symbol ? this._dataView.getInt8(this._dataView.position) : this._dataView.getUint8(this._dataView.position);
            },

            2: (symbol: boolean) => {
                return symbol ? this._dataView.getInt16(this._dataView.position) : this._dataView.getUint16(this._dataView.position);
            },

            3: (symbol: boolean) => {
                if (symbol) throw new Error('can not read symbol int 3');
                let _tempRes: number;
                _tempRes = this._dataView.getUint8(this._dataView.position) << 16;
                _tempRes |= this._dataView.getUint8(this._dataView.position + 1) << 8;
                _tempRes |= this._dataView.getUint8(this._dataView.position + 2);
                return _tempRes;
            },

            4: (symbol: boolean) => {
                return symbol ? this._dataView.getInt32(this._dataView.position) : this._dataView.getUint32(this._dataView.position);
            },

            8: (symbol: boolean) => {
                if (symbol) throw new Error('can not read symbol int 8');
                let _tempRes: number;
                _tempRes = this._dataView.getUint32(this._dataView.position) << 32;
                _tempRes |= this._dataView.getUint32(this._dataView.position + 4);
                return _tempRes;
            }
        }
    }

    /**
     * 根据参数从dateView中读取数据
     * @param size
     * @param symbol
     */
    public readByte(size: number, symbol: boolean = false) {
        let result: any = null;
        let _readFunc = this._readTypeList[size];

        if (!_readFunc) {
            result = '';
        } else {
            try {
                result = _readFunc(symbol);
            } catch (e) {
                EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
                    code: ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
                    message: `stream parse error： ${e.message}`,
                    data: null,
                }, e);
            }

        }
        this.position += size;
        return result;
    }

    /**
     * 跳过 count 数量的字节
     * @param {number} count
     */
    skip(count: number) {
        let loop: number = Math.floor(count / 4);
        let last: number = count % 4;
        for (let i: number = 0; i < loop; i++) {
            this.readByte(4);
        }
        if (last > 0) {
            this.readByte(last);
        }
    }

    /**
     * position回退
     * @param count 
     */
    back(count: number) {
        this._dataView.position -= count;
    }

    /**
     * 从8位中读取一个无符号整数
     * @returns {any}
     */
    public readUint8() {
        return this.readByte(1);
    }

    /**
     * 从16位中读取一个无符号整数
     * @returns {any}
     */
    public readUint16() {
        return this.readByte(2);
    }

    /**
     * 从24位中读取一个无符号整数
     * @returns {any}
     */
    readUint24() {
        return this.readByte(3);
    }

    /**
     * 从32位中读取一个无符号整数
     * @returns {any}
     */
    public readUint32() {
        return this.readByte(4);
    }

    /**
     * 从64位中读取一个无符号整数
     * @returns {any}
     */
    public readUint64() {
        return this.readByte(8);
    }

    /**
     * 从8位中读取一个有符号整数
     * @returns {any}
     */
    public readInt8() {
        return this.readByte(1, true);
    }

    /**
     * 从16位中读取一个有符号整数
     * @returns {any}
     */
    public readInt16() {
        return this.readByte(2, true);
    }

    /**
     * 从32位中读取一个有符号整数
     * @returns {any}
     */
    public readInt32() {
        return this.readByte(4, true);
    }

    /**
     * 创建一个32位Uint8Array对象并写入value
     * @param value 
     */
    public writeUint32 (value:number) {
        return new Uint8Array([
            value >>> 24 & 0xff,
            value >>> 16 & 0xff,
            value >>> 8 & 0xff,
            value & 0xff,
        ]);
    }

}

export default Stream;