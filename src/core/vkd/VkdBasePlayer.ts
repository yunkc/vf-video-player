/**
 * 自定义核心 基础播放器类
 */
import { StateTypeList } from "../../config/StateTypeList";
import * as EventEmitter from 'eventemitter3';
import NormalUtils from '../../utils/NormalUtils';
import { IObject } from '../../interface/IGeneral';
import { EventLevel } from "../../events/EventLevel";
import { ErrorTypeList } from "../../config/ErrorTypeList";
import EventCenter from "../../events/EventCenter";
import IPlayerCore from "../../interface/IPlayerCore";
import { playerConfig } from '../../config/MediaPlayerConfig';
import PlayerStateManager from "../PlayerStateManager";
import RuntimeLog from "../../log/RuntimeLog";
import Buffer from "./Buffer";
import MSE from "./MSE";

abstract class VkdBasePlayer extends EventEmitter implements IPlayerCore {
    [key: string]: any;

    width: number;
    height: number;
    aspectRatio: string;
    bufferedEnd: number;
    bufferedPercent: number;

    private _video: HTMLVideoElement;
    private _mainUrl: string;
    private _mainUrlMap: IObject = {
        '240P': null,
        '360P': null,
        '480P': null,
        '720P': null,
        '1080P': null,
        '4K': null,
    };
    private _usefulUrlList: IObject[] = [];
    protected _options: IObject;
    protected _switchDefinitionTimer: number = null;
    protected _switchingDefinition: boolean = false;
    protected _mediaSegmentsQueue: Uint8Array[] = [];
    protected _taskQueue: IObject[] = [];
    protected _taskHandling: boolean = false;
    protected _mediaBufferCache: Buffer = new Buffer();
    protected _mse: MSE;


    get video(): HTMLVideoElement {
        return this._video;
    }

    get currentTime(): number {
        return this._video.currentTime;
    }

    set currentTime(value: number) {
        this._video.currentTime = value;
    }

    get buffered(): TimeRanges {
        return this._video.buffered;
    }

    get duration(): number {
        return this._video.duration;
    }

    get src(): string {
        return this._video.src;
    }

    set src(value: string) {
        this._video.src = value;
    }

    get currentWidth(): number {
        return this._video.videoWidth;
    }

    get currentHeight(): number {
        return this._video.videoHeight;
    }

    get muted(): boolean {
        return this._video.muted;
    }

    set muted(value: boolean) {
        playerConfig.muted = value;
        this._video.muted = value;
    }

    get poster(): string {
        return this._video.poster;
    }

    set poster(value: string) {
        playerConfig.poster = value;
        this._video.poster = value;
    }

    get videoPlaybackQuality(): unknown {
        return this._video.getVideoPlaybackQuality();
    }

    get volume(): number {
        return this._video.volume;
    }

    set volume(value: number) {
        playerConfig.volume = value;
        this._video.volume = value;
    }

    get playbackRate(): number {
        return this._video.playbackRate;
    }

    set playbackRate(value: number) {
        playerConfig.playbackRate = value;
        this._video.playbackRate = value;
    }

    get loop(): boolean {
        return playerConfig.loop;
    }

    set loop(value: boolean) {
        playerConfig.loop = value;
        this._video.loop = value;
    }

    get preload(): string {
        return this._video.preload;
    }

    set preload(value: string) {
        playerConfig.preload = value;
        this._video.preload = value;
    }

    get autoplay(): boolean {
        return this._video.autoplay;
    }

    set autoplay(value: boolean) {
        playerConfig.autoplay = value;
        this._video.autoplay = value;
    }

    get controls(): boolean {
        return this._video.controls;
    }

    set controls(value: boolean) {
        playerConfig.controls = value;
        this._video.controls = value;
    }

    get supportFullScreen(): boolean {
        return this._video.webkitSupportsFullscreen;
    }

    get mainUrl(): string {
        return this._mainUrl;
    }

    set mainUrl(value: string) {
        this._mainUrl = value;
    }

    get mainUrlMap(): IObject {
        return this._mainUrlMap;
    }

    set mainUrlMap(value: IObject) {
        this._mainUrlMap = value;
    }

    get usefulUrlList(): IObject[] {
        return this._usefulUrlList.concat();
    }

    constructor(videoElement: HTMLVideoElement, options: IObject) {
        super();
        this._video = videoElement;
        this._options = options;
    }

    /**
     * 初始化
     */
    protected init() {
        if (!playerConfig.resolution) {
            playerConfig.resolution = 'Auto';
        }

        try {
            this.urlStrategies[NormalUtils.typeOf(this._options.src)]();
            this.initMediaEventsListener();
        } catch (e) {
            this.dispatchErrorEvent(ErrorTypeList.PLAYER_CORE_INIT_ERROR, `in VkdBasePlayer init: ${e.message}`, null);
        }
    }

    /**
     * url初始化
     */
    protected urlStrategies: IObject = {
        'String': () => {
            playerConfig.canSwitchResolution = false;
            this._mainUrlMap = {
                '240P': null,
                '360P': null,
                '480P': null,
                '720P': null,
                '1080P': null,
                '4K': null,
            };
            this._usefulUrlList = [];
            playerConfig.currentResolution = null;
            this.mainUrl = this._options.src;
        },

        'Object': () => {
            playerConfig.canSwitchResolution = true;
            this.mainUrlMap = { ...this._options.src };
            this.mainUrl = this.createCanSwitchMainUrl();
        }
    }

    /**
     * 创建可切换分辨率模式下的初始化url
     */
    private createCanSwitchMainUrl() {
        let mainUrl = null;
        let _keys = Object.keys(this.mainUrlMap);
        let _usefulUrl: IObject[] = [];
        _keys.forEach((item: string) => {
            if (this.mainUrlMap[item]) {
                _usefulUrl.push({
                    url: this.mainUrlMap[item],
                    key: item
                });
            }
        })
        if (!_usefulUrl.length) {
            this.errorHandler({
                message: `no userful url, core init failed!`
            })
            return;
        }
        this._usefulUrlList = _usefulUrl;

        if (playerConfig.resolution === 'Auto') {
            // Auto分辨率下优先480P, 否则选择第一个可用src作为baseUrl
            if (this.mainUrlMap['480P']) {
                mainUrl = this.mainUrlMap['480P'];
                playerConfig.currentResolution = '480P';
            } else {
                let _lastUrlObj = this._usefulUrlList[0];
                playerConfig.currentResolution = _lastUrlObj.key;
                mainUrl = _lastUrlObj.url;
            }
        } else {
            playerConfig.currentResolution = playerConfig.resolution;
            mainUrl = this.mainUrlMap[playerConfig.resolution];
        }

        RuntimeLog.getInstance().log(`(player) init resolution: ${playerConfig.currentResolution}, mainUrl: ${mainUrl}`)
        return mainUrl;
    }

    /**
     * 初始化媒体事件监听器
     */
    private initMediaEventsListener() {
        const MediaEventsList: IObject = { ...StateTypeList, ...{ onError: 'error' } };
        Object.keys(MediaEventsList).forEach((key: string) => {
            if (MediaEventsList[key] === 'seeking') {
                this._video.onseeking = NormalUtils.throttle(this.seekingHandler) as any;
            } else {
                this._video.addEventListener(`${MediaEventsList[key]}`,
                    (e: IObject) => {
                        let eventHandlerName = MediaEventsList[key] + "Handler";
                        if (this[eventHandlerName] && typeof this[eventHandlerName] === 'function') {
                            this[eventHandlerName]();
                        }
                        this.handleMediaEvent(MediaEventsList[key], e);
                    }
                )
            }
        });
    }

    /**
     * mediaEvent抽象方法
     */
    abstract timeupdateHandler = () => { };
    abstract onPauseHandler = () => { };
    abstract waitingHandler = () => { };
    abstract seekingHandler = () => { };

    /**
     * Media事件处理
     */
    protected handleMediaEvent(name: string, originEvent: IObject) {
        let _data: IObject = null;
        if (name === "timeupdate") {
            _data = {
                currentTime: this._video.currentTime,
                duration: this._video.duration
            }
        }
        PlayerStateManager.getInstance().updatePlayerState(name);

        if (name === "ended") {
            if (NormalUtils.is_weixin() && !NormalUtils.is_iOS()) {
                this.play();
                setTimeout(() => {
                    this.pause();
                }, 100);
                RuntimeLog.getInstance().log('special handle ended event in WX browser (not iOS).');
            }
        }

        EventCenter.getInstance().dispatchOutwardEvent('PlayerMediaEvent', {
            code: name,
            message: `H5 media event ${name} fired.`,
            data: _data
        }, originEvent);

        this.emit(name, originEvent);
    }

    /**
     * 移除媒体事件监听器
     */
    private removeMediaEventsListener() {
        const MediaEventsList: IObject = { ...StateTypeList, ...{ onError: 'error' } };

        Object.keys(MediaEventsList).forEach((key: string) => {
            this._video.removeEventListener(
                `on${MediaEventsList[key].charAt(0).toUpperCase()}${MediaEventsList[key].slice(1)}`,
                (e: IObject) => {
                    this.handleMediaEvent(MediaEventsList[key], e)
                }
            )
        });
    }

    /**
     * 抛出异常事件
     * @param {IObject} code
     * @param {string} message
     * @param {IObject} data
     */
    protected dispatchErrorEvent = (code: IObject, message: string, data: IObject = null) => {
        let errorObj: IObject = {
            code: code,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: data
        };

        // this.emit('error', errorObj);
        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj as IObject);
    };

    /**
     * start方法 指定video的MSE链接
     * @param {string} url
     */
    protected start(url: string) {
        this._video.src = url;
        //配置播放器行为
        ['autoplay', 'muted', 'poster', 'controls', 'volume', 'playbackRate'].forEach((item: string) => {
            (this._video as IObject)[item] = playerConfig[item];
        })
    }

    /**
     * 获取video已缓冲范围
     */
    protected getBufferedRange(): number[] {
        let range: number[] = [0, 0];
        let video: HTMLVideoElement = this._video;
        let buffered: TimeRanges = video.buffered;
        let currentTime: number = video.currentTime;
        if (buffered) {
            for (let i: number = 0, len = buffered.length; i < len; i++) {
                range[0] = buffered.start(i);
                range[1] = buffered.end(i);
                if (range[0] <= currentTime && currentTime <= range[1]) {
                    break;
                }
            }
        }
        if (range[0] - currentTime <= 0 && currentTime - range[1] <= 0) {
            return range;
        } else {
            return [0, 0];
        }
    }

    /**
     * 响应网络环境变化事件
     */
    protected onNetworkSpeedChange = (e: IObject) => {
        if (!playerConfig.canSwitchResolution) return;

        let targetDefinition = e.networkState

        if (playerConfig.currentDefinition === targetDefinition) return;

        if (this._switchDefinitionTimer) {
            clearTimeout(this._switchDefinitionTimer);
            this._switchDefinitionTimer = undefined;
        }

        /*  let urlNotExist = this.usefulUrlList.every((item: IObject) => {
             if (item.key === targetDefinition) {
                 return false;
             } else {
                 return true;
             }
         });
 
         //如果target指定分辨率不存在, 则进一步判断
         if (urlNotExist) {
             let _mainUrlMapKeys = Object.keys(this._mainUrlMap);
             let _start = _mainUrlMapKeys.indexOf(this._usefulUrlList[0].key);
             let _end = _mainUrlMapKeys.indexOf(this._usefulUrlList[this._usefulUrlList.length - 1].key);
             let _current = _mainUrlMapKeys.indexOf(targetDefinition);
             if (_current < _start) {
                 targetDefinition = this._usefulUrlList[0].key;
             } else if (_current > _end) {
                 targetDefinition = this._usefulUrlList[this._usefulUrlList.length - 1].key;
             } else {
                 //TODO: 目前直接取消切流, 后期需要修改为根据当前分辨率和可用分辨率之间的关系来进行抉择
                 targetDefinition = null
             }
         } */

        this._switchDefinitionTimer = window.setTimeout(() => {
            playerConfig.currentDefinition = targetDefinition;
            this.switchResolution(playerConfig.currentDefinition);
        }, playerConfig.networkSpeedChangeReflectTime);

        RuntimeLog.getInstance().log(`(mp4) netwrok speed change event fired, config definition: ${playerConfig.resolution}, current defunition: ${playerConfig.currentDefinition}, changed definition: ${e.networkState}`);
    }

    /**
     * 切换分辨率抽象方法
     * @param definition 
     */
    abstract switchResolution(definition: string): void;

    /**
     * 清空队列和缓存buffer
     */
    protected clearCache() {
        this._taskQueue = [];
        this._mediaSegmentsQueue = [];
        this._mediaBufferCache = new Buffer();
    }

    public play() {
        this._video.play();
    }

    public pause() {
        this._video.pause();
    };

    public seek(time: number) {
        let _time = Math.min(this.duration, Math.max(0, time));
        this._video.currentTime = _time;
    }

    public replay() {
        this.currentTime = 0;
        this.play();
    }

    public enterFullScreen(): void {
        this._video.webkitEnterFullScreen();
    }

    public exitFullScreen(): void {
        this._video.webkitExitFullScreen();
    }

    public reset(): void {
        throw new Error("Method not implemented.");
    }

    public setCurrentTimeByPercent(percent: number): void {
        throw new Error("Method not implemented.");
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

        if (this._switchDefinitionTimer) {
            clearTimeout(this._switchDefinitionTimer);
            this._switchDefinitionTimer = undefined;
        }

        if (playerConfig.resolution !== resolution) {
            playerConfig.resolution = resolution;
            /**
             * 如果 其他分辨率 => Auto 则不立即切换, 后续切换逻辑网速监控来完成
             * 否则 Auto => 其他分辨率 则立刻切换
             */
            if (resolution !== 'Auto') {
                playerConfig.currentResolution = resolution;
                this.switchResolution(resolution);
            }
        }
    }

    /**
     * 销毁BasePlayer
     */
    public dispose() {
        this.clearCache();
        this.removeMediaEventsListener();
        this._video = null;
        this._options = null;
    }
}

export default VkdBasePlayer