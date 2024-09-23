<template>
  <div 
    class="btn-edit ui-edit"
    :data-code="content.code"
    v-if="aIndex === currentIndex">
    <el-input v-model="content.text"></el-input>
       
  </div>
</template>

<script>

  export default {
    name: 'Btn',
    props: {
      content: Object,
      oStyle: Object,
      aIndex: Number,
      currentIndex: Number
    },
    // components: {MaterialTest},
    data(){
      return {
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
