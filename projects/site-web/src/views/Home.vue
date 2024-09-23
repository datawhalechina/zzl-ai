<template>
  <div id="components-layout-demo-basic">
    <div class="layout">
      <div class="layout-header header">
        <div class="left">
          <svg-icon name="back" class="back" @click="handleBack"></svg-icon>
        </div>
        <div class="right">
          <a-button class="mr20" @click="handleSave">保存并继续</a-button>
          <a-button type="primary" @click="handlePubilsh">发布</a-button>
        </div>
      </div>
      <a-layout>
        <a-layout-sider width="80px" class="aside">
          <div class="chooseSetting" @click="gotoDecoration">
            <div class="choose">
              <img
                class="m5"
                :src="flag == 0 ? decorationChecked : decoration"
                alt
              />
              <div
                :style="flag == 0 ? { color: '#3351E7' } : { color: '#333333' }"
              >
                装修
              </div>
            </div>
          </div>
          <div class="chooseSetting" @click="gotoSetting">
            <div class="choose">
              <img class="m5" :src="flag == 1 ? settingChecked : setting" alt />
              <div
                :style="flag == 1 ? { color: '#3351E7' } : { color: '#333333' }"
              >
                设置
              </div>
            </div>
            <!-- <div @click="$router.push({ path: '/login' })">login</div> -->
          </div>
        </a-layout-sider>
        <a-layout-content>
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-modal :visible="visible" title="发布成功" @cancel="visible = false">
        <!-- <img id='image' :src="codeUrl"> -->
        <qriously :value="codeUrl" :size="200" />
      </a-modal>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import svgIcon from "../components/Icon/Index";
import { mapState } from 'vuex';
import { getIPAdress }from '@/utils/index.js'
// import {getSiteInfo, saveSiteInfo, sitePublish} from '@/api/decoration'

export default {
  name: "Home",
  components: { svgIcon },
  data() {
    return {
      flag: 0,
      setting: require("../assets/img/decoration/setting.png"),
      settingChecked: require("../assets/img/decoration/settingChecked.png"),
      decoration: require("../assets/img/decoration/decoration.png"),
      decorationChecked: require("../assets/img/decoration/decorationChecked.png"),
      visible: false,
      codeUrl: ''
    };
  },
  mounted() {
    this.flag = Number(this.$route.path === "/site/setting");
    this.fetchSiteInfo()
  },
  computed:{
    ...mapState({
      site: state=>state.site.site,
      pages: state=>state.site.pages,
      components: state=>state.site.components,
      pageIndex: state=>state.site.pageIndex
    }),
    // site:{
    //   get(){
    //     return this.$store.getters.site
    //   },
    //   set(newVal){
    //     console.log(newVal)
    //     window.sessionStorage.setItem('siteData', JSON.stringify(newVal));
    //   }
    // },
    // pages:{
    //   get(){
    //     return this.$store.getters.pages
    //   },
    //   set(newVal){
    //     window.sessionStorage.setItem('pageData', JSON.stringify(newVal));
    //     this.$set(this.site, 'pages', newVal)
    //   }
    // },
    // components:{
    //   get(){
    //     return this.$store.getters.components
    //   },
    //   set(newVal){
    //     console.log(newVal)
    //     window.sessionStorage.setItem('localData', JSON.stringify(newVal));
    //     this.$set(this.pages[this.pageIndex], 'components', newVal)
    //   }
    // }
  },
  watch: {
    site: {
      handler(newVal, oldVal){
        // console.log('site:'+JSON.stringify(newVal))

        window.sessionStorage.setItem('siteData', JSON.stringify(newVal));
      },
      deep: true
    },
    pages: {
      handler(newVal, oldVal) {
        // console.log('pages:'+JSON.stringify(newVal))
        window.sessionStorage.setItem('pageData', JSON.stringify(newVal));
      },
      deep: true
    },
    components: {
      handler(newVal, oldVal){
        let value = JSON.stringify(newVal)
        window.sessionStorage.setItem('localData', value);
        this.$set(this.pages[this.pageIndex], 'components', newVal)
      },
      deep: true
    },
    pageIndex: {
      handler(newVal, oldVal){
        console.log(newVal)
        let comData = this.pages[newVal].components?this.pages[newVal].components:[]
        this.$store.commit('site/setState', {name: 'components', key: comData})
      },
      deep: true
    }
  },
  methods: {
    handleBack() {
      this.$router.push('/');
    },
    gotoDecoration() {
      this.$router.push({ path: "/site/newdecoration" });
      this.flag = 0;
    },
    gotoSetting() {
      this.$router.push({ path: "/site/setting?activeId=1" });
      this.flag = 1;
    },
    fetchSiteInfo(){
      let params ={siteId: this.site.id}
      this.$api.decoration.getSiteInfo(params).then((res) => {
        const { data } = res
        if(data){
          this.$store.commit('site/setState', {name: 'site', key: data});
          let pages = data.pages;
          this.$store.commit('site/setState', {name: 'pages', key: pages});

          if(pages.length > 0) {
            let pageIndex;
            data.pages.forEach((element, index) => {
              if(Number(element.isIndex) === 1){
                pageIndex = index
              }
            });
            this.$store.commit('site/setState', {name: 'pageIndex', key: pageIndex});

            this.$store.commit('site/setState', {name: 'components', key: pages[this.pageIndex].components});
          }
        }
      })
    },
    handleSave() {
      let params = this.site
      return new Promise((resolve, reject)=>{
        this.$api.decoration.saveSiteInfo(params).then((res) => {
          if(res.code === 0){
            this.$message.success('保存成功！')
            resolve()
          }else{
            this.$message.error('保存失败');
            // reject()
          }
        })
      })

    },
    handlePubilsh() {
      /*
        带参数路由二维码，需要页面预览时可打开这段代码
        参考文档：https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/server/qr-code/create-qr-code
      */
      // this.$api.decoration.sitePublish(this.site.id).then((res) => {
      //   let access_token = res.data.access_token
      //   axios({
      //     url:'https://developer.toutiao.com/api/apps/qrcode',
      //     method: 'post',
      //     data: {
      //       access_token,
      //       appname: 'toutiao',
      //       path: encodeURI(`/pages/page0/page0?site=${this.site.id}`),
      //     },
      //     responseType: 'blob'
      //   }).then(res => {
      //     const data = res.data

      //     var bytes = new Uint8Array(data);
      //     var blob = new Blob([data], { type: "image/png" });
      //     var url = URL.createObjectURL(blob);
      //     this.visible=true
      //     this.codeUrl = url;
      //   })
      // })
      this.$api.decoration.sitePublish(this.site.id).then((res) => {
        this.visible=true
        const hostname =window.location.hostname;

        this.codeUrl = `http://${hostname}:10086/#/?siteId=${this.site.id}`;
      })

    },
  }
};
</script>
<style>
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #fff;
  /* color: #fff; */
}
#components-layout-demo-basic .ant-layout-sider {
  background: #fff;
  /* color: #fff; */
  /* line-height: 120px; */
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
</style>

<style lang="scss" scoped>
@import "../assets/css/mixin.scss";
.layout {
  .layout-header {
    height: 56px;
    background: #fff;
    box-shadow: 0px 8px 24px 0px #eef0f4;
    padding: 0 32px;
    @include flex(row, space-between, center);
    color: #666;
    border-bottom: 1px solid #edf0f3;
    .back {
      width: 16px !important;
      height: 16px !important;
      cursor: pointer;
    }
  }
}
.aside {
  .chooseSetting {
    position: relative;
    @include flex(column, center, center);
    box-sizing: border-box;
    height: 104px;
    border-bottom: 1px solid #edf0f3;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    cursor: pointer;
  }
  border-right: 1px solid #edf0f3;
}
#image{
  width: 100px;
  height: 100px;
  // position: absolute;
  // top: 0;
  // bottom: 0;
  z-index: 9990000;
}
</style>
