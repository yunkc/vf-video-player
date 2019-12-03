import { WorkerEvents } from '../../events/EventNames';
import { IObject } from '../../interface/IGeneral';
import EventBus from '../../events/EventBus';
/**
 * 内联方式引入worker
 */

class InlineWorker implements Worker {
    [key: string]: any;

    private worker: Worker;

    constructor(func: Function) {
        if (func) {
            const funcStr = func.toString().trim().match(
                /^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/
            );
            if (funcStr && funcStr.length >= 2) {
                this.worker = new Worker(URL.createObjectURL(
                    new Blob([funcStr[1]], { type: "text/javascript" })
                ));

                this.worker.onmessage = function (res: IObject) {
                    let _data: IObject = res.data;
                    let _eventName = '';
                    switch (_data.method) {
                        case 'initSegment':
                            _eventName = WorkerEvents.WORKER_INIT_SEGMENT_FINISHED;
                            break;
                        case 'mediaSegment':
                            _eventName = WorkerEvents.WORKER_MEDIA_SEGMENT_FINISHED;
                    }
                    EventBus.getInstance().emit(_eventName, _data);
                };
                return;
            }

        }
        throw new Error("must has a function agument")
    }

    get onerror() {
        return this.worker.onerror;
    };

    set onerror(errorhandler: AbstractWorker["onerror"]) {
        this.worker.onerror = errorhandler;
    }

    get onmessage() {
        return this.worker.onmessage;
    };

    set onmessage(messagehandler: Worker["onmessage"]) {
        this.worker.onmessage = messagehandler;
    }

    /**
     * 发送消息
     * @param message 
     * @param options 
     */
    postMessage(message: any, options?: any): void {
        this.worker.postMessage(message, options);
    }

    /**
     * 销毁worker
     */
    terminate(): void {
        this.worker.terminate();
    }

    /**
    * 添加监听器
    */
    addEventListener<K extends "message" | "error">(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => void, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: any, listener: any, options?: any) {
        this.worker.addEventListener(type, listener, options);
    }

    /**
     * 移除监听器
     */
    removeEventListener<K extends "message" | "error">(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => void, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: any, listener: any, options?: any) {
        this.worker.removeEventListener(type, listener, options);
    }

    /**
     * 自定义消息
     */
    dispatchEvent(evt: Event): boolean {
        return this.worker.dispatchEvent(evt);
    }
}

export default InlineWorker;
