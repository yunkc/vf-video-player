import { IObject } from '../interface/IGeneral';

/**
 * 状态类型列表
 */
export const StateTypeList: IObject = {
    NOT_READY: 'notready',
    LOAD_START: 'loadstart',
    READY: 'ready',
    CAN_PLAY: 'canplay',
    CAN_PLAY_THROUGH: 'canplaythrough',
    PLAYING: 'playing',
    PROGRESS: 'progress',
    LOADED_METADATA: 'loadedmetadata',
    LOADED_DATA: 'loadeddata',
    SEEKING: 'seeking',
    TIME_UPDATE: 'timeupdate',
    WATTING: 'waiting',
    ENDED: 'ended',
    PLAY: 'play',
    PAUSE: 'pause',
    SEEKED: 'seeked',
    REAT_CHANGE: 'ratechange',
    VOLUME_CHANGE: 'volumechange',
    DURATION_CHANGE: 'durationchange'
};