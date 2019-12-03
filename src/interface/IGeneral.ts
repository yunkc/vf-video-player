/**
 * SensorUtils打点track方法调用数据格式接口
 */
export interface ISensorDataObj {
    message: string;
    type: string;
    class_id?: string; //appId
}

/**
 * 神策上传接口
 */
export interface ISensorUploadDataObj {
    product: string;
    business: string;
    $url: string;
    version: string;
    message: string;
    type: string;
    class_id?: string; //appId

    [propName: string]: any;
}

/**
 * object遍历接口
 */
export interface IObject {
    [key: string]: any
}