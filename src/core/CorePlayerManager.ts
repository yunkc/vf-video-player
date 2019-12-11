/**
 * 播放核心管理者
 */
import IPlayerCore from "../interface/IPlayerCore";
import RuntimeLog from "../log/RuntimeLog";
import EventBus from "../events/EventBus";
import { CommandEvents, PropEvents } from "../events/EventNames";
import { IObject } from '../interface/IGeneral';
import { ErrorTypeList } from "../config/ErrorTypeList";
import EventCenter from "../events/EventCenter";
import { EventLevel } from "../events/EventLevel";
import NormalUtils from '../utils/NormalUtils';
import VkdMP4Player from "./vkd/mp4/VkdMP4Player";
import VkdHLSPlayer from "./vkd/hls/VkdHLSPlayer";
import FMP4Worker from './vkd/FMP4Worker';
import { playerConfigManager, playerConfig } from '../config/MediaPlayerConfig';
import Scheduler from './Scheduler';


/**
 * Manager配置项接口
 */
export default class CorePlayerManager implements IPlayerCore {
    [key: string]: any;

    private _playerCore: any;
    private _player_id: string;
    private _videoElement: HTMLVideoElement;

    constructor(options: IObject) {
        RuntimeLog.getInstance().log('player core manager is loading...');
        this.initManager(options);
        RuntimeLog.getInstance().log('player core manager is loaded');
    }

    /**
     * 创建video标签
     * @param {IObject} config
     */
    private createVideoElement(videoConfig: IObject): HTMLVideoElement {
        let _tempElement = document.createElement('video') as HTMLVideoElement;
        //style
        _tempElement.style.backgroundColor = 'black';
        _tempElement.style.padding = '0px';
        _tempElement.style.outline = 'none';
        //properties
        this._player_id = videoConfig.id || NormalUtils.generateUUID();
        _tempElement.setAttribute('id', this._player_id);
        _tempElement.setAttribute('airplay', 'allow');
        _tempElement.setAttribute('x-webkit-airplay', 'allow');
        _tempElement.setAttribute('playsinline', 'true');
        _tempElement.setAttribute('webkit-playsinline', 'true');
        _tempElement.setAttribute('x5-playsinline', 'true');
        _tempElement.setAttribute('x5-video-player-type', 'h5');
        _tempElement.setAttribute('x5-video-player-fullscreen', 'true');
        _tempElement.setAttribute('width', videoConfig.playerWidth || "100%");
        _tempElement.setAttribute('height', videoConfig.playerHeight || "100%");
        //custom style list
        if (videoConfig.classList && videoConfig.classList.length) {
            videoConfig.classList.forEach((item: string) => {
                _tempElement.classList.add(item);
            })
        }
        return _tempElement;
    }

    /**
     * 创建播放核心管理者
     * @param {object} config
     */
    private initManager(config: IObject) {
        if (!config.container) {
            RuntimeLog.getInstance().error('container element is must-pass param!');
            return;
        }

        this._videoElement = this.createVideoElement({
            id: config.id,
            classList: config.classList,
            playerHeight: config.playerHeight,
            playerWidth: config.playerWidth
        });
        config.container.appendChild(this._videoElement);
        RuntimeLog.getInstance().log('video element appended');

        try {
            this.initVkdPlayerCore(this._videoElement, config);
            this.initEventsHandler();
        } catch (e) {
            let errorObj: IObject = {
                code: ErrorTypeList.PLAYER_CORE_MSE_ERROR,
                level: EventLevel.ERROR,
                target: this,
                message: `media player init error (Core manager): ${e.message}`,
                data: e
            };
            EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        }
    }

    /**
     * 初始化自定义播放核心
     */
    initVkdPlayerCore(element: HTMLVideoElement, options: IObject) {
        if (!options.src) {
            EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
                code: ErrorTypeList.VIDEO_URL_ERROR,
                message: `media player error ${ErrorTypeList.VIDEO_URL_ERROR}, src is must-pass param.`,
                data: null,
            });
        }

        //初始化碎片MP4 worker
        FMP4Worker.getInstance();

        //设置player配置项
        playerConfigManager.setPlayerConfig(options);

        let fileType: string = null;
        //通过获取src中的文件格式来确定加载器和解析器
        if (NormalUtils.typeOf(options.src) === 'String') {
            fileType = NormalUtils.parseExtended(options.src);
        } else if (NormalUtils.typeOf(options.src) === 'Object') {
            let _keys = Object.keys(options.src);
            fileType = NormalUtils.parseExtended(options.src[_keys[0]]); //通过第一个文件检测核心格式
        }

        RuntimeLog.getInstance().log(`file type is ${fileType}`);
        switch (fileType) {
            case '.mp4':
                this._playerCore = new VkdMP4Player(element, options);
                break;
            case '.m3u8':
                this._playerCore = new VkdHLSPlayer(element, options);
                break;
        }
    }

    /**
     * 初始化事件监听器
     */
    private initEventsHandler() {
        for (let key in CommandEvents) {
            EventBus.getInstance().on(CommandEvents[key], this.commandEventsHandler)
        }

        for (let key in PropEvents) {
            EventBus.getInstance().on('set-' + PropEvents[key], this.propEventsHandler);
        }
    }

    /**
     * command事件处理handler
     * @param {IObject} e
     */
    private commandEventsHandler = (e: IObject) => {
        if (!this[e.code] && this[e.code] === undefined) {
            RuntimeLog.getInstance().warning('Player doesn\'t have this function name: ' + e.code);
            return;
        }
        this.callCoreFuncByName(e.code, e.data);
    };

    /**
     * prop事件处理handler
     * @param {IObject} e
     */
    private propEventsHandler = (e: IObject) => {
        e.code = e.code.slice(4); //去除set标记
        if (!this[e.code] && this[e.code] === undefined) {
            RuntimeLog.getInstance().warning('Player doesn\'t have this prop name: ' + e.code);
            return;
        }
        this[e.code] = e.data;
    };

    /**
     * 通过名字调用播放核心方法
     * @param {string} funcName
     * @param {object} params
     */
    public callCoreFuncByName(funcName: string, params: any[]) {
        if (!params) {
            return this[funcName]().bind(this);
        }

        return this[funcName].apply(this, params);
    }

    get playerId(): string {
        return this._player_id;
    }

    set playerId(value: string) {
        this._player_id = value;
        this._videoElement.setAttribute('id', this._player_id);
    }

    get buffered(): any {
        return this._playerCore.buffered;
    }

    get bufferedPercent(): number {
        return this._playerCore.bufferedPercent;
    }

    get currentWidth(): number {
        return this._playerCore.currentWidth;
    }

    get currentHeight(): number {
        return this._playerCore.currentHeight;
    }

    get currentTime(): number {
        return this._playerCore.currentTime;
    }

    set currentTime(value: number) {
        this._playerCore.currentTime = value;
    }

    get duration(): number {
        return this._playerCore.duration
    }

    set duration(value: number) {
        this._playerCore.duration = value;
    }

    get muted(): boolean {
        return this._playerCore.muted;
    }

    set muted(value: boolean) {
        this._playerCore.muted = value;
    }

    get poster(): string {
        return this._playerCore.poster;
    }

    set poster(value: string) {
        this._playerCore.poster = value;
    }

    get volume(): number {
        return this._playerCore.volume;
    }

    set volume(value: number) {
        this._playerCore.volume = value;
    }

    get src(): any {
        return this._playerCore.src;
    }

    set src(value: any) {
        this._playerCore.src = value;
    }

    get playbackRate(): any {
        return this._playerCore.playbackRate;
    }

    set playbackRate(value: any) {
        this._playerCore.playbackRate = value;
    }

    get loop(): boolean {
        return this._playerCore.loop;
    }

    set loop(value: boolean) {
        this._playerCore.loop = value;
    }

    get preload(): boolean {
        return this._playerCore.preload;
    }

    set preload(value: boolean) {
        this._playerCore.preload = value;
    }

    get autoplay(): boolean {
        return this._playerCore.autoplay;
    }

    set autoplay(value: boolean) {
        this._playerCore.autoplay = value;
    }

    get controls(): boolean {
        return this._playerCore.controls;
    }

    set controls(value: boolean) {
        this._playerCore.controls = value;
    }

    get supportFullScreen(): any {
        if (this._playerCore['supportFullScreen'] === undefined) {
            return null;
        }

        return this._playerCore.supportFullScreen;
    }

    get fullScreenState(): any {
        return this._playerCore.fullScreenState;
    }

    get resolutions(): IObject[] | string {
        return this._playerCore.usefulUrlList;
    }

    changeResolution(resolution: string) {
        this._playerCore.changeResolution(resolution);
    }

    changeSrc(source: string): void {
        this._playerCore.changeSrc(source);
    }

    enterFullScreen(): void {
        this._playerCore.enterFullScreen();
    }

    exitFullScreen(): void {
        this._playerCore.exitFullScreen();
    }

    pause(): void {
        this._playerCore.pause();
    }

    play(): void {
        this._playerCore.play();
    }

    replay(): void {
        this._playerCore.replay();
    }

    reset(): void {
        this._playerCore.reset();
    }

    setCurrentTimeByPercent(percent: number): void {
        this._playerCore.setCurrentTimeByPercent(percent);
    }

    dispose(): void {
        //移除所有事件, 注销worker
        FMP4Worker.getInstance().worker.terminate();
        this._playerCore.dispose();
    }
}