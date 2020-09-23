<template>
  <v-container>
    <h1>AI Flow Debug</h1>
    <v-row>
      <v-col>
        <RequestBox></RequestBox>
        <ResponseBox></ResponseBox>
      </v-col>
      <v-col cols="4">
        <Preview></Preview>
      </v-col>
      <v-snackbar :timeout="timeout" bottom color="error" v-model="snackbar"
        >{{ errMsg }}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import Preview from "@/components/Preview";
import RequestBox from "@/components/RequestBox";
import ResponseBox from "@/components/ResponseBox";
export default {
  components: {
    RequestBox,
    ResponseBox,
    Preview,
  },
  data: () => ({
    snackbar: false,
    errMsg: "",
    timeout: 3000,
  }),
  mounted() {
    this.$root.eventHub.$on("resErrData", (err) => {
      this.errMsg = "请求出错了，请检查";
      this.snackbar = true;
    });
  },
};
</script>
