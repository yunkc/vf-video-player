/**
 * mp4组装器
 */
import MediaInfoTask from './MediaInfoTask';
import * as EventEmitter from "eventemitter3";
import Parse from "./Parse";
import { ErrorTypeList } from "../../../config/ErrorTypeList";
import { EventLevel } from "../../../events/EventLevel";
import Box from "./Box";
import { IObject } from '../../../interface/IGeneral';
import MathUtils from "../../../utils/MathUtils";
import DeepClone = require("lodash/cloneDeep");
import RuntimeLog from '../../../log/RuntimeLog';
import EventCenter from '../../../events/EventCenter';
import FMP4Worker from '../FMP4Worker';
import EventBus from '../../../events/EventBus';
import { WorkerEvents } from '../../../events/EventNames';


const DownloadBlockSize: number = Math.pow(25, 4);

class MP4 extends EventEmitter {
    private readonly _url: string;
    private _boxes: Box[];
    private _moovBox: Box;
    private _videoTrak: any = [];
    private _audioTrak: any = [];
    private _mdatStart: number;
    private _videoFrames: IObject[];
    private _audioFrames: IObject[];
    private _timeRange: number[][] = [];
    private _meta: IObject;
    private _videoOnly: boolean = false;
    private _typeBox: IObject = {
        video: {
            stsc: null,
            stsz: null,
            stts: null,
            stco: null,
            ctts: null
        },
        audio: {
            stsc: null,
            stsz: null,
            stts: null,
            stco: null,
            ctts: null
        }
    };

    get timeRange(): number[][] {
        return this._timeRange;
    }

    get meta(): IObject {
        return this._meta;
    }

    /**
     * 获取视频帧数组
     * @returns {IObject[]}
     */
    get videoKeyFrames(): IObject[] {
        if (this._videoFrames) {
            return this._videoFrames;
        }
        let stss: Box = Box.findBox(this._videoTrak, 'stss') as Box;
        let frames = this.getSamplesByOrders('video', (stss.entries as number[]).map(item => item - 1));
        this._videoFrames = frames;
        return frames;
    }

    /**
     * 获取音频帧数组
     * @returns {IObject[]}
     */
    get audioKeyFrames(): IObject[] {
        if (this._audioFrames) {
            return this._audioFrames;
        }
        let videoMdhdBox: Box = Box.findBox(this._videoTrak, 'mdhd') as Box;
        let audioMdhdBox: Box = Box.findBox(this._audioTrak, 'mdhd') as Box;
        let audioSttsBox: Box = Box.findBox(this._audioTrak, 'stts') as Box;
        if (audioMdhdBox) {
            let videoScale: number = videoMdhdBox.timeScale;
            let audioScale: number = audioMdhdBox.timeScale;
            let audioStts: IObject[] = audioSttsBox.entry;
            let videoFrames: IObject[] = this.videoKeyFrames;
            let audioIndex: IObject[];
            audioIndex = videoFrames.map((item: IObject) => {
                return Box.seekOrderSampleByTime(audioStts, audioScale, item.time.time / videoScale);
            });
            this._audioFrames = audioIndex;
        } else {
            this._audioFrames = [];
        }

        this._audioFrames.forEach((item: IObject, idx: number) => {
            let _tempAudioSamples = this.getSamplesByOrders('audio', item.order, 0)[0];
            item.samples = _tempAudioSamples
        })

        return this._audioFrames;
    }

    constructor(url: string) {
        super();
        this._url = url;
        this.init();
        this.once('moovReady', this.moovParse);
    }

    /**
     * 发送错误事件
     * @param {IObject} code
     * @param {string} message
     * @param data
     */
    private dispatchErrorEvent = (message: string = '', data: any = null, code?: string) => {
        let errorObj = {
            code: code || ErrorTypeList.PLAYER_CORE_MP4_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: data
        };
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj as IObject);
    };

    /**
     * 视频媒体信息下载
     * @param {number} start = 0
     * @param {number} end = start + DownloadBlockSize
     * @returns {Promise}
     */
    private getMediaInfoData(start: number = 0, end?: number) {
        if (end === undefined) end = start + DownloadBlockSize;
        RuntimeLog.getInstance().log(`loading media info data from ${start} to ${end}...`);
        return new Promise((resolve, reject) => {
            //下载结果response直接作为resolve的参数
            let mediaInfoTask = new MediaInfoTask(this._url, start, end, resolve);
            mediaInfoTask.once('error', (errObj: IObject) => {
                // this.emit('error', errObj);
                reject(errObj);
            })
        })
    }

    /**
     * 解析moov视频信息
     */
    private moovParse = () => {
        RuntimeLog.getInstance().log('(mp4) media info data start prasing...');
        let videoTrak: Box, audioTrak: Box;
        let videoCodec: string = '', audioCodec: string = '';
        let videoTimeScale: number, audioTimeScale: number;
        let sps: number[], pps: number[], profile: number, width: number | string, height: number | string;
        let channelCount: number, sampleRate: number, decoderConfig: string;

        let mvhd: Box | Box[] = Box.findBox(this._moovBox, 'mvhd') as Box;
        let traks: Box | Box[] = Box.findBox(this._moovBox, 'trak');
        this._moovBox.freeTraksbox();
        traks = [].concat(traks);
        traks.forEach((trak: Box) => {
            let hdlr: Box = Box.findBox(trak, 'hdlr') as Box;
            let mdhd: Box = Box.findBox(trak, 'mdhd') as Box;
            if (!hdlr || !mdhd) {
                this.dispatchErrorEvent(`mp4 parse can not find hdlr: ${hdlr} | mdhd: ${mdhd}`);
                return;
            }
            let stsd: Box = Box.findBox(trak, 'stsd') as Box;
            let codecBox: Box = stsd.subBox[0] as Box;
            if (hdlr.handleType === 'vide') {
                let avcC: Box = Box.findBox(trak, 'avcC') as Box;
                let tkhd: Box = Box.findBox(trak, 'tkhd') as Box;
                videoTrak = trak;
                videoTimeScale = mdhd.timeScale;
                if (avcC) {
                    videoCodec = `${codecBox.type}. ` + MathUtils.toHex(avcC.profile, avcC.profileCompatibility, avcC.AVCLevelIndication).join('');
                    sps = avcC.sequence && avcC.sequence.map((item: string) => Number(`0x${item}`));
                    pps = avcC.pps && avcC.pps.map((item: string) => Number(`0x${item}`));
                    profile = avcC.profile;
                } else {
                    videoCodec = codecBox.type as string;
                }

                if (tkhd) {
                    width = tkhd.width;
                    height = tkhd.height;
                }
            }
            if (hdlr.handleType === 'soun') {
                audioTrak = trak;
                let esds: Box = Box.findBox(trak, 'esds') as Box;
                let mp4a: Box = Box.findBox(trak, 'mp4a') as Box;
                let ESDescriptor = Box.findBox(trak, 5) as Box;
                audioTimeScale = mdhd.timeScale;
                if (esds) {
                    audioCodec = `${codecBox.type}. ` + MathUtils.toHex(esds.subBox[0].subBox[0].typeID) + `.${esds.subBox[0].subBox[0].subBox[0].type}`
                } else {
                    audioCodec = codecBox.type as string;
                }

                if (ESDescriptor && ESDescriptor.EScode) {
                    decoderConfig = ESDescriptor.EScode.map((item: string) => Number(`0x${item}`));
                }

                if (mp4a) {
                    channelCount = mp4a.channelCount;
                    sampleRate = mp4a.sampleRate
                }
            }
        });
        this._videoTrak = DeepClone(videoTrak as object);
        this._audioTrak = DeepClone(audioTrak as object);
        let mdat: Box = this._boxes.find(item => item.type === 'mdat');
        let videoDuration: number = Number(Box.seekTrakDuration(videoTrak, videoTimeScale));
        let audioDuration: number = Number(Box.seekTrakDuration(audioTrak, audioTimeScale));
        this._mdatStart = mdat.start;
        let vf: IObject[] = this.videoKeyFrames;
        let videoKeyFramesLg = vf.length - 1;
        vf.forEach((item: IObject, idx: number) => {
            if (idx < videoKeyFramesLg) {
                this._timeRange.push([
                    item.time.time / videoTimeScale,
                    vf[idx + 1].time.time / videoTimeScale
                ])
            } else {
                this._timeRange.push([
                    item.time.time / videoTimeScale,
                    -1
                ])
            }
        });

        if (!audioCodec) {
            this._videoOnly = true;
        }

        this._meta = {
            videoCodec,
            audioCodec,
            createTime: mvhd.createTime,
            modifyTime: mvhd.modifyTime,
            duration: mvhd.duration / mvhd.timeScale,
            timeScale: mvhd.timeScale,
            videoDuration,
            videoTimeScale,
            audioDuration,
            audioTimeScale,
            endTime: this._videoOnly ? Number(videoDuration) : Math.min(Number(videoDuration), Number(audioDuration)),
            sps,
            pps,
            width,
            height,
            profile,
            pixelRatio: [
                1, 1
            ],
            channelCount,
            sampleRate,
            audioConfig: decoderConfig,
            videoOnly: this._videoOnly
        }
        //发送媒体信息解析完毕事件
        this.emit('moovParseEnd', {
            audioCodec: audioCodec,
            videoKeyFrames: this.videoKeyFrames,
            audioKeyFrames: this.audioKeyFrames,
            timeScale: videoTimeScale,
            mdatStart: mdat.start
        });

        //计算平均播放帧率
        let _samplesCount: number = this.videoKeyFrames[this.videoKeyFrames.length - 1].idx;
        let _frameRate: number = _samplesCount / videoDuration;
        this._meta.frameRate = _frameRate;

        //外抛媒体信息至最外层
        EventCenter.getInstance().dispatchOutwardEvent('PlayerMediaInfoParsed', this._meta);
    };

    /**
     * 初始化，获取moov元信息
     */
    private init() {
        this.getMediaInfoData().then((res: ArrayBuffer) => {
            let parsed: Parse;
            let moovStart: number = 0;
            let moov: Box;

            try {
                parsed = new Parse(res);
            } catch (e) {
                this.dispatchErrorEvent(`mp4 parse init error: ${e.message}`);
                return;
            }

            //查找moov box
            this._boxes = parsed.boxes;
            this._boxes.every((item: Box) => {
                moovStart += item.size;
                if (item.type === 'moov') {
                    moov = item;
                    this._moovBox = item;
                    this.emit('moovReady', moov);
                    return false
                } else {
                    return true;
                }
            });

            const findNextBox = (parsed: Parse) => {
                if (!moov) {
                    let nextBox: Box = parsed.nextBox;
                    if (nextBox) {
                        if (nextBox.type === 'moov') {
                            this.getMediaInfoData(moovStart, moovStart + nextBox.size + 28).then((res: ArrayBuffer) => {
                                let _parsed = new Parse(res);
                                this._boxes = this._boxes.concat(_parsed.boxes);
                                let tempMoovArr: Box[] = _parsed.boxes.filter(box => box.type === 'moov');
                                if (tempMoovArr.length) {
                                    this._moovBox = tempMoovArr[0];
                                    this.emit('moovReady', tempMoovArr);
                                } else {
                                    this.dispatchErrorEvent(`mp4 parse can not find moov box when next box is moov`);
                                }
                            })
                        } else {
                            this.dispatchErrorEvent(`mp4 parse can not find moov box when next box is not moov`);
                        }
                    } else {
                        this.getMediaInfoData(moovStart).then((res: ArrayBuffer) => {
                            let _parsed = new Parse(res);
                            if (_parsed) {
                                this._boxes = this._boxes.concat(_parsed.boxes);
                                _parsed.boxes.every((item: Box) => {
                                    moovStart += item.size;
                                    if (item.type === 'moov') {
                                        moov = item;
                                        this._moovBox = moov;
                                        this.emit('moovReady', moov);
                                        return false
                                    } else {
                                        return true
                                    }
                                })
                                findNextBox(_parsed);
                            } else {
                                this.dispatchErrorEvent(`mp4 parse can not find moov box when downloaded next block data`);
                            }
                        })
                    }
                }
            }

            findNextBox(parsed);
        }).catch((errObj: IObject) => {
            this.dispatchErrorEvent(`${errObj.message}`);
        })
    }

    /**
     * 按区段获取samples
     * @param {string} type
     * @param {number} start
     * @param {number} end
     * @returns {object}
     */

    private getSamplesByOrders(type: string = 'video', start: number | number[], end: number = undefined): IObject[] {
        let trak = type === 'video' ? this._videoTrak : this._audioTrak;
        ['stsc', 'stsz', 'stts', 'stco', 'ctts'].forEach((item: string) => {
            if (this._typeBox[type][item] === null) {
                this._typeBox[type][item] = Box.findBox(trak, item)
            }
        })

        let mdatStart = this._mdatStart;
        let samples: IObject[] = [];
        end = end !== undefined ? end : this._typeBox[type].stsz.entries.length;
        if (start instanceof Array) {
            start.forEach((item: number) => {
                samples.push({
                    idx: item,
                    size: this._typeBox[type].stsz.entries[item],
                    time: Box.seekSampleTime(
                        this._typeBox[type].stts,
                        this._typeBox[type].ctts, item),
                    offset: Box.seekSampleOffset(
                        this._typeBox[type].stsc,
                        this._typeBox[type].stco,
                        this._typeBox[type].stsz, item, mdatStart)
                })
            })
        } else if (end !== 0) {
            for (let i: number = start; i < end; i++) {
                samples.push({
                    idx: i,
                    size: this._typeBox[type].stsz.entries[i],
                    time: Box.seekSampleTime(
                        this._typeBox[type].stts,
                        this._typeBox[type].ctts, i),
                    offset: Box.seekSampleOffset(
                        this._typeBox[type].stsc,
                        this._typeBox[type].stco,
                        this._typeBox[type].stsz, i, mdatStart)
                })
            }
        } else {
            samples = [{
                idx: start,
                size: this._typeBox[type].stsz.entries[start],
                time: Box.seekSampleTime(
                    this._typeBox[type].stts,
                    this._typeBox[type].ctts, start),
                offset: Box.seekSampleOffset(
                    this._typeBox[type].stsc,
                    this._typeBox[type].stco,
                    this._typeBox[type].stsz, start, mdatStart)
            }]
        }
        return samples;
    }

    /**
     * 生成initSegment buffer
     */
    createInitSegment() {
        return new Promise((resolve, reject) => {
            if (!this._meta) {
                this.dispatchErrorEvent(`mp4 meta info is undefined!`);
                reject(null);
            }

            FMP4Worker.getInstance().worker.postMessage({
                method: 'initSegment',
                params: {
                    meta: this._meta
                }
            })

            EventBus.getInstance().on(WorkerEvents.WORKER_INIT_SEGMENT_FINISHED, (res: IObject) => {
                resolve(res.params);
            })
        })
    }

    /**
     * 创建frgament并将其写入buffer
     */
    createFragment(mdatData: Uint8Array, start: number, fragIndex: number, fragIndexEnd?: number) {
        let _arguments = arguments;

        return new Promise((resolve, reject) => {
            let isSeek: boolean = _arguments.length < 4;
            let framesIndex: number[] = this.videoKeyFrames.map(item => item.idx);
            let _video_samples: IObject[] = isSeek ?
                this.getSamplesByOrders('video', framesIndex[fragIndex], framesIndex[fragIndex + 1]) :
                this.getSamplesByOrders('video', framesIndex[fragIndex], framesIndex[fragIndexEnd]);
            let _audio_samples: IObject[] = [];
            if (this.audioKeyFrames.length) {
                if (isSeek) {
                    _audio_samples = this.getSamplesByOrders(
                        'audio',
                        this.audioKeyFrames[fragIndex].order,
                        this.audioKeyFrames[fragIndex + 1] ? this.audioKeyFrames[fragIndex + 1].order : undefined
                    );
                } else {
                    _audio_samples = this.getSamplesByOrders(
                        'audio',
                        this.audioKeyFrames[fragIndex].order,
                        this.audioKeyFrames[fragIndexEnd] ? this.audioKeyFrames[fragIndexEnd].order : undefined
                    );
                }
            }

            FMP4Worker.getInstance().worker.postMessage({
                method: 'mediaSegment',
                params: {
                    mdatData,
                    start,
                    samples: [_video_samples, _audio_samples]
                }
            })

            EventBus.getInstance().on(WorkerEvents.WORKER_MEDIA_SEGMENT_FINISHED, (res: IObject) => {
                resolve(res.params);
            })
        })
    }

    /**
     * 销毁
     */
    dispose() {
        this._boxes = undefined;
        this._moovBox = undefined;
        this._videoTrak = undefined;
        this._audioTrak = undefined;
        this._mdatStart = undefined;
        this._videoFrames = undefined;
        this._audioFrames = undefined;
        this._timeRange = undefined;
        this._meta = undefined;
        this._videoOnly = undefined;
        this._typeBox = undefined;
    }
}

export default MP4;