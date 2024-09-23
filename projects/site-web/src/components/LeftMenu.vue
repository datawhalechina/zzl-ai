<template>
  <div class="left">
    <div
      :class="[isComponent ? 'showStyle' : 'showContent', 'myButton']"
      @click="pageOrComponent"
    >
      <div class="show">页面</div>
      <div class="show">组件</div>
    </div>
    <div v-if="isComponent">
      <div class="com-wapper">
        <div class="title">常用组件</div>
        <draggable
          class="list-group"
          :list="list1"
          :group="{ name: 'widgets', put: false, pull: 'clone'}"
          v-bind="dragOptionsLeft"
          :clone="onClone"
        >
          <transition-group type="transition" :name="'flip-list'">
            <div
              class="dragType"
              id="dragItem"
              v-for="(element, index) in list1"
              :key="element.name + index"
              :type="element.type"
              :name="element.name"
              :description="element.description"
              :version='element.version'
            >
              <img
                :src="
                  require(`../assets/img/decoration/${element.name.split('Com')[0]}Test.png`)
                "
                style="width:32px;height:32px;display:block;margin:auto;"
              />
              <p>{{ element.description }}</p>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <div v-if="!isComponent" style="margin-top:24px">
      <div class="pagePart" v-if="pages.length>0">
        <div
          v-for="(element, index) in pages"
          :key="element.content.title + index"
          class="pageItem"
          :style="{ background: pageFlag == index ? '#F2F4F6' : '#FFFFFF' }"
          @mouseenter="showHandler(index)"
          @mouseleave="hideHandler()"
          @click="choosePage(index)"
        >
          <div class="pageN" :style="pageIndex == index ? { color: '#3351E7' }: { color: '#666666' }">
            <img
              src="../assets/img/decoration/pageList.png"
              alt
              style="margin-right:12px"
            />
            {{ element.content.title }}
          </div>
          <div
            v-if="element.isIndex == 1"
            style="font-size:12px;font-weight:400;margin-right:16px"
          >
            主页
          </div>
          <div v-if="pageFlag == index && element.isIndex != 1">
            <img
              src="../assets/img/decoration/index.png"
              alt
              @click="(event)=>setIndex(event,index)"
            />

            <img
              src="../assets/img/decoration/delPage.png"
              alt
              @click="(e)=>{handleDelete(e, index)}"
            />
          </div>
        </div>
      </div>
      <div class="add">
        <div class="addPage" @click="addNewPage">+ 新建页面</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import draggable from "vuedraggable";
import {addDecoratePage} from '@/api/decoration.js'
import { compare } from '@/utils/index'
export default {
  components: {draggable},
  data() {
    return {
      pageFlag: -1,
      list1: [
        { name: "TextCom", type: 0, description: "文本", version: "v1.0.0" },
        { name: "PicCom", type: 1, description: "图片", version: "v1.0.0" },
        // { name: "BtnCom", type: 2, description: "按钮", version: "v1.0.0" },
        { name: "CarouselCom", type: 3, description: "幻灯片", version: "v1.0.0" },

      ]
    }
  },
  computed: {
    ...mapState({
      isComponent: state=>state.site.isComponent,
      site: state=>state.site.site,
      pages: state=>state.site.pages,
      pageIndex: state=>state.site.pageIndex,
      components: state=>state.site.components,

    }),
    dragOptionsLeft() {
      return {
        animation: 300,
        // group: "description",
        // disabled: !this.editable,
        ghostClass: "ghostLeft",
        chosenClass: "chosen",
        dragClass: "drag",
        sort: false
      };
    },
  },
  methods: {
    onClone(e) {
      return JSON.parse(JSON.stringify(e));
    },
    pageOrComponent() {
      if (this.isComponent) {
        this.$store.commit('site/setState', {name:'isComponent',key: false});
      } else {
        this.$store.commit('site/setState', {name: 'isComponent', key: true});
      }
    },
    showHandler(index) {
      this.pageFlag = index;
    },
    hideHandler() {
      this.pageFlag = -1;
    },
    choosePage(index) { // 复制当前的组件到当前页面下，切换pageIndex,
      // this.$set(this.site.pages[this.pageIndex], 'components', this.components)
      this.$store.commit('site/setState', {name: 'pageIndex', key: index});
      this.$store.commit('site/setState', {name: 'editIndex', key: 0});

      let bottomNav = this.site.bottomNav
      // let activePageId = this.site.pages[this.pageIndex].id;
      if(Boolean(Number(bottomNav.status))){
        bottomNav.navList.map((item, index)=>{
          if(item.link==this.pageIndex){
            let activebottomTab = index;
            this.$set(this.site.bottomNav, 'activeIndex', activebottomTab);
          }
        })
      }


    },
    addNewPage() {
      this.$store.dispatch('site/addPage')
    },
    handleDelete(e, index){
      e.preventDefault();
      e.stopPropagation();
      // console.log(index)
      if(this.pageIndex === index){
        this.$store.commit('site/setState', {name: 'pageIndex', key: index-1}) // 如果删除的页面是当前激活页面则把当前激活页面index-1
      }
      this.$store.commit('site/delPage', index)
    },
    setIndex(event, index) {
      event.preventDefault()
      this.pages.forEach((item, itemIndex) => {
        if(itemIndex===index){
          item.isIndex = 1;
        }else {
          item.isIndex = 0;
        }
      });
      // this.pages.sort(compare('isIndex'))
      // this.choosePage(index)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/mixin.scss';


.left {
  width: 208px;
  background-color: #ffffff;
  min-height: calc(100vh - 56px);
  .com-wapper{
    padding: 16px;
  }
  .pagePart {
    position: relative;
    .pageItem {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #edf0f3;
      border-bottom: 1px solid #edf0f3;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      cursor: pointer;
      .pageN {
        display: flex;
        align-items: center;
        margin-left: 14px;
        font-weight: 400;
      }
    }
  }
  .add {
    height: 97px;
    width: 208px;
    @include flex(row, center, center);
    box-shadow: 0px -4px 8px 0px rgba(239, 240, 243, 0.32);
    position: absolute;
    bottom: 0;
    .addPage {
      @include flex(row, center, center);
      // position: absolute;
      // bottom: 0;
      cursor: pointer;
      width: 106px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid rgba(51, 81, 231, 1);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 81, 231, 1);
    }
  }

  .myButton {
    width: 178px;
    height: 32px;
    display: flex;
    justify-content: space-around;
    border: 1px solid #dddfe7;
    border-radius: 16px;
    box-sizing: border-box;
    margin-bottom: 16px;
    margin: 16px auto;

  }
  .show {
    width: 87px;
    @include flex(row, center, center);
    border-radius: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    cursor: pointer
  }
  .showContent {
    div:nth-child(1) {
      border: 1px solid #3351e7;
      background-color: #e3ebff;
      color: #3351e7;
    }
  }
  .showStyle {
    div:nth-child(2) {
      border: 1px solid #3351e7;
      background-color: #e3ebff;
      color: #3351e7;
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

.active {
  border: 2px solid #3351e7;
}
#dragItem {
  display: inline-block;
  margin: 8px;
  padding: 8px;
  box-sizing: border-box;
  // @include flex(column, center, center)
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
  // height: 56px;
  padding: 8px;
  color: #333;
}
.main {
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
}


</style>
