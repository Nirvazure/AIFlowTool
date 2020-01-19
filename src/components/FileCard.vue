<template>
<v-container>
    <v-file-input v-model='uploadFile' @change="fileChange"></v-file-input>
    <v-chip>{{fileType}}</v-chip>
</v-container>
</template>

<script>
export default {
    data: () => ({
        fileType: 'undefined',
        uploadFile: null
    }),
    methods: {
        fileChange() {
            let reader = new FileReader();
            reader.readAsDataURL(this.uploadFile)
            reader.onload=(e)=>{
                //这里是分析数据截取的类型信息
                let anaType=e.currentTarget.result.split(';')[0].split(':')[1].split('/')[0]
                this.fileType=anaType
            }
        }
    }
}
</script>

<style>

</style>
