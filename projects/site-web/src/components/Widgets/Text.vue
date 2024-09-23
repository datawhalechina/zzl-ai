<template>
  <div class="widget">
    <div 
      class="text-box ui-sortable relative textActive"
      :class="[
        aIndex == editIndex ? 'active' : '',
      ]"
      :style="oStyle"
      @mouseenter="delFlag=aIndex"
      @mouseleave="delFlag=-1"
    >
      <p 
        class="showtext"
        >
       {{ content.text }}
      </p>
      <DeleteCp :visible="delFlag === aIndex" :delIndex="aIndex"></DeleteCp>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DeleteCp from "@/components/DeleteCp";

export default {
name: 'TextCom',
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
      delFlag: -1
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

<style lang='scss' scoped>
.active {
  border: 2px solid #3351e7;
}

//文本框模块
.textActive {
  background-color: #ffffff;
  padding: 10px;
  position: relative;
  box-sizing:border-box;
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
.PicActive:hover {
  border: #3351e7 1px dashed;
}
.PicActive {
  height: 210px;
  background-color: #f8fbff;
  position: relative;
  box-sizing:border-box;

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
</style>