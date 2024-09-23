<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zh_CN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import { mapState } from 'vuex'


moment.locale("zh-cn");

export default {
  name: 'App',
  data() {
    return {
      zh_CN
    };
  },
  
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
