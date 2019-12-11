import { IObject } from '../interface/IGeneral';
import RuntimeLog from '../log/RuntimeLog';
import EventBus from '../events/EventBus';
import NormalUtils from '../utils/NormalUtils';

/**
 * 插件管理类单例
 */
let _instance: PlayerPluginManager;
class PlayerPluginManager {
    //插件list
    private _plugins: IObject[];

    get pluginList(): IObject[] {
        return this._plugins;
    }

    constructor(sign: unknown, pluginArr: IObject[]) {
        if (sign !== PrivateClass) throw new Error('class PlayerPluginManager is singleton, do not use new operator!');

        if (!this._plugins && !pluginArr) {
            throw new Error('plugin array is undefined! It\'s a must-pass param when initialization.');
        }

        this._plugins = pluginArr;

        this.initEvents();
    }

    /**
     * 初始化事件钩子
     */
    private initEvents() {
        //media events
        EventBus.getInstance().on('PlayerMediaEvent', (e: IObject) => {
            // this.dispatchOutwardEvent('PlayerMediaEvent', e);
            this._plugins.forEach((item: IObject) => {
                let funcName = `on${e.code}`
                if (NormalUtils.typeOf(item[funcName]) === 'Function') {
                    item[funcName](e);
                }
            });
        })

        //error events
        EventBus.getInstance().on('PlayerError', (e: IObject) => {
            this._plugins.forEach((item: IObject) => {
                if (NormalUtils.typeOf(item['onError']) === 'Function') {
                    item['onError'].call(item, e);
                }
            });
        })

        //network events
        EventBus.getInstance().on('PlayerDownloadSpeed', (e: IObject) => {
            this._plugins.forEach((item: IObject) => {
                if (NormalUtils.typeOf(item['onNetSpeed']) === 'Function') {
                    item['onNetSpeed'].call(item, e);
                }
            });
        })

        //media info
        EventBus.getInstance().on('PlayerMediaInfoParsed', (e: IObject) => {
            this._plugins.forEach((item: IObject) => {
                if (NormalUtils.typeOf(item['onMediaInfoParsed']) === 'Function') {
                    item['onMediaInfoParsed'].call(item, e);
                }
            });
        })
    }

    static getInstance(pluginArr?: IObject[]) {
        if (!_instance) {
            _instance = new PlayerPluginManager(PrivateClass, pluginArr);
        }
        return _instance;
    }

    /**
     * 注册插件
     * @params pluginInstance | [pluginInstance1, pluginInstance2, ...]
     */
    registerPlugin(pluginInstance: IObject | IObject[]) {
        if (!this._plugins) {
            RuntimeLog.getInstance().warning(`cannot register plugins when pluginManager init failed.`);
            return;
        };

        if (pluginInstance instanceof Array) {
            pluginInstance.forEach((item: IObject) => {
                this._plugins.push(pluginInstance);
            })
        } else {
            this._plugins.push(pluginInstance);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        if (this._plugins) {
            this._plugins.length = 0;
        }
        _instance = undefined;
    }
}

export default PlayerPluginManager

/**
 * 内部类
 */
class PrivateClass { }