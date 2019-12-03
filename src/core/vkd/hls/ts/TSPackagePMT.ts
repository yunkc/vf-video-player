/**
 * 创建PMT实例
 */
import BasePES from './BasePES';
import Stream from '../../Stream';
import { IObject } from '../../../../interface/IGeneral';

class TSPackagePMT extends BasePES {
    private _tableID: number;
    private _sectionLength: number;
    private _program: number;
    private _current: number;
    private _order: number;
    private _lastOrder: number;
    private _PCR_PID: number;
    private _programLength: number;
    private _list: IObject[];
    private _CRC32: number;

    get list(): IObject[] {
        return this._list;
    }

    get program(): number {
        return this._program
    }

    constructor(stream: Stream) {
        super(stream);
        this.parse();
    }

    parse() {
        let next = this._stream.readUint8();
        this._stream.skip(next);
        next = this._stream.readUint8();
        this._tableID = next;
        next = this._stream.readUint16();
        this._sectionLength = next & 0xfff;
        this._program = this._stream.readUint16();
        this._current = this._stream.readUint8() & 1;
        this._order = this._stream.readUint8();
        this._lastOrder = this._stream.readUint8();
        this._PCR_PID = this._stream.readUint16() & 0x1fff;
        this._programLength = this._stream.readUint16() & 0xfff;
        let N = (this._sectionLength - 13) / 5
        let list: IObject[] = [];
        for (let i = 0; i < N; i++) {
            list.push({
                streamType: this._stream.readUint8(),
                pid: this._stream.readUint16() & 0x1fff,
                es: this._stream.readUint16() & 0xfff
            })
        }
        this._list = list;
        if (this._stream.dataView.byteLength - this._stream.position >= 4) {
            this._CRC32 = this._stream.readUint32();
        }
    }
}

export default TSPackagePMT;