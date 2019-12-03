/**
 * EventBus 单例
 */

import * as EventEmitter from "eventemitter3";

let _instance: EventBus;

export default class EventBus extends EventEmitter {

    constructor(sign: any) {
        if (sign !== PrivateSingle) throw new Error('class EventBus is singleton, do not use new operator!')
        super();
    }

    static getInstance() {
        if (!_instance) {
            _instance = new EventBus(PrivateSingle)
        }

        return _instance;
    }

    /**
     * 销毁EventBus
     */
    public dispose() {
        this.removeAllListeners();
        _instance = null;
    }
}

class PrivateSingle {
    //内部类
}