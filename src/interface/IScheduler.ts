/**
 * 调度器任务接口
 */
export interface ISchedulerTask {
    startTime?: number,
    endTime?: number,
    id: string,
    func: Function,
    delta: number
}