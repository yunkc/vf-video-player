## Player提供接口列表

#### 属性
| 名称              | 类型      | 描述                   |
|-------------------|-----------|------------------------|
| buffered          | TimeRange | (只读属性)已缓冲范围   |
| currentTime       | number    | 播放器当前播放时间     |
| duration          | number    | 播放内容总时长         |
| muted             | boolean   | 静音                   |
| poster            | string    | 封面图片               |
| volume            | number    | 音量 0 ~ 1.0           |
| controls          | boolean   | 是否显示H5默认控制界面 |
| playbackRate      | number    | 播放速度 0~255         |
| loop              | boolean   | 是否循环播放           |
| preload           | boolean   | 是否预加载             |
| autoplay          | boolean   | 是否自动播放           |
| definition        | Array     | 当前可用分辨率         |
| mediaPlayerState  | string    | 当前播放器状态         |
| mediaPlayerConfig | object    | 当前播放器配置项       |

#### 方法
| 名称             | 参数             | 描述                                                        |
|------------------|------------------|-------------------------------------------------------------|
| init             | 无               | 初始化SDK, 需要在事件注册后调用, 否则会导致事件注册失败     |
| changeSrc        | source::string   | 切换播放视频源                                              |
| changeDefinition | source::string   | ['Auto', '240P', '480P', '720P', '1080P','4K'] 详见方法说明 |
| play             | 无               | 开始播放                                                    |
| pause            | 无               | 暂停播放                                                    |
| replay           | 无               | 重新播放                                                    |
| registerPlugin   | instance::Object | 插件注册, 详见方法说明                                      |
| dispose          | 无               | 销毁播放器                                                  |

#### 方法说明:
- changeDefinition 切换当前视频分辨率, 该方法在只传入一个链接的模式下无效并会在控制台输出警告, 其取值范围为,['Auto', '240P', '480P', '720P', '1080P','4K'], 如果对应分辨率的视频链接不存在, 则切换清晰度失败.

- registerPlugin 注册插件, 传入参数为按照规则开发的插件类实例, 注册后可以在该插件实例中触发相应的钩子以便于开发者制作额外的功能, 插件开发规则详见: [plugin 插件]()