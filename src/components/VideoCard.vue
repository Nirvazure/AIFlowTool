<template>
<v-container>
    <v-sheet>
        <video ref="record" width='100%' height='100%' autoplay></video>
    </v-sheet>
    <v-row>
        <v-file-input display='inlined' dense outlined v-model='videoFile' accept='.mp4' label="select your video here" show-size @change='fileChange'></v-file-input>
        <v-btn text color='primary' :disabled="isRecording" @click='record'>Start</v-btn>
        <v-btn text color='error' :disabled="!isRecording" @click='stop'>Stop</v-btn>
    </v-row>
    <!-- <v-btn :disabled="!videoUrl" @click='save'>Save</v-btn> -->
</v-container>
</template>

<script>
import MediaStreamRecorder from 'msr'
export default {
    data: () => ({
        videoUrl: null,
        recorder: null,
        isRecording: false,
        videoFile: null
    }),
    mounted() {
        this.resetVideo();
    },
    methods: {
        fileChange() {
            var self = this //这句话居然有用
            let reader = new FileReader();
            console.log(this.videoFile)
            reader.readAsDataURL(this.videoFile);
            reader.onload = function (e) {
                console.log(this.result) //好像拿到了
                self.$emit("childContent", this.result)
            };
            // this.$emit("childContent", this.res)
        },
        record() {
            this.videoUrl = null;
            this.isRecording = true;
            console.log('开始录像');
            this.recorder.start();
        },
        stop() {
            this.isRecording = false;
            console.log('停止录像');
            this.recorder.stop();
        },
        save() {
            console.log("save file")
            let myVideoFile = null
            this.recorder.save(myVideoFile, 'myFile')
        },
        resetVideo() {
            console.log("正在重置内容");
            this.isRecording = false;
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: {
                        ideal: 320
                    },
                    height: {
                        ideal: 240
                    }
                },
                // audio: true
            }).then(this.getStream).catch((err) => console.error(err))
        },
        getStream(mediaStream) {
            this.recorder = new MediaStreamRecorder(mediaStream);
            this.recorder.mimeType = 'video/mp4';
            this.recorder.ondataavailable = this.videoDataHandler;
            this.$refs.record.srcObject = mediaStream
        },
        videoDataHandler(event) {
            console.log("数据合适的时候像向组件外pull消息");
            let reader = new FileReader();
            reader.readAsDataURL(event);
            this.videoUrl = URL.createObjectURL(event);
            reader.onloadend = () => {
                console.log(reader.result)
                this.$emit('childContent', reader.result);
                // this.$refs.record.src = null;
                // this.$refs.record.src = this.videoUrl;
            }
        }
    },
    save() {
        console.log("save file")
        let myVideoFile = null
        this.mediaRecorder.save(myVideoFile, 'myFile')
    }
}
</script>
