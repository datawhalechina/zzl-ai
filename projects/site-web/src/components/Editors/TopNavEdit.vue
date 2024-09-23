<template>
  <transition name="slide-right">
    <div class="right">
    <div class="title">
      <div class="name">
          <img
            class="mr5"
            src="@/assets/img/decoration/text.png"
            style="width:13px;height:13px;align-self:center;"
          />
          <p>顶部导航</p>
      </div>
      <div class="tabpane-title" @click="activeTab==='first'?toggleTab('second'):toggleTab('first')">
        <div :class="activeTab==='first'?'tabpane-active':''" class="tabpane-btn">内容</div>
        <div :class="activeTab==='second'?'tabpane-active':''" class="tabpane-btn">样式</div>
      </div>
    </div>
    <div class="edit-wrapper topNavContent">
      <div class="first" v-if="activeTab==='first'" @click="toggleTab('first')">
        <div class="container">
          <div class="part"> 导航标题 </div>
          <div class="titleSelect">
            <a-radio-group v-model="titleType">
              <a-radio :value="0">分别用各页面名称</a-radio>
              <a-radio :value="1">统一标题</a-radio>
            </a-radio-group>
          </div>
          <div v-if="titleType == 1">
            <a-input
              prefix="标题"
              placeholder="建议输入6个字以内"
              :maxLength='10'
              @blur="changeName"
              
            />
            <p class="tips" v-if="showTips">请输入标题名称</p>
          </div>
        </div>
      </div>
      <div class="second" v-if="activeTab==='second'" @click="toggleTab('second')">
        <div class="container">
          <div class="part">
            颜色
          </div>
          <div class="pageColor line-item">
            <span class="label">背景</span>
            <div class="colorSelect">
              <p>{{site.topNav.background}}</p>
              <el-color-picker
                size="mini"
                class="changeColor"
                v-model="navBackground"
              ></el-color-picker>
            </div>
            <div class="reset" @click="resetColor">
              <img
                src="@/assets/img/decoration/reset.png"
                alt=""
                class="resetButton"
              />
            </div>
          </div>
          <div class="line-item">
            <span class="label">标题</span>
            <a-radio-group v-model="titleColor">
              <a-radio value="#fff">白色</a-radio>
              <a-radio value="#000">黑色</a-radio>
            </a-radio-group>
          </div>
          <div class="line-item">
            <span class="label">按键</span>
            <a-radio-group v-model="buttonColor">
              <a-radio value="#fff">白色</a-radio>
              <a-radio value="#000">黑色</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      activeTab: 'first',
      showTips: false,
      // titleColor: '',
      // : ''
    }
  },
  computed: {
    ...mapState({
      site: state=>state.site.site,
      editIndex: state=>state.site.editIndex,
      components: state=>state.site.components,
    }),
    titleType:{
      get(){
        return this.site.topNav.type
      },
      set(value) {
        this.$set(this.site.topNav, 'type', value);
      }
    },
    navBackground:{
      get(){
        return this.site.topNav.background
      },
      set(value) {
        this.$set(this.site.topNav, 'background', value);
      }
    },
    titleColor: {
      get(){
        return this.site.topNav.titleColor
      },
      set(value) {
        this.$set(this.site.topNav, 'titleColor', value);
      }
    },
    buttonColor:{
      get(){
        return this.site.topNav.buttonColor
      },
      set(value) {
        this.$set(this.site.topNav, 'buttonColor', value);
      }
    }

  },
  methods: {
    toggleTab(name) {
      this.activeTab = name
    },
    onChange(e) {
      // console.log("radio checked", e.target.value);
      const {value} = e.target;
      this.site.navType = value;
    },
    changeName(e) {
      const {value} = e.target
      if (!e.target.value) {
        this.showTips = true;
      } else {
        this.showTips = false;
        this.$set(this.site.topNav, 'title', value);
      }
    },
    navColorSetting(val) {
      console.log(val)
      this.$set(this.site.topNav, 'background', val);

    },
    resetColor() {
      this.$set(this.site.topNav, 'background', '#FFFFFF');
    }
  }
}
</script>
<style lang="scss">
.topNavContent{
  .ant-input {
    padding-left: 50px;
  }
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 50px !important;
    height: 40px;
    background:rgba(248,248,248,1);
    border:1px solid rgba(236,236,236,1); 
  }
  .ant-input-prefix{
    line-height: 38px;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";
.right  {
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
  }
  .edit-wrapper{
    margin: 20px 0;
    .part{
      color: #333;
      margin: 10px 0;
    }
    .first{
      .titleSelect {
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .tips {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 149, 66, 1);
      }
    }
  
    .second{
      .pageColor {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .colorSelect {
          width: 242px;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(248, 248, 248, 1);
          border-radius: 2px;
          border: 1px solid rgba(236, 236, 236, 1);
          box-sizing: border-box;
          padding-left: 16px;
          padding-right: 16px;
        }
        .reset {
          width: 40px;
          height: 40px;
          background: rgba(248, 248, 248, 1);
          border-radius: 2px;
          border: 1px solid rgba(236, 236, 236, 1);
          @include flex(row, center, center);
          .resetButton {
            width: 16px;
            height: 16px;
          }
        }
      }
      .line-item{
        margin-bottom: 16px;
        span.label{
          margin-right: 10px;
        }
      }
    }
  }
}
</style>