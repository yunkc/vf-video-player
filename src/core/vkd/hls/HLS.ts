import * as EventEmitter from "eventemitter3";
import M3U8 from './M3U8';
import { IObject } from '../../../interface/IGeneral';
import TSTask from './TSTask';
import RuntimeLog from '../../../log/RuntimeLog';
import TSStreamParser from "./TSStreamParser";
import TSPackage from "./TSPackage";
import TSPackagePES from './ts/TSPackagePES';
import Buffer from '../Buffer';
import FMP4 from '../FMP4';
import MSE from '../MSE';
import EventCenter from "../../../events/EventCenter";
import { EventLevel } from "../../../events/EventLevel";
import { ErrorTypeList } from '../../../config/ErrorTypeList';
import VkdHLSPlayer from './VkdHLSPlayer';
import NormalUtils from '../../../utils/NormalUtils';
import VkdBasePlayer from '../VkdBasePlayer';

/**
 * HLS组装器
 */
class HLS extends EventEmitter {
    private _player: VkdHLSPlayer;
    private _url: string = '';
    private _segments: IObject[] = [];
    private _taskIdCache: Set<number> = new Set<number>();
    private _m3u8: M3U8 = null;
    private _mse: MSE = null;
    private _cache: Buffer = new Buffer();
    private _inited: Boolean = false;
    private _startDTS: number = undefined;

    constructor(player: VkdHLSPlayer, url: string) {
        super();
        this._player = player;
        this._url = url;
        this.init(url)
    }

    /**
     * 初始化
     * @param url 
     */
    private init(url: string) {
        RuntimeLog.getInstance().log('m3u8 header file start parsing...');
        let m3u8 = new M3U8(this._url);
        m3u8.once('ready', () => {
            RuntimeLog.getInstance().log('m3u8 header file parsed');
            this._segments = m3u8.segments;
            this._mse = new MSE(this._player.video, {
                audio_codecs: 'mp4a.40.5'
            });
            this._mse.on('sourceopen', this.onMSEOpenHandler);
            this._mse.on('error', this.onMSEErrorHandler);
            this._player.start(this._mse.url);
        })
        this._m3u8 = m3u8;
    }

    /**
     * MSE open事件处理
     */
    private onMSEOpenHandler = () => {
        let tsTask = null;
        tsTask = new TSTask(this._segments);
        tsTask.on('load', this.onTSLoadHandler);
        tsTask.on('error', this.onTSErrorHandler);
    }

    /**
     * MSE 异常事件处理
     */
    private onMSEErrorHandler = (err: IObject) => {
        this.dispatchErrorEvent('MSE ERROR', err);
    }

    /**
     * ts文件下载完成事件处理
     */
    private onTSLoadHandler = (e: IObject) => {
        let _task = e.task;
        RuntimeLog.getInstance().log(`received media data => id: ${_task.idx}`);

        if (this._taskIdCache.has(_task.idx)) return;
        this._taskIdCache.add(_task.idx);
        // RuntimeLog.getInstance().log('ts media data start parsing...');
        try {
            let _ts = new TSStreamParser(_task.cacheBuffer);
            this.parsePES(_ts);
        } catch (e) {
            this.dispatchErrorEvent(`ts stream parse error: ${e.message}`);
        }
    }

    /**
     * ts文件下载异常事件处理
     */
    private onTSErrorHandler = (e: IObject) => {
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', e);
    }

    /**
     * pes解析
     * @param ts 
     */
    private parsePES(ts: TSStreamParser) {
        let _pesArr: TSPackagePES[] = [];
        let _video: TSPackagePES[] = [];
        let _audio: TSPackagePES[] = [];
        let _meta: IObject = null;
        ts.pes.forEach((item: TSPackage[], idx: number) => {
            let _pes = new TSPackagePES(item);
            _pesArr.push(_pes);
            if (_pes.type === 'video') {
                _video.push(_pes);
            } else if (_pes.type === 'audio') {
                _audio.push(_pes);
            }
        })
        _video.some((item: TSPackagePES) => {
            if (item.ES.sps.length) {
                let es = item.ES;
                let as = _audio[0].ES; //audio
                let duration: number = 0;
                this._m3u8.segments.forEach((item: IObject) => {
                    duration += item.duration * 1; //为live模式作准备, duration需要不断计算
                })
                //媒体信息
                _meta = {
                    sps: es.sps,
                    pps: es.pps,
                    width: es.info.width,
                    height: es.info.height,
                    pixelRatio: es.info.pixelRatio,
                    channelCount: as.channel,
                    timeScale: as.frequence,
                    sampleRate: as.frequence,
                    profile: as.profile,
                    duration: duration,
                    audioConfig: _audio[0].ES.audioConfig
                }
                return false;
            }
        })
        if (_meta) {
            if (this._startDTS === undefined) {
                this._startDTS = Math.min(_video[0].dts, _audio[0].pts);
            }
            let _onlyVideo = !!_audio.length;
            _meta.startDTS = this._startDTS;
            _meta.videoSamples = _video;
            if (_onlyVideo) {
                _meta.audioSamples = _audio;
            }
            //解析完ts后初始化mse
            if (!this._inited) {
                RuntimeLog.getInstance().log('mse start init...');
                this._inited = true;
                this._mse.appendInitBuffer(this.initSegment(_meta));
            }

            // this._mse.appendBuffer()
            let _videoBuffer = this.createVideoSegment(_meta);
            let _audioBuffer = this.createAudioFragment(_meta);
            // let _tempBuffer = NormalUtils.concatTypedArray(Uint8Array, _videoBuffer, _audioBuffer);
            let _tempBuffer = NormalUtils.concatUint8Array(_videoBuffer, _audioBuffer);
            this._mse.appendBuffer(_tempBuffer);
            this._mse.once('updateend', () => {
                // this.update()
            })
        }
    }


    /**
     * 创建初始化片段
     * @param data 
     */
    private initSegment(meta: IObject) {
        let buffer = new Buffer();
        buffer.write(FMP4.ftyp());
        buffer.write(FMP4.moov(meta));
        this._cache.write(buffer.buffer);
        return buffer.buffer;
    }

    /**
     * 添加video片段
     */
    private createVideoSegment(meta: IObject) {
        let video = meta.videoSamples;

        let samplesLength = video.length;

        let sampleDuration = (video[samplesLength - 1].dts - video[0].dts) / samplesLength;
        let samples, startDTS;
        startDTS = meta.startDTS;
        samples = video.map((item: TSPackagePES, idx: number) => {
            let duration
            if (idx + 1 === samplesLength) {
                duration = sampleDuration;
            } else {
                duration = video[idx + 1].dts - item.dts;
            }
            return {
                size: item.ES.buffer.byteLength,
                duration: duration,
                offset: item.pts - item.dts,
                buffer: item.ES.buffer,
                key: !!item.ES.pps.length
            }
        })
        return this.addFragment({
            id: 1,
            time: video[0].dts - startDTS,
            firstFlags: 0x2000000,
            flags: 0xf01,
            samples: samples
        })
    }

    /**
     * 添加audio片段
     */
    private createAudioFragment(meta: IObject) {
        let audio = meta.audioSamples; let samplesLength = audio.length; let startPTS = meta.startDTS || 0
        let samples, duration
        samples = audio.map((item: TSPackagePES, idx: number) => {
            if (idx + 1 === samplesLength) {
                duration = (audio[samplesLength - 1].pts - audio[0].pts) / samplesLength
            } else {
                duration = audio[idx + 1].pts - item.pts
            }
            return {
                size: item.ES.buffer.byteLength,
                duration,
                offset: 0,
                buffer: item.ES.buffer,
                key: true
            }
        })
        return this.addFragment({
            id: 2,
            time: audio[0].pts - startPTS,
            firstFlags: 0x00,
            flags: 0x701,
            samples: samples
        })
    }

    /**
     * 添加片段
     * @param data 
     */
    addFragment(data: IObject) {
        let buffer = new Buffer();
        buffer.write(FMP4.moof(data));
        buffer.write(FMP4.mdat(data));
        this._cache.write(buffer.buffer);
        return buffer.buffer;
    }

    /**
     * 抛出异常
     */
    private dispatchErrorEvent = (message: string, data: IObject = null) => {
        let errorObj: IObject = {
            code: ErrorTypeList.PLAYER_CORE_HLS_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: data
        };
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
    };

}

export default HLS;