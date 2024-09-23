<template>
  <div class='layout'>
    <navi></navi>
    <a-layout>
      <div class='layout-header'>
        <div class="title">
          这个一个活动页生成器
        </div>
        <div class="ops">
          <div class="item">
            {{$store.getters.name}}
          </div>
          <div class="logout" @click="handleLogout">
            退出
            <svg-icon name='logout' class="ml5"></svg-icon>
          </div>
        </div>
      </div>
      <a-layout-content
        :style="{ margin: '24px 16px', minHeight: '280px' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script>
import navi from '../components/Navi'
import svgIcon from '../components/Icon/Index.vue'

export default {
  components: {navi,svgIcon},
  data() {
    return {
    };
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push({ path: 'login' })
      })
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/assets/css/mixin.scss' ;

.layout{
  display: flex;
  .layout-header{
    height: 56px;
    background: #fff; 
    padding: 0 32px;
    @include flex(row, space-between, center);
    color: #666;
    .ops{
      @include flex(row, flex-end, center);
      .item{
        color:#666666;
        padding: 0 20px;
        cursor: pointer
      }
      .item::after{
        content: '|';
        padding-left:20px; 
        height:14px;
        color:#ccc;
      }
      .logout{
        color: #999;
        @include flex(row, center, center);
        cursor: pointer
      }
    }
    
  }
}
</style>