<template>
  <div class="middle">
    <div>
      <img src="../assets/img/decoration/phoneTitle.png" alt />
    </div>
    <div v-if="pages[pageIndex]">
      <div class="navSetting" :style="{backgroundColor:site.topNav.background}">
        <img src="../assets/img/decoration/goback.png" alt class="back" />
        <div class="title" :style="{color: site.topNav.titleColor}">{{ !navUnify?pages[pageIndex].content.title:site.topNav.title }}</div>
        <div class="phoneFunction">
          <img
            src="../assets/img/decoration/phoneList.png"
            alt
            class="phoneList"
          />
          <img src="../assets/img/decoration/phoneClose.png" alt />
        </div>
      </div>
      <div :style="{background:pages[pageIndex].content.background}" class="phoneShow">
        <div>
          <draggable
            class="list-group"
            :group="{ name: 'widgets' }"
            v-bind="dragOptionsMiddle"
            :emptyInsertThreshold="800"
            @add="onAdd"
            @sort="onSort"
          >
            <transition-group type="transition" :name="'flip-list'">
              <div 
                v-for="(appUi,index) in components"
                :is="appUi.name"
                :content="appUi.content"
                :oStyle="appUi.style"
                :aIndex="index"
                @click.native="getIndex(index)"
                
                :key="'a'+index"></div>
            </transition-group>
          </draggable>
          <div class="bottomTab" :style="{background: bottomNav.background}" v-if="site.bottomNav ? Boolean(Number(site.bottomNav.status)):false">
            <div class="nav-item-wrap" 
              v-for="(item, index) in bottomNav.navList" 
              :key="'n'+index" 
              @click="handleClick(item, index)" 
              :style="{color:bottomNav.activeIndex===index?bottomNav.activeColor: bottomNav.color}">
                <img :src="bottomNav.activeIndex===index?require(`../assets/img/material/${item.activeIcon}.png`):require(`../assets/img/material/${item.icon}.png`)" alt="" width="21" height="21">
                <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import draggable from "vuedraggable";
import BtnCom from '@/components/Widgets/Btn.vue'
import TextCom from '@/components/Widgets/Text.vue'
import PicCom from '@/components/Widgets/Pic.vue'
import CarouselCom from '@/components/Widgets/Carousel.vue'




export default {
  components: {draggable, BtnCom, TextCom, PicCom, CarouselCom},
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      site: state=>state.site.site,
      pages: state=>state.site.pages,
      pageIndex:state=>state.site.pageIndex,
      components:state=>state.site.components,

    }),

    dragOptionsMiddle() {
      return {
        animation: 300,
        // group: "description",
        // disabled: !this.editable,
        ghostClass: "ghost",
        chosenClass: "chosenMiddle",
        dragClass: "dragMiddle"
      };
    },
    navUnify() {
      return  this.site.topNav.type===1 && this.site.topNav.title !== ''
    },
    bottomNav:{
      get(){
        return this.site.bottomNav;
      },
      set(value){
        this.$set(this.site, 'bottomNav', value);
      }
    }
  },
  methods: {
    onAdd (res) {
      // this.addCp(res)
      this.$store.dispatch('site/addCp',{components: this.components,res: res})
    },
    getIndex(index){
      this.$store.commit('site/setCommon',{index: index, flag: true});
      this.$store.commit('site/setActiveTab', 'first')

    },
    onSort(res){
      if (res.from === res.to){
        this.$store.dispatch('site/sortCp',res)
      }
    },
    handleClick(item,index){
      this.$set(this.site.bottomNav, 'activeIndex', index);
      let linkId = item.link

      // this.pages.map((item,pageIndex)=>{
      //   if(item.id == linkId){
          this.$store.commit('site/setState', {name: 'isComponent', key: false});

          this.$store.commit('site/setState', {name: 'pageIndex', key: linkId});
      //   }
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../assets/css/mixin.scss';

.active {
    border: 2px solid #3351e7;
}
.middle {
  width: 375px;
  min-height: 667px;
  background-color: #ffffff;
  // position: absolute;
  // left: calc(50% - 187px);
  
  .chosenMiddle {
    opacity: 0.7;
  }
  .phoneShow {
    min-height: 603px;
    width: 375px;
    position: relative;
    .bottomTab{
      position: absolute;
      bottom: 0;
      height: 50px;
      width: 100%;
      background: #F8F8F8;
      @include flex(row, center,center);
      .nav-item-wrap{
        flex:1;
        height: 100%;
        @include flex(column, center,center);
        font-size: 12px;
        cursor: pointer;
      }
      
    }
  }
  .navSetting {
    width: 375px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      font-size: 18px;
    }
    .phoneFunction {
      width: 85px;
      height: 32px;
      background: transparent;
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
    text-align: center;
    position: absolute;
    left: 100%;
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
  // color: #333333;
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