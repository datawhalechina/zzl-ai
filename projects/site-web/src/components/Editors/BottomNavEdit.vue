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
          <p>底部导航</p>
      </div>
      <div class="tabpane-title" @click="activeTab==='first'?toggleTab('second'):toggleTab('first')">
        <div :class="activeTab==='first'?'tabpane-active':''" class="tabpane-btn">内容</div>
        <div :class="activeTab==='second'?'tabpane-active':''" class="tabpane-btn">样式</div>
      </div>
    </div>
    <div class="edit-wrapper">
      <div class="first" v-if="activeTab==='first'" @click="toggleTab('first')">
        <div class="container">
          <div class="flex mb20">
             <a-switch v-model="status" /> 
             <div class="ml10">导航{{status?'开启':'关闭'}}</div>
          </div>
         
          <div class="part"> 
            添加导航
            <p class="description">最多5个导航，鼠标拖拽调整导航顺序（导航1除外）</p>
          </div>
          <div class="navl-ist-box">
            <draggable v-model="navList" v-bind="listOptions">
              <transition-group type="transition" :name="'flip-list'">
                <div class="navl-item" v-for="(item,index) in navList" :key="'n'+index" @click="handleClick(index)" :class="index === activeIndex?'active':''">
                  <span>{{item.name}}</span>
                  <div class="close" @click="(e)=>deleteItem(e, index)"></div>
                </div>
                <div class="navl-item add" @click="handleAdd" v-if="navList.length<5" key="n--1">
                  <a-icon type="plus" />
                </div>
              </transition-group>
            </draggable>
          </div>
          <div class="navl-item-preview" @click="visible = true" @cancel="visible = false">
            <div class="preview-imgs" >
              <div class="img-item">
                <img :src="navList[activeIndex]?require(`../../assets/img/material/${navList[activeIndex].icon}.png`):''" alt="">
                <span>未选中</span>
              </div>
              <div class="img-item">
                <img :src="navList[activeIndex]?require(`../../assets/img/material/${navList[activeIndex].activeIcon}.png`):''" alt="">
                <span>选中</span>
              </div>
            </div>
            <div class="mask" >{{navList[activeIndex]?'修改':'选择'}}</div>
          </div>
          <div class="input-wapper">
            <div class="drawerBox">
              <span>名称:</span>
               <a-input
                class="mt10 mb10"
                placeholder="建议输入6个字以内"
                :maxLength='10'
                v-model="navList[activeIndex].name"
              />
            </div>
           
            
            <div class="drawerBox">
              <span>链接:</span>
              <a-select
                placeholder="选择页面"
                style="width: 100%"
                class="weiliu-components-base-input-index-input"
                v-model="navList[activeIndex].link"
              >
                <a-select-option v-for="(item, index) in pages" :value="index" :key="'j'+index">
                  {{item.content.title}}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>
      <div class="second" v-if="activeTab==='second'" @click="toggleTab('second')">
        <div class="container">
          <div class="part">
            颜色
          </div>
          <div class="pageColor line-item">
            <span class="label">名称</span>
            <div class="colorSelect">
              <p>{{site.bottomNav.color}}</p>
              <el-color-picker
                size="mini"
                class="changeColor"
                v-model="titleColor"
              ></el-color-picker>
            </div>
            <div class="reset" @click="resetColor('color')">
              <img
                src="@/assets/img/decoration/reset.png"
                alt=""
                class="resetButton"
              />
            </div>
          </div>
          <div class="pageColor line-item">
            <span class="label">选中名称</span>
            <div class="colorSelect">
              <p>{{site.bottomNav.activeColor}}</p>
              <el-color-picker
                size="mini"
                class="changeColor"
                v-model="activeColor"
              ></el-color-picker>
            </div>
            <div class="reset" @click="resetColor('activeColor')">
              <img
                src="@/assets/img/decoration/reset.png"
                alt=""
                class="resetButton"
              />
            </div>
          </div>
          <div class="pageColor line-item">
            <span class="label">背景</span>
            <div class="colorSelect">
              <p>{{site.bottomNav.background}}</p>
              <el-color-picker
                size="mini"
                class="changeColor"
                v-model="navBackground"
              ></el-color-picker>
            </div>
            <div class="reset" @click="resetColor('background')">
              <img
                src="@/assets/img/decoration/reset.png"
                alt=""
                class="resetButton"
              />
            </div>
          </div>
          <!-- <div class="line-item">
            <span class="label">标题</span>
            <a-radio-group v-model="titleColor">
              <a-radio value="#fff">白色</a-radio>
              <a-radio value="#000">黑色</a-radio>
            </a-radio-group>
          </div> -->
        </div>
      </div>
    </div>
    <icon-material :visible="visible" @select="handleSelect" @cancel="handleCancel"></icon-material>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex';
import draggable from "vuedraggable";
import iconMaterial from '../IconMaterial.vue'

export default {
  components: {draggable, iconMaterial},
  data() {
    return {
      activeTab: 'first',
      listOptions: {
        sort: true,
        filter: 'div.add',
      },
      visible: false,
      operation: 'edit',
    }
  },
  computed: {
    ...mapState({
      site: state=>state.site.site,
      pages: state=>state.site.pages,
      pageIndex: state=>state.site.pageIndex,
      editIndex: state=>state.site.editIndex,
      components: state=>state.site.components,

    }),
    status: {
      get(){
        return Boolean(Number(this.site.bottomNav.status))
      },
      set(value) {
        let key = value ? '1':'0';
        this.$set(this.site.bottomNav, 'status', key);
      }
    },
    navList:{
      get(){
        return this.site.bottomNav.navList
      },
      set(value) {
        this.$set(this.site.bottomNav, 'navList', value);
      }
    },
    activeIndex: {
      get(){
        return Number(this.site.bottomNav.activeIndex)
      },
      set(value) {
        this.$set(this.site.bottomNav, 'activeIndex', value);
      }
    },
    navBackground:{
      get(){
        return this.site.bottomNav.background
      },
      set(value) {
        this.$set(this.site.bottomNav, 'background', value);
      }
    },
    titleColor: {
      get(){
        return this.site.bottomNav.color
      },
      set(value) {
        this.$set(this.site.bottomNav, 'color', value);
      }
    },
    activeColor: {
      get(){
        return this.site.bottomNav.activeColor
      },
      set(value) {
        this.$set(this.site.bottomNav, 'activeColor', value);
      }
    }

  },
  methods: {
    onChange() {},
    toggleTab(name) {
      this.activeTab = name
    },
    navColorSetting(val) {
      console.log(val)
      this.$set(this.site.bottomNav, 'background', val);

    },
    resetColor(attr) {
      this.$set(this.site.bottomNav, attr, '#fff');
    },
    deleteItem(e, index) {
      e.stopPropagation();
      this.activeIndex -= 1;
      this.navList.splice(index, 1);
    },
    handleClick(index){
      this.activeIndex = index
    },
    handleAdd() {
      this.operation = 'add';
      this.visible = true;
    },
    handleSelect(obj) {
      delete obj.checked;
      let item = {
        ...obj,
        link: this.navList[this.activeIndex].link
      };
      if(this.operation === 'add'){
        this.navList.push(item)
        this.activeIndex = this.navList.length-1;
      }else if(this.operation === 'edit') {

        this.navList.splice(this.activeIndex, 1, item);
        this.activeIndex = this.navList.length-1;
      }
      
      this.visible = false;
    },
    handleCancel(){
      this.visible=false;
      this.activeIndex = 0;
    }
  }
}
</script>
<style lang="scss">


.ant-select-selection{
  height: 40px;
  // padding-left: 12px;
  background: rgba(248, 248, 248, 1);
  border-radius: 2px;
  border: 1px solid rgba(236, 236, 236, 1);
  color: #666666;
  line-height: 40px;
  .ant-select-selection__rendered{
    line-height: 40px;
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
      line-height: 28px;
      .description{
        color: #999;
      }
    }
    .first{
      .navl-ist-box {
        >div>span{
          display: flex;
          flex-wrap: wrap;
        }
        .navl-item {
          width:48px;
          height:48px;
          background:#FFFFFF;
          border:1px solid #ececec;
          margin: 10px 10px 10px 0;
          cursor: pointer;
          font-size:12px;
          @include flex(row, center, center);
          position: relative;
          &:hover:not(.add){
            background: rgba(0,0,0,.4);
            border:1px solid #EFEFEF!important;
            .close{
              display: block;

            }
          }
          &.active{
            border:2px solid #3351E7;
          }
          .close{
            width: 18px;
            height: 18px;
            position: absolute;
            top: -8px;
            right: -8px;
            background: url('../../assets/img/decoration/close.png') no-repeat;
            background-size: cover;
            z-index: 999;
            display: none;
          }
        }
      }
      .navl-item-preview{
        cursor: pointer;
        &:hover{
          .mask{
            background:#3351e7;
            color: #fff;
          }
        }
        .preview-imgs{
          width: 100%;
          height: 136px;
          background: #f8f8f8;
          margin-top: 10px;
          @include flex(row, space-around, center);
          color: #999;
          .img-item{
            img{
              width: 56px;
              height: 56px;
            }
            
            @include flex(column, space-around, center)

          }
        }
        .mask{
          width:100%;
          height:36px;
          background:#2B2F32;
          opacity:0.9;
          text-align: center;
          color: #fff;
          line-height: 36px;
          margin-bottom: 10px;
          
        }
      }
      .input-wapper{
        margin: 15px 0;
        .drawerBox{
          width: 100%;
          height: 50px;
          @include flex(row, space-between, center);
          span{
            display: block;
            width: 50px;
          }
          input{
            // width: 100%;
            height: 40px;
            padding-left: 12px;
            background: rgba(248, 248, 248, 1);
            border-radius: 2px;
            border: 1px solid rgba(236, 236, 236, 1);
            color: #666666
          }
          .error-input{
            border: 1px solid #FF515E!important;
          }
          .tips{
            font-size: 12px;
            height: 18px;
            color: #FF515E;
            margin: 10px 0;
          }

        }
      }
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
        .label {
          width: 60px;
        }
        .colorSelect {
          width: 200px;
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