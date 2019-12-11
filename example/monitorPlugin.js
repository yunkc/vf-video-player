/**
 * player监控面板插件
 */

import echarts from 'echarts';
import { networkSpeedOption, timeupdateOption, frameSpeedOption, chartLg } from './config.js'

let networkChartOptions = networkSpeedOption;
let mediaInfoTable = null;
let infoTmplt = {
    width: "视频宽度",
    height: "视频高度",

    audioCodec: "音频格式",
    audioDuration: "音频轨道时长",
    channelCount: "音频通道数量",
    sampleRate: "音频采样率",

    videoCodec: "视频格式",
    videoDuration: "视频轨道时长",
    pixelRatio: "视频像素比",
    frameRate: "平均播放帧率",

    createTime: "文件创建时间",
    modifyTime: "文件修改时间",
    duration: "文件总时长"
}
let dateNow, dateOld, timeupdateCount = 0;
let lastTime, newTime, frameCount = 0;
let reqID;
export default class monitorPlugin {
    constructor(netWorkSpeedContainer, timeUpdateContainer, frameSpeedChartContainer) {
        this._netWorkSpeedContainer = netWorkSpeedContainer;
        this._timeUpdateContainer = timeUpdateContainer;
        this._frameSpeedChartContainer = frameSpeedChartContainer;
        this.initCharts();
    }

    initCharts() {
        this._networkChart = echarts.init(this._netWorkSpeedContainer);
        // this._networkChart.showLoading();
        this._timeupdateChart = echarts.init(this._timeUpdateContainer);
        // this._timeupdateChart.showLoading();
        mediaInfoTable = $('.table.table-condensed.my-table')[0];
        this._timeupdateChart.setOption(timeupdateOption);
        this._frameSpeedChart = echarts.init(this._frameSpeedChartContainer);
        this._frameSpeedChart.setOption(frameSpeedOption);
    }

    ontimeupdate(e) {
        if (!this._timeupdateChart) return;

        if (!dateOld) {
            dateOld = Date.now();
        }

        dateNow = Date.now();
        if (dateNow - dateOld >= 1000) {
            timeupdateOption.title.text = `timeupdate触发次数: ${timeupdateCount} 次/秒`

            let _tempObj = {
                key: (new Date()).toLocaleTimeString().replace(/^\D*/, ''),
                timeupdate_count: timeupdateCount
            }
            let data = timeupdateOption.series[0].data;
            if (data.length > chartLg)
                data.shift();
            data.push(_tempObj.timeupdate_count);
            timeupdateOption.xAxis.data.shift();
            timeupdateOption.xAxis.data.push(_tempObj.key);
            this._timeupdateChart.setOption(timeupdateOption);
            dateOld = dateNow;
            timeupdateCount = 0;
        } else {
            timeupdateCount++;
        }
    }

    onNetSpeed(e) {
        if (!this._networkChart) return;
        // this._networkChart.hideLoading();

        networkChartOptions.title.text = `下载任务网速监控: ${e.speed.toFixed(2)} m/s, 建议播放清晰度: ${e.netState}`;

        let _tempObj = {
            key: (new Date()).toLocaleTimeString().replace(/^\D*/, ''),
            speed: e.speed
        }
        let data = networkChartOptions.series[0].data;
        if (data.length > chartLg)
            data.shift();
        data.push(_tempObj.speed);
        networkChartOptions.xAxis.data.shift();
        networkChartOptions.xAxis.data.push(_tempObj.key);
        this._networkChart.setOption(networkChartOptions);
    }

    onMediaInfoParsed(e) {
        let data = e;
        if (data.pixelRatio) {
            data.pixelRatio = `${data.pixelRatio[0]}:${data.pixelRatio[1]}`
        }
        if (data.frameRate) {
            data.frameRate = `${data.frameRate.toFixed(2)} fps`
        }
        let tableBody = $(mediaInfoTable).children('tbody')[0];
        $(tableBody).empty();
        $(tableBody).append('<tr><th>视频信息</th> <th>解析值</th></tr>');
        let infoKeys = Object.keys(infoTmplt);
        infoKeys.forEach((key) => {
            let htmlStr = `<tr>
                    <th>${infoTmplt[key]}</th>
                    <td>${e[key] || '获取失败'}</td></tr>
            `;
            $(tableBody).append(htmlStr);

        });
    }

    onplay() {
        if(!reqID){
            this.animation();
        }
        
    }

    onpause() {
        if (reqID) {
            cancelAnimationFrame(reqID);
            reqID = undefined;
        }
    }

    onend() {
        if (reqID) {
            cancelAnimationFrame(reqID);
            reqID = undefined;
        }
    }

    animation() {
        if (!this._frameSpeedChart) return;

        if (!lastTime) {
            lastTime = Date.now();
        }

        newTime = Date.now();
        if (newTime - lastTime > 1000) {
            frameSpeedOption.title.text = `刷新帧率: ${frameCount} fps`;
            let _tempObj = {
                key: (new Date()).toLocaleTimeString().replace(/^\D*/, ''),
                frame_count: frameCount
            }
            let data = frameSpeedOption.series[0].data;
            if (data.length > chartLg)
                data.shift();
            data.push(_tempObj.frame_count);
            frameSpeedOption.xAxis.data.shift();
            frameSpeedOption.xAxis.data.push(_tempObj.key);
            this._frameSpeedChart.setOption(frameSpeedOption);
            lastTime = newTime;

            frameCount = 0;
        } else {
            frameCount++;
        }

        reqID = requestAnimationFrame(this.animation.bind(this));
    }

    resize() {
        this._networkChart.resize();
        this._timeupdateChart.resize();
        this._frameSpeedChart.resize();
    }
}
