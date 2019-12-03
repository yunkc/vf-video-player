/**
 * 错误类型列表
 */

import { IObject } from '../interface/IGeneral';

/**
 * 1xxxx 模块运行异常
 * 2xxxx 参数异常
 * 3xxxx 保留异常
 * 4xxxx 保留异常
 * 5xxxx 保留异常
 * .
 * .
 *
 * 00000 为未知异常
 */
export const ErrorTypeList: IObject = {
    PLAYER_CORE_INIT_ERROR: '10001',//核心初始化异常
    PLAYER_CORE_RUN_ERROR: '10002', //核心运行异常
    PLAYER_CORE_MP4_ERROR: '10003', //MP4异常
    PLAYER_CORE_HLS_ERROR: '10004', //HLS异常
    PLAYER_CORE_M3U8_ERROR: '10005', //M3U8异常
    PLAYER_CORE_MSE_ERROR: '10006', //MSE异常
    PLAYER_CORE_TASK_ERROR: '10007', //Task异常
    PLAYER_CORE_STREAM_PARSE_ERROR: '10008', //stream解析异常
    PRODUCT_ID_ERROR: '20001',
    VIDEO_URL_ERROR: '20002',
    TASK_PARAMS_ERROR: '20003',
    UNKNOWN_ERROR: '00000',
};