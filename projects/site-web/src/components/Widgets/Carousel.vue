<template>
  <div class="widget">
    <div 
      class="ui-sortable"
      :class="[
        aIndex == editIndex ? 'active' : '',
      ]"
      :style="oStyle"
      @mouseenter="delFlag=aIndex"
      @mouseleave="delFlag=-1"
    >
      <div class="mask" v-if="content.title">{{content.title}}</div>
      <a-carousel autoplay dots >
        <div
          slot="prevArrow"
          slot-scope="props"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
        >
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div v-if="content.list.length === 0">
          <img :src="require('../../assets/img/decoration/default-bg.png')" alt="" style="width:100%;height:100%">
        </div>
        <div v-for="(item, index) in content.list" :key="'j'+index" v-else :style="{'overflow': 'hidden','height':oStyle.height}">
          <img :src="item" alt="" style="width:100%;height:100%">
          
        </div>
      </a-carousel>
      <DeleteCp :visible="delFlag === aIndex" :delIndex="aIndex"></DeleteCp>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DeleteCp from "@/components/DeleteCp";

export default {
  name: 'CarouselCom',
  props: {
    content: Object,
    oStyle: Object,
    aIndex: Number
  },
  components: {
    DeleteCp
  },
  data(){
    return {
      delFlag: -1,
    }
  },
  computed: {
    ...mapState({
      editIndex: state=>state.site.editIndex
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.widget{
  width: 100%;
  height: 210px;
  box-sizing:border-box;
  .ui-sortable{
    width: 100%;
    height: 100%;
    box-sizing:border-box;
    position: relative;
    &:hover {
      border: #3351e7 1px dashed;
    }
    &.active {
      border: 2px solid #3351e7;
    }
  }
}



.mask{
  width: 100%;
  height: 38px;
  background:linear-gradient(270deg,rgba(39,57,74,0) 0%,rgba(42,62,82,1) 100%);
  opacity:0.95;
  position: absolute;
  bottom: 0px;
  color: #fff;
  line-height: 38px;
  box-sizing: border-box;
  padding: 0 10px;
  text-align: left;
  z-index: 999;
}

</style>