/**
 * player 状态管理单例
 */
import RuntimeLog from "../log/RuntimeLog";
import EventCenter from "../events/EventCenter";
import { IObject } from "../interface/IGeneral";

interface IStateChangeDir {
    [propName: string]: (state: string) => any;
}

let _instance: PlayerStateManager;

export default class PlayerStateManager {
    private stateNow: string = null;

    constructor(sign: any) {
        if (sign !== PrivateClass) {
            RuntimeLog.getInstance().error('class PlayerStateManager is singleton, do not use new operator!');
            return;
        }
    }

    static getInstance() {
        if (!_instance) {
            _instance = new PlayerStateManager(PrivateClass)
        }
        return _instance;
    }

    /**
     * 更新Player当前状态
     */
    public updatePlayerState(state: string) {
        if (state === this.stateNow) return;
        this.stateNow = state;
    }

    /**
     * 获取Player当前状态
     */
    public getPlayerState() {
        return this.stateNow;
    }

    public dispose() {
        _instance = null;
    }
}

class PrivateClass {
}