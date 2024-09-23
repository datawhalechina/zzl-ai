<template>
  <div class="edit-wrapper" :data-code="content.code" v-if="aIndex === currentIndex">
    <div class="content-edit-wrapper" v-if="activeTab==='first'" @click="handleTabChange('first')">
      <section class="part-1" style="padding-left:0">
        <span class="part-1-title">选择图片</span>
        <div class="part-1-preview"  @click="handleChange">
          <img :src="content.url?content.url:require('../../assets/img/decoration/default-bg.png')" class="part-1-preview-img" />
          <div class="mask">{{content.url?'更换':'选择'}}图片</div>
          <!-- <input type="file" @change="handleChange"> -->
        </div>
      </section>
      <click-event @change="handleEventChange" @tel="handleTel" @link="handleLink"></click-event>


    </div>
    <div v-if="activeTab==='second'" @click="handleTabChange('second')">
      <!-- 样式设置 -->
      <div class="edgeSetting">
        <div>边距</div>
        <div class="edge">
          <span class="demonstration">上下边距</span>
          <a-slider
            :max="30"
            class="slider"
            :default-value="parseInt((oStyle['padding-top'] || '0px').split('px')[0])"
            @change="sliderTop"
          />
          <div class="edgeShow">{{ oStyle["padding-top"] || '0px' }}</div>
        </div>
        <div class="edge">
          <span class="demonstration">左右边距</span>
          <a-slider
            :max="30"
            class="slider"
            :default-value="parseInt((oStyle['padding-left'] || '0px').split('px')[0])"
            @change="sliderLeft"
          />
          <div class="edgeShow">{{ oStyle['padding-left'] || '0px' }}</div>
        </div>
      </div>
    </div>
    <a-modal width="1030px" v-model="visible" title="我的图片" @ok="handleOk">
      <materialCom :requireCheck="false" @select="handleSelect"></materialCom>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import clickEvent from "@/components/ClickEvent";
import materialCom from '@/components/MaterialCom'



function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
  export default {
    name: 'Btn',
    props: {
      content: Object,
      oStyle: Object,
      aIndex: Number,
      currentIndex: Number,
      activeTab: String
    },
    components: {clickEvent, materialCom},
    data(){
      return {
        // mStyle: {
        //   'padding-top': '0px',
        //   'padding-left': '0px'
        // },
        visible:  false,
        imageUrl: ''
      }
    },
    computed: {
      ...mapState({
        editIndex: state=>state.site.editIndex,
        components: state=>state.site.components,
      })
    },
    methods: {
      handleTabChange(name){
        this.$emit('changeTab', name)
      },
      handleChange(e) {
        // getBase64(e.target.files[0], imageUrl => {
        //   this.setUrl(imageUrl)
        // });
        this.visible = true;
      },
      setUrl(imageUrl){
        this.$set(this.components[this.editIndex].content, 'url', imageUrl);
      },
      sliderTop(value) {
        // this.mStyle['padding-top'] = value+'px'
        // this.mStyle['padding-bottom'] = value+'px'

        this.setStyle(value+'px', 'padding-top')
        this.setStyle(value+'px', 'padding-bottom')

      },
      sliderLeft(value){
        // this.mStyle['padding-left'] = value+'px'
        // this.mStyle['padding-right'] = value+'px'

        this.setStyle(value+'px', 'padding-left')
        this.setStyle(value+'px', 'padding-right')
      },
      setStyle(value, style){
        this.$set(this.components[this.editIndex].style, style, value);
      },
      handleEventChange(value) {
        this.$set(this.components[this.editIndex].event, 'type', value);
      },
      handleTel(value) {
        this.$set(this.components[this.editIndex].event, 'tel', value);
      },
      handleLink(value){
        this.$set(this.components[this.editIndex].event, 'linkId', value);
      },
      handleOk() {
        this.visible = false;
        this.setUrl(this.imageUrl);
      },
      handleSelect(url) {
        this.imageUrl = url;
      }
    }
  }
</script>

<style lang='scss' scoped>
.edit-wrapper{
  margin: 20px 0;
  .part-1-preview{
    position: relative;
    overflow: hidden;
    cursor:pointer;
    &:hover{
      .mask{
        background:#3351e7;
        color: #fff;
      }
    }
    .mask{
      width:306px;
      height:36px;
      background:#2B2F32;
      opacity:0.9;
      position: absolute;
      bottom: 0px;
      text-align: center;
      color: #fff;
      line-height: 36px;
      // &:hover{
      //   background:#3351e7;
      //   color: #fff;
      // }
    }

    input{
			position: absolute;
			top:0;
			left: 0;
			opacity: 0;
		}
  }
  .edgeSetting {
    &>div{
      margin: 10px 0;
    }
    .edge {
      width: 306px;
      display: flex;
      align-content: center;
      justify-content: space-around;
      .slider {
        width: 170px;
      }
      .edgeShow {
        width: 56px;
        height: 32px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(236, 236, 236, 1);
        line-height: 32px;
        text-align: center;
      }

      .demonstration {
        align-self: center;
        font-size: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        margin-right: 5px;
      }
    }
  }
}



/* TAG: 第二部分 */
/* //*文字标题-添加图片 */
span.part-1-title {
  display: block;
  margin-bottom: 16px;
  font-size: 14px;
  color: #333;
}

/* //*添加图片的按钮 */
img.part-1-add-img {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(236, 236, 236, 1);
}
img.part-1-add-img:hover {
  cursor: pointer;
}

/* //*预览图片 */
img.part-1-preview-img {
  width: 306px;
  height: 174px;
  background: rgba(233, 242, 255, 1);
}

/* //*包裹第二部分的section */
section.part-1 {
  padding-left: 24px;
  margin-bottom: 24px;
}
</style>
