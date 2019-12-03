/**
 * 播放 SDK 入口类
 */
import * as EventEmitter from "eventemitter3";
import GlobalAPI from "./api/GlobalAPI";
import RuntimeLog from './log/RuntimeLog';
import { IObject } from './interface/IGeneral';
import { ErrorTypeList } from "./config/ErrorTypeList";
import EventBus from "./events/EventBus";
import { StateTypeList } from "./config/StateTypeList";
import EventCenter from "./events/EventCenter";
import PlayerStateManager from "./core/PlayerStateManager";
import PlayerPluginManager from './plugin/PlayerPluginManager';
import { playerConfig } from './config/MediaPlayerConfig';
import SensorUtils from "./utils/SensorUtils";

export default class MediaPlayer extends EventEmitter {
    private _globalAPI: GlobalAPI;
    private _element: HTMLElement;
    private _options: any;

    /* ------------------------ property ------------------------ */
    /**
     * player像素比
     * @returns {string}
     */
    get aspectRatio(): string {
        return this._globalAPI.getCorePropertyByName('aspectRatio');
    }

    set aspectRatio(value: string) {
        this._globalAPI.setCorePropertyByName('aspectRatio', value);
    }

    /**
     * player已缓冲范围（只读）
     * @returns {any}
     */
    get buffered(): any {
        return this._globalAPI.getCorePropertyByName('buffered')
    }

    /**
     * player已缓冲范围结尾时间（只读）
     * @returns {number}
     */
    get bufferedEnd(): number {
        return this._globalAPI.getCorePropertyByName('bufferedEnd')
    }

    /**
     * player已缓冲百分比（只读）
     * @returns {number}
     */
    get bufferedPercent(): number {
        return this._globalAPI.getCorePropertyByName('bufferedPercent')
    }

    /**
     * video实际宽度（只读）
     * @returns {number}
     */
    get currentWidth(): number {
        return this._globalAPI.getCorePropertyByName('currentWidth');
    }

    /**
     * video实际高度（只读）
     * @returns {number}
     */
    get currentHeight(): number {
        return this._globalAPI.getCorePropertyByName('currentHeight');
    }

    /**
     * player当前播放时间
     * @returns {number}
     */
    set currentTime(value: number) {
        this._globalAPI.setCorePropertyByName('currentTime', value);
    }

    get currentTime() {
        return this._globalAPI.getCorePropertyByName('currentTime');
    }

    /**
     * player总时长
     * @returns {number}
     */
    get duration(): number {
        return this._globalAPI.getCorePropertyByName('duration');
    }

    set duration(value: number) {
        this._globalAPI.setCorePropertyByName('duration', value)
    }

    /**
     * player高度
     * @returns {number}
     */
    get height(): number {
        return this._globalAPI.getCorePropertyByName('height');
    }

    set height(value: number) {
        this._globalAPI.setCorePropertyByName('height', value);
    }

    /**
     * player静音
     * @returns {boolean}
     */
    get muted(): boolean {
        return this._globalAPI.getCorePropertyByName('muted');
    }

    set muted(value: boolean) {
        this._globalAPI.setCorePropertyByName('muted', value);
    }

    /**
     * player封面
     * @returns {string}
     */
    get poster(): string {
        return this._globalAPI.getCorePropertyByName('poster')
    }

    set poster(value: string) {
        this._globalAPI.setCorePropertyByName('poster', value)
    }

    /**
     * player质量（只读）
     * @returns {number}
     */
    get videoPlaybackQuality(): number {
        return this._globalAPI.getCorePropertyByName('videoPlaybackQuality');
    }

    /**
     * player声音
     * @returns {number}
     */
    get volume(): number {
        return this._globalAPI.getCorePropertyByName('volume');
    }

    set volume(value: number) {
        this._globalAPI.setCorePropertyByName('volume', value);
    }

    /**
     * player控制栏
     */
    get controls():boolean{
        return this._globalAPI.getCorePropertyByName('controls')
    }

    set controls(value:boolean){
        this._globalAPI.setCorePropertyByName('controls', value);
    }

    /**
     * player宽度
     * @returns {number}
     */
    get width(): number {
        return this._globalAPI.getCorePropertyByName('width');
    }

    set width(value: number) {
        this._globalAPI.setCorePropertyByName('width', value);
    }

    /**
     * player播放source
     * @returns {any}
     */
    get src(): any {
        return this._globalAPI.getCorePropertyByName('src');
    }

    set src(value: any) {
        this._globalAPI.setCorePropertyByName('src', value);
    }

    /**
     * player播放速度
     * @returns {any}
     */
    get playbackRate(): any {
        return this._globalAPI.getCorePropertyByName('playbackRate');
    }

    set playbackRate(value: any) {
        this._globalAPI.setCorePropertyByName('playbackRate', value);
    }

    /**
     * player是否循环播放
     * @returns {any}
     */
    get loop(): any {
        return this._globalAPI.getCorePropertyByName('loop');
    }

    set loop(value: any) {
        this._globalAPI.setCorePropertyByName('loop', value);
    }

    /**
     * player是否预加载
     * @returns {any}
     */
    get preload(): any {
        return this._globalAPI.getCorePropertyByName('preload');
    }

    set preload(value: any) {
        this._globalAPI.setCorePropertyByName('preload', value);
    }


    /**
     * player是否开始自动播放
     * @returns {any}
     */
    get autoplay(): any {
        return this._globalAPI.getCorePropertyByName('autoplay');
    }

    set autoplay(value: any) {
        this._globalAPI.setCorePropertyByName('autoplay', value);
    }

    /**
     * player是否支持全屏，若player无该方法则返回null
     * @returns {any}
     */
    get supportFullScreen(): any {
        return this._globalAPI.getCorePropertyByName('supportFullScreen');
    }

    /**
     * 获取player全屏状态
     * @returns {any}
     */
    get fullScreenState(): any {
        return this._globalAPI.getCorePropertyByName('fullScreenState');
    }

    /**
     * 获取分辨率
     */
    get definition(){
        return this._globalAPI.getCorePropertyByName('definition');
    }

    set definition(value: IObject[]| string){
        this._globalAPI.setCorePropertyByName('definition', value);
    }

    /**
     * 获取Player当前状态
     * @returns {any}
     */
    get mediaPlayerState(): any {
        return PlayerStateManager.getInstance().getPlayerState();
    }

    /**
     * 获取Player当前配置
     */
    get mediaPlayerConfig():IObject{
        return playerConfig;
    }

    

    /* ------------------------ constructor ------------------------ */
    /**
     * 构造函数
     * @param element 
     * @param options 
     */
    constructor(element: HTMLElement, options: any) {
        super();
        this.setShowLog(options.isShowLog);
        this._element = element;
        this._options = options;
    }

    /* ------------------------ function --------------------------- */
    /**
     * 初始化player外抛事件监听器
     */
    private initOutwardStatesEventsListener() {
        EventBus.getInstance().on('PlayerMediaEvent', (e: IObject) => {
            this.dispatchOutwardEvent('PlayerMediaEvent', e);
        })

        EventBus.getInstance().on('PlayerError', (e: IObject) => {
            this.dispatchOutwardEvent('playerError', e);
        })

        EventBus.getInstance().on('PlayerDownloadSpeed', (e: IObject) => {
            this.dispatchOutwardEvent('PlayerDownloadSpeed', e);
        })
    }

    /**
     * 向media player抛出事件
     */
    private dispatchOutwardEvent(type: string, params: IObject) {
        this.emit(type, params);
    }

    /**
     * 监听内核销毁事件
     * @param e
     */
    private disposeCoreSuccessHandler = (e: any) => {
        RuntimeLog.getInstance().log('player core dispose success');

        RuntimeLog.getInstance().dispose();
        GlobalAPI.getInstance().dispose();
        EventCenter.getInstance().dispose();
        PlayerStateManager.getInstance().dispose();
        PlayerPluginManager.getInstance().dispose();

        this._globalAPI = null;
        this._element = null;
        this._options = null;

        EventBus.getInstance().dispose();
        this.removeAllListeners();
    };

    /**
     * 初始化 player SDK
     */
    public init(): void {
        let containerElement = this._element;
        let options = this._options;
        RuntimeLog.getInstance().outputSdkInfo();

        // Player状态设置为未就绪
        PlayerStateManager.getInstance().updatePlayerState(StateTypeList.NOT_READY);

        this.initOutwardStatesEventsListener();

        // 初始化API模块
        let _GlobalAPIOpts: IObject = {
            containerElement, ...options
        };
        this._globalAPI = GlobalAPI.getInstance(_GlobalAPIOpts);

        // 初始化插件模块
        PlayerPluginManager.getInstance(options.pluginList || []);

        // 初始化打点模块
        // SensorUtils.getInstance(options.saInstance, options.productId, options.isProd);

        // EventBus.getInstance().on('disposeCoreSuccess', this.disposeCoreSuccessHandler);
    }

    /**
     * 切换视频播放源
     * @param {string} source
     */
    public changeSrc(source: string): void {
        this._globalAPI.callFuncByName('changeSrc', source);
    }

    public changeDefinition(definition: string): void {
        this._globalAPI.callFuncByName('changeDefinition', definition);
    }

    /**
     * 进入全屏
     */
    public enterFullScreen(): void {
        this._globalAPI.callFuncByName('enterFullScreen');
    }

    /**
     * 退出全屏
     */
    public exitFullScreen(): void {
        this._globalAPI.callFuncByName('exitFullScreen');
    }

    /**
     * player暂停播放
     */
    public pause(): void {
        this._globalAPI.callFuncByName('pause');
    }

    /**
     * player开始播放
     */
    public play(): void {
        this._globalAPI.callFuncByName('play');
    }

    /**
     * player重播
     */
    public replay(): void {
        this._globalAPI.callFuncByName('replay');
    }

    /**
     * player重置
     */
    public reset(): void {
        this._globalAPI.callFuncByName('reset');
    }

    /**
     * 通过百分比设置player当前播放进度
     * @param {number} percent
     */
    public setCurrentTimeByPercent(percent: number): void {
        this._globalAPI.callFuncByName('setCurrentTimeByPercent', percent);
    }

    /**
     * 设置是否显示log日志
     * @param {boolean} value
     */
    public setShowLog(value: boolean) {
        RuntimeLog.getInstance().changeShowLog(value);
    }

    /**
     * 注册插件
     */
    public registerPlugin(plugins: IObject | IObject[]) {
        PlayerPluginManager.getInstance().registerPlugin(plugins);
    }

    /**
     * 销毁player
     */
    public dispose(): void {
        this._globalAPI.callFuncByName('dispose');
    }
}



