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
import 'vf-media-player/dist/VFMediaPlayer.css'
import VFMediaPlayer from 'vf-media-player';

```

## 初始化
```javascript
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
        ...
});

myPlayer.on('PlayerMediaEvent', MEDIA_EVENT_HANDLER);
myPlayer.on('playerError', PLAYER_ERROR_HANDLER);
myPlayer.init();
```

## 插件注册
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
    ...
}

//注册插件
let yourPlugin = new YOUR_PLUGIN(...)
myPlayer.registerPlugin(yourPlugin);

```