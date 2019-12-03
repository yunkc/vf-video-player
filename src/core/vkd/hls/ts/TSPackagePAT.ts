/**
 * 创建PAT实例
 */
import Stream from '../../Stream';
import BasePES from './BasePES';
import { IObject } from '../../../../interface/IGeneral';

class TSPackagePAT extends BasePES {
    private _tabelID: number = -1;
    private _error: number;
    private _zero: number;
    private _sectionLength: number;
    private _streamID: number;
    private _current: number;
    private _lastSectionNumber: number;
    private _list: IObject[];
    private _program: number;
    private _pid: number;
    private _CRC32: number;
    private _sectionNumber: number;

    get list(): IObject[] {
        return this._list;
    }

    constructor(stream: Stream) {
        super(stream);
        this.parse();
    }

    /**
     * 解析
     */
    parse() {
        let next = this._stream.readUint8();
        this._stream.skip(next);
        next = this._stream.readUint8();
        this._tabelID = next;
        next = this._stream.readUint16();
        this._error = next >>> 7;
        this._zero = next >>> 6 & 1;
        this._sectionLength = next & 0xfff;
        this._streamID = this._stream.readUint16();
        this._current = this._stream.readUint8() & 1;
        this._sectionNumber = this._stream.readUint8();
        this._lastSectionNumber = this._stream.readUint8();
        let N: number = this._sectionLength - 9;
        let list: IObject[] = [];
        for (let i = 0; i < N; i += 4) {
            let programNumber = this._stream.readUint16();
            let pid = this._stream.readUint16() & 0x1fff;
            list.push({
                program: programNumber,
                pid,
                type: programNumber === 0 ? 'network' : 'mapPID'
            })
        }
        this._list = list;
        // this._program = this._stream.readUint16();
        // this._pid = this._stream.readUint16();
        if (this._stream.dataView.byteLength - this._stream.position >= 4) {
            this._CRC32 = this._stream.readUint32();
        }
    }
}

export default TSPackagePAT;