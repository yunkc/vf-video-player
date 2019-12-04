## Player事件监听

| 事件名称              | 描述                   |
|-----------------------|------------------------|
| PlayerMediaEvent      | 播放器媒体事件         |
| PlayerDownloadSpeed   | 播放器网络速度         |
| PlayerMediaInfoParsed | 播放器媒体信息解析完毕 |
| PlayerError           | 播放器异常             |

## 事件详细说明
##### PlayerMediaEvent 包括H5提供的MediaEvent以及一些自定义事件, 返回参数结构如下:

| key  | 返回值描述     |
|------|----------------|
| code | 播放器媒体事件 |
| data | 事件返回值内容 |

- code及返回值说明:

| code           | 描述                                       | data                    |
|----------------|--------------------------------------------|-------------------------|
| notready       | 播放器未准备就绪                           | 无                      |
| ready          | 播放器准备就绪                             | 无                      |
| loadstart      | 播放器下载开始                             | 无                      |
| canplay        | 播放器够播放                               | 无                      |
| canplaythrough | 播放能够继续，而应该不会中断               | 无                      |
| progress       | 播放器正在下载                             | 无                      |
| loadeddata     | 触发时间媒体的第一帧已经加载完毕           | 无                      |
| seeking        | 播放器正在跳转新的播放位置                 | 无                      |
| seeked         | 播放器结束跳转新的播放位置                 | 无                      |
| timeupdate     | 播放器当前播放时间改变                     | {currentTime, duration} |
| waiting        | 播放暂停, 等待下载其他数据                 | 无                      |
| ended          | 播放到媒体文件末尾, 播放停止(loop = false) | 无                      |
| play           | 播放器开始播放                             | 无                      |
| playing        | 播放器已经开始播放                         | 无                      |
| pause          | 播放器播放暂停                             | 无                      |
| ratechange     | 播放器播放速度改变                         | 无                      |
| volumechange   | 播放器音量属性改变或静音属性改变           | 无                      |
| durationchange | 播放器duration长度改变                     | 无                      |

- 案例
```javascript
player.on('PlayerMediaEvent', (e) => {
    switch (e.code) {
        case 'notready':
            console.log('===> the player is notready ');
            break;
        case 'ready':
            console.log('===> the player is ready: ', player);
            break;
        case 'timeupdate':
            let duration = e.data.duration;
            let currentTime = e.data.currentTime;
            let precent = currentTime / duration * 100;
            $(progressBar).css('width', precent + '%');
            break;
        ...
    }
}
```

---

##### PlayerDownloadSpeed 播放器的下载模块每次下载任务结束后触发该事件, 返回参数结构如下:

| key      | 返回值描述                       |
|----------|----------------------------------|
| speed    | 当前下载速度(粗略估算, 单位 m/s) |
| netState | 播放器当前建议播放清晰度         |

- netState 在 ['240P', '360P','480P', '720P','1080P','4K'] 中根据网速取值

---
##### PlayerMediaInfoParsed 播放器在媒体信息解析完毕后触发该事件, 返回参数内容如下:

| key           | 返回值描述   |
|---------------|--------------|
| width         | 视频宽度     |
| height        | 视频高度     |
| audioCodec    | 音频格式     |
| audioDuration | 视频高度     |
| channelCount  | 音频轨道时长 |
| sampleRate    | 音频通道数量 |
| videoCodec    | 视频格式     |
| videoDuration | 视频轨道时长 |
| pixelRatio    | 视频像素比   |
| frameRate     | 平均播放帧率 |
| createTime    | 文件创建时间 |
| modifyTime    | 文件修改时间 |
| duration      | 文件总时长   |

- 案例
```js
player.on('PlayerMediaInfoParsed', (e) => {
    let data = e;
    let _keys = Object.keys(data);
    _keys.forEach( (item) => {
        console.log(`name: ${item}, value: ${data[item]}`);
        ...
    })
})
```

---
##### PlayerError 播放器播放过程中产生异常触发该事件, 返回参数内容如下:

| key            | 返回值描述                  |
|----------------|-----------------------------|
| code           | 错误码                      |
| data           | 返回错误参数(缺省值null)    |
| level          | 固定值 'error'              |
| message        | 错误消息内容                |
| originEventObj | 被catch异常的原生异常消息体 |
| target         | 发生错误的模块              |
| type           | 固定值 'PlayerError'        |

- 返回错误码说明:

| 错误码 | 错误描述     |
|--------|--------------|
| 1xxxx  | 模块运行异常 |
| 2xxxx  | 模块运行异常 |
| 3xxxx  | 模块运行异常 |
| 4xxxx  | 模块运行异常 |
| 5xxxx  | 模块运行异常 |
| 00000  | 为未知异常   |

具体错误码详见[异常错误码说明]()