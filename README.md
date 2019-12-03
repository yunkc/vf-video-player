# VF视频播放SDK

> 功能处于施工中...

> H5页面视频播放器, 支持mp4视频播放及多清晰度无缝切流

项目致力于打造一款web播放器，使得使用者通过简单的流程接入即可使用并享受无缝切流功能带来的流畅播放体验.


## 安装

npm方式:

```sh
npm install vf-media-player
```

或者选择直接引入:

```sh
<script src='yourPath/VFMediaPlayer.js'></script>
```

## 使用
```javascript
//引入npm包
import VFMediaPlayer from 'vf-media-player';

//初始化
let myPlayer = new VFMediaPlayer(videoContainer, {
        id: YOUR_ID,
        src: YOUR_URL,
        definition: '480P',
        controls: false,
        autoplay: false,
        muted: false,
        loop: false,
        playbackRate: 1,
        isShowLog: true,
});

myPlayer.on('PlayerMediaEvent', MEDIA_EVENT_HANDLER);
myPlayer.on('playerError', PLAYER_ERROR_HANDLER);
```

## 插件机制
```javascript
//注册插件
let yourPlugin = new YOUR_PLUGIN(...)
myPlayer.registerPlugin(yourPlugin);
```
```javascript
//插件类
class YOUR_PLUGIN{
    // 插件开发规范, 详情请参考文档 plugin 说明页
    // on + mediaEvent名称可触发对应钩子
    // 例如;
    onplay(){
        //..
    }

    onwaiting(){
        //..
    }
    ...

    // MP4视频头文件解析完毕钩子
    onMediaInfoParsed(){
        
    }
}

```

## 使用文档

暂无

## 案例 Demo

暂无

## TODO List
功能|进度
---|---
P2P加载器 | 0%
hls支持 | 0%
flv支持 | 0%
自定义皮肤 | 0%

## 联系方式

邮箱 – jiaziling@vipkid.com.cn

LICENSE - MIT

## 贡献

1. Fork本项目 (<https://github.com/vipkid-edu/vf-mediaPlayer/tree/dev>)
2. 创建您的个人分支 (`git checkout -b yourname/feature`)
3. 提交您的改动 (`git commit -am 'Yourname Add some feature'`)
4. 将您的改动推送到远程分支 (`git push origin yourname/feature`)
5. 创建 MR
