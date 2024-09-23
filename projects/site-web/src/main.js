import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import VueQriously from 'vue-qriously'

// import axiosPlus from '@/assets/js/axiosPlus'
import "@/api"

import "@/assets/css/base.css";
import "@/assets/js/antDesign";
import "@/assets/js/element";
import "@/assets/css/theme.less";



Vue.use(VueQriously);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
