/**
 * API接口
 */
export default interface IPlayerCore {
    width: number;
    height: number;
    volume: number;
    duration: number;
    currentTime: number;
    videoPlaybackQuality: any;
    muted: boolean;
    currentWidth: number;
    currentHeight: number;
    aspectRatio: string;
    poster: string;
    buffered: any;
    bufferedEnd: number;
    bufferedPercent: number;
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

    changeDefinition(definition: string): void;

}