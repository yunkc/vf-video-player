/**
 * 异步API request请求
 */
import AbstractAPIRequest from "./AbstractAPIRequest";
import {APIRequestTypeList} from "../config/APIRequestTypeList";

export default class AsyncAPIRequest extends AbstractAPIRequest {
    constructor(data: any) {
        super(data);
    }

    getRequestType(): any {
        return APIRequestTypeList.ASYNC_REQ;
    }

}