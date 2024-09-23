<template>
  <div class="content_contaier">
    <div class="btn">
      <a-upload
        name="file"
        class="avatar-uploader"
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        :customRequest="handleUpload"
      >
        <a-button> <a-icon type="upload" /> 上传</a-button>
      </a-upload>
      <div>仅支持jpeg、png两种格式，大小不超过3.0MB</div>
    </div>
    <!-- <br> -->
    <div class="list_wapper">
      <div class="none_wapper" v-if="list.length===0">
        <div class="none_info">
            <img src="@/assets/img/material/pic.png" alt="">
            <span>暂无图片，可点击左上角“上传图片”按钮添加</span>
        </div>

      </div>
      <div v-else class="img_list_wapper">
        <a-spin :spinning="loading">
          <div>
            <div class="btn" v-if="requireCheck">
              <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                全选
              </a-checkbox>
              <a-button @click="handleDelete">删除</a-button>
            </div>
            <div class="list">
              <div v-for="(item) in list" :key="item.id" @click="handleCheck(item)">
                <div class="item" :class="checkedList.indexOf(item.id)!==-1?'checked':''">
                  <div class="imgOuter" :style="{ background: 'no-repeat center/100% url('+item.path+')' }"></div>
                  <div class="text_box" >
                    <span>{{item.title}}</span>
                    <div class="op" v-if="requireCheck">
                      <div class="button" @click="(e)=>handleRename(e, item.id)">改名</div>
                      <div class="split"></div>
                      <div class="button" @click="(e)=>handlePreview(e, item.path)">预览</div>

                    </div>
                  </div>
                  <div class="cu_toolbar"></div>
                </div>
              </div>
            </div>
            <div class="pages">
              <a-pagination
                v-model="pagaination.current"
                :page-size-options="pageSizeOptions"
                :total="pagaination.total"
                show-size-changer
                :page-size="pagaination.size"
                @showSizeChange="onShowSizeChange"
                @change="onChange"
              >
                <template slot="buildOptionText" slot-scope="props">
                  <span v-if="props.value !== '100'">{{ props.value }}条/页</span>
                  <span v-if="props.value === '100'">全部</span>
                </template>
              </a-pagination>
            </div>
          </div>


        </a-spin>
      </div>
    </div>
    <a-modal width="380px" v-model="visible" title="修改名称" @ok="handleRenameOk" @cancel="visible = false">
      <a-input v-model="newName"></a-input>

    </a-modal>
    <a-modal
      width='800px'
      :title="null"
      :visible="imgVisible"
      :footer="null"
      wrapClassName="preview_wapper"
      @cancel="imgVisible = false"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="800"/>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";
import { getOSSToken, pagainationList, deleteResource, renameResource } from "@/api/picture";

export default {
  props: {
    requireCheck: true,
  },
  data() {
    return {
      imageUrl: "",
      aliyunOssToken: {},
      tabs: [
        {id:1, name:'图片'},
        {id:2, name:'图标'},
        {id:3, name:'音频'},
        {id:4, name:'视频'},
      ],
      list: [],
      visible: false,
      loading: true,
      pagaination: {
        current: 1,
        size: 15,
        total: 0,
      },
      pageSizeOptions: ['15', '30', '50', '80', '10'],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      itemId: '',
      newName: '',
      imgVisible: false,
    }
  },
  computed:{
    ...mapState({
      site: state=>state.site.site,
      pages: state=>state.site.pages,
    })
  },
  watch: {
    visible(val) {
      if(!val){
        this.newName = '';
        this.itemId= ''
      }
    },
    imgVisible(val) {
      if(!val){
        this.imageUrl = '';
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true
      let params = {
        current: this.pagaination.current,
        resourceType: 1,
        size: this.pagaination.size,
        stId: this.site.id
      };
      //* 向服务器请求资源列表
      // this.loading = true
      this.$api.picture.pagainationList(params).then(res => {
        this.loading = false;
        let imgListTemp = [];
        let records = res.data.records;
        this.pagaination.current = res.data.current;
        this.pagaination.total = res.data.total;

        // * 将返回记录中相关信息赋值到 this.imgList
        records.forEach((r, i) => {
          imgListTemp[i] = {};
          this.$set(imgListTemp[i], "id", r.id);
          this.$set(imgListTemp[i], "title", r.name);
          this.$set(imgListTemp[i], "path", r.relativeUrl);
          // this.$set(imgListTemp[i], "checked", false);
          // console.log(imgListTemp[i]);
        });
        this.list = imgListTemp;
      });
    },
    onChange(current, pageSize) {
      this.pagaination.current = current;
      this.loading = true
      this.fetchData();
    },
    onShowSizeChange(current, pageSize) {
      this.pagaination.size = pageSize;
      this.loading = true
      this.fetchData();
    },
    handleCheck(item){  // 点击图片checked切换
      let {id} = item;
      if(this.requireCheck){
        if(this.checkedList.indexOf(id) === -1){
          this.checkedList.push(this.list.filter(item=>item.id===id)[0].id);   // 选中 push特定id
        } else {
          this.checkedList.splice(this.checkedList.indexOf(id), 1);   // 取消选中 删除特定id
        }

        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.list.length;
        this.checkAll = this.checkedList.length === this.list.length;
      } else {
        this.checkedList= [item.id];
        this.$emit('select', item.path);
      }


    },
    onCheckAllChange(e) {  // 点击全选按钮全选
      const allIds = this.list.map(item=> item.id);

      Object.assign(this, {
        checkedList: e.target.checked ? allIds : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });

    },
    handleDelete() {  // 删除
      let params = {
        stId:this.site.id,
        resourceIds: this.checkedList,
      }
      this.$api.picture.deleteResource(params).then((res)=>{
        // console.log(res)
        if(res.code === 0){
          if(this.list.length === this.checkedList.length && this.pagaination.current>1 ){ // 当前页面图片全部删除时，删除后需要自动翻到前一页面
            this.pagaination.current-=1;
          }
          this.$message.success('删除成功');
          this.fetchData();
        }
      })
    },
    handleRename(e, id) {
      e.stopPropagation();
      this.itemId = id
      this.visible = true
    },
    handlePreview(e, path){
      e.stopPropagation();

      this.imgVisible = true;
      this.imageUrl = path;
    },
    handleRenameOk(){
      this.visible = false;
      this.loading = true
      let params = {
        resourceId: this.itemId,
        stId: this.site.id,
        name: this.newName,
      }
      this.$api.picture.renameResource(params).then((res) => {
        this.loading = false
        this.$message.success('重命名成功');
        this.fetchData();
      })

    },
    handleCancel() {},
    getSignature() {
      return new Promise((resolve)=> {
        let params = {
          stId: this.site.id,
          uploadType: 1
        };
        this.$api.picture.getOSSToken(params).then(res => {
          let obj = res.data;
          let aliyunOssToken = {
            host: obj["host"],
            policy: obj["policy"],
            accessid: obj["accessid"],
            signature: obj["signature"],
            expire: parseInt(obj["expire"]),
            callbackbody: obj["callback"],
            key: obj["dir"]
          };
          resolve(aliyunOssToken)
        });
      })
    },
    handleUpload(file) {
      this.getSignature().then((aliyunOssToken)=>{
        let filename = file.file.name
        var formData = new FormData();

        //注意formData里append添加的键的大小写
        formData.append("key", aliyunOssToken.key +file.file.uid +'/'+ filename); //存储在oss的文件路径
        formData.append("callback", aliyunOssToken.callbackbody); //callbacks
        formData.append("OSSAccessKeyId", aliyunOssToken.accessid); //accessKeyId
        formData.append("policy", aliyunOssToken.policy); //policy
        formData.append("Signature", aliyunOssToken.signature); //签名
        formData.append("file", file.file);
        // file.onProgress();
        this.loading = true
        axios({
          url: aliyunOssToken.host,
          method: "post",
          data: formData // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(res => {
          let { data } = res.data;
          let path = data.src
          let imgObj = {
            "id": data.resourceId,
            "title": path.substring(path.lastIndexOf("/")+1),
            "path": path,
            "checked": false,
          }
          this.loading = false;
          // this.list.unshift(imgObj);
          this.fetchData()
          file.onSuccess() //上传成功
        })
        .catch(err => {
          this.loading = false;

          file.onError() //上传失败
          console.error(err);
        });
      });

    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const limitSize = 3 * 1024 *1024;
      const isLt3M = file.size / limitSize < 1;
      if (!isLt3M) {
        this.$message.error("Image must smaller than 3MB!");
      }
      return isJpgOrPng && isLt3M;
    }
  }
}
</script>
<style lang="scss">
  .content_wapper{
    .ant-tabs-content{
      padding: 0;
      margin: 0;
    }
  }
  .preview_wapper{
    .ant-modal-body{
      padding: 0px;

    }
  }
</style>
<style lang='scss' scoped>
@import '@/assets/css/mixin.scss';

.content_contaier{
  width: 100%;
  min-height: calc(100vh - 192px);
  .btn{
      padding: 24px 0 12px 40px;
      line-height: 38px;
  }
  @include flex(column, center, flex-start);
  .list_wapper{
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #F7F8F8;
    .none_wapper{
      width: 100%;
      flex: 1;
      @include flex(column, center, center);
      .none_info{
        width: 300px;
        @include flex(column, center, center);

        > span{
          color: #999;
          line-height: 50px;
        }
      }
    }
    .img_list_wapper{
      padding: 0 30px;
      .list{
        display: flex;
        flex-wrap: wrap;
        .item.checked{
          border:1px solid #3351E7;
          box-shadow:4px 4px 16px 0px #e7e9ef;
          .cu_toolbar{
            display:block;
            background: no-repeat center/100% url('../assets/img/material/check.png');
          }
        }
        .item:hover:not(.checked){
          box-shadow:4px 4px 16px 0px #e7e9ef;
          border:1px dashed #3351E7;
          .cu_toolbar{
            display:block;
            background: no-repeat center/100% url('../assets/img/material/hover-check.png');
          }
        }
        .item{
          width: 144px;
          height: 210px;
          margin: 20px;
          background:#FFFFFF;
          position: relative;
          cursor: pointer;
          .cu_toolbar{
            position: absolute;
            top: -2px;
            left: -2px;
            width: 24px;
            height: 24px;

            display: none;
          }
          .imgOuter{
            width: 142px;
            height: 144px;

          }
          .text_box{
            height: 66px;
            @include flex(column, space-around, center);
            line-height: 33px;
            color: #333333;

            .op{
              width: 100%;
              color: #999;
              height: 33px;
              box-sizing: border-box;
              @include flex(row, space-around, center);
              &:hover{
                background: rgba(0,0,0, .3);
                color: #fff;
              }
              .button{
                flex: 1;
                text-align: center;
                &:hover{
                  color: #2589ff;
                }
              }
              .split{
                width: 1px;
                height: 14px;
                background: #ccc;
              }
            }
          }

        }
      }
      .pages{
        @include flex(row, flex-end, center);
        height: 60px;
        padding: 30px;
      }
    }
  }
}
</style>
