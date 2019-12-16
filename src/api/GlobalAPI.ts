/**
 * API模块
 */
import { EventLevel } from "../events/EventLevel";
import RuntimeLog from "../log/RuntimeLog";
import CorePlayerManager from "../core/CorePlayerManager";
import { IObject } from "../interface/IGeneral";
import SyncAPIReqHandler from "./SyncAPIReqHandler";
import AsyncAPIReqHandler from "./AsyncAPIReqHandler";
import AbstractAPIReqHandler from "./AbstractAPIReqHandler";
import AsyncAPIRequest from "./AsyncAPIRequest";
import SyncAPIRequest from "./SyncAPIRequest";

let _instance: GlobalAPI;

export default class GlobalAPI {
    public _core: CorePlayerManager;
    private _apiReqHandlerChain: AbstractAPIReqHandler;

    constructor(dataObj: IObject, sign: any) {
        if (sign !== PrivateClass) {
            RuntimeLog.getInstance().error('class CorePlayerManager is singleton, do not use new operator!');
            return
        }

        this._core = new CorePlayerManager(dataObj);
        this._apiReqHandlerChain = GlobalAPI.initAPIReqHandlerChains();
    }

    static getInstance(dataObj?: IObject) {
        if (!_instance) {
            if (!dataObj) {
                RuntimeLog.getInstance().error('GlobalAPI must have params when getInstance in first time!');
                return
            }

            _instance = new GlobalAPI(dataObj, PrivateClass)
        }
        return _instance;
    }

    /**
     * 创建操作处理责任链
     */
    private static initAPIReqHandlerChains() {
        let _syncHandler = new SyncAPIReqHandler();
        _syncHandler.nextHandler = new AsyncAPIReqHandler();
        return _syncHandler;
    }

    /**
     * 发送异步请求
     * @param {string} name
     * @param {[]} argsArr
     */
    private handleAsyncRequest(name: string, argsArr: any[]): void {
        let _tempEventObj: IObject = {
            code: name,
            level: EventLevel.COMMAND,
            target: this,
            message: `player async request ${name} => ${argsArr}`,
            data: argsArr,
        };
        let _asyncReq = new AsyncAPIRequest(_tempEventObj);
        this._apiReqHandlerChain.handleRequest(_asyncReq);
    }

    /**
     * 发送同步请求
     * @param {string} name
     * @param {[]} argsArr
     */
    private handleSyncRequest(name: string, argsArr: any[] = null): void {
        let _tempEventObj: IObject = {
            code: name,
            level: EventLevel.COMMAND,
            target: this,
            message: `player sync request ${name} => `,
            data: argsArr,
        };
        let _syncReq = new SyncAPIRequest(_tempEventObj);
        return this._apiReqHandlerChain.handleRequest(_syncReq);
    }

    /**
     * 通过名字获取core属性
     * @param {string} propName
     */
    public getCorePropertyByName(propName: string): any {
        if (!propName) {
            RuntimeLog.getInstance().error('propName is must-pass parameters when get it (globalAPI)');
            return;
        }
        return this.handleSyncRequest(propName);
    }

    /**
     * 通过名字设置core属性
     * @param {string} propName
     * @param params
     * @returns
     */
    public setCorePropertyByName(propName: string, params: any): any {
        if (!propName) {
            RuntimeLog.getInstance().error('propName is must-pass parameters when set it (globalAPI)');
            return;
        }
        this.handleAsyncRequest('set-' + propName, params);
    }

    /**
     * 通过名字调用函数
     * @param {string} funcName
     * @param args
     */
    public callFuncByName(funcName: string, ...args: any[]): any {
        if (!funcName) {
            RuntimeLog.getInstance().error('funcName is must-pass parameters when call it (globalAPI)');
            return;
        }
        this.handleAsyncRequest(funcName, args);
    }

    /**
     * 销毁GlobalAPI
     */
    public dispose() {
        this._core.dispose();
        this._apiReqHandlerChain = null;
        _instance = null;
    }
}

class PrivateClass {
    //内部类
}