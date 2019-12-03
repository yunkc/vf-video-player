/**
 * API层请求抽象类
 */

export default abstract class AbstractAPIRequest {
    private _dataObj: any;

    constructor(dataObj: any) {
        this._dataObj = dataObj;
    };

    public getContent(): any {
        return this._dataObj;
    };

    // 获取请求类型
    public abstract getRequestType(): string;
}


