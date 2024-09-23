<template>
  <div class="pageSetting" v-if="pages[pageIndex]">
    <div class="line">
      <p>页面名称</p>
      <a-input
        v-model="pages[pageIndex].content.title"
        placeholder="请输入页面名称，最多10个字"
        :maxLength="10"
        @change="NameInput"
      ></a-input>
    </div>
    <div class="line">
      <p>背景</p>
      <div class="pageColor">
        <div class="colorSelect">
          <p>{{ pages[pageIndex].content.background }}</p>
          <el-color-picker
            v-model="pages[pageIndex].content.background"
            size="mini"
            class="changeColor"
            @change="pageBgcolorSetting"
          ></el-color-picker>
        </div>
        <div class="reset" @click="resetPagecolor">
          <img
            src="../../assets/img/decoration/reset.png"
            alt=""
            class="resetButton"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "PageEdit",
  data() {
    return {
    };
  },
  computed:{
    ...mapState({
      pages: state=>state.site.pages,
      pageIndex: state=>state.site.pageIndex,
    })
  },
  methods: {
    pageBgcolorSetting(val) {
      this.setValue('background', val)
    },
    NameInput(e) {
      const value = e.target.value;
      this.setValue('title', value)
      
    },
    setValue(attr,value){
      this.$set(this.pages[this.pageIndex].content, attr, value);
    },
    resetPagecolor() {
      this.setValue('background', '#FFFFFF') 
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/mixin.scss";
.pageSetting {
  // padding-left: 24px;
  // padding-right: 38px;
  margin: 20px 0;
  .line{
    padding: 10px;
  }
  p {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 38px;
  }
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
}
</style>
<style lang="scss">
  .pageSetting .line .ant-input{
    width:100%;
    height:40px;
    background:rgba(248,248,248,1);
    border-radius:2px;
    border:1px solid rgba(236,236,236,1);
  }
</style>
