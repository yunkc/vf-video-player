import VkdBasePlayer from '../VkdBasePlayer';
import { IObject } from '../../../interface/IGeneral';
import HLS from './HLS';
import MSE from '../MSE';
/**
 * hls播放器核心
 */
class VkdHLSPlayer extends VkdBasePlayer {
    private _hls: HLS = null;
    private _videoElement: HTMLVideoElement = null;

    constructor(element: HTMLVideoElement, options: IObject) {
        super(element, options);
        if (!MSE.isSupported('video/mp4; codecs="avc1.64001E, mp4a.40.5"')) return;
        this._videoElement = element;
        this.init();
    }

    /**
     * 初始化player
     */
    init() {
        super.init();
        let player = this;
        let hls = new HLS(player, this._options.src);
    }

    /**
     * player开始
     * @param url 
     */
    start(url: string) {
        super.start(url);
    }

    switchResolution(definition: string): void {
        throw new Error("Method not implemented.");
    }
    timeupdateHandler: () => void;
    onPauseHandler: () => void;
    waitingHandler: () => void;
    seekingHandler: () => void;

}

export default VkdHLSPlayer;