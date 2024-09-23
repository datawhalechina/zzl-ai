<template>
  <div 
    class="btn-box ui-sortable relative btnActive"
    :class="[
      aIndex == editIndex ? 'active' : '',
    ]"
    @mouseenter="delFlag=aIndex"
    @mouseleave="delFlag=-1"
  >
    <a-button 
      class="ui-btn"
      :style="oStyle">
      {{ content.text }}
    </a-button>
    <DeleteCp :visible="delFlag === aIndex" :delIndex="aIndex"></DeleteCp>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import DeleteCp from "@/components/DeleteCp";
  
  export default {
    name: 'BtnCom',
    props: {
      content: Object,
      oStyle: Object,
      aIndex: Number
    },
    components: {
      DeleteCp
    },
    data() {
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

<style lang='scss' scoped>
.active {
  border: 2px solid #3351e7;
}

.btnActive{
  color: #666;
}
.btnActive:hover {
  border: #3351e7 1px dashed;
}
</style>
