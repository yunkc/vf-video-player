/**
 * 神策工具类
 */

import {
    SensorDataObj,
    SensorEventType,
    SensorServerUrl
} from "../config/MediaPlayerConfig";
import { IObject, ISensorDataObj } from '../interface/IGeneral';

let _instance: SensorUtils;
export default class SensorUtils {
    private _saInstance: IObject = null;
    private _isProd: boolean = null;
    private _productId: string = null;

    constructor(saInstance: IObject, productId: string, isProd: boolean, sign: any) {
        if (sign !== PrivateClass) {
            console.error('class SensorUtils is singleton, do not use new operator!');
            return;
        }

        if (!this._saInstance && !saInstance) {
            this._saInstance = require(`sa-sdk-javascript`);
            this.initSensor();
        } else {
            this._saInstance = saInstance;
        }

        this._isProd = isProd;
        this._productId = productId;
    }

    static getInstance(saInstance?: IObject, productId?: string, isProd?: boolean) {
        if (!_instance) {
            _instance = new SensorUtils(saInstance, productId, isProd, PrivateClass);
        }
        return _instance;
    }

    /**
     * 初始化神策打点
     */
    private initSensor() {
        this._saInstance.init({
            server_url: this._isProd ? SensorServerUrl.sa_online_server_url : SensorServerUrl.sa_test_server_url,
            show_log: !this._isProd,
        })
    }

    /**
     * 普通打点
     * @param {ISensorDataObj} data
     */
    public track(data: ISensorDataObj) {
        data.class_id = this._productId;
        let _tempTrackObj: ISensorDataObj = {
            ...SensorDataObj,
            ...data,
            ...{ class_id: this._productId },
        };
        this._saInstance.track(this._isProd ? SensorEventType.test : SensorEventType.prod, _tempTrackObj);
    }

    /**
     * 销毁SensorUtils
     */
    public dispose() {
        this._isProd = null;
        this._productId = null;
        _instance = null;
    }
}

class PrivateClass {
    //内部类
}