<template>
  <div class="topNav">
    <div class="topNavContent">
      <p class="part">
        导航标题
      </p>
      <div class="titleSelect">
        <a-radio-group @change="onChange" v-model="value">
          <a-radio :value="1">分别用各页面名称</a-radio>
          <a-radio :value="2">统一标题</a-radio>
        </a-radio-group>
      </div>
      <div v-if="value == 2">
        <a-input
          prefix="标题"
          placeholder="建议输入6个字以内"
          defaultValue="站点名称"
          @input="inputName"
        />
        <p class="tips" v-if="showTips">请输入标题名称</p>
      </div>
    </div>
    <div class="topNavStyle">
      <p class="part">
        颜色
      </p>
      <div class="pageColor">
        <div class="colorSelect">
          <p></p>
          <el-color-picker
            size="mini"
            class="changeColor"
            @change="navColorSetting"
          ></el-color-picker>
        </div>
        <div class="reset" @click="resetColor">
          <img
            src="../assets/img/decoration/reset.png"
            alt=""
            class="resetButton"
          />
        </div>
      </div>
      <div>
        <span class="color">标题</span>
        <a-radio-group @change="onChange" v-model="titleColor">
          <a-radio :value="1">白色</a-radio>
          <a-radio :value="2">黑色</a-radio>
        </a-radio-group>
      </div>
      <div>
        <span class="color">按键</span>
        <a-radio-group @change="onChange" v-model="buttonColor">
          <a-radio :value="1">白色</a-radio>
          <a-radio :value="2">黑色</a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextTest",
  props: {
    topnav: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: 1,
      showTips: false,
      titleColor: 1,
      buttonColor: 1
    };
  },
  watch: {
    topnav: {
      deep: true,
      immediate: true,
      handler(newVal) {
        console.log(newVal, "TopNavnewVal");
      }
    }
  },
  updated() {
    // console.log(this.message, "message");
  },
  methods: {
    onChange(e) {
      console.log("radio checked", e.target.value);
      this.$emit("chooseName", e.target.value);
    },
    inputName(e) {
      console.log("input checked", e.target.value);
      if (!e.target.value) {
        this.showTips = true;
      } else {
        this.showTips = false;
      }
    },
    navColorSetting(val) {
      this.$emit("topNavColor", val);
    },
    resetColor() {
      this.$emit("resetTopNavColor");
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/mixin.scss";
.topNav {
  padding-left: 24px;
  padding-right: 38px;
  .part {
    margin-top: 16px;
  }
  .topNavContent {
    .titleSelect {
      margin-top: 16px;
      margin-bottom: 16px;
    }
    .ant-input {
      padding-left: 60px;
      .ant-input-affix-wrapper .ant-input:not(:first-child) {
        padding-left: 60px !important;
      }
    }
    .tips {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 149, 66, 1);
    }
  }
  .topNavStyle {
    .pageColor {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
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
}
</style>
