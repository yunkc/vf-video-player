/**
 * VF心脏
 *
 * @author 8088
 */
export default class Ticker {

    private static instance: Ticker;

    private _startTime: number = 0;

    private _lastTime: number = 0;

    private _lastCount: number = 1000;

    private _frameRate: number = 60;

    private _frameTime: number = 15;

    private _frameInterval: number = 1000;

    private _paused: boolean = false;

    private _requestId: number = 0;

    private MIN_FPS: number = 4;

    private MAX_FPS: number = 60;

    /**
     * @private
     */
    private _callbackList: Function[] = [];

    private _contextList: unknown[] = [];

    private _id: number = Math.random();
    constructor(lock: ConstructorLock = null) {
        if (lock !== ConstructorLock) {
            throw new SyntaxError("禁止实例化 Ticker !");
        }
        this._startTime = Date.now();
        this.start();

    }

    public static getInstance(): Ticker {
        if (!Ticker.instance) {
            Ticker.instance = new Ticker(ConstructorLock)
        }
        return Ticker.instance;
    }

    /**
     * @private
     * @param {(timestamp: number) => boolean} callback
     * @param context
     */
    public addCallback(callback: (timestamp: number) => boolean, context: unknown): void {
        let index = this.getIndex(callback, context);
        if (index != -1) {
            return;
        }
        this.concat();
        this._callbackList.push(callback);
        this._contextList.push(context);
    }

    /**
     * @private
     * @param {(timestamp: number) => boolean} callback
     * @param context
     */
    public removeCallback(callback: (timestamp: number) => boolean, context: unknown): void {
        let index = this.getIndex(callback, context);
        if (index == -1) {
            return;
        }
        this.concat();
        this._callbackList.splice(index, 1);
        this._contextList.splice(index, 1);
    }

    /**
     * @private
     */
    public start(): void {
        let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"]

        if (!requestAnimationFrame) {
            requestAnimationFrame = (callback: Function) => {
                return window.setTimeout(callback, this._frameTime);
            };
        }

        let ticker = this;
        ticker._paused = false;
        ticker._requestId = requestAnimationFrame(onTick);
        function onTick(): void {
            ticker.update();
            ticker._requestId = requestAnimationFrame(onTick);
        }
    }

    /**
     * @private
     */
    public pause(): void {
        this._paused = true;
    }

    /**
     * @private
     */
    public resume(): void {
        this._paused = false;
    }

    /**
     * @private
     */
    public stop(): void {
        let cancelAnimationFrame =
            window["cancelAnimationFrame"] ||
            window["webkitCancelAnimationFrame"]

        if (!cancelAnimationFrame) {
            cancelAnimationFrame = (id: number) => {
                return window.clearTimeout(id);
            };
        }

        let ticker = this;
        ticker._paused = true;
        cancelAnimationFrame(ticker._requestId);
    }

    /**
     * @private
     */
    public update(): void {
        let callbackList: Function[] = this._callbackList;
        let contextList: unknown[] = this._contextList;
        let escapedTime = Date.now() - this._startTime;

        if (this._paused) {
            this._lastTime = escapedTime;
            return;
        }

        let deltaTime = escapedTime - this._lastTime;

        if (deltaTime >= this._frameTime) {
            this._lastTime = escapedTime;
            let ln = callbackList.length;
            for (let i = 0; i < ln; i++) {
                let callback = callbackList[i];
                let context = contextList[i];
                if (callback) {
                    callback.call(context, escapedTime);
                }
            }
        }
    }

    public get frameRate(): number {
        return this._frameRate;
    }

    public set frameRate(value: number) {
        if (this._frameRate == value) return;
        this._frameRate = Math.max(this.MIN_FPS, Math.min(Math.round(value), this.MAX_FPS));
        this._frameTime = 1000 / this._frameRate;
        this._lastCount = this._frameInterval = Math.round(60000 / this._frameRate);
    }


    // Internals
    //

    private getIndex(callBack: Function, context: unknown): number {
        let callBackList = this._callbackList;
        let contextList = this._contextList;
        for (let i = callBackList.length - 1; i >= 0; i--) {
            if (callBackList[i] == callBack && contextList[i] == context) {
                return i;
            }
        }
        return -1;
    }

    private concat(): void {
        this._callbackList = this._callbackList.concat();
        this._contextList = this._contextList.concat();
    }

}
class ConstructorLock { };