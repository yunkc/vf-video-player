/**
 * 同步Request请求处理器
 */

import AbstractAPIReqHandler from "./AbstractAPIReqHandler";
import {APIRequestTypeList} from "../config/APIRequestTypeList";
import AbstractAPIRequest from "./AbstractAPIRequest";
import GlobalAPI from "./GlobalAPI";
import RuntimeLog from "../log/RuntimeLog";

export default class SyncAPIReqHandler extends AbstractAPIReqHandler {
    constructor() {
        super();
    }

    handle(req: AbstractAPIRequest): any {
        let _tempObj = req.getContent();
        let _core = GlobalAPI.getInstance()._core;

        RuntimeLog.getInstance().log(_tempObj.message + _core[_tempObj.code]);
        return _core[_tempObj.code];
    }

    getHandleType(): string {
        return APIRequestTypeList.SYNC_REQ;
    }
}