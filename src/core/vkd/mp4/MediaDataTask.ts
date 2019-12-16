import { IObject } from '../../../interface/IGeneral';
import * as EventEmitter from 'eventemitter3';
import { ErrorTypeList } from '../../../config/ErrorTypeList';
import { EventLevel } from '../../../events/EventLevel';
import HTTPLoader from '../HTTPLoader';
import { playerConfig } from '../../../config/MediaPlayerConfig';
import RuntimeLog from '../../../log/RuntimeLog';
import EventCenter from '../../../events/EventCenter';
import NormalUtils from '../../../utils/NormalUtils';

/**
 * 视频媒体内容下载管理类
 */
//下载任务状态
const NOT_LOAD: number = 0;
const LOADING: number = 1;
const LOADED: number = 2;
//网速区域范围
const netStatesMap: IObject = {
    '240P': [0, 0.1],
    '360P': [0.1, 0.4],
    '480P': [0.4, 1],
    '720P': [1, 2],
    '1080P': [2, 4],
    '4K': [4, 8]
}
//下载切片大小
const SLICE_SIZE = 200000;
class MediaDataTask extends EventEmitter {
    private _url: string = '';
    private _keepLoader: HTTPLoader = null;
    private _taskMap: IObject[] = [];
    private _videoKeyFrames: IObject[];
    private _audioKeyFrames: IObject[];
    private _mdatStart: number = 0;
    private _preloadTime: number;
    private _preloadIndex: number;
    private _keepLoadedIndex: number = 0;
    private _timeScale: number;
    private _isLoading: boolean = false;
    private _options: IObject = {
        url: '',
        videoElement: null,
        videoKeyFrames: [],
        audioKeyFrames: [],
        preloadTime: playerConfig.preloadTime,
        timeScale: 1,
        mdatStart: 0,
    };
    private _loadStartTime: number = -1;
    private _loadEndTime: number = -1;
    private _netState: string = null;

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        this._isLoading = value;
    }

    constructor(options: IObject) {
        super();
        this._options = { ...this._options, ...options };
        this._url = this._options.url;
        this._timeScale = options.timeScale;
        this._videoKeyFrames = this._options.videoKeyFrames;
        this._audioKeyFrames = this._options.audioKeyFrames;
        this._preloadTime = this._options.preloadTime;
        this._mdatStart = this._options.mdatStart;
        this._preloadIndex = this.getIndexByTime(this._preloadTime);
        this.initTaskList();
        if (this._options.fromStart) {
            this.initTaskLoader();
        }
    }

    /**
     * 根据关键帧建立任务列表
     */
    private initTaskList() {
        let _lg: number = this._videoKeyFrames.length;
        this._videoKeyFrames.forEach((item: IObject, idx: number) => {
            this._taskMap.push({
                start: this._audioKeyFrames.length ? Math.min(item.offset, this._audioKeyFrames[idx].samples.offset) : item.offset,
                end: idx < this._videoKeyFrames.length - 1 ? (
                    this._audioKeyFrames.length ? Math.max(this._videoKeyFrames[idx + 1].offset, this._audioKeyFrames[idx + 1].samples.offset) : this._videoKeyFrames[idx + 1].offset
                ) : null,
                state: NOT_LOAD,
                time: this._videoKeyFrames[idx].time,
                id: idx,
                isLast: idx === _lg - 1 ? true : false,
            })
        })
    }

    /**
     * 创建loader
     */
    private initTaskLoader() {
        if (!this._taskMap.length) {
            this.emit('error', {
                code: ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel.ERROR,
                target: this,
                message: `MediaDataTask task map length is 0`
            })
            return;
        }
        //默认开始第一分片下载
        this.createNextKeepLoader();
    }

    /**
     * 创建next loader
     */
    private createNextKeepLoader() {
        if (this._keepLoader) return;

        if (this._keepLoadedIndex >= this._videoKeyFrames.length ||
            this._keepLoadedIndex > this._preloadIndex
        ) return;

        let _currentTask = this._taskMap[this._keepLoadedIndex];
        //如果当前分片处于下载中或者下载完毕, 则进入下一分片
        if (_currentTask.state !== NOT_LOAD) {
            this.emit('load', {
                task: _currentTask
            });
            this._keepLoadedIndex += 1;
            this.createNextKeepLoader();
            return;
        };

        /* 
        this._keepLoader = new HTTPLoader({
            url: this._url,
            fileType: 'mp4'
        });
        _currentTask.state = LOADING;
        this._loadStartTime = Date.now();
        this._keepLoader.start(
            _currentTask.start + this._mdatStart,
            _currentTask.end ? _currentTask.end + this._mdatStart : null
        ).then((res: XMLHttpRequest) => {
            this._keepLoader = null;
            let _contentSize = +res.getResponseHeader('Content-Length') / 1048576; //B -> MB
            this.checkNetworkState(_contentSize);
            _currentTask.buffer = res.response;
            _currentTask.state = LOADED
            this._keepLoadedIndex += 1;
            this.emit('load', {
                task: _currentTask
            });
            //发送currentTask后将当前任务置空防止其占用内存
            _currentTask.buffer = undefined;
            _currentTask.state = NOT_LOAD;
            this.createNextKeepLoader();
        }).catch((e: any) => {
            this.dispatchError(e);
        }) */


        _currentTask.state = LOADING;
        let _taskStart = _currentTask.start + this._mdatStart;
        let _taskEnd = _currentTask.end ? _currentTask.end + this._mdatStart : null;
        let _tempEnd = _taskStart - 1, _tempBuffer = new Uint8Array(0);
        let eleLoad = () => {
            this._keepLoader = new HTTPLoader({
                url: this._url,
                fileType: 'mp4'
            });
            this._loadStartTime = Date.now();
            if (_taskEnd === null) {
                this._keepLoader.start(_taskStart, null).then((res: XMLHttpRequest) => {
                    _currentTask.buffer = res.response;
                    _currentTask.state = LOADED
                    this._keepLoadedIndex += 1;
                    this.emit('load', {
                        task: _currentTask
                    });
                    //发送currentTask后将当前任务置空防止其占用内存
                    _currentTask.buffer = undefined;
                    _currentTask.state = NOT_LOAD;
                })
            } else {
                let _tempStart = _tempEnd + 1;
                _tempEnd = Math.min(_tempStart + SLICE_SIZE, _taskEnd);
                this._keepLoader.start(_tempStart, _tempEnd).then((res: XMLHttpRequest) => {
                    _tempBuffer = NormalUtils.concatUint8Array(_tempBuffer, new Uint8Array(res.response));
                    let _contentSize = +res.getResponseHeader('Content-Length') / 1048576; //B -> MB
                    this.checkNetworkState(_contentSize);

                    if (_tempEnd === _taskEnd) {
                        _currentTask.buffer = _tempBuffer.buffer; //TODO:拼接最后buffer
                        _currentTask.state = LOADED
                        this._keepLoadedIndex += 1;
                        this.emit('load', {
                            task: _currentTask
                        });
                        //发送currentTask后将当前任务置空防止其占用内存
                        _currentTask.buffer = undefined;
                        _tempBuffer = undefined;
                        _currentTask.state = NOT_LOAD;
                        this._keepLoader = null;
                        this.createNextKeepLoader();
                    } else {
                        eleLoad();
                    }
                })
            }

        }
        eleLoad();
    }

    /**
     * 检测网络状态
     */
    private checkNetworkState(contentSize: number) {
        this._loadEndTime = Date.now();
        let _networkSpeed: number = (contentSize * 1000) / (this._loadEndTime - this._loadStartTime); //ms -> s
        let _keys: string[] = Object.keys(netStatesMap);
        let _tempNetState: string = null;
        _keys.every((key: string) => {
            if (_networkSpeed >= netStatesMap[key][0] &&
                _networkSpeed < netStatesMap[key][1]) {
                _tempNetState = key;
                return false;
            } else return true;
        })
        if (!_tempNetState) return;

        // RuntimeLog.getInstance().log(`%c >> net speed: ${_networkSpeed} MB/s, net state: ${_tempNetState} <<`, 'color: #858701;background: #061a87');

        //发送网速事件
        EventCenter.getInstance().dispatchOutwardEvent('PlayerDownloadSpeed', {
            speed: _networkSpeed,
            netState: _tempNetState
        })

        if (!this._netState) {
            this._netState = _tempNetState;
            return;
        }

        //只有当前分辨率为Auto时才会发送该事件
        if (this._netState !== _tempNetState && playerConfig.resolution === 'Auto') {
            this.abort();
            this._netState = _tempNetState;
            RuntimeLog.getInstance().log(`media data task networkStateChange event fired`);

            //发送网速变化事件
            this.emit('networkStateChange', {
                networkState: this._netState
            });
        }
    }

    /**
     * 抛出异常
     */
    private dispatchError = (e: any) => {
        let errorObj: IObject = {
            code: ErrorTypeList.PLAYER_CORE_TASK_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: `MediaDataTask xhr error: ${e.message || 'load fail'}`,
            data: null
        };
        this.emit('error', errorObj);
    }

    /**
     * 通过时间获取其所在索引
     * @param timeStart 
     */
    private getIndexByTime(time: number) {
        let _timeStart = time * this._timeScale;
        let _seekIdx: number = -1;
        let _videoKeyFrames = this._videoKeyFrames;
        let _audioKeyFrames = this._audioKeyFrames;

        _videoKeyFrames.every((item: IObject, idx: number) => {
            let nowTime: number = item.time.time;
            let nextTime = _videoKeyFrames[idx + 1] ? _videoKeyFrames[idx + 1].time.time : Number.MAX_SAFE_INTEGER;
            if (nowTime <= _timeStart && _timeStart < nextTime) {
                _seekIdx = idx;
                return false;
            } else return true;
        })

        _audioKeyFrames.every((item: IObject, idx: number) => {
            let nowTime: number = item.startTime;
            let nextTime = _audioKeyFrames[idx + 1] ? _audioKeyFrames[idx + 1].startTime : Number.MAX_SAFE_INTEGER;
            if (nowTime <= time && time < nextTime) {
                _seekIdx = Math.min(idx, _seekIdx);
                return false;
            } else return true;
        })

        return _seekIdx;
    }

    /**
     * 开始下载 为默认不开启下载的情况准备
     */
    start() {
        this.initTaskLoader();
    }

    /**
     * 取消当前下载, 该行为默认关闭自动下载
     */
    abort() {
        if (!this._keepLoader) return;
        this._keepLoader.abort();
        this._keepLoader = null;
        this._taskMap[this._keepLoadedIndex] && (this._taskMap[this._keepLoadedIndex].state = NOT_LOAD);
    }

    /**
     * 跳转
     * @param time
     */
    seek(time: number) {
        this.abort();
        let _time: number = time;
        let _seekIdx = this.getIndexByTime(_time);
        this._keepLoadedIndex = _seekIdx;
        let _seekEndIdx = this.getIndexByTime(_time + this._preloadTime);
        this._preloadIndex = _seekEndIdx;
        RuntimeLog.getInstance().log(`dataTask: seekIdx: ${_seekIdx}, seekEndIdx${_seekEndIdx}`);
        this.createNextKeepLoader();
    }

    /**
     * 通过时间获取播放时间结尾 如果是最后一帧则返回null
     * @param time
     */
    getFrameTimeByTime(time: number) {
        let _currentIdx = this.getIndexByTime(time);
        let _nextIdx = _currentIdx + 1;
        if (!this._videoKeyFrames[_nextIdx]) {
            return null;
        }
        return this._videoKeyFrames[_nextIdx].time.time / this._timeScale;
    }

    /**
     * 检测当前播放时间是否已经超过条件限制并重新开启下一段preload  range下载
     * @param time 
     */
    checkNeedNextRangeLoad(time: number) {
        if (this._preloadIndex > this._videoKeyFrames.length - 2) return;
        let _currentTime = time;
        //获取当前帧结尾 | 下一帧开始时间
        let _startTime = this._videoKeyFrames[this._preloadIndex].time.time / this._timeScale;
        let _endTime = this._videoKeyFrames[this._preloadIndex].time.time
        // let _endTime = (_startTime + _duration) / this._timeScale;

        if (_startTime - _currentTime <= playerConfig.triggerNextLoadRangeTime) {
            RuntimeLog.getInstance().log(`trigger preload, currentTime: ${_currentTime}, _endTime: ${_startTime}, triggerNextLoadRangeTime: ${playerConfig.triggerNextLoadRangeTime}`);
            this.seek(_startTime);
        }
    }
}

export default MediaDataTask;