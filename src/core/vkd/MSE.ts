/**
 * MSE 媒体流生成类
 */
import * as EventEmitter from "eventemitter3";
import { EventLevel } from "../../events/EventLevel";
import { ErrorTypeList } from "../../config/ErrorTypeList";
import TypedArray = NodeJS.TypedArray;
import { IObject } from '../../interface/IGeneral';
import NormalUtils from '../../utils/NormalUtils';
import RuntimeLog from '../../log/RuntimeLog';
import EventCenter from "../../events/EventCenter";
import { playerConfig } from '../../config/MediaPlayerConfig';

class MSE extends EventEmitter {
    // private _codecs: string = 'video/mp4; codecs="avc1.64001E, mp4a.40.5"';
    private _codecs: string = 'video/mp4; codecs=';
    private _video_codecs: string = 'avc1.64001E';
    private _audio_codecs: string;
    private readonly _mediaSource: MediaSource;
    private _url: string;
    private _updating: boolean = false;
    private _penddingQueue: ArrayBuffer[] = [];
    private _sourceBuffer: SourceBuffer = null;
    private _removeQueue: IObject[] = [];
    private _videoElement: HTMLVideoElement = null;

    constructor(videoElement: HTMLVideoElement, { audio_codecs = '' }) {
        super();
        this._videoElement = videoElement;
        this._audio_codecs = NormalUtils.strSpaceFilter(audio_codecs);
        this._codecs += `\"${this._video_codecs}${this._audio_codecs ? ", " + this._audio_codecs : ""}\"`;
        RuntimeLog.getInstance().log(`(MSE) codecs => '${this._codecs}'`);
        this._mediaSource = new MediaSource;
        this._mediaSource.addEventListener('sourceopen', this.sourceOpenHandler);
        this._mediaSource.addEventListener('sourceclose', this.sourceCloseHandler);
        this._url = window.URL.createObjectURL(this._mediaSource);
    }

    /**
     * mse更新状态
     * @returns {boolean}
     */
    get updating(): boolean {
        return this._updating;
    }

    set updating(value: boolean) {
        this._updating = value;
    }

    /**
     * ready状态
     * @returns {any}
     */
    get state() {
        return this._mediaSource.readyState;
    }

    /**
     * 总长度
     * @returns {number}
     */
    get duration(): number {
        return this._mediaSource.duration
    }

    set duration(value) {
        this._mediaSource.duration = value
    }

    /**
     * 生成的 blob url；
     * @returns {string}
     */
    get url(): string {
        return this._url;
    }

    /**
     * 处理 MediaSource open 事件
     */
    private sourceOpenHandler = () => {
        this._sourceBuffer = this._mediaSource.addSourceBuffer(this._codecs);
        this._sourceBuffer.addEventListener('error', (e: any) => {
            this.dispatchErrorEvent(ErrorTypeList.PLAYER_CORE_MSE_ERROR, `mse source open error`, e);
        });
        this._sourceBuffer.addEventListener('updateend', () => {
            this.onSourceBufferUpdateEndHandler();
        });
        this.emit('sourceopen');
        RuntimeLog.getInstance().log('(MSE) source open');
    };

    /**
     * 处理sourcebuffer更新完毕事件
     */
    private onSourceBufferUpdateEndHandler = () => {
        this.emit('updateend');

        this.handlePendingRemoveBuffer();

        if (!this._penddingQueue.length) return;
        let buffer = this._penddingQueue.shift();
        RuntimeLog.getInstance().log(`%c(MSE) queue shift buffer length : ${buffer.byteLength}`, 'color: #0f0;');
        if (buffer && this._sourceBuffer && !this._sourceBuffer.updating && this.state === 'open') {
            this._sourceBuffer.appendBuffer(buffer);
        }
    }

    /**
     * 处理 MediaSource close 事件
     */
    private sourceCloseHandler = () => {
        this.emit('sourceclose');
    };

    /**
     * 抛出异常事件
     * @param {IObject} code
     * @param {string} message
     * @param {IObject} data
     */
    private dispatchErrorEvent = (code: IObject, message: string, data: IObject = null) => {
        let errorObj: IObject = {
            code: ErrorTypeList.PLAYER_CORE_MSE_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: data
        };
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj as IObject);
    };

    /**
     * 自动清理sourceBuffer
     */
    private autoCleanBuffer() {
        if (!this._sourceBuffer || !this._sourceBuffer.buffered || !this._sourceBuffer.buffered.length) return;

        let _buffered = this._sourceBuffer.buffered;
        let currentTime = this._videoElement.currentTime;
        if (currentTime - _buffered.start(0) <= playerConfig.autoCleanupMaxDuration) return;

        let _needRemove: boolean = false;
        for (let i = 0, l = _buffered.length; i < l; i++) {
            let _start: number = _buffered.start(i);
            let _end: number = _buffered.end(i);

            if (_start <= currentTime && currentTime < _end + 3) {
                if (currentTime - _start >= playerConfig.autoCleanupMaxDuration) {
                    _needRemove = true;
                    let _removeEnd = currentTime - playerConfig.autoCleanupMinDuration;
                    this._removeQueue.push({
                        start: _start,
                        end: _removeEnd
                    })
                }
            } else if (_end < currentTime) {
                _needRemove = true;
                this._removeQueue.push({
                    start: _start,
                    end: _end
                })
            }
            if (_needRemove) break;
        }

        if (_needRemove) {
            this.handlePendingRemoveBuffer();
        }
    }

    /**
     * 删除等待队列处理
     */
    private handlePendingRemoveBuffer() {
        if (this._removeQueue.length && !this._sourceBuffer.updating) {
            while (this._removeQueue.length && !this._sourceBuffer.updating) {
                let _range: IObject = this._removeQueue.shift();
                this._sourceBuffer.remove(_range.start, _range.end);
                RuntimeLog.getInstance().log(`%c(MSE) clean range:${_range.start}-${_range.end}`, 'color: #a42204;');
            }
        }
    }

    /**
     * 添加初始化initSegment
     * @param buffer 
     */
    public appendInitBuffer(buffer: ArrayBuffer) {
        RuntimeLog.getInstance().log(`%c(MSE) push initSegement, buffer length : ${buffer.byteLength}`, 'color: #ff0;');
        let sourceBuffer = this._sourceBuffer;
        this._penddingQueue.length = 0;
        this.autoCleanBuffer();
        if (sourceBuffer && !sourceBuffer.updating && this.state === 'open') {
            RuntimeLog.getInstance().log(`%c(MSE) sourceBuffer append init buffer length : ${buffer.byteLength}`, 'color: #0f0;');
            sourceBuffer.appendBuffer(buffer);
            return true
        } else {
            RuntimeLog.getInstance().log(`%c(MSE) queue push init buffer length : ${buffer.byteLength}`, 'color: #f00;');
            this._penddingQueue.push(buffer);
            return false
        }
    }

    /**
     * 添加media buffer
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    public appendBuffer(buffer: ArrayBuffer) {
        let sourceBuffer = this._sourceBuffer;
        this.autoCleanBuffer();
        if (sourceBuffer && !sourceBuffer.updating && this.state === 'open') {
            RuntimeLog.getInstance().log(`%c(MSE) sourceBuffer append media buffer length : ${buffer.byteLength}`, 'color: #0f0;');
            sourceBuffer.appendBuffer(buffer);
            return true
        } else {
            RuntimeLog.getInstance().log(`%c(MSE) queue push media buffer length : ${buffer.byteLength}`, 'color: #f00;');
            this._penddingQueue.push(buffer);
            return false
        }
    }

    /**
     * 按照时间段(seconds)删除 buffer
     * @param {number} start
     * @param {number} end
     */
    public removeBuffer(start: number, end: number) {
        this._removeQueue.push({
            start: start,
            end: end
        })
        this.handlePendingRemoveBuffer();
    }

    /**
     * 结束 MediaSource
     */
    public endOfStream() {
        if (this.state === 'open') {
            this._mediaSource.endOfStream()
        }
    }

    /**
     * 销毁
     */
    public dispose() {
        this._penddingQueue.length = 0;
        this._removeQueue.length = 0;
        this._sourceBuffer.removeEventListener('updateend', this.onSourceBufferUpdateEndHandler);
        this.removeAllListeners();
    }

    /**
     * 判断播放格式是否支持
     * @param codecs 
     */
    static isSupported(codecs: string) {
        return (window as any).MediaSource && (window as any).MediaSource.isTypeSupported(codecs)
    }
}

export default MSE