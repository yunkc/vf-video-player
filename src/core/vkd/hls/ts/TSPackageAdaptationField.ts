/**
 * 创建自适应区域解析实例
 */
import BasePES from './BasePES';
import Stream from '../../Stream';
import TSPackageHeader from './TSPackageHeader';

class TSPackageAdaptationField extends BasePES {
    private _header: TSPackageHeader = null;
    private _start: number = 0;
    private _type: string = '';
    private _adaptationLength: number = -1;
    private _discontinue: number = -1;
    private _access: number;
    private _priority: number;
    private _PCR: number;
    private _OPCR: number;
    private _splicePoint: number;
    private _transportPrivate: number;
    private _adaptationFieldExtension: number;
    private _programClockBase: number;
    private _programClockExtension: number;
    private _originProgramClockBase: number;
    private _originProgramClockExtension: number;
    private _spliceCountdown: any;
    private _ltwValid: number;
    private _ltwOffset: number;
    private _piecewiseRate: number;
    private _spliceType: number;
    private _dtsNextAU1: number;
    private _marker1: number;
    private _dtsNextAU2: number;
    private _marker2: number;
    private _dtsNextAU3: any;
    private _buffer: Stream;

    get type(): string {
        return this._type;
    }

    get buffer(): Stream {
        return this._buffer;
    }

    constructor(stream: Stream, header: TSPackageHeader, type: string) {
        super(stream);
        this._header = header;
        this._start = this._stream.position;
        this._type = type;
        this.parse();
    }

    parse() {
        if (this._header.adaptation === 0x02 || this._header.adaptation === 0x03) {
            this._adaptationLength = this._stream.readUint8(); //该长度只包含5flags所指定的区域长度
            if (this._adaptationLength) {
                let next = this._stream.readUint8();
                this._discontinue = next >>> 7;
                this._access = next >>> 6 & 0x01;
                this._priority = next >>> 5 & 0x01;
                this._PCR = next >>> 4 & 0x01;
                this._OPCR = next >>> 3 & 0x01;
                this._splicePoint = next >>> 2 & 0x01;
                this._transportPrivate = next >>> 1 & 0x01;
                this._adaptationFieldExtension = next & 0x01;
                let _start = this._stream.position;
                if (this._PCR === 1) {
                    this._programClockBase = this._stream.readUint32() << 1;
                    next = this._stream.readUint16();
                    // this._programClockBase |= next >>> 15;
                    this._programClockExtension = next & 0x1ff;
                }

                if (this._OPCR === 1) {
                    this._originProgramClockBase = this._stream.readUint32() << 1;
                    next = this._stream.readUint16();
                    // this._originProgramClockBase += next >>> 15;
                    this._originProgramClockExtension = next & 0x1ff;
                }

                if (this._splicePoint === 1) {
                    this._spliceCountdown = this._stream.readUint8();
                }

                if (this._transportPrivate === 1) {
                    let length = this._stream.readUint8(),
                        transportPrivateData: number[] = [];
                    for (let i = 0; i < length; i++) {
                        transportPrivateData.push(this._stream.readUint8())
                    }
                }

                if (this._adaptationFieldExtension === 1) {
                    let length = this._stream.readUint8(), //该长度只包含3flags所指定的区域长度
                        next = this._stream.readUint8(),
                        start = this._stream.position;
                    let ltw = next >>> 7,
                        piecewise = next >>> 6 & 0x1,
                        seamless = next >>> 5 & 0x1;

                    if (ltw === 1) {
                        next = this._stream.readUint16();
                        this._ltwValid = next >>> 15;
                        this._ltwOffset = next & 0xefff;
                    }

                    if (piecewise === 1) {
                        next = this._stream.readUint24();
                        this._piecewiseRate = next & 0x3fffff;
                    }

                    if (seamless === 1) {
                        next = this._stream.readInt8();
                        this._spliceType = next >>> 4;
                        this._dtsNextAU1 = next >>> 1 & 0x7;
                        this._marker1 = next & 0x1;
                        next = this._stream.readUint16();
                        this._dtsNextAU2 = next >>> 1;
                        this._marker2 = next & 0x1;
                        next = this._stream.readUint16();
                        this._dtsNextAU3 = next;
                    }
                    this._stream.skip(length - 1 - (this._stream.position - start));
                }
                let lastStuffing = this._adaptationLength - 1 - (this._stream.position - _start);
                this._stream.skip(lastStuffing);
            }
        }
        this._buffer = new Stream(this._stream.buffer.slice(this._stream.position));
    }
}

export default TSPackageAdaptationField;