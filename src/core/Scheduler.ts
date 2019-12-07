/**
 * 全局时间调度器
 */
import RuntimeLog from "../log/RuntimeLog";
import { ISchedulerTask } from '../interface/IScheduler';
let _instance: Scheduler;
class Scheduler {
    private _taskArr: ISchedulerTask[] = [];
    private _reqId: number = -1;

    constructor(sign: any) {
        if (sign !== PrivateClass) {
            RuntimeLog.getInstance().error('class Scheduler is singleton, do not use new operator!');
            return
        }

        this.update();
    }

    static getInstance() {
        if (!_instance) {
            _instance = new Scheduler(PrivateClass);
        }
        return _instance;
    }

    /**
     * 更新
     */
    private update = () => {
        this._reqId = window.requestAnimationFrame(this.update);
        this._taskArr.every((item: ISchedulerTask) => {
            item.endTime = Date.now();
            if (item.endTime - item.startTime >= item.delta) {
                item.func();
                item.startTime = item.endTime;
            }
        })
    }

    /**
     * 向调度器中注册定时任务
     * @param instance 
     */
    registerTask(taskObj: ISchedulerTask) {
        taskObj.startTime = Date.now();
        taskObj.endTime = Date.now();
        this._taskArr.push(taskObj);
    }

    /**
     * 通过id从调度器中删除定时任务
     */
    removeTaskById(id: string) {
        this._taskArr.every((item: ISchedulerTask, idx: number) => {
            if (item.id === id) {
                this._taskArr.splice(idx, 1);
                return false;
            } else {
                return true;
            }
        })
    }

    /**
     * 销毁
     */
    dispose() {
        if (this._reqId)
            window.cancelAnimationFrame(this._reqId);
        this._taskArr.length = 0;
        _instance = null;
    }

}

export default Scheduler;


class PrivateClass {
    //内部类
}