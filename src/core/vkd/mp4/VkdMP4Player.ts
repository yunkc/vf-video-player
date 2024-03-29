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
import { playerConfig } from '../../../config/MediaPlayerConfig';
import Scheduler from '../../Scheduler';

class VkdMP4Player extends VkdBasePlayer {
    private _mp4: MP4;
    private _mediaDataLoader: MediaDataTask;
    private _waitingHandlerTimer: number = undefined;
    private _isEnd: boolean = false;

    constructor(element: HTMLVideoElement, options: IObject) {
        super(element, options);
        if (!MSE.isSupported('video/mp4; codecs="avc1.64001E, mp4a.40.5"')) return;
        this.init();
        Scheduler.setInterval(playerConfig.appendRateToMSE, this.appendMediaBuffer);
    }

    private errorHandler = (err: IObject) => {
        if (!err) err = {
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
            this._mediaDataLoader.on('load', this.onMediaLoaderLoad);
            this._mediaDataLoader.on('error', this.errorHandler);
            this._mediaDataLoader.on('networkStateChange', this.onNetworkStateChange);
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
        if (this._switchingResolution) this._switchingResolution = false;
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
        // RuntimeLog.getInstance().log(`(player) handle next task, task id: ${_task.id}`);

        this._mp4.createFragment(_task.buffer, _task.start, _task.id).then((buffer: Uint8Array) => {
            if (buffer) {
                this._mediaSegmentsQueue.push(buffer);
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
     * 判断当前播放进度是否为结束
     */
    private isEnded = () => {
        if (this._mp4.meta.endTime - this.currentTime < playerConfig.playerEndGapTime) {
            this._isEnd = true;
            this.clearAllTimer();
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
     * clear所有Timer
     */
    private clearAllTimer = () => {
        this._waitingHandlerTimer && clearTimeout(this._waitingHandlerTimer);
        this._switchResolutionTimer && clearTimeout(this._switchResolutionTimer);
    }

    /**
     * 更新分辨率
     * @param resolution
     */
    private updateResolution(resolution: string, switchStartTime?: number) {
        let url = this.mainUrlMap[resolution];
        playerConfig.currentResolution = resolution;
        //卸载mp4和loader, 清空队列
        this.clearCache();
        this._mp4.removeAllListeners();
        this._mp4 = undefined;
        this._mediaDataLoader.abort();
        this._mediaDataLoader.removeAllListeners();
        this._mediaDataLoader = undefined;
        playerConfig.currentResolution = resolution;

        //TODO 更新到状态管理  取消当前下载后设置状态为切换中
        this._switchingResolution = true;
        this.createMP4Runtime(url).then((result: IObject) => {
            //重新初始化mp4
            this._mp4 = result.mp4;
            this._mp4.on('error', (err) => {
                this.errorHandler(err);
            });
            this._mp4.createInitSegment().then((res: ArrayBuffer) => {
                this._mse.appendInitBuffer(res);
            })
            //重新初始化 media data loader
            this._mediaDataLoader = result.mediaDataTask;
            this._mediaDataLoader.on('load', this.onMediaLoaderLoad);
            this._mediaDataLoader.on('error', this.errorHandler);
            this._mediaDataLoader.on('networkStateChange', this.onNetworkStateChange);
            if (!switchStartTime) {
                this._mediaDataLoader.seek(this.currentTime);
            } else {
                this._mediaDataLoader.seek(switchStartTime);
            }

        }).catch((e: unknown) => {
            this.errorHandler(e);
        })
    }

    /**
     * 切流
     * @param resolution 
     */
    switchResolution(resolution: string) {
        //切流中, 放弃切流
        if (this._switchingResolution) return;
        //如果剩余时间小于当前播放时间+切换预置时间, 放弃切流
        if (this.currentTime + playerConfig.playerPreSwitchTime >= this.duration) return;

        let _switchStartTime: number = this.currentTime + playerConfig.playerPreSwitchTime;
        let _taskEndTime: number = this._mediaDataLoader.getFrameTimeByTime(_switchStartTime);
        //返回null说明预置时间已经处于最后一个gap中, 放弃切流
        if (_taskEndTime === null) return;

        //判断当前播放所处缓冲区域的结尾时间是否大于预置时间, 优先时间短者
        let _buffered_lg = this.buffered.length;
        if (_buffered_lg) {
            let _tempStart = null;
            let _tempEnd = null;
            for (let i = 0; i < _buffered_lg; i++) {
                _tempStart = this.buffered.start(i);
                _tempEnd = this.buffered.end(i);
                if (this.currentTime >= _tempStart && this.currentTime <= _tempEnd) {
                    break;
                }
            }
            //如果已经缓冲并播放到最后 放弃切流
            if (Math.abs(_tempEnd - this.duration) <= 0.5) return;
            _switchStartTime = Math.min(_switchStartTime, _tempEnd);
        }
        this.updateResolution(resolution, _switchStartTime);
    }

    /**
     * 改变分辨率
     * @param resolution 
     */
    public changeResolution(resolution: string) {
        if (!playerConfig.canSwitchResolution) {
            RuntimeLog.getInstance().warning(`(player) cannot switch definition when only have one src!`);
            return;
        }
        //如果传入目标分辨率不存在或正处于切流中, 放弃切流
        if (!resolution || this._switchingResolution) return;
        //如果目标分辨率不是Auto且在map中找不到, 放弃切流
        if (resolution !== 'Auto' && !this.mainUrlMap[resolution]) return;
        this.clearAllTimer();

        if (playerConfig.resolution !== resolution) {
            playerConfig.resolution = resolution;
            /**
             * 如果 其他分辨率 => Auto 则不立即切换, 后续切换逻辑网速监控来完成
             * 否则 Auto => 其他分辨率 则立刻切换
             */
            if (resolution !== 'Auto') {
                this.updateResolution(resolution);
            }
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

        /* if (!this._waitingHandlerTimer && !this._isEnd) {
            this._waitingHandlerTimer = window.setTimeout(() => {
                this.seekingHandler();
                clearTimeout(this._waitingHandlerTimer);
            }, playerConfig.playerWaitingHandlerTime);
        } */

    }

    /**
     * 响应暂停事件
     */
    pauseHandler = () => {
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