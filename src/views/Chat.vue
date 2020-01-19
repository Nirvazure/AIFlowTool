<template>
<v-container>
    <v-card>
        <v-card-title>
            <span>AI Flow Chat</span>
            <v-spacer></v-spacer>
            <v-sheet width='200px'>
                <v-select v-model="dagName" :items="dags|getDagName" @change="selectChange" label="请选择Dag"></v-select>
            </v-sheet>
        </v-card-title>
        <v-card-actions>
            <v-dialog v-model="dialog" width='500'>
                <template v-slot:activator='{on}'>
                    <v-btn text v-on="on" @click="dialogShow('video')" :disabled="inputTypes.indexOf('video')==-1">
                        <v-icon>mdi-video</v-icon>
                    </v-btn>
                    <v-btn text v-on="on" @click="dialogShow('audio')" :disabled="inputTypes.indexOf('audio')==-1">
                        <v-icon>mdi-volume-high</v-icon>
                    </v-btn>
                    <v-btn text v-on="on" @click="dialogShow('image')" :disabled="inputTypes.indexOf('fullImage')==-1&&inputTypes.indexOf('image')==-1">
                        <v-icon>mdi-image</v-icon>
                    </v-btn>
                    <v-btn v-on='on' text @click="dialogShow('camera')" :disabled="inputTypes.indexOf('fullImage')==-1&&inputTypes.indexOf('image')==-1">
                        <v-icon>mdi-camera</v-icon>
                    </v-btn>
                </template>
                <v-card raised>
                    <v-card-title>{{dialogType}}</v-card-title>
                    <v-container>
                        <VideoCard v-show="dialogType=='video'" v-on:childContent="getMedia"></VideoCard>
                        <AudioCard v-show="dialogType=='audio'" v-on:childContent="getMedia"></AudioCard>
                        <PhotoCard v-show="dialogType=='image'" v-on:childContent="getMedia"></PhotoCard>
                        <CamCard v-show="dialogType=='camera'" v-on:childContent="getMedia"></CamCard>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color='success' text @click="sendMsg(dialogType)">Send</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-text-field dense class='ml-4' label="Typing here" @change='textChange' :disabled="inputTypes.indexOf('text')==-1"></v-text-field>
            <v-btn id="textBtn" color='green' @click="sendMsg('text')" dark text>send</v-btn>
        </v-card-actions>
    </v-card>
    <v-list ref="msgList" height='300'>
        <v-list-item  v-for="(msg,i) in msgs" :key='i'>
            <Message :type='msg.type' :tar='msg.tar' :content='msg.content'></Message>
        </v-list-item>
    </v-list>
</v-container>
</template>

<script>
import axios from "axios";
import CamCard from '@/components/CamCard'
import AudioCard from '@/components/AudioCard'
import PhotoCard from '@/components/PhotoCard'
import VideoCard from '@/components/VideoCard'
import Message from '@/components/Message'
import write from 'fs';
var base64 = require('base64-js')
export default {
    components: {
        CamCard,
        VideoCard,
        AudioCard,
        PhotoCard,
        Message
    },
    data: () => ({
        dialog: false, //控制dialog显示的布尔变量，应该是必须的
        dialogType: '',
        msgContent: null,
        msgs: [], //维护之间传递的消息
        dagName: '',
        dags: [],
        inputTypes: []
    }),
    mounted() {
        this.getDags()
    },
    computed: {
        target() {
            return this.$refs.msgList.height
        },
        options() {
            return {
                duration: 1000
            }
            // offset:msg.height
            // easing:
        }
    },
    methods: {
        dialogShow(type) {
            this.dialogType = type
        },
        selectChange(target) {
            console.log("你当前选择的是" + target)
            this.msgs = [] //清空消息列表
            this.inputTypes = this.dags.filter(v => v.name == target)[0].inputs
            console.log('支持的类别有')
            console.log(this.inputTypes)
        },
        textChange(v) {
            this.msgContent = v
        },
        getDags() {
            // axios.get('/dagsChannelName').then((res) => {
            //这里是开发环境的请求
            axios.get('service/dagsChannelName').then((res) => {
                console.log(res.data)
                // this.dags = res.data
                console.log('正在从服务端获取dag列表数据')
                for (let key in res.data) {
                    let dag = {}
                    dag['name'] = key
                    dag['inputs'] = res.data[key]
                    this.dags.push(dag)
                }
                console.log('dag列表数据已经传输进本地变量')
            }).catch((err) => {
                console.log(err)
            })
        },
        getMedia(data) {
            this.msgContent = data
        },
        sendMsg(type) {
            console.log(this.target)
            let newMsg = {}
            if (this.msgContent == '') {
                console.log('消息不能为空')
                return
            } else {
                newMsg.tar = 'me'
                newMsg.type = type
                newMsg.content = this.msgContent
                this.msgs.push(newMsg)
            }

            this.dialog = false

            let reqData = {}
            reqData['dagName'] = this.dagName
            //这一句很不好
            let isFullImage = this.inputTypes.indexOf('fullImage') == -1

            reqData['data'] = this.handleData(newMsg, isFullImage)
            axios.post('gateway/v1/aiflow/dagservice/call', reqData).then((res) => {
                // 这里就处理回复的信息了，获得回复并解析给消息列表显示
                console.log(res.data)
                this.handleResponse(res.data)
            })
            // this.$vuetify.goTo(this.$refs.msgList.style.height, this.options)
        },

        handleResponse(res) {
            //这里回复的消息可能不止一个
            let payload = ''
            let type = ''

            for (let itemKey in res.data) {
                console.log(itemKey) //这里考虑做一个过滤
                let itemData = res.data[itemKey]
                let newMsg = {}
                for (let typeKey in itemData) {

                    if (typeKey == 'pcm') {
                        type = typeKey
                        payload = this.convertPCMToWAV(base64.toByteArray(itemData[typeKey].data))
                        payload = 'data:audio/wav;base64,' + base64.fromByteArray(payload);
                    } else if (typeKey == "image") {
                        type = typeKey
                        payload = "data:image/jpeg;base64," + itemData[typeKey].image
                    } else if (typeKey == 'text') {
                        type = typeKey
                        payload = itemData[typeKey].data
                    } else {
                        type = 'illegal'
                        // type = typeKey
                        payload = JSON.stringify(itemData[typeKey])
                    }
                }
                if (type != 'illegal') {
                    newMsg['type'] = this.getTypeFromKey(type)
                    newMsg['content'] = payload
                    newMsg['tar'] = 'yun'
                    this.msgs.push(newMsg)
                }
            }
        },
        getTypeFromKey(key) {
            switch (key) {
                case "pcm":
                    return "audio";
                    break;
                case "captureImageCommand":
                    return "cmd";
                    break;
                    // case 'asrResult':
                    //     return 'text';
                    //     break;
                default:
                    return key //nlpResult,nlpFlash,asrResult
            }
        },

        //这里很麻烦的一件事就是这个fullimage，true说明找不到，没有fullimage
        handleData(msg, ifFullImage) {
            let reqData = msg.content.split(',')[1]
            //msg.type是我的依据，content是我的处理元
            if (msg.type == 'audio') {
                reqData = {
                    'audio': {
                        'pcm': {
                            'data': reqData
                        }
                    }
                }
            } else if (msg.type == 'image') {
                if (ifFullImage) {
                    //没有的时候
                    reqData = {
                        'image': {
                            'image': {
                                'image': reqData
                            }
                        }
                    }
                } else {
                    reqData = {
                        'fullImage': {
                            'image': {
                                'image': reqData
                            }
                        }
                    }
                }

            } else if (msg.type == 'video') {
                reqData = {
                    'video': {
                        'video': {
                            'video': reqData
                        }
                    }
                }
            } else { //这里认为其他就是文字
                reqData = {
                    'text': {
                        'text': {
                            'data': msg.content
                        }
                    }
                }
            }
            return reqData
        },

        convertPCMToWAV(pcmView) {
            let sampleRate = 16000;
            let numChannels = 1;
            let buffer = new ArrayBuffer(44 + pcmView.length); //lengrh找不到
            let wavView = new DataView(buffer);
            this.writeString(wavView, 0, 'RIFF');
            wavView.setUint32(4, 36 + pcmView.length, true); //rest size
            this.writeString(wavView, 8, 'WAVE'); //format
            this.writeString(wavView, 12, 'fmt '); //with space
            wavView.setUint32(16, 16, true); //消息格式头长度
            wavView.setInt16(20, 1, true); //音频格式 pcm-1
            wavView.setInt16(22, numChannels, true);
            wavView.setUint32(24, sampleRate, true);
            wavView.setUint32(28, sampleRate * 2, true); //字节率
            wavView.setInt16(32, numChannels * 2, true); //每个采样字节数
            wavView.setInt16(34, 16, true); //每个采样存储比特数
            this.writeString(wavView, 36, 'data'); //data以及长度
            wavView.setUint32(40, pcmView.length, true);
            let offset = 44;

            for (var i = 0; i < pcmView.length; i++) {
                wavView.setUint8(offset + i, pcmView[i]);
            }

            return new Uint8Array(wavView.buffer);
        },

        writeString(view, offset, string) {
            for (var i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

    }
}
</script>
