<template>
  <div class="edit-wrapper" :data-code="content.code" v-if="aIndex === currentIndex">
    <div class="content-edit-wrapper" v-if="activeTab==='first'" @click="handleTabChange('first')">
      <section class="part-1" style="padding-left:0">
        <span class="part-1-title">选择图片</span>
        <span class="part-1-sub-title">最多添加 10 个图片，鼠标拖拽调整图片顺序</span>
        <div class="part-1-list">
          <draggable v-model="content.list" v-bind="listOptions">
            <transition-group type="transition" :name="'flip-list'">
              <div class="part-1-item" v-for="(item, index) in content.list" :key="'i'+index" @click="changeIndex(index)" :class="index === content.index?'checked':''">
                <img :src="item" alt="">
                <div class="close" @click="(e)=>deleteItem(e, index)"></div>
              </div>
              <div class="part-1-item add" @click="handleAdd" v-if="content.list.length<10" key="i--1">
                <a-icon type="plus" />
              </div>
            </transition-group>
          </draggable>
          
          
        </div>
        <div class="part-1-preview">
          <img :src="content.list[content.index]?content.list[content.index]:require('../../assets/img/decoration/default-bg.png')" class="part-1-preview-img" />
          <div class="mask" @click="handleChange(content.index)">{{content.list[content.index]?'更换':'选择'}}图片</div>
        </div>
      </section>

      <div class="text-input mb20">
        <a-input
          prefix="标题"
          placeholder="建议输入6个字以内"
          :maxLength='10'
          v-model="content.title"
        />
      </div>
      <click-event @change="handleEventChange" @tel="handleTel"></click-event>

    </div>
    <div v-if="activeTab==='second'" @click="handleTabChange('second')">
      <!-- 样式设置 -->
      <div class="edgeSetting">
        <div>高度</div>
        <div class="edge">
          <span class="demonstration">组件高度</span>
          <a-slider
            :max="600"
            :min='20'
            class="slider"
            :default-value="parseInt((oStyle['height'] || '0px').split('px')[0])"
            @change="sliderHeight"
          />
          <div class="edgeShow">{{ oStyle["height"] || '0px' }}</div>
        </div>
      </div>
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
    <a-modal width="1030px" v-model="visible" title="我的图片" @ok="handleOk" @cancel="visible = false">
      <materialCom :requireCheck="false" @select="handleSelect"></materialCom>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from "vuedraggable";
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
    components: {clickEvent, materialCom, draggable},
    data(){
      return {
        // mStyle: {
        //   'padding-top': '0px',
        //   'padding-left': '0px'
        // },
        listOptions: {
          sort: true,
          filter: 'div.add',
        },
        visible:  false,
        itemIndex: 0,
        list: [],
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
      setCarouselItem(list, index){
        this.$set(this.components[this.editIndex].content, 'list', list);
        this.$set(this.components[this.editIndex].content, 'index', index);
      },
      sliderHeight(value){
        this.setStyle(value+'px', 'height')
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
      handleChange(index) {  // 更换图片
        this.visible = true;
        this.itemIndex = index;
      },
      handleAdd(){  // 添加图片
        if(this.content.list.length===10){
          this.$message.warning('最多只能添加十张图片，请删除后添加');
        } else {
          this.visible = true;
          this.itemIndex = -1
        }
      },
      deleteItem(e, index) {
        let list = this.content.list;
        list.splice(index, 1)  // 删除
      },
      changeIndex(index) {  // 选择幻灯片
        this.$set(this.components[this.editIndex].content, 'index', index);
      },
      handleSelect(url) {  // 选择我的图片
        let list = [];
        Object.assign(list, this.content.list); // 复制content.list副本
        if(this.itemIndex === -1) {
          this.itemIndex = list.length;
          list.push(url);
          this.list = list;
        } else {
          list.splice(this.itemIndex, 1, url)  //替换
          this.list = list;
        }
        
      },
      handleOk() {  // 提交选中的图片
        this.visible = false;
        this.setCarouselItem(this.list, this.itemIndex)
      },
      changeName(e) {
        const {value} = e.target
        this.$set(this.components[this.editIndex].content, 'title', value);
      },
    }
  }
</script>

<style lang='scss' scoped>
@import '@/assets/css/mixin.scss'; 
.edit-wrapper{
  margin: 20px 0;
  .part-1-title {
    display: block;
    font-size: 14px;
    color: #333;
    line-height: 30px;
  }
  .part-1-sub-title{
    display: block;
    font-size: 12px;
    color: #999;
  }
  .part-1-list{
    display: flex;
    flex-wrap: wrap;
    .part-1-item{
      width: 48px;
      height: 48px;
      border:1px solid #ECECEC;
      @include flex(row, center, center);
      margin: 16px 16px 16px 0;
      box-sizing: border-box;
      position: relative;
      &.checked{
        border:2px solid #3351E7;
      }
      &:hover{
        border:1px dashed #3351E7;
        .close{
          display: block;
        }
      }
      .close{
        width: 18px;
        height: 18px;
        position: absolute;
        top: -8px;
        right: -8px;
        background: url('../../assets/img/decoration/close.png') no-repeat;
        background-size: cover;
        z-index: 999;
        display: none;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .part-1-preview{
    position: relative;
    overflow: hidden;
    cursor:pointer;
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
      &:hover{
        background:#3351e7;
        color: #fff;
      }
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
.part-1-list > div >  span{
  display: flex;
  flex-wrap: wrap;
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
<style lang="scss">
  .text-input{
    .ant-input {
      padding-left: 50px;
    }
    .ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 50px !important;
      height: 40px;
      background:rgba(248,248,248,1);
      border:1px solid rgba(236,236,236,1); 
    }
    .ant-input-prefix{
      line-height: 38px;
    }
  }
</style>
