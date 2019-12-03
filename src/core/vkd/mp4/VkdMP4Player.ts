/**
 * mp4播放器
 */
import VkdBasePlayer from "../VkdBasePlayer";
import MSE from "../MSE";
import MP4 from './MP4';
import { IObject } from '../../../interface/IGeneral';
import { ErrorTypeList } from "../../../config/ErrorTypeList";
import MediaDataTask from './MediaDataTask';
import RuntimeLog from '../../../log/RuntimeLog';
import Buffer from "../Buffer";
import { playerConfig } from '../../../config/MediaPlayerConfig';
import EventCenter from '../../../events/EventCenter';

class VkdMP4Player extends VkdBasePlayer {
    private _mp4: MP4;
    private _mediaDataLoader: MediaDataTask;
    private _timer: number = undefined;
    private _isEnd: boolean = false;

    constructor(element: HTMLVideoElement, options: IObject) {
        super(element, options);
        if (!MSE.isSupported('video/mp4; codecs="avc1.64001E, mp4a.40.5"')) return;
        this.init();
    }

    private errorHandler = (err: IObject) => {
        if(!err) err = {
            code: ErrorTypeList.UNKNOWN_ERROR,
            message: `(player) unknow error catch!`
        }
        !err.code && (err.code = ErrorTypeList.PLAYER_CORE_MP4_ERROR);
        this.dispatchErrorEvent(err.code, err.message, err.data);
        this.once('canplay', () => {
            this.play();
        });
    };

    /**
     * 初始化player
     */
    protected init() {
        super.init();
        this.createMP4Runtime(this.mainUrl).then((result: IObject) => {
            this._mp4 = result.mp4;
            this._mse = result.mse;
            this._mediaDataLoader = result.mediaDataTask;
            super.start(this._mse.url);
            this._mp4.on('error', (err) => {
                this.errorHandler(err);
            });
        }).catch((err) => {
            this.errorHandler(err);
        });
    }

    /**
     * 创建MP4运行runtime
     * @returns {Promise}
     */
    private createMP4Runtime(url: string) {
        let mp4: MP4 = new MP4(url);
        let mse: MSE;
        let mediaDataTask: MediaDataTask;
        return new Promise((resolve, reject) => {
            mp4.once('moovParseEnd', (data) => {
                RuntimeLog.getInstance().log('(mp4) media info data prased');
                if (!this._mse) {
                    mse = new MSE(this.video, {
                        audio_codecs: data.audioCodec
                    });
                    mse.on('sourceopen', () => {
                        mp4.createInitSegment().then((res: ArrayBuffer) => {
                            mse.appendInitBuffer(res);
                            mediaDataTask.start();
                        })
                    });
                    mse.on('error', (err) => {
                        this.errorHandler(err);
                    });
                }
                mediaDataTask = new MediaDataTask({
                    url: url,
                    videoElement: this.video,
                    videoKeyFrames: data.videoKeyFrames,
                    audioKeyFrames: data.audioKeyFrames,
                    timeScale: data.timeScale,
                    mdatStart: data.mdatStart
                })
                mediaDataTask.on('load', this.onMediaLoaderLoad);
                mediaDataTask.on('error', this.errorHandler);
                mediaDataTask.on('networkSpeedChange', this.onNetworkSpeedChange);

                resolve({ mp4, mse, mediaDataTask });
            });

            mp4.on('error', (e) => {
                !e.code && (e.code = ErrorTypeList.PLAYER_CORE_MP4_ERROR);
                reject(e);
            });
        });
    }

    /**
     * 响应media data loader加载完成事件
     */
    private onMediaLoaderLoad = (e: IObject) => {
        if (this._switchingDefinition) this._switchingDefinition = false;
        let _task = { ...e.task };
        _task.buffer = e.task.buffer.slice(0);
        this._taskQueue.push(_task);
        this.handleNextTask();
    }

    /**
     * 处理下一次任务内容
     */
    private handleNextTask = () => {
        if (!this._mp4 || !this._taskQueue.length || this._taskHandling) return;
        
        this._taskHandling = true;
        let _task = this._taskQueue.shift();

        //组装碎片MP4并加入MSE中
        RuntimeLog.getInstance().log(`(player) handle next task, task id: ${_task.id}`);

        this._mp4.createFragment(_task.buffer, _task.start, _task.id).then((buffer: Uint8Array) => {
            if (buffer) {
                this._mediaBufferCache.write(new Uint8Array(buffer));
                if (this.canSwitchDefinition) {
                    if ((this._mediaBufferCache.buffer.byteLength >= playerConfig.playerAppendMinBufferLengthMap[this.currentDefinition]) ||
                        _task.isLast) {
                        this._mediaSegmentsQueue.push(this._mediaBufferCache.buffer.slice(0));
                        this._mediaBufferCache = new Buffer();
                        this.appendMediaBuffer();
                    }
                } else {
                    this._mediaSegmentsQueue.push(this._mediaBufferCache.buffer.slice(0));
                    this._mediaBufferCache = new Buffer();
                    this.appendMediaBuffer();
                }
            }
        }).catch((err) => {
            this.errorHandler(err);
        }).finally(() => {
            this._taskHandling = false;
            this.handleNextTask();
        })
    }

    /**
     * 向MSE中添加mediaSegments
     */
    private appendMediaBuffer = () => {
        if (!this._mediaSegmentsQueue.length || !this._mse) return;
        let _tempMediaBuffer = this._mediaSegmentsQueue.shift();
        let mse = this._mse;
        mse.updating = true;
        mse.appendBuffer(_tempMediaBuffer);
        mse.once('updateend', () => {
            mse.updating = false;
        });
    }

    /**
     * 切流
     * @param url 
     */
    switchDefinition(definition: string) {
        if (!this.mainUrlMap[definition]) {
            // TODO: 先取消报错, 直接放弃切流
            // this.errorHandler({
            //     message: `no userful ${definition} src.`
            // })
            return;
        }
        let url = this.mainUrlMap[definition];

        //如果目标分辨率不存在或正处于切流中, 放弃切流
        if (!definition || this._switchingDefinition) return;
        this.clearCache();

        //如果剩余时间小于当前播放时间+切换预置时间, 放弃切流
        if (this.currentTime + playerConfig.playerPreSwitchTime >= this.duration) {
            return;
        }

        let _currentTime = this.currentTime;
        let _switchStartTime: number = this._mediaDataLoader.getFrameTimeByTime(_currentTime + playerConfig.playerPreSwitchTime);

        //判断当前播放所处缓冲区域的结尾时间是否大于预置时间, 优先时间长者
        if (this.buffered.length) {
            for (let i = 0; i < this.buffered.length; i++) {
                let _tempStart = this.buffered.start(i);
                let _tempEnd = this.buffered.end(i);
                if (this.currentTime >= _tempStart && this.currentTime <= _tempEnd) {
                    _switchStartTime = _tempEnd;
                    break;
                }
            }
        }

        this._mediaDataLoader.abort(); //取消当前下载器任务
        this._mediaDataLoader.removeAllListeners();
        this._mediaDataLoader = undefined;
        //取消当前下载后设置状态为切换中
        this.currentDefinition = definition;
        this._switchingDefinition = true;
        this.createMP4Runtime(url).then((result: IObject) => {
            if (_switchStartTime === null) {
                //返回null说明预置时间已经处于最后一个gap中, 放弃切流
                RuntimeLog.getInstance().log('(player) switch start time illegal, prevent switch definition');
                return;
            }

            //卸载并重新初始化mp4模块
            this._mp4.removeAllListeners();
            this._mp4 = result.mp4;
            this._mp4.on('error', (err) => {
                this.errorHandler(err);
            });
            this._mp4.createInitSegment().then((res: ArrayBuffer) => {
                this._mse.appendInitBuffer(res);
            })
            //卸载并重新初始化 media data loader
            this._mediaDataLoader = result.mediaDataTask;
            if (_switchStartTime >= this.currentTime + playerConfig.triggerNextLoadRangeTime) return;
            this._mediaDataLoader.seek(_switchStartTime);
        }).catch((e: unknown) => {
            this.errorHandler(e);
        })
    }

    /**
     * 判断当前播放进度是否为结束
     */
    private isEnded = () => {
        if (this._mp4.meta.endTime - this.currentTime < playerConfig.playerEndGapTime) {
            this._isEnd = true;
            this.pause();
            setTimeout(() => {
                this.handleMediaEvent('ended', null);
                if (playerConfig.loop) {
                    this.seek(0);
                    this.play();
                }
            }, 0)

        }
    }

    /**
     * 响应seeking事件
     */
    seekingHandler = () => {
        this.clearCache();
        if (this._mediaDataLoader) {
            this._mediaDataLoader.seek(this.currentTime);
        }
    }

    /**
     * 响应timeupdate事件
     */
    timeupdateHandler = () => {
        if (this._mediaDataLoader) {
            this._mediaDataLoader.checkNeedNextRangeLoad(this.currentTime);
        }
    }

    /**
     * 响应waiting事件
     */
    waitingHandler = () => {
        if (this._mse && !this._mse.updating) {
            this.isEnded();
        }

        if (this._isEnd) {
            clearTimeout(this._timer);
        } else {
            if (!this._timer) {
                this._timer = window.setTimeout(() => {
                    this.seekingHandler();
                    clearTimeout(this._timer);
                    this._timer = undefined;
                }, playerConfig.playerWaitingHandlerTime);
            }
        }
    }

    /**
     * 响应暂停事件
     */
    onPauseHandler = () => {
    }

    /**
     * 响应播放事件
     */
    onPlayHandler = () => {
    }

    /**
     * 切换播放源
     * @param url 
     */
    changeSrc(url: string) {
        this.clearCache();

        if (this._mediaDataLoader) {
            this._mediaDataLoader.abort(); //取消当前下载器任务
            this._mediaDataLoader.removeAllListeners();
            this._mediaDataLoader = undefined;
        }

        if (this._mp4) {
            this._mp4.removeAllListeners();
            this._mp4 = undefined;
        }

        if (this._mse) {
            this._mse.dispose();
            this._mse = undefined;
        }

        this.createMP4Runtime(url).then((result: IObject) => {
            //卸载并重新初始化mp4模块
            this._mp4 = result.mp4;
            this._mse = result.mse;
            super.start(this._mse.url);
            this._mp4.on('error', (err) => {
                this.errorHandler(err);
            });
            this._mp4.createInitSegment().then((res: ArrayBuffer) => {
                this._mse.appendInitBuffer(res);
            })
            //卸载并重新初始化 media data loader
            this._mediaDataLoader = result.mediaDataTask;
            this._mediaDataLoader.seek(0);
        }).catch((e: unknown) => {
            this.errorHandler(e);
        })
    }

    /**
     * 销毁
     */
    public dispose() {
        super.dispose();
        this._mp4.dispose();
        //TODO: dispose
    }
}

export default VkdMP4Player;