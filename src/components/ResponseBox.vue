<template>
<v-container>
    <v-toolbar flat color="white">
        <v-toolbar-title>
            Response
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn text @click="showJson=false">Table</v-btn>
            <v-btn text @click="showJson=true">Json</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-textarea filled outlined v-if=showJson v-model="resData"></v-textarea>
    <v-data-table v-else dense hide-default-footer :headers="headers" :items="items" @click:row="showE">
        <template v-slot:item.type="{ item }">
            <v-chip label :color="getColor(item.type)" dark>{{ item.type }}</v-chip>
        </template>
    </v-data-table>
</v-container>
</template>

<script>
import {
    write
} from 'fs';
var base64 = require('base64-js')
export default {
    data: () => ({
        items: [],
        resData: null,
        showJson: false,
        headers: [{
                text: 'key',
                align: 'left',
                sortable: false,
                value: 'key'
            },
            {
                text: 'type',
                value: 'type'
            }
        ],
    }),
    mounted() {
        this.$root.eventHub.$on('responseData', (res) => {
            this.resData = JSON.stringify(res)
            this.items = []
            let itemDatas = res.data.data
            for (let itemKey in itemDatas) {
                let item = {}
                let itemData = itemDatas[itemKey]
                for (let typeKey in itemData) {
                    var payload = ""
                    if (typeKey == "image") {
                        payload = "data:image/jpeg;base64," + itemData[typeKey].image
                    } else if (typeKey == "pcm") {
                        let pcmView = itemData[typeKey].data
                        payload = this.convertPCMToWAV(base64.toByteArray(pcmView))
                        payload = 'data:audio/wav;base64,' + base64.fromByteArray(payload);
                    } else if (typeKey == "text") {
                        payload = itemData[typeKey].data
                    } else {
                        payload = JSON.stringify(itemData[typeKey])
                    }
                    item['type'] = this.getTypeFromKey(typeKey)
                    item['content'] = payload
                    item['key'] = itemKey
                }
                this.items.push(item)
            }
            console.log(this.items)
        });
    },
    methods: {
        getColor(type) {
            if (type == 'audio') return 'green'
            else if (type == 'image' || type == 'camera') return 'grey'
            else if (type == 'cmd') return 'red'
            else return 'orange'
        },
        showE(item) {
            console.log('这是response发的')
            console.log(item)
            this.$root.eventHub.$emit('testcase', {
                'src': 'Response',
                'type': item.type,
                'content': item.content
            });
        },
        getTypeFromKey(key) {
            switch (key) {
                case "pcm":
                    return "audio";
                    break;
                case "captureImageCommand":
                    return "cmd";
                    break;
                default:
                    return key //nlpResult,nlpFlash,asrResult
            }
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
    },
}
</script>
