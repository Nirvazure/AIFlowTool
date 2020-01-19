<template>
<v-container>
    <v-row>
        <v-file-input dense outlined v-model="myFile" accept=".wav" label='select your file here' show-size @change='fileChange'></v-file-input>
        <v-btn class="mx-2" dark color="green" @mousedown="startRecording" @mouseup="stopRecording">
            {{audioBtnText}}
        </v-btn>
    </v-row>
</v-container>
</template>

<script>
import Recorder from 'js-audio-recorder';
export default {
    data: () => ({
        myFile: null,
        res: null,

        audioBtnText: "开始录音",
        isRecording: false,
        blob: null,
        recorder: null
    }),
    created() {
        this.recorder = new Recorder({
            sampleRate: 16000
        });
    },
    methods: {
        fileChange() {
            var self = this //这句话居然有用
            let reads = new FileReader();
            reads.readAsDataURL(this.myFile);
            reads.onload = function (e) {
                this.res = this.result
                self.$emit("childContent", this.res)
            };
        },
        startRecording() {
            console.log("start recording")
            this.audioBtnText = "录音中"
            this.recorder.start().then(() => {
                this.isRecording = true
            }, (error) => {
                console.log(`${error.name} : ${error.message}`);
            });

        },
        stopRecording() {
            console.log("stopRecording")
            this.audioBtnText = "开始录音"
            this.recorder.stop()
            this.blob = this.recorder.getWAVBlob()
            this.blobToBase64(this.blob).then(res => {
                console.log(res)
                this.$emit("childContent", res)
            })
        },
        blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    resolve(e.target.result);
                };
                fileReader.readAsDataURL(blob);
                fileReader.onerror = () => {
                    reject(new Error('文件流异常'));
                };
            });
        }
    }
}
</script>
