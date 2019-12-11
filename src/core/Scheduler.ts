/**
 * Schedule anything
 *
 * @author 8088
 */
import * as EventEmitter from 'eventemitter3';
import Ticker from "./Ticker";
import { IObject } from '../interface/IGeneral';
import { EventLevel } from '../events/EventLevel';
import { SchedulerEvents } from '../events/EventNames';

export default class Scheduler extends EventEmitter {

    protected start: number;

    protected lastTick: number = -1;

    protected endHandler: Function;

    protected elapsedTimeAtPause: number = 0;

    protected lastVisited: Number = -1;

    protected tickHandler: Function;

    public interval: number = 0;

    public timeout: number = Infinity;

    public static clock: Function = Date.now;

    public static ticker: Ticker = Ticker.getInstance();

    private _running: boolean;

    private _lastExecuted: number = 0;

    private _id: number = Math.random();

    private TIMEOUT: number = 1000;

    constructor(_timeout: number = Infinity, _interval: number = 0) {
        super();
        this.endHandler = this.noop;
        this.tickHandler = this.noop;
        this.timeout = _timeout;
        this.interval = _interval;
        this.restart();
    }

    protected noop(evt: IObject = null): void {
        return;
    }

    public restart(): void {
        this.elapsedTimeAtPause = 0;
        this.start = Scheduler.clock();
        this._lastExecuted = this.start;
        this._running = true;
        Scheduler.ticker.addCallback(this.run, this);
    }

    public stop(): void {
        this.elapsedTimeAtPause = 0;
        this._running = false;
        Scheduler.ticker.removeCallback(this.run, this);
    }

    public pause(): void {
        if (this._running) {
            this.stop();
            this.elapsedTimeAtPause = Scheduler.clock() - this.start;
        }
    }

    public resume(): void {
        let _t: number;
        if (!this._running) {
            _t = this.elapsedTimeAtPause;
            this.restart();
            this.start = this.start - _t;
        }
    }

    public seek(time: number): void {
        this.elapsedTimeAtPause = time;
    }

    public isTickable(num: number): boolean {
        return num - this.lastTick >= this.interval;
    }

    public get id(): number {
        return this._id;
    }

    public static setInterval(time: number, listener: EventEmitter.ListenerFn): Scheduler {
        let scheduler: Scheduler = new Scheduler(Infinity, time);
        scheduler.addListener(SchedulerEvents.TICK, listener);
        return scheduler;
    }

    public static setTimeout(time: number, listener: EventEmitter.ListenerFn): Scheduler {
        let scheduler: Scheduler = new Scheduler(time, Infinity);
        scheduler.addListener(SchedulerEvents.END, listener, scheduler);
        return scheduler;
    }


    // Internals
    //

    private run(): boolean {
        let elapsed: number;
        let t: number = Scheduler.clock();
        let timeElapsed: number = t - this._lastExecuted;
        this._lastExecuted = t;

        if (timeElapsed >= this.TIMEOUT) {
            return; //init Scheduler
        }

        if (this.lastVisited <= t) {
            this.lastVisited = t;
            elapsed = t - this.start;
            if (this.isTickable(t)) {
                this.lastTick = t;
                let info = {
                    code: SchedulerEvents.TICK,
                    level: EventLevel.STATUS,
                    target: this,
                    elapsed: elapsed
                }
                this.emit(SchedulerEvents.TICK, info);
            }
            if (elapsed >= this.timeout) {
                this.stop();
                let info = {
                    code: SchedulerEvents.END,
                    level: EventLevel.STATUS,
                    target: this,
                    elapsed: elapsed
                }
                this.emit(SchedulerEvents.END, info);
            }
            //..
        }

        return false;
    }
}