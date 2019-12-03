/**
 * 视频媒体信息下载器
 */
import * as EventEmitter from 'eventemitter3';
import NormalUtils from "../../../utils/NormalUtils";
import { EventLevel } from "../../../events/EventLevel";
import { ErrorTypeList } from "../../../config/ErrorTypeList";
import RuntimeLog from '../../../log/RuntimeLog';
import EventCenter from '../../../events/EventCenter';
import { IObject } from '../../../interface/IGeneral';

//下载任务队列
const TASK_LIMIT: number = 2;
class MediaInfoTask extends EventEmitter {
    static TaskSendedQueue: MediaInfoTask[] = [];
    static TaskWaitingQueue: MediaInfoTask[] = [];

    private _url: string = '';
    private _start: number = -1;
    private _end: number = -1;
    private _taskId: string = '';
    private _on: boolean = false;
    private _callback: Function = null;
    private _xhr: XMLHttpRequest = null;
    private _logger: RuntimeLog = null;
    private _range: string = "";

    constructor(url: string, start: number, end: number, callback: Function) {
        super();
        this._taskId = NormalUtils.generateUUID();
        this._url = url;
        this._start = start;
        this._end = end;
        this._callback = callback;
        this._range = `${start}-${end}`;
        this.initHttpRequest();
    }

    /**
     * 输出日志
     * @param str 
     */
    private debug_log(str: string) {
        if (!this._logger) {
            this._logger = RuntimeLog.getInstance();
        }
        // this._logger.log(str);
    }

    /**
     * 初始化xhr请求
     */
    private initHttpRequest() {
        if (this.queueCheckRangeRepeat()) return;

        this._xhr = new XMLHttpRequest();
        this._xhr.responseType = 'arraybuffer';
        this._xhr.open('get', this._url);
        this._xhr.setRequestHeader('Range', `bytes=${this._start}-${this._end ? this._end : ""}`);
        this._xhr.onload = this.onXHRLoadHandler;
        this._xhr.onerror = this.onXHRErrorHandler;
        this._xhr.onloadend = this.onXHRLoadEndHandler;
        MediaInfoTask.TaskWaitingQueue.push(this);
        this.debug_log(`waiting queue push. taskId: ${this._taskId}`);
        this.update();
    }

    /**
     * xhr load 事件处理
     */
    private onXHRLoadHandler = () => {
        if (this._xhr.status === 200 || this._xhr.status === 206) {
            if (this._callback && typeof this._callback === 'function') {
                this._callback(this._xhr.response);
            }
        }
        this.update();
        this.debug_log(`MediaInfoTask xhr load. taskId: ${this._taskId}`);
    };

    /**
     * xhr error 事件处理
     * @param e
     */
    private onXHRErrorHandler = (e: any) => {
        let errorObj: IObject = {
            code: ErrorTypeList.PLAYER_CORE_TASK_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: `MediaInfoTask xhr error event: ${e.message}`,
            data: null
        };
        this.emit('error', errorObj);
        this.debug_log(`MediaInfoTask xhr error. taskId: ${this._taskId}`);
    };

    /**
    * xhr onloadend 事件处理
    */
    private onXHRLoadEndHandler = () => {
        this.debug_log(`MediaInfoTask xhr load end. taskId: ${this._taskId}`);
        this.remove();
    }

    /**
     * 查询Task任务范围是否重复 false: 未重复 true:重复
     */
    private queueCheckRangeRepeat(): boolean {
        let _finded: boolean = false;
        MediaInfoTask.TaskWaitingQueue.every((item: MediaInfoTask) => {
            if (item._range === this._range) {
                _finded = true;
                return false;
            } else {
                return true;
            }
        })

        MediaInfoTask.TaskSendedQueue.every((item: MediaInfoTask) => {
            if (item._range === this._range) {
                _finded = true;
                return false;
            } else {
                return true;
            }
        })

        return _finded;
    }

    /**
     * 取消本次任务
     */
    public cancel() {
        this._xhr.abort();
    }

    /**
     * 移除本次任务
     */
    public remove() {
        if (this._on) {
            MediaInfoTask.TaskSendedQueue.splice(MediaInfoTask.TaskSendedQueue.indexOf(this), 1);
            this.debug_log(`sended queue remove. taskId: ${this._taskId}`);
        } else {
            MediaInfoTask.TaskWaitingQueue.splice(MediaInfoTask.TaskWaitingQueue.indexOf(this), 1);
            this.debug_log(`waiting queue remove. taskId: ${this._taskId}`);
        }
        this.update();
    }


    /**
     * 更新 MediaInfoTask queue
     */
    public update() {
        let setUpNum: number = TASK_LIMIT - MediaInfoTask.TaskSendedQueue.length;
        if (setUpNum) {
            for (let i: number = setUpNum; i > 0; i--) {
                MediaInfoTask.TaskWaitingQueue[0] && MediaInfoTask.TaskWaitingQueue[0].run();
            }
        }
    }

    /**
     * 开始任务
     */
    public run() {
        try {
            if (this._xhr.readyState === 1) {
                let currentTask = MediaInfoTask.TaskWaitingQueue.shift();
                currentTask._on = true;
                currentTask._xhr.send();
                MediaInfoTask.TaskSendedQueue.push(currentTask);
                this.debug_log(`waiting queue -> sended queue. taskId: ${currentTask._taskId}`);
            } else {
                this.remove();
            }
        } catch (err) {
            let errorObj: IObject = {
                code: ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel.ERROR,
                target: this,
                message: `${err.message}`,
                data: err
            };
            EventCenter.getInstance().dispatchOutwardEvent('PlayerError', errorObj as IObject);
        }
    }

    /**
     * 清空任务列表
     */
    public static clear() {
        MediaInfoTask.TaskSendedQueue.forEach(item => {
            item.cancel();
        });

        MediaInfoTask.TaskSendedQueue.length = MediaInfoTask.TaskWaitingQueue.length = 0;
    }
}

export default MediaInfoTask;