import Stream from "../../Stream";
import TSPackage from '../TSPackage';
import EventCenter from "../../../../events/EventCenter";
import { ErrorTypeList } from "../../../../config/ErrorTypeList";
import { EventLevel } from "../../../../events/EventLevel";
import NormalUtils from '../../../../utils/NormalUtils';
import TSPackageAdaptationField from './TSPackageAdaptationField';
import ExpGolomb from "./ExpGolomb";
import { IObject } from '../../../../interface/IGeneral';

/**
 * es解析类
 */

class TSPackageES {
    private _stream: Stream = null;
    private _tsArr: TSPackage[] = [];
    private _sps: number[];
    private _pps: number[];
    private _info: IObject;
    private _buffer: Uint8Array;
    private _id: string;
    private _layer: number;
    private _absent: number;
    private _audioObjectType: number;
    private _profile: number;
    private _frequencyIndex: number;
    private _frequence: number;
    private _channel: number;
    private _frameLength: number;
    private _audioConfig: number[];

    get sps(): number[] {
        return this._sps;
    }

    get pps(): number[] {
        return this._pps;
    }

    get info(): IObject {
        return this._info
    }

    get channel(): number {
        return this._channel;
    }

    get frequence(): number {
        return this._frequence;
    }

    get profile(): number {
        return this._profile;
    }

    get audioConfig(): number[] {
        return this._audioConfig;
    }

    get buffer(): Uint8Array {
        return this._buffer;
    }

    constructor(stream: Stream, type: string, tsArr: TSPackage[]) {
        let next: number = null;
        let totalBuffer: Uint8Array = TSPackageES.Merge(stream, tsArr);
        this._stream = new Stream(totalBuffer.buffer);
        if (type === 'video') {
            next = this._stream.readUint32();
            if (next !== 1) {
                this._stream.back(4);
                next = this._stream.readUint24();
                if (next !== 1) {
                    this.dispatchErrorEvent(`h264 nal header parse failed`);
                }
            }
            //09 0xNN 打包ES为pes的时候 pes header和es数据之间需要插入一个type=9的nalu以及随意1B的数据
            this._stream.skip(2);
            this.findSPS();
            this._sps = TSPackageES.readSPSorPPS(this._stream, 'sps');
            this._pps = TSPackageES.readSPSorPPS(this._stream, 'pps');
            let nal;
            if (this._sps.length) {
                this._info = new ExpGolomb(new Uint8Array(this._sps)).readSPS();
                nal = this._stream.readUint24();
            } else {
                nal = this._stream.readUint24();
                if (nal === 0) {
                    nal = this._stream.readUint8();
                }
            }

            if (nal === 1) {
                let vdata: Uint8Array = new Uint8Array(this._stream.buffer.slice(this._stream.position));
                // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._stream.writeUint32(vdata.byteLength), vdata);
               this._buffer =  NormalUtils.concatUint8Array(this._stream.writeUint32(vdata.byteLength), vdata);
            } else {
                this.dispatchErrorEvent(`h264 convert to avcc error`);
            }
        } else if (type === 'audio') {
            next = this._stream.readUint16();
            // adts的同步字节，12位
            if (next >>> 4 !== 0xfff) {
                this.dispatchErrorEvent(`aac ES parse error`);
            }
            const fq: number[] = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
            this._id = (next >>> 3 & 0x01) === 0 ? 'MPEG-4' : 'MPEG-2';
            this._layer = next >>> 1 & 0x03;
            this._absent = next & 0x01;
            next = this._stream.readUint16();
            this._audioObjectType = (next >>> 14 & 0x03) + 1;
            this._profile = this._audioObjectType - 1;
            this._frequencyIndex = next >>> 10 & 0x0f;
            this._frequence = fq[this._frequencyIndex];
            this._channel = next >>> 6 & 0x07;
            this._frameLength = (next & 0x03) << 11 | (this._stream.readUint16() >>> 5);
            this._audioConfig = TSPackageES.getAudioConfig(this._audioObjectType, this._channel, this._frequencyIndex);
            this._stream.skip(1);
            this._buffer = TSPackageES.Merge(this._stream, this._tsArr);
        }

    }

    /**
     * 该方法查找sps nalu并将position置为查找到的位置
     * @param tsArr 
     */
    private findSPS() {
        let _next: number = 0;
        do {
            if (this._stream.position <= 0 || this._stream.position >= this._stream.length) {
                this.dispatchErrorEvent(`ES cannot find sps and pps info`);
                break;
            }

            _next = this._stream.readUint8();
            if (_next === 0) {
                _next = this._stream.readUint24();
                if (_next === 1) {
                    //找到分隔符 判断类型(后5位)
                    _next = this._stream.readUint8();
                    if ((_next & 0x1f) === 7) {
                        //找到sps 回退5字节
                        this._stream.back(5);
                        break;
                    } else if ((_next & 0x1f) !== 6) {
                        //非SEI增强信息直接回退
                        this._stream.back(5);
                        break;
                    }
                } else {
                    this._stream.back(3);
                }
            }
        } while (true)
    }

    /**
     * 读取 序列参数集（SPS）或 图像参数集（PPS）
     * @param stream 
     * @param type 
     */
    static readSPSorPPS(stream: Stream, type: string = 'sps') {
        let isSps = type === 'sps';
        let _backStep = isSps ? 4 : 3;
        let _nextCheckFlag = isSps ? 7 : 8;
        let start: number = stream.readUint32();//分隔符 0x00000001
        let result: number[] = [],
            next: number,
            flag: Boolean = true,
            check: Boolean = false;

        if (start === 1) {
            do {
                next = stream.readUint8();
                if (!check) {
                    if ((next & 0x1f) !== _nextCheckFlag) {
                        flag = false;
                        stream.back(5);
                        break;
                    } else {
                        check = true;
                    }
                }
                if (next !== 0) {
                    result.push(next);
                } else {
                    next = isSps ? stream.readUint24() : stream.readUint16();
                    if (next === 1) {
                        flag = false;
                        stream.back(_backStep);
                    } else {
                        stream.back(_backStep);
                        result.push(stream.readUint8());
                    }
                }
            } while (flag)
        } else {
            stream.back(4);
        }

        return result;
    }

    /**
     * 获取音频配置信息
     * @param audioObjectType 
     * @param channel 
     * @param sampleIndex 
     */
    static getAudioConfig(audioObjectType: number, channel: number, sampleIndex: number): number[] {
        let userAgent = navigator.userAgent.toLowerCase(), config, extensionSampleIndex;
        if (/firefox/i.test(userAgent)) {
            if (sampleIndex >= 6) {
                audioObjectType = 5;
                config = new Array(4);
                extensionSampleIndex = sampleIndex - 3;
            } else {
                audioObjectType = 2;
                config = new Array(2);
                extensionSampleIndex = sampleIndex;
            }
        } else if (userAgent.indexOf('android') !== -1) {
            audioObjectType = 2;
            config = new Array(2);
            extensionSampleIndex = sampleIndex;
        } else {
            audioObjectType = 5;
            config = new Array(4);
            if (sampleIndex >= 6) {
                extensionSampleIndex = sampleIndex - 3;
            } else {
                if (channel === 1) {
                    audioObjectType = 2;
                    config = new Array(2);
                }
                extensionSampleIndex = sampleIndex;
            }
        }

        config[0] = audioObjectType << 3;
        config[0] |= (sampleIndex & 0x0e) >> 1;
        config[1] = (sampleIndex & 0x01) << 7;
        config[1] |= channel << 3;
        if (audioObjectType === 5) {
            config[1] |= (extensionSampleIndex & 0x0e) >> 1;
            config[2] = (extensionSampleIndex & 0x01) << 7;
            config[2] |= 2 << 2;
            config[3] = 0;
        }
        return config;
    }

    /**
     * 拼接媒体数据
     * @param buffer 
     * @param ts 
     */
    static Merge(buffer: Stream, ts: TSPackage[]) {
        let length: number = buffer.length - buffer.position,
            data: Uint8Array,
            offset: number = length;
        ts.forEach(item => {
            length += (item.body as TSPackageAdaptationField).buffer.length;
        });
        data = new Uint8Array(length);
        data.set(new Uint8Array(buffer.buffer, buffer.position), 0);
        ts.forEach(item => {
            buffer = (item.body as TSPackageAdaptationField).buffer;
            data.set(new Uint8Array(buffer.buffer, buffer.position), offset);
            offset += buffer.length - buffer.position;
        });
        return data;
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

export default TSPackageES;