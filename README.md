# VF视频播放器
[中文](README.md) | [English](README_EN.md)

> 功能模块均处于施工中...

> H5页面视频播放器, 支持mp4视频播放及多清晰度无缝切流

项目致力于打造一款web播放器，使得使用者通过简单的流程接入即可使用并享受无缝切流功能带来的流畅播放体验.


## 安装

npm方式:

```sh
npm install vf-media-player --save
```

## 使用
```javascript
//script标签直接引入
<script src='yourPath/VFMediaPlayer.js'></script>

//或者通过module方式
import VFMediaPlayer from 'vf-media-player';

```

## 初始化
```javascript
let videoContainer = document.getElementById('YOUR_CONTAINER_ID');
let myPlayer = new VFMediaPlayer({
        container: videoContainer,
        id: YOUR_ID,
        src: YOUR_URL, //详情见options配置项说明
        definition: 'Auto',
        controls: false,
        autoplay: false,
        muted: false,
        loop: false,
        playbackRate: 1,
        isShowLog: true,
        ...
});

myPlayer.on('PlayerMediaEvent', MEDIA_EVENT_HANDLER);
myPlayer.on('playerError', PLAYER_ERROR_HANDLER);
```

## 使用文档

* [Quick start 快速开始](https://github.com/vipkid-edu/vf-media-player/wiki/Quick-start-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
* [Options 配置项](https://github.com/vipkid-edu/vf-media-player/wiki/Options-%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%89%E9%A1%B9%E9%85%8D%E7%BD%AE)
* [API 方法接口](https://github.com/vipkid-edu/vf-media-player/wiki/%E6%96%B9%E6%B3%95%E6%8E%A5%E5%8F%A3-API)
* [Event 事件监听](https://github.com/vipkid-edu/vf-media-player/wiki/Events-%E6%92%AD%E6%94%BE%E5%99%A8%E4%BA%8B%E4%BB%B6%E8%AF%B4%E6%98%8E)
* [Error 异常错误码说明](https://github.com/vipkid-edu/vf-media-player/wiki/Error-%E5%BC%82%E5%B8%B8%E9%94%99%E8%AF%AF%E7%A0%81%E8%AF%B4%E6%98%8E)
* [Plugin 插件说明](https://github.com/vipkid-edu/vf-media-player/wiki/Plugin-%E6%8F%92%E4%BB%B6%E8%AF%B4%E6%98%8E)
* [Q&A 常见问题](https://github.com/vipkid-edu/vf-media-player/wiki/Q&A-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

## TODO List
| 功能            | 进度 |
|-----------------|------|
| 提升MP4播放体验 | 0%   |
| P2P加载器       | 0%   |
| flv支持         | 0%   |
| hls支持         | 0%   |
| 自定义皮肤      | 0%   |

## 联系方式

邮箱 – 781011352@qq.com

LICENSE - MIT

## 贡献

1. Fork本项目
2. 创建您的个人分支 (`git checkout -b yourname/feature`)
3. 提交您的改动 (`git commit -am 'Yourname Add some feature'`)
4. 将您的改动推送到远程分支 (`git push origin yourname/feature`)
5. 创建Pull Request
