import BasePES from './BasePES';
import Stream from '../../Stream';
import { IObject } from '../../../../interface/IGeneral';

class TSPackageCAT extends BasePES {
    private _tableID: any;
    private _sectionIndicator: number;
    private _sectionLength: number;
    private _version: number;
    private _currentnextIndicator: number;
    private _sectionNumber: any;
    private _lastSectionNumber: any;
    private _CRC32: any;

    constructor(stream: Stream) {
        super(stream);
        this.parse();
    }

    parse() {
        this._tableID = this._stream.readUint8();
        let next = this._stream.readUint16();
        this._sectionIndicator = next >>> 7;
        this._sectionLength = next & 0x0fff;
        this._stream.skip(2);
        next = this._stream.readUint8();
        this._version = next >>> 3;
        this._currentnextIndicator = next & 0x01;
        this._sectionNumber = this._stream.readUint8();
        this._lastSectionNumber = this._stream.readUint8();
        let N = (this._sectionLength - 9) / 4
        let list: IObject[] = [];
        for (let i = 0; i < N; i++) {
            list.push({})
        }
        this._CRC32 = this._stream.readUint32();
    }
}

export default TSPackageCAT;