## 插件开发说明

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