## HCI_DEMO
Author:LFR  
UpdateDate:2019.12.03
CreateDate:2019.11.07

### Todos
- 将两个项目合在一起

### Archive
#### week4
- 解决pcm音频播放问题
- 本地部署（目前绕开了router：history mode采用带#的hash设定）
- 因为听说后端做了跨域允许，所以目前直接访问是可以的，根据这个直接移除了api2
- api1采用全域名访问的方式拿到了数据
- 更改vue.config

#### week3
- 调通AIFlwService接口
- 调通DagList接口
- 组件数据带出&数据组织
#### week2
- 基于vue-audio-native的音频播放功能实现
- 基于web-camera的图像捕捉功能实现
- 基于js-audio-recorder的录音功能实现
- 基于vue-picture-input的图片上传实现
#### week1
- 前端UI框架搭建
- 原型评审
- 组件库&交互原型设计

### Audit
- 取消table的expand插槽形式

### Requirements
 
 - 录音实现： [js-audio-recorder](https://github.com/2fps/recorder "录音机实现")
 - 音频播放实现：[vue-audio-native](https://github.com/trsoliu/vue-audio "音频播放实现")
 - 图片上传实现：[vue-picture-input](https://github.com/alessiomaffeis/vue-picture-input "图片上传实现")

This project contains two parts
1. a DAG API integrate tools
2. a DAG interactive tools

Refer
* ARC (Chrome plugin)
* rest_client (JAR)

Function
* Map Creator
* DAG Flow Animation

### Todos
* split components(拆分组件，数据流展示，对话)
* gRPC to JS
* 字段分析

---

底部组件
<div>
    <select>
        <option value='1'>语音</option>
        <option value='1'>图像</option>
        <option value='1'>相机</option>
    </select>
    <input placeholder="这是输入文字消息"></input>
    <button display="block">发送</button>
</div>

## Project setup
```
