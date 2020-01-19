<template>
<v-container>
    <v-row :class="tarShow">
        <v-avatar>
            <v-img :src='avatarShow'></v-img>
        </v-avatar>
        <v-card class='pa-3 ma-3' max-width="500">
            <vue-audio-native v-show="type=='audio'" :url='content' :showControls=true></vue-audio-native>
            <v-img v-show="type=='image'" :src='content'></v-img>
            <video v-show="type=='video'" controls width='100%' :src='content'></video>
            <span v-show="type=='text'">{{content}}</span>
        </v-card>
    </v-row>
</v-container>
</template>

<script>
export default {
    props: {
        tar: { //决定左边显示还是右边
            Type: String,
            // default: () => []
            default: 'yun' //yun,me
        },
        content: { //决定显示内容
            Type: String,
            default: '你好，我是小云，有什么可以帮您' //base64,text
        },
        type: { //决定显示组件
            Type: String,
            default: 'text' //text,image,audio,video
        }
    },
    data: () => ({

    }),
    computed: {
        tarShow() {
            if (this.tar == 'yun') {
                return "d-flex flex-row"
            } else {
                return "d-flex flex-row-reverse"
            }
        },
        avatarShow() {
            if (this.tar == 'yun') {
                return require('@/assets/yun.png')
            } else {
                return require('@/assets/user.png')
            }
        }
    }
}
</script>

<style>

</style>
