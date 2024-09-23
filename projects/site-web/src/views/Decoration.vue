<template>
  <div>
    <div class="main">
      <left-menu></left-menu>
      <div class="container">
        <main-view></main-view>
      </div>
      <BaseEdit></BaseEdit>
    </div>
  </div>
</template>

<script>
// 导入组件
import leftMenu from '../components/LeftMenu'
import mainView from '../components/MainView'
import BaseEdit from '../components/BaseEditor'

import { mapState } from 'vuex';

export default {
  name: "Decoration",
  components: {
    leftMenu,
    mainView,
    BaseEdit
  },
  data() {
    return {
    };
  },
  mounted(){
  },
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";

.main {
  @include flex(row, space-between, center);
  // display: flex;
  .container{
    flex:1;
    overflow: scroll;
    height: calc(100vh - 56px);
    @include flex(row, center, flex-start);
    padding: 96px 0;

  }
}
</style>