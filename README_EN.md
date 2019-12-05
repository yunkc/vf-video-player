# VF media player
[中文](README.md) | [English](README_EN.md)

> Functional modules are under construction

> H5 page video player, support mp4 video playback and multi-definition seamless cut stream

The project is committed to creating a web player that allows users to access and enjoy the smooth playback experience brought by the seamless streaming function through simple process access.


## Install

npm:

```sh
npm install vf-media-player --save
```

## Use
```javascript
//by script tag:
<link rel="stylesheet" href="yourPath/VKDVideoSDK.css"/>
<script src='yourPath/VFMediaPlayer.js'></script>

//or import as a moudle, remember import .css file 
import 'vf-media-player/dist/VFMediaPlayer.css'
import VFMediaPlayer from 'vf-media-player';

```

## Initialization
```javascript
let myPlayer = new VFMediaPlayer(videoContainer, {
        id: YOUR_ID,
        src: YOUR_URL,
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
myPlayer.init();
```

## Document

* [Quick start](https://github.com/vipkid-edu/vf-media-player/wiki/Quick-start)
* [Options](https://github.com/vipkid-edu/vf-media-player/wiki/Options)
* [API](https://github.com/vipkid-edu/vf-media-player/wiki/API)
* [Event](https://github.com/vipkid-edu/vf-media-player/wiki/Events)
* [Error](https://github.com/vipkid-edu/vf-media-player/wiki/Error)
* [Plugin](https://github.com/vipkid-edu/vf-media-player/wiki/Plugin)
* [Q&A](https://github.com/vipkid-edu/vf-media-player/wiki/Q&A)

## TODO List
| features                      | schedule |
|-------------------------------|----------|
| Improve MP4 playback function | 0%       |
| P2P loader                    | 0%       |
| support hls                   | 0%       |
| support flv                   | 0%       |
| custom skin                   | 0%       |

## Contact information

email – 781011352@qq.com

LICENSE - MIT

## Contribution

1. Fork this project
2. Create your feature branch (`git checkout -b yourname/feature`)
3. Commit your changes (`git commit -am 'Yourname Add some feature'`)
4. Push to the branch (`git push origin yourname/feature`)
5. Create a new Pull Request
