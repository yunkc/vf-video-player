import $ from 'jquery'
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MediaPlayer from '../dist/VFMediaPlayer';
import monitorPlugin from './monitorPlugin';
// import VConsole from 'vconsole'

//测试视频map

const srcMap = {
    //MP4
    noAudioLocal: './video/banner_720P.mp4',
    videojsDemoLocal: './video/oceans.mp4',
    bigbunnyLocal: './testVideo/bigbunny.mp4',
    bigbunnyListLocal: {
        '240P': './testVideo/bigbunnyList/bigbunny_240P.mp4',
        '360P': './testVideo/bigbunnyList/bigbunny_360P.mp4',
        // '480P': './testVideo/bigbunnyList/bigbunny_480P.mp4',
        '720P': './testVideo/bigbunnyList/bigbunny_720P.mp4',
        '1080P': './testVideo/bigbunnyList/bigbunny_1080P.mp4',
    },
    bigfile: {
        '240P': './video/bigfile/bigfile_240P.mp4',
        '360P': './video/bigfile/bigfile_360P.mp4',
        '480P': './video/bigfile/bigfile_480P.mp4',
        // '480P': './video/bigfile/bigfile_720P.mp4',
        '720P': './video/bigfile/bigfile_720P.mp4',
        '1080P': './video/bigfile/bigfile_1080P.mp4',
    }
}
let player
let playBtn, pauseBtn, replayBtn;
let progressBar, progressBarContainer;
let definitionMenu, definitionMenuBtn;
let changeSrcBtn, changePlayRateBtn;
let videoContainer;
let fullScreenBtn;
let mutedCheck, loopCheck;
function init() {
    initDomElement();
    initPlayer(srcMap['bigfile']);

    //初始化分辨率列表
    let usefulDefinitionList = player.resolutions;
    let _keys = Object.keys(usefulDefinitionList);
    _keys.unshift('Auto');
    if (!_keys.length) {
        $(definitionMenuBtn).attr('disabled', 'disabled');
    } else {
        _keys.forEach((item) => {
            let itemElement = $(`<li><a>${item}</a></li>`)
            $(definitionMenu).append(itemElement);
            itemElement.on('click', () => {
                player.changeResolution(item);
            })
        })
    }

    //插件注册
    let netWorkSpeedChartContainer = $('#networkSpeedChartContainer')[0];
    let timeupdateChartContainer = $('#timeupdateChartContainer')[0];
    let frameSpeedChartContainer = $('#frameSpeedChartContainer')[0];
    let _monitorPlugin = new monitorPlugin(
        netWorkSpeedChartContainer,
        timeupdateChartContainer,
        frameSpeedChartContainer);
    player.registerPlugin(_monitorPlugin);

    //事件监听
    initEventListener();

    //resize
    window.addEventListener('resize', () => {
        _monitorPlugin.resize();
    })
}

function initDomElement() {
    videoContainer = $('#myVideoContainer')[0];
    playBtn = $('#playBtn')[0];
    pauseBtn = $('#pauseBtn')[0];
    replayBtn = $('#replayBtn')[0];
    progressBar = $('#progressBar')[0];
    progressBarContainer = $('#progressBarContainer')[0];
    definitionMenu = $('#definitionMenu')[0];
    definitionMenuBtn = $('#definitionMenuBtn')[0];
    changeSrcBtn = $('#changeSrcBtn')[0];
    changePlayRateBtn = $('#changePlayRateBtn')[0];
    fullScreenBtn = $('#fullScreenBtn')[0];
    mutedCheck = $('#mutedCheckInput')[0];
    loopCheck = $('#loopCheckInput')[0];
}

function initEventListener() {
    $(playBtn).on('click', (e) => {
        player.play();
    })

    $(pauseBtn).on('click', (e) => {
        player.pause();
    })

    $(replayBtn).on('click', (e) => {
        player.replay();
    })

    $(progressBarContainer).on('click', (e) => {
        let totalWidth = e.target.clientWidth;
        let clickX = e.offsetX;
        let percent = clickX / totalWidth;
        let targetTime = percent * player.duration;
        player.currentTime = targetTime;
    })

    $(changeSrcBtn).on('click', () => {
        if (!player) return;
        let src = $('#changeSrcInput')[0].value;
        player.changeSrc(src);
    })

    $(changePlayRateBtn).on('click', () => {
        if (!player) return;
        let rate = $('#changePlayRateInput')[0].value;
        rate = parseFloat(rate);
        if (isNaN(rate)) rate = 1;
        player.playbackRate = rate;
    })

    $(fullScreenBtn).on('click', () => {
        player.enterFullScreen();
    })

    $(mutedCheck).change((e) => {
        player.muted = e.target.checked;
    })

    $(loopCheck).change((e) => {
        player.loop = e.target.checked;
    })
}

function initPlayer(src) {
    player = new MediaPlayer({
        container: videoContainer,
        // id: 'myPlayer',
        src: src,
        resolution: 'Auto', //1080P
        controls: true,
        autoplay: false,
        // preload: true,
        muted: true,
        loop: false,
        playbackRate: 1,
        productId: 'j21',
        isShowLog: true,
        playerWidth: "100%",
        playerHeight: "100%"
    });

    player.playerId = 'myPlayer';

    //test
    // let count = 0;
    // let s1 = MediaPlayer.setInterval(() => {
    //     if (count++ >= 10) {
    //         MediaPlayer.removeTimer(s1)
    //     }
    //     console.log(1)
    // }, 1000)

    //状态监听
    player.on('PlayerMediaEvent', (e) => {
        switch (e.code) {
            case 'notready':
                console.log('===> the player is notready ');
                break;
            case 'loadstart':
                console.log('===> the player is loadstart');
                break;
            case 'ready':
                console.log('===> the player is ready: ', player);
                break;
            case 'canplay':
                console.log('===> the player is canplay');
                break;
            case 'canplaythrough':
                console.log('===> the player is canplaythrough');
                break;
            case 'playing':
                console.log('===> the player is playing');
                $(videoContainer).css('background', '#5cb85c');
                break;
            case 'progress':
                console.log('===> the player is progressing');
                break;
            case 'loadeddata':
                console.log('===> the player is loadeddata');
                break;
            case 'seeking':
                console.log('===> the player is seeking');
                break;
            case 'timeupdate':
                let duration = e.data.duration;
                let currentTime = e.data.currentTime;
                let precent = currentTime / duration * 100;
                $(progressBar).css('width', precent + '%');
                break;
            case 'waiting':
                console.log('===> the player is waiting');
                $(videoContainer).css('background', 'red');
                break;
            case 'ended':
                console.log('===> the player is ended');
                $(videoContainer).css('background', 'gray');
                break;
            case 'play':
                console.log('===> the player is play');
                break;
            case 'pause':
                console.log('===> the player is pause');
                $(videoContainer).css('background', '#e6e45b');
                break;
            case 'seeked':
                console.log('===> the player is seeked');
                $(videoContainer).css('background', 'blue');
                break;
            case 'ratechange':
                console.log('===> the player is ratechange');
                break;
            case 'volumechange':
                console.log('===> the player is volumechange');
                break;
            case 'durationchange':
                console.log('===> the player is durationchange');
                break;
        }
    });

    //异常监听
    player.on('playerError', (e) => {
        console.log('===> player error: ', e);
    });

    window.myPlayer = player;
}

$(document).ready(() => {
    init();
   /*  videoContainer = $('#myVideoContainer')[0];
    let _videoElement = document.createElement('video');
    _videoElement.style.backgroundColor = 'black';
    _videoElement.style.padding = '0px';
    _videoElement.style.outline = 'none';
    _videoElement.setAttribute('airplay', 'allow');
    _videoElement.setAttribute('x-webkit-airplay', 'allow');
    _videoElement.setAttribute('playsinline', 'true');
    _videoElement.setAttribute('webkit-playsinline', 'true');
    _videoElement.setAttribute('x5-playsinline', 'true');
    _videoElement.setAttribute('x5-video-player-type', 'h5');
    _videoElement.setAttribute('x5-video-player-fullscreen', 'true');
    _videoElement.setAttribute('width', "100%");
    _videoElement.setAttribute('height', "100%");
    _videoElement.setAttribute('controls', "true");
    videoContainer.appendChild(_videoElement);
    _videoElement.setAttribute('src', './video/bigfile/bigfile_240P.mp4'); */
})


