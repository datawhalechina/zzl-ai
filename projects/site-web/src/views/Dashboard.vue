<template>
  <div class="common_page_wapper">
    <div>测试</div>
  </div>
</template>

<script>
// import {createDefaultSite, fetchPages} from '@/api/decoration'
// import {overview} from '@/api/dashboard'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {

    }
  },
  mounted(){
    this.fetchData()
  },
  // watch: {
  //   site: {
  //     handler(newVal, oldVal){
  //       console.log('site:'+JSON.stringify(newVal))

  //       window.sessionStorage.setItem('siteData', JSON.stringify(newVal));
  //     },
  //     deep: true
  //   },
  //   pages: {
  //     handler(newVal, oldVal) {
  //       window.sessionStorage.setItem('pageData', JSON.stringify(newVal));
  //       this.$set(this.site, 'pages', newVal)
  //     },
  //     deep: true
  //   },
  //   components: {
  //     handler(newVal, oldVal){
  //       window.sessionStorage.setItem('localData', JSON.stringify(newVal));
  //       this.$set(this.pages[this.pageIndex], 'components', newVal)
  //       this.$set(this.site.pages[this.pageIndex], 'components', newVal)

  //     },
  //     deep: true
  //   },
  //   pageIndex: {
  //     handler(newVal, oldVal){
  //       let comData = this.pages[newVal].components?this.pages[newVal].components:[]
  //       this.$store.commit('site/setState', {name: 'components', key: comData})
  //     },
  //     deep: true
  //   }
  // },
  computed:{
    ...mapState({
      site: state=>state.site.site,
      pages: state=>state.site.pages,
    })
  },
  methods: {
    fetchData() {
      this.$api.dashboard.overview().then((res) => {
        if(res.code === 10013){
          // 没有默认站点则建立默认站点
          this.handleCreateSite()
        }else {
          const siteInfo = res.data.siteInfo;
          siteInfo.topNav={
            type: 0,
            background: '#fff',
            title: '',
            titleColor: '#000',
            buttonColor: '#000'
          }
          this.$store.commit('site/setState', {name: 'site', key: siteInfo})
          // this.fetchPageList(siteInfo.id)
        }
      })

    },
    fetchPageList(siteId){
      this.$api.decoration.fetchPages({siteId: siteId}).then((res)=>{
        let pageList = res.data.pageList;
        // console.log(pageList)
        pageList.map((item) => {item.content={name:item.name,background: '#fff'}})
        // let pageIndex= pageList.filter(item=>isIndex===1).index
        this.$store.commit('site/setState', {name: 'pages', key: pageList})

      })
    },
    handleCreateSite(){
      let params = {
        name: '测试公司',
        industry: '测试行业'
      }
      this.$api.decoration.createDefaultSite(params).then((res) => {
        console.log(res);
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.common_page_wapper{
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  min-height: calc(100vh - 104px);
  padding: 24px;
}
</style>
