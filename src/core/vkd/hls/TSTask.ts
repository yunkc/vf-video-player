/**
 * TS下载管理者
 */
import { IObject } from '../../../interface/IGeneral';
import * as EventEmitter from 'eventemitter3';
import { ErrorTypeList } from '../../../config/ErrorTypeList';
import { EventLevel } from '../../../events/EventLevel';
import HTTPLoader from '../HTTPLoader';

class TSTask extends EventEmitter {
    private _segemnts: IObject[] = [];
    private _taskMap: IObject[] = [];
    private _loader: HTTPLoader = null;
    private _loaderIdx: number = 0;

    constructor(segments: IObject[]) {
        super();
        this._segemnts = segments;
        this.initTaskMap();
        this.initTaskLoader();
    }

    /**
     * 初始化下载任务map
     */
    private initTaskMap() {
        this._taskMap = this._segemnts; // 这里暂时不需要处理, 如果需要处理则不能直接赋值
    }

    /**
     * 创建loader任务
     */
    private initTaskLoader() {
        if (!this._taskMap.length) {
            this.dispatchError(`ts task map length is 0`);
            return;
        }
        this.createNextKeepLoader();
    }

    /**
     * 创建下一个下载任务
     */
    private createNextKeepLoader() {
        if (this._loader) return;

        if (this._loaderIdx >= this._segemnts.length) {
            return;
        }

        let _currentTask = this._taskMap[this._loaderIdx];
        //如果当前分片已经下载完毕, 则直接进入下一任务
        if (_currentTask.downloaded) {
            this.emit('load', {
                task: _currentTask
            });
            this._loaderIdx += 1;
            this.createNextKeepLoader();
            return;
        }

        this._loader = new HTTPLoader({
            url: _currentTask.url,
            type: 'arraybuffer'
        });

        this._loader.start().then((res: XMLHttpRequest) => {
            this._loader = null;
            let _res = res.response;
            _currentTask.cacheBuffer = _res;
            _currentTask.downloaded = true;
            this._loaderIdx += 1;
            this.emit('load', {
                task: _currentTask
            });
            this.createNextKeepLoader();
        }).catch((e: Error) => {
            this.dispatchError(`TSTask xhr error: ${e.message || 'load fail'}`);
        })
    }

    /**
     * 错误处理
     */
    private dispatchError = (message: string = '') => {
        let errorObj: IObject = {
            code: ErrorTypeList.PLAYER_CORE_TASK_ERROR,
            level: EventLevel.ERROR,
            target: this,
            message: message,
            data: null
        };
        this.emit('error', errorObj);
    }
}

export default TSTask;