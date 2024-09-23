<template>
  <transition name="slide-right">
    <div v-if="components.length>0 && isComponent === true" class="right">
      <div class="title">
        <div class="name">
            <img
              class="mr5"
              src="../assets/img/decoration/text.png"
              style="width:13px;height:13px;align-self:center;"
            />
            <p>{{ components[editIndex].description }}</p>
        </div>
        <div class="tabpane-title" @click="activeTab==='first'?toggleTab('second'):toggleTab('first')">
          <div :class="activeTab==='first'?'tabpane-active':''" class="tabpane-btn">内容</div>
          <div :class="activeTab==='second'?'tabpane-active':''" class="tabpane-btn">样式</div>
        </div>
      </div>
      <div 
        v-for="(appUi,index) in components"
        :is="appUi.name.split('Com')[0]+'Edit'"
        :content="appUi.content"
        :oStyle="appUi.style"
        :aIndex="index"
        :currentIndex="editIndex"
        :key="appUi.content.code"
        :activeTab="activeTab"
        @changeTab="toggleTab"
      >
      </div>
    </div>
    <div v-else class="right">
      <div class="title">
        <div class="name">
            <img
              class="mr5"
              src="../assets/img/decoration/text.png"
              style="width:13px;height:13px;align-self:center;"
            />
            <p>页面</p>
        </div>
      </div>
      <PageEdit></PageEdit>
    </div>
  </transition>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';
  import BtnEdit from "@/components/Editors/BtnEdit.vue";
  import TextEdit from "@/components/Editors/TextEdit.vue";
  import PageEdit from "@/components/Editors/PageEdit.vue";
  import PicEdit from '@/components/Editors/PicEdit.vue';
  import CarouselEdit from '@/components/Editors/CarouselEdit.vue';

  export default {
    name: 'BaseEdit',
    components: {
      BtnEdit,
      TextEdit,
      PageEdit,
      PicEdit,
      CarouselEdit
    },
    data(){
      return {
      }
    },
    
    computed: {
      ...mapState({
        pages: state=>state.site.pages,
        pageIndex: state=>state.site.pageIndex,
        editIndex:state=>state.site.editIndex, 
        components:state=>state.site.components, 
        isComponent:state=>state.site.isComponent,
        activeTab: state=>state.site.activeTab
      })
    },
    methods: {
      toggleTab(name) {
        // this.activeName = name
        this.$store.commit('site/setActiveTab',name)
      }
    }
  }
</script>

<style lang='scss' scoped>
@import "@/assets/css/mixin.scss";
.right {
  width: 368px;
  background-color: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 30px 20px;
  .title{
    @include flex(row, space-between, center);
    
    box-sizing: border-box;
    .name{
      color: #333;
      font-size: 18px;
      @include flex(row, space-between, center);
      font-weight:500;
    }
    .tabpane-title {
      width: 146px;
      height: 34px;
      display: flex;
      justify-content: space-around;
      border: 1px solid #dddfe7;
      border-radius: 17px;
    }
  }
  .tabpane-active{
    border: 1px solid #3351e7;
    background-color: #e3ebff;
    color: #3351e7;
  }
  .tabpane-btn {
    width: 71px;
    @include flex(row, center, center);
    border-radius: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 16px;
    cursor: pointer;
  }
}




  .cui-flex-lable {
    white-space: nowrap;
    display: block;
    min-width: 75px;
  }
  
  .cui-clomun {
    flex-wrap: wrap;
  }
  
  .cui-flex-list {
    align-items: center;
    margin: 0 2%;
    margin-bottom: 10px;
    width: 46%;
  }
  
  .cui-input-box input {
    display: block;
    width: 100%;
    text-align: center;
  }
  
  .slide-right-enter-active, .slide-right-leave {
    transition: all .45s ease-in-out;
    opacity: 1;
  }
  
  .slide-right-enter {
    opacity: 0;
  }
  
  .slide-right-leave-active {
    transition: all .45s ease-in-out;
    opacity: 0;
  }
  
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  
  .app-right .el-color-picker--mini .el-color-picker__trigger {
    padding: 1px;
  }
  
  .app-right .el-form {
    overflow: hidden;
    padding-top: 5px;
  }
  
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
  
  .app-right .el-form-item > * {
    line-height: 1;
    float: none;
    text-align: left;
  }
  
  .app-right .el-form-item__label {
    width: 80px;
    text-align: right;
  }
  
  .el-collapse-item__wrap {
    width: 100%;
  }
  
  .el-color-picker {
    vertical-align: middle;
  }
  
  .black-text-shadow {
    text-shadow: 0 0 6px rgba(0, 0, 0, 1);
    font: 12px/1 '宋体';
  }
  
  .app-right .el-tabs__header {
    margin-bottom: 0;
    background: #fff;
  }
  
  .app-right .el-tabs__header .el-tabs__nav {
    float: none;
  }
  
  .app-right .el-tabs__header .el-tabs__item {
    height: 45px;
    width: 50%;
    text-align: center;
    cursor: pointer;
  }
</style>
