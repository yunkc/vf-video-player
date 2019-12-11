/**
 * API接口
 */
export default interface IPlayerCore {
    volume: number;
    duration: number;
    currentTime: number;
    muted: boolean;
    currentWidth: number;
    currentHeight: number;
    poster: string;
    buffered: any;
    src: any;
    playbackRate: any;
    loop: any;
    preload: any;
    autoplay: any;

    reset(): void;

    play(): void;

    pause(): void;

    replay(): void;

    dispose(): void;

    enterFullScreen(): void;

    exitFullScreen(): void;

    setCurrentTimeByPercent(percent: number): void;

}