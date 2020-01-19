import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import vueAudioNative from 'vue-audio-native'
Vue.use(vueAudioNative)

Vue.config.productionTip = false

import filter from './filters'
Object.keys(filter).forEach(key=>Vue.filter(key,filter[key]))

new Vue({
  router,
  vuetify,
  data: {
    eventHub: new Vue()
  },
  render: h => h(App)
}).$mount('#app')
