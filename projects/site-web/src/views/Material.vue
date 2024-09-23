<template>
  <div >
    <div class="title">素材管理</div>
    <div class="common_page_wapper">
      <a-tabs
        :default-active-key="1"
        tab-position="left"
        class="content_wapper"
      >
        <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
          <materialCom v-if="tab.name==='图片'" :requireCheck="true"></materialCom>
        </a-tab-pane>
      </a-tabs>
    </div>

    
  </div>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";
import materialCom from '../components/MaterialCom'
export default {
  components: {materialCom},
  data() {
    return {
      tabs: [
        {id:1, name:'图片'},
        {id:2, name:'图标'},
        {id:3, name:'音频'},
        {id:4, name:'视频'},
      ],
    };
  },
};
</script>

<style lang='scss' scoped>
@import '@/assets/css/mixin.scss';
.title{
  font-size:18px;
  color: #333;
  height: 38px;
  padding-left: 15px;
}
.common_page_wapper{
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  min-height: calc(100vh - 144px);
  padding: 24px 0;
  .content_wapper{
    min-height: calc(100vh - 192px);
    // .content_contaier{
    //   width: 100%;
    //   min-height: calc(100vh - 192px);
    //   .btn{
    //      padding: 24px 0 12px 40px;
    //      line-height: 38px;
    //   }
    //   @include flex(column, center, flex-start);
    //   .list_wapper{
    //     width: 100%;
    //     flex: 1;
    //     display: flex;
    //     flex-direction: column;
    //     background: #F7F8F8;
    //     .none_wapper{
    //       width: 100%;
    //       flex: 1;
    //       @include flex(column, center, center);
    //       .none_info{
    //         width: 300px;
    //         @include flex(column, center, center);

    //         > span{
    //           color: #999;
    //           line-height: 50px;
    //         }
    //       }
    //     }
    //     .img_list_wapper{
    //       padding: 0 30px;
    //       .list{
    //         display: flex;
    //         flex-wrap: wrap;
    //         .item.checked{
    //           border:1px solid #3351E7;
    //           box-shadow:4px 4px 16px 0px #e7e9ef;
    //           .cu_toolbar{
    //             display:block;
    //             background: no-repeat center/100% url('../assets/img/material/check.png');
    //           }
    //         }
    //         .item:hover:not(.checked){
    //           box-shadow:4px 4px 16px 0px #e7e9ef;
    //           border:1px dashed #3351E7;
    //           .cu_toolbar{
    //             display:block;
    //             background: no-repeat center/100% url('../assets/img/material/hover-check.png');
    //           }
    //         }
    //         .item{
    //           width: 144px;
    //           height: 210px;
    //           margin: 20px;
    //           background:#FFFFFF;
    //           position: relative;
    //           cursor: pointer;
    //           .cu_toolbar{
    //             position: absolute;
    //             top: -2px;
    //             left: -2px;
    //             width: 24px;
    //             height: 24px;
                
    //             display: none;
    //           }
    //           .imgOuter{
    //             width: 142px;
    //             height: 144px;
                
    //           }
    //           .text_box{
    //             height: 66px;
    //             @include flex(column, space-around, center);
    //             line-height: 33px;
    //             color: #333333;

    //             .op{
    //               width: 100%;
    //               color: #999;
    //               height: 33px;
    //               box-sizing: border-box;
    //               @include flex(row, space-around, center);
    //               &:hover{
    //                 background: rgba(0,0,0, .3);
    //                 color: #fff;
    //               }
    //               .button{
    //                 flex: 1;
    //                 text-align: center;
    //                 &:hover{
    //                   color: #2589ff;
    //                 }
    //               }
    //               .split{
    //                 width: 1px;
    //                 height: 14px;
    //                 background: #ccc;
    //               }
    //             }
    //           }
              
    //         }
    //       }
    //       .pages{
    //         @include flex(row, flex-end, center);
    //         height: 60px;
    //         padding: 30px;
    //       }
    //     }
    //   }
    // }
  }
  
}
</style>
