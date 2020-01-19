<template>
<v-card>
    <v-card-title>
        <span class="title font-weight">Preview </span>
        <v-spacer></v-spacer>
        <v-chip small dark v-if='MsgSrc'>{{MsgSrc}}</v-chip>
    </v-card-title>
    <v-card-text>
        <v-sheet>
            <vue-audio-native v-if="dagType=='audio'" size='default' :url=audUrl :showControls=showControls :hint=hint :waitBuffer=waitBuffer :downloadName=downloadName @on-change="change" @on-timeupdate="timeupdate" @on-metadata="metadata" @on-audioId="audioId">
            </vue-audio-native>
            <v-textarea v-else-if="dagType=='text'" filled outlined :value="textContent" hint="Hint text"></v-textarea>
            <v-img v-else-if="(dagType=='image'||dagType=='camera'||dagType=='file')" :src="imgUrl" lazy-src="https://picsum.photos/id/11/10/6" aspect-ratio="1" class="grey lighten-2" max-width="500" max-height="300"></v-img>
            <video v-else-if="dagType=='video'" controls width='100%' :src='videoUrl'></video>
            <v-textarea v-else outlined class="body-1 Light weight text." :value="textContent"></v-textarea>
        </v-sheet>
    </v-card-text>

</v-card>
</template>

<script>
import Vue from 'vue'
export default {
    data: () => ({
        MsgSrc: '',
        dagType: "",
        audUrl: '',
        imgUrl: '',
        videoUrl: '',
        textContent: '',
        showControls: true, //默认false，true:展示原生音频播放控制条，false：展示模拟播放控制条
        waitBuffer: true, //默认true，拖拽到未加载的时间，是否需要等待加载，true:滑块位置不动，等待加载音频资源后播放，false：当滑动位置大于当前缓冲的最大位置，则重置到当前最大缓冲位置
        downloadName: "下载音频", //默认“下载音频”，在Chrome和火狐、同域名下，修改下载文件名称，其它保持原文件服务器名称
        hint: "音频正在加载中，请稍等…", //无音频情况下提示文案
        currentAudioId: "", //当前正在播放的audio id
    }),
    methods: {
        change(event) {
            console.log("当前播放状态：", event)
        },
        timeupdate(event) {
            console.log("当前播放时间：", event)
        },
        metadata(event) {
            console.log(event, "音频长度：", event.target.duration)
        },
        //切换音频地址
        swtichSrc(index) {
            let t = this;
            t.url = t.urlArray[index];
        },
        //获取正在播放音频currentAudioId，可存全局，用以播放和暂停音频
        audioId(event) {
            this.currentAudioId = event;
            var id = event;
            Vue.nextTick(function () {
                document.getElementById(id).load();
            })
        },
        //使用组件的id，用来开始播放录音
        play() {
            document.getElementById(this.currentAudioId).play();
        },
        //使用组件的id，用来暂停播放录音
        pause() {
            document.getElementById(this.currentAudioId).pause();
        }
    },
    mounted() {
        this.$root.eventHub.$on('testcase', (res) => {
            this.MsgSrc = res['src']
            this.dagType = res['type']
            if (this.dagType == "audio") {
                this.audUrl = res['content']
            } else if (this.dagType == "image" || this.dagType == 'camera') {
                this.imgUrl = res['content']
            } else if (this.dagType == "video") {
                this.videoUrl = res['content']
            } else {
                this.textContent = res['content']
            }
        });
    }
}
</script>
