/**
 * 同步API request请求
 */
import AbstractAPIRequest from "./AbstractAPIRequest";
import {APIRequestTypeList} from "../config/APIRequestTypeList";

export default class SyncAPIRequest extends AbstractAPIRequest {
    constructor(data: any) {
        super(data);
    }

    getRequestType(): string {
        return APIRequestTypeList.SYNC_REQ;
    }

}