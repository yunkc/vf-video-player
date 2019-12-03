/**
 * 异步Request处理器
 */

import AbstractAPIReqHandler from "./AbstractAPIReqHandler";
import AbstractAPIRequest from "./AbstractAPIRequest";
import {APIRequestTypeList} from "../config/APIRequestTypeList";
import EventCenter from "../events/EventCenter";

export default class AsyncAPIReqHandler extends AbstractAPIReqHandler {
    constructor() {
        super();
    }

    handle(req: AbstractAPIRequest): any {
        let _tempObj = req.getContent();
        EventCenter.getInstance().dispatchInnerEvent(_tempObj.code, _tempObj);
    }

    getHandleType(): string {
        return APIRequestTypeList.ASYNC_REQ;
    }

}