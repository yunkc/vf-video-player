/**
 * Player配置列表
 */

import { ErrorTypeList } from "./ErrorTypeList";
import { ISensorUploadDataObj, IObject } from '../interface/IGeneral';

/**
 * Player SDK 信息
 * @type {{version: string; author: string}}
 */
export const MediaPlayerSdkInfo: any = {
    version: '1.0.0',
    author: 'Jia zi ling'
};

/**
 * 神策服务器url列表
 * @type {{sa_test_server_url: string; sa_online_server_url: string}}
 */
export const SensorServerUrl = {
    sa_test_server_url: "",
    sa_online_server_url: ""
};

/**
 * 神策上报数据内容
 * @type 
 * {
 *  $url: string; 
 *  business: string;
 *  product: string;
 *  version: string; 
 *  message: string; 
 *  type: ErrorTypeList.UNKNOWN_ERROR; 
 *  class_id: string
 * }
 */
export const SensorDataObj: ISensorUploadDataObj = {
    $url: document.location.href || "unknown",
    business: "H5-VIDEO-SDK",
    product: "VK-VIDEO-SDK",
    version: MediaPlayerSdkInfo.version,
    message: 'unknown error',
    type: ErrorTypeList.UNKNOWN_ERROR,
    class_id: 'unknown ID',
};

/**
 * 神策打点事件类型选择
 */
export const SensorEventType = {
    test: "",
    prod: ""
};

/**
 * 播放器默认配置
 */
export let playerConfig: IObject = {
    definition: 'Auto',
    autoplay: false,
    muted: false,
    loop: false,
    preload: false, //该属性暂时无效
    poster: '',
    controls: false,
    volume: 1,
    src: '',
    playbackRate: 1,
    preLoadTime: 3 * 60, //预加载的时间
    triggerNextLoadRangeTime: 2 * 60, //触发下次预加载的时间
    autoCleanupMaxDuration: 3 * 60, //自动sourcebuffer最大长度
    autoCleanupMinDuration: 2 * 60, //自动sourcebuffer实际长度
    playerAppendMinBufferLengthMap: {
        '240P': 1048576 * 0.25,
        '360P': 1048576 * 0.5,
        '480P': 1048576 * 0.75,
        '720P': 1048576,
        '1080P': 1048576 * 1.5,
        '4K': 1048576 * 3,
    }, // MSE最小添加buffer长度Map
    playerPreSwitchTime: 3, // 切流预置时间(s)
    playerWaitingHandlerTime: 3000, // waiting事件处理时间(ms)
    playerEndGapTime: 0.5, //判断是否播放到结尾的误差时间(s)
    networkSpeedChangeReflectTime: 5000, //(ms)
}

export class playerConfigManager {
    static setPlayerConfig(opts: IObject) {
        playerConfig = { ...playerConfig, ...opts };
    }
}