## Player可传入配置项

| 名称                           | 默认值        | 类型          | 描述                                     |
|--------------------------------|---------------|---------------|------------------------------------------|
| container                      | 无            | HTMLElement   | player容器                               |
| id                             | 无            | string        | playerID                                 |
| src                            | 无            | string/object | 视频链接地址, 详见 字段说明              |
| definition                     | 'Auto'        | string        | 初始化分辨率, 单视频链接情况下该字段无效 |
| controls                       | false         | boolean       | 开启player系统默认控制界面               |
| autoplay                       | false         | boolean       | 开启自动播放                             |
| preload                        | false         | boolean       | 开启预加载, 该字段目前无效               |
| muted                          | false         | boolean       | 开启静音                                 |
| loop                           | false         | boolean       | 开启循环播放                             |
| playbackRate                   | 1             | number        | 设置播放速度,                            |
| poster                         | 无            | string        | 设置视频封面,                            |
| preLoadTime                    | 3 * 60s       | number        | 预加载时间设置,                          |
| triggerNextLoadRangeTime       | 2 * 60s       | number        | 播放过程中触发下次预加载时间设置         |
| autoCleanupMaxDuration         | 3 * 60s       | number        | sourceBuffer清理触发长度                 |
| autoCleanupMinDuration         | 2 * 60s       | number        | sourceBuffer清理实际长度                 |
| playerAppendMinBufferLengthMap | 详见 字段说明 | object        | MSE最小添加buffer长度Map, 详见字段说明   |
| playerPreSwitchTime            | 3s            | number        | 切流预置时间                             |
| playerWaitingHandlerTime       | 3000ms        | number        | waiting事件处理时间                      |
| playerEndGapTime               | 0.5s          | number        | 判断是否播放到结尾的误差时间             |
| networkSpeedChangeReflectTime  | 5000ms        | number        | 网络环境改变后的预置切流时间             |

## 字段说明
- src: 当传入string类型链接时, player默认为单视频链接模式, 此时切换分辨率功能无效. 传入为object类型时, 请符合如下key-value形式:
```js
    src: {
        '240P': VIDEO_240P_URL,
        '360P': VIDEO_360P_URL,
        '480P': VIDEO_480P_URL,
        '720P': VIDEO_720P_URL,
        '1080P': VIDEO_1080P_URL,
        '4K': VIDEO_4K_URL
    };
```

- playerAppendMinBufferLengthMap: 向MSE中appendbuffer时的最小buffer长度, 根据分辨率进行切换, 可使用默认值(一般不需要进行设置):
```js
{
        '240P': 1048576 * 0.25,
        '360P': 1048576 * 0.5,
        '480P': 1048576 * 0.75,
        '720P': 1048576,
        '1080P': 1048576 * 1.5,
        '4K': 1048576 * 3,
}
```