import EventBus from "../events/EventBus";
import { CommandEvents, PropEvents } from "../events/EventNames";
import SensorUtils from "../utils/SensorUtils";
import { IObject, ISensorDataObj } from '../interface/IGeneral';
import { MediaPlayerSdkInfo } from "../config/MediaPlayerConfig";

/**
 * 运行时日志
 */

let _instance: RuntimeLog;

export default class RuntimeLog {
    private _isShowLog: boolean;
    private readonly _isUploadLog: boolean;

    constructor(sign: unknown) {
        if (sign !== PrivateClass) throw new Error('class RuntimeLogCenter is singleton, do not use new operator!')
        this.initLogListener();
        this.initCommandListener();
        this.initWarningListener();
        this.initErrorLinstener();
        this._isShowLog = false;
        this._isUploadLog = false; //目前强制不开启
    }

    static getInstance() {
        if (!_instance) {
            _instance = new RuntimeLog(PrivateClass);
        }
        return _instance;
    }

    /**
     * 初始化log命令事件监听
     */
    private initLogListener() {
        EventBus.getInstance().on('PlayerMediaEvent', this.logEventHandler);
    }

    /**
     * log事件handler
     */
    private logEventHandler = (e: IObject) => {
        if (!e.message) return;
        this.log(e.message);
    };

    /**
     * 初始化command命令事件监听
     */
    private initCommandListener() {
        for (let key in CommandEvents) {
            EventBus.getInstance().on(CommandEvents[key], this.commandEventHandler);
        }

        for (let key in PropEvents) {
            EventBus.getInstance().on('set-' + PropEvents[key], this.commandEventHandler);
            // EventBus.getInstance().on('get-' + PropEvents[key], this.commandEventHandler);
        }
    }

    /**
     * command事件handler
     */
    private commandEventHandler = (e: IObject) => {
        this.command(e.message || 'command has no message');
    };

    /**
     * 初始化warning命令事件监听
     */
    private initWarningListener = () => {
        //TODO: 暂无警告需求
    }

    /**
     * 初始化error事件handler
     */
    private initErrorLinstener = () => {
        EventBus.getInstance().on('PlayerError', this.errorEventHandler);
    }

    /**
     * command事件handler
     */
    private errorEventHandler = (e: IObject) => {
        this.error(e.message || 'error has no message');
    }

    /**
     * 上传日志
     */
    private uploadLog(argsArr: any[]) {
        if (!this._isUploadLog) return;

        let _message = argsArr.join(' ');
        let _tempMsgObj: ISensorDataObj = {
            message: _message,
            type: 'logList'
        };
        // SensorUtils.getInstance().track(_tempMsgObj);
    }

    public outputSdkInfo() {
        //sdk info in console log
        let args: any[] =
            [`%c %c \u2665 VKD-Player version: ${MediaPlayerSdkInfo.version} \u2730 %cAuthor: @ ${MediaPlayerSdkInfo.author} `
                , 'background: #f86; padding:5px 0; line-height:14px; margin: 10px 0; font-family: Arial;'
                , 'color: #f86; background: #030307; padding:5px 0;'
                , 'color: #f86; background: #030307; padding:5px 0;'
            ];
        console.log.apply(console, args);
    }

    /**
     * 是否输出runtime日志
     * @param {boolean} value
     */
    public changeShowLog(value: boolean) {
        this._isShowLog = value;
    }

    /**
     * 输出 log
     * @param args
     */
    public log(...args: any[]) {
        if (!this._isShowLog) return;

        args[0] = `[VIDEO-SDK RT Log]: ${args[0]}`;
        console.log.apply(this, args);
        this.uploadLog(args);
    }

    /**
     * 输出 command
     * @param args
     */
    public command(...args: any[]) {
        if (!this._isShowLog) return;

        args[0] = `[VIDEO-SDK RT Command]: ${args[0]}`;
        console.log.apply(this, args);
        this.uploadLog(args);
    }

    /**
     * 输出 warning
     * @param args
     */
    public warning(...args: any[]) {
        if (!this._isShowLog) return;

        args[0] = `[VIDEO-SDK RT Warn]: ${args[0]}`;
        console.warn.apply(this, args);
        this.uploadLog(args);
    }

    /**
     * 输出 error
     * @param args
     */
    public error(...args: any[]) {
        if (!this._isShowLog) return;

        args[0] = `[VIDEO-SDK RT Error]: ${args[0]}`;
        console.error.apply(this, args);
        this.uploadLog(args);
    }

    /**
     * 销毁 RuntimLog
     */
    public dispose() {
        _instance = null;
    }
}

class PrivateClass {
    //内部类
}