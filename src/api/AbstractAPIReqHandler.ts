/**
 * API request请求handler抽象类
 */
import AbstractAPIRequest from "./AbstractAPIRequest";
import RuntimeLog from "../log/RuntimeLog";

export default abstract class AbstractAPIReqHandler {
    public nextHandler: AbstractAPIReqHandler = null;

    constructor() {
    };

    public handleRequest(req: AbstractAPIRequest) {
        if (this.getHandleType() === req.getRequestType()) {
            return this.handle(req) || null;
        } else {
            if (this.nextHandler !== null) {
                this.nextHandler.handleRequest(req);
            } else {
                RuntimeLog.getInstance().error('this API req does not have any handler: ', req);
            }
        }
    }

    /**
     * req处理方法
     * @returns {any}
     */
    public abstract handle(req: AbstractAPIRequest): any;

    /**
     * handler处理req类型
     * @returns {any}
     */
    public abstract getHandleType(): string;
}