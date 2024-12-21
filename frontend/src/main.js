import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import VueClipboard from 'vue-clipboard2';

Vue.use(ElementUI);
Vue.use(VueClipboard);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');