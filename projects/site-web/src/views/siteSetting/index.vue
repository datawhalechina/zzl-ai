<template>
  <div>
    <div class="main">
      <div class="left">
        <div
          :class="activeId === item.id ? 'active nav' : 'nav'"
          v-for="item in navList"
          :key="item.id"
          @click="setNav(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="container">
        <main-view></main-view>
      </div>
      <TopNavEdit v-if="activeId === '1'"></TopNavEdit>
      <BottomNavEdit v-if="activeId === '2'"></BottomNavEdit>

    </div>
  </div>
</template>

<script>
import mainView from '@/components/MainView'
import TopNavEdit from "@/components/Editors/TopNavEdit";
import BottomNavEdit from '@/components/Editors/BottomNavEdit'

export default {
  name: "Setting",
  components: { mainView, TopNavEdit, BottomNavEdit },
  data() {
    return {
      navList: [
        { id: '1', name: "顶部导航" },
        { id: '2', name: "底部导航" }
      ],
      activeId: this.$route.query.activeId,
      activeName: "",
      activePage: 1001,
      isStyle: true,
      activeComponent: "TopNav",
      navSetting: {}
    };
  },
  methods: {
    setNav(item) {
      this.activeId = item.id;
      this.$router.push({ path: "/site/setting?activeId="+item.id });
      // this.$router.push({})
    },
    changeButtonF() {
      if (this.isStyle) {
        this.isStyle = false;
      } else {
        this.isStyle = true;
      }
      console.log(this.textF.isStyle, "this.textF.isStyle");
    },
    //重置顶部导航背景颜色
    resetTopNavColorF() {
      
    },
    //修改顶部导航背景颜色
    topNavColorF() {}
  },
  
};
</script>
<style scoped lang="scss">
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

#dragItem {
  display: inline-block;
  margin: 16px;
}

.location {
  width: 375px;
  height: 50px;
  background: rgba(96, 120, 244, 1);
}
.drag {
  opacity: 0.7 !important;
}
.chosen {
  background-color: #3351e7 !important;
  opacity: 0.7 !important;
  color: #ffffff !important;
  width: 72px !important;
  height: 78px !important;
  text-align: center !important;
  font-size: 12px !important;
}
/* .no-move {
  transition: transform 0s;
} */
.ghost {
  opacity: 0.5;
  // background: #3351E7!important;
}
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.item {
  width: 300px;
  height: 50px;
  background-color: #42b983;
  color: #ffffff;
}
.test-group {
  display: flex;
}
.list-group-item {
  width: 300px;
  height: 50px;
  background-color: #cccccc;
  color: black;
  border: #ffffff solid 1px;
  position: relative;
}
.title {
  height: 56px;
}
.main {
  // display: flex;
  // justify-content: space-between;
  @include flex(row, space-between, center);
  background-color: #f8f8f8;
}
.left {
  width: 136px;
  background-color: #ffffff;
  min-height: calc(100vh - 56px);
  .nav {
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    &.active {
      background: #f2f4f6;
      color: #3351e7;
      border-right: 1px solid #3351e7;
    }
  }
  .ghostLeft {
    background-color: #3351e7;
    opacity: 0.7;
    color: #ffffff;
  }
  .dragType {
    width: 72px;
    height: 78px;
    background: rgba(242, 244, 246, 1);
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      text-align: center;
    }
  }
}

.middle {
  width: 375px;
  height: 667px;
  background: #fff;
  box-shadow: 0px 4px 16px 0px #e8eaf1;
  position: absolute;
  left: calc(50% - 187px);
  .navSetting {
    width: 375px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .phoneFunction {
      width: 85px;
      height: 32px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-right: 12px;
      .phoneList {
        padding-right: 12px;
        border-right: 1px solid #f6f6f6;
      }
    }
    .back {
      margin-left: 12px;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}

.right {
  width: 368px;
  background-color: #ffffff;
  min-height: calc(100vh - 56px);
}
//文本框模块
.textActive {
  max-width: 375px;
  // height: 20px;
  background-color: #ffffff;
  padding: 10px;
  position: relative;
  .delItem {
    width: 59px;
    height: 23px;
    background: rgba(252, 252, 252, 1);
    box-shadow: 0px 2px 5px 0px rgba(232, 234, 241, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 81, 94, 1);
    line-height: 23px;
    position: absolute;
    left: 375px;
    top: 10px;
  }
}
.textActive:hover {
  border: #3351e7 1px dashed;
}
.picActive:hover {
  border: #3351e7 1px dashed;
}
.picActive {
  max-width: 375px;
  height: 210px;
  background-color: #f8fbff;
  position: relative;
  .delItem {
    width: 59px;
    height: 23px;
    background: rgba(252, 252, 252, 1);
    box-shadow: 0px 2px 5px 0px rgba(232, 234, 241, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 81, 94, 1);
    line-height: 23px;
    position: absolute;
    left: 375px;
    top: 40px;
  }
}
//控制文本展示
.showtext {
  min-height: 20px;
  max-width: 355px;
  line-height: 20px;
  color: #3351e7;
  margin: 0;
  word-wrap: break-word;
}
.textbold {
  font-weight: 700;
}
.styleTitle {
  display: flex;
  justify-content: space-between;
  margin: 30px 24px;
  .styleName {
    display: flex;
    align-content: center;
    p {
      margin: 0 0 0 8px;
      width: 36px;
      height: 20px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      align-self: center;
    }
    img {
      align-self: center;
    }
  }
}
</style>
