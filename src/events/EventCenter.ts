import EventBus from "./EventBus";
import { IObject } from '../interface/IGeneral';

/**
 * EventCenter 事件发送中心单例
 */

let _instance: EventCenter;

export default class EventCenter {

    constructor(sign: any) {
        if (sign !== PrivateSingle) throw new Error('class EventCenter is singleton, do not use new operator!')
    }

    static getInstance() {
        if (!_instance) {
            _instance = new EventCenter(PrivateSingle);
        }
        return _instance;
    }

    /**
     * 发送外部事件
     * @param eventType
     * @param eventConfigObject
     * @param originEventObj
     */
    public dispatchOutwardEvent
        (
            eventType: 'PlayerError' |
                'PlayerMediaEvent' |
                'PlayerDownloadSpeed' |
                'PlayerMediaInfoParsed',
            customEvent: IObject,
            originEventObj: any = {}
        ) {
        let _tempOutwardEventObject: IObject = {
            ...customEvent,
            ...{ type: eventType }
        };

        EventBus.getInstance().emit(eventType, {
            ..._tempOutwardEventObject, ...{ originEventObj: originEventObj }
        });
    }

    /**
     * 发送内部事件
     * @param {string} name
     * @param {IObject} dataObj
     */
    public dispatchInnerEvent(name: string, dataObj: IObject) {
        EventBus.getInstance().emit(name, dataObj);
    }

    /**
     * 销毁EventBus
     */
    public dispose() {
        _instance = null;
    }
}

class PrivateSingle {
    //内部类
}