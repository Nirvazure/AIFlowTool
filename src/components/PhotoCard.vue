<template>
<picture-input ref="pictureInput" width="400" height="240" accept="image/jpeg,image/png" size="10" :custom-strings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drag a 😺 GIF or GTFO'
      }" @change="onChange">
</picture-input>
</template>

<script>
import PictureInput from 'vue-picture-input'
export default {
    components: {
        PictureInput
    },
    methods: {
        onChange(image) {
            console.log('New picture selected!')
            if (image) {
                console.log('Picture loaded.')
                this.$emit("childContent", image)
            } else {
                console.log('FileReader API not supported: use the <form>, Luke!')
            }
        }
    }
}
</script>
