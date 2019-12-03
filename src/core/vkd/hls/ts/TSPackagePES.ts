/**
 * pes 解析类
 */
import TSPackage from '../TSPackage';
import Stream from '../../Stream';
import TSPackageHeader from './TSPackageHeader';
import EventCenter from '../../../../events/EventCenter';
import { ErrorTypeList } from '../../../../config/ErrorTypeList';
import { EventLevel } from '../../../../events/EventLevel';
import TSPackageES from './TSPackageES';

class TSPackagePES {
    private _header: TSPackageHeader = null;
    private _type: string = '';
    private _packetLength: number;
    private _ptsDTSFlag: number;
    private _escrFlag: number;
    private _esRateFlag: number;
    private _dsmFlag: number;
    private _additionalFlag: number;
    private _crcFlag: number;
    private _extensionFlag: number;
    private _pesHeaderLength: number;
    private _pts: number;
    private _dts: number;
    private _escr: number;
    private _esRate: number;
    private _additionalCopyInfo: number;
    private _pesCRC: number;
    private _ES: TSPackageES;
    static _errorCount: number = 0;

    get type(): string {
        return this._type;
    }

    get ES(): TSPackageES {
        return this._ES;
    }

    get dts(): number {
        return this._dts;
    }

    get pts(): number {
        return this._pts;
    }

    constructor(pes: TSPackage[]) {
        let _it = pes[0], _stream: Stream = _it.body.stream;
        let next = _stream.readUint24(); //start code 固定为 0x000001
        this._header = _it.header;
        if (next !== 1) {
            this.dispatchErrorEvent(`ts parse error, this is not pes packet.`);
        } else {
            let _streamID: number = _stream.readUint8();
            if (_streamID >= 0xe0 && _streamID <= 0xef) {
                this._type = 'video';
            }
            if (_streamID >= 0xc0 && _streamID <= 0xdf) {
                this._type = 'audio';
            }
            let _packetLength: number = _stream.readUint16();
            this._packetLength = _packetLength;
            if (this._type === 'video' || this._type === 'audio') {
                let next = _stream.readUint8();
                let first = next >>> 6;
                if (first !== 0x02) {
                    this.dispatchErrorEvent(`error when parse pes header`);
                }
                next = _stream.readUint8();
                this._ptsDTSFlag = next >>> 6;
                this._escrFlag = next >>> 5 & 0x01;
                this._esRateFlag = next >>> 4 & 0x01;
                this._dsmFlag = next >>> 3 & 0x01;
                this._additionalFlag = next >>> 2 & 0x01;
                this._crcFlag = next >>> 1 & 0x01;
                this._extensionFlag = next & 0x01;
                this._pesHeaderLength = _stream.readUint8();
                let _N1 = this._pesHeaderLength;

                if (this._ptsDTSFlag === 2) {
                    let pts = [];
                    next = _stream.readUint8();
                    pts.push(next >>> 1 & 0x07);
                    next = _stream.readUint16();
                    pts.push(next >>> 1);
                    next = _stream.readUint16();
                    pts.push(next >>> 1);
                    this._pts = (pts[0] << 30 | pts[1] << 15 | pts[2]);
                    _N1 -= 5;
                    // 视频如果没有dts用pts
                    if (this._type === 'video') {
                        this._dts = this._pts;
                    }
                }

                if (this._ptsDTSFlag === 3) {
                    let pts = [];
                    next = _stream.readUint8();
                    pts.push(next >>> 1 & 0x07);
                    next = _stream.readUint16();
                    pts.push(next >>> 1);
                    next = _stream.readUint16();
                    pts.push(next >>> 1);
                    this._pts = (pts[0] << 30 | pts[1] << 15 | pts[2]);
                    let dts = [];
                    next = _stream.readUint8();
                    dts.push(next >>> 1 & 0x07);
                    next = _stream.readUint16();
                    dts.push(next >>> 1);
                    next = _stream.readUint16();
                    dts.push(next >>> 1);
                    this._dts = (dts[0] << 30 | dts[1] << 15 | dts[2]);
                    _N1 -= 10;
                }

                if (this._escrFlag === 1) {
                    let escr = [], ex = [];
                    next = _stream.readUint8();
                    escr.push(next >>> 3 & 0x07);
                    escr.push(next & 0x03);
                    next = _stream.readUint16();
                    escr.push(next >>> 13);
                    escr.push(next & 0x03);
                    next = _stream.readUint16();
                    escr.push(next >>> 13);
                    ex.push(next & 0x03);
                    next = _stream.readUint8();
                    ex.push(next >>> 1);
                    this._escr = (escr[0] << 30 | escr[1] << 28 | escr[2] << 15 | escr[3] << 13 | escr[4]) * 300 + (ex[0] << 7 | ex[1]);
                    _N1 -= 6;
                }

                if (this._esRateFlag === 1) {
                    next = _stream.readUint24();
                    this._esRate = next >>> 1 & 0x3fffff;
                    _N1 -= 3;
                }
                if (this._dsmFlag === 1) {
                    this.dispatchErrorEvent(`not support DSM_trick_mode`);
                }
                if (this._additionalFlag === 1) {
                    next = _stream.readUint8();
                    this._additionalCopyInfo = next & 0x7f;
                    _N1 -= 1;
                }
                if (this._crcFlag === 1) {
                    this._pesCRC = _stream.readUint16();
                    _N1 -= 2;
                }
                if (this._extensionFlag === 1) {
                    this.dispatchErrorEvent(`not support extension`);
                }
                if (_N1 > 0) {
                    _stream.skip(_N1);
                }

                this._ES = new TSPackageES(_stream, this._type, pes.slice(1));
            } else {
                this.dispatchErrorEvent(`PES format is not supported`);
            }
        }
    }

    /**
     * 抛出异常事件
     */
    private dispatchErrorEvent = (message: string) => {
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
            code: ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: null
        });
    }


}

export default TSPackagePES;