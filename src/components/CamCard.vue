<template>
    <v-row class='text-center'>
        <v-col>
            <video ref="video" id="video" width="200" height="150" autoplay v-on:click="capture()"></video>
        </v-col>
        <v-col>
            <img id="capture" width="200" height="150" :src="myImg">
        </v-col>
        <canvas ref="canvas" id="canvas" width="200" height="150"></canvas>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            video: {},
            canvas: {},
            myImg: require("../assets/plhd.png")
        }
    },
    mounted() {
        this.video = this.$refs.video;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(stream => {
                this.video.srcObject = stream;
                this.video.play();
            });
        }
    },
    methods: {
        capture() {
            this.canvas = this.$refs.canvas;
            var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 200, 150);
            this.myImg = canvas.toDataURL("image/png")
            this.$emit("childContent", this.myImg)
        }
    }
}
</script>

<style>
#video {
    background-color: #000000;
}

#canvas {
    display: none;
}
</style>
