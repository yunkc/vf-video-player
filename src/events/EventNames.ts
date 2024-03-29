import { IObject } from '../interface/IGeneral';
export const CommandEvents: IObject = {
    //枚举value值必须和函数名对应
    DIMENSION: 'dimension',
    CHANGE_SRC: 'changeSrc',
    DISPOSE: 'dispose',
    ENTER_FULL_SCREEN: 'enterFullScreen',
    EXIT_FULL_SCREEN: 'exitFullScreen',
    PAUSE: 'pause',
    PLAY: 'play',
    REPLAY: 'replay',
    RESET: 'reset',
    SET_CURRENT_TIME_BY_PERCENT: 'setCurrentTimeByPercent',
    CHANGE_RESOLUTION: 'changeResolution',
};

export const PropEvents: IObject = {
    ASPECTRATIO: 'aspectRatio',
    BUFFERED: 'buffered',
    BUFFERED_END: 'bufferedEnd',
    BUFFERED_PERCENT: 'bufferedPercent',
    CURRENT_WIDTH: 'currentWidth',
    CURRENT_HEIGHT: 'currentHeight',
    CURRENT_TIME: 'currentTime',
    DURATION: 'duration',
    HEIGHT: 'height',
    MUTED: 'muted',
    POSTER: 'poster',
    VIDEO_PLAYBACK_QUALITY: 'videoPlaybackQuality',
    VOLUME: 'volume',
    WIDTH: 'width',
    SRC: 'src',
    PLAYBACK_RATE: 'playbackRate',
    LOOP: 'loop',
    PRELOAD: 'preload',
    AUTOPLAY: 'autoplay',
    SUPPORT_FULL_SCREEN: 'supportFullScreen',
    FULL_SCREEN_STATE: 'fullScreenState',
    RESOLUTIONS: 'resolutions',
    CONTROLS: 'controls',
    PLAYER_ID: 'playerId'
};

export const WorkerEvents: IObject = {
    WORKER_INIT_SEGMENT_FINISHED: 'workerInitSegmentFinished',
    WORKER_MEDIA_SEGMENT_FINISHED: 'workerMediaSegmentFinished',
}

export const SchedulerEvents: IObject = {
    /**
    * 启动/开始
    */
    START: 'start',

    /**
     * 心跳
     */
    TICK: 'tick',

    /**
     * 更新
     */
    UPDATE: 'update',

    /**
     * 已改变
     */
    CHANGED: 'changed',

    /**
     * 结束
     */
    END: 'end',

    // ...
}