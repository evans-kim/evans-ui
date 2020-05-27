import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import EvansUI from './components'
import EvMessage from './plugins/EvToast';
import SequencePlugIn from "./plugins/Sequence";
import './assets/tailwind.css'

Vue.config.productionTip = false

Vue.use(EvansUI);
Vue.use(EvMessage);
Vue.use(SequencePlugIn);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
