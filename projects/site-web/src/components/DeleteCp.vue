<template>
  <div class="delete-compontent-box" v-if="visible">
    <div
        class="delItem"
        @click="dailogStatu"
      >
        删除
    </div>
    
  </div>
</template>

<script>
  import { mapState } from "vuex";
  
  export default {
    name: 'DeleteCp',
    props: {
      visible: Boolean,
      delIndex: Number
    },
    data(){
      return {
      }
    },
    methods: {
      dailogStatu(){
        // this.$store.commit('site/setCommon',{flag: true, index: this.aIndex})
        const self  = this
        this.$confirm({
          title: "提示",
          content: "确定要删除此组件吗",
          onOk: function () {
            let flag = false;
            self.$store.commit('site/deleteCp',self.delIndex);
            self.$message.success("删除成功!");
            self.$store.commit('site/setCommon',{flag: false, index: 0})
          },
          onCancel: () => {
            this.$message.info("已取消删除");
          }
        });
      },
    }
  }
</script>

<style lang='scss' scoped>
 
  
  .delItem {
    cursor: pointer;
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
    top: 50%;
    margin-top: -11px;
  }
</style>
