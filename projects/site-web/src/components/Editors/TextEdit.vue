<template>
  <div class="edit-wrapper" v-if="aIndex === currentIndex">
    <div class="text-edit" :data-code="content.code" v-if="activeTab==='first'" @click="handleTabChange('first')">
      <div class="input-area">
        <a-input
          type="textarea"
          :autoSize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入内容"
          v-model="content.text"
        ></a-input>
      </div>
      <div class="fontAttribute">
        <div class="firstLine">
          <ul class="fontSetting1">
            <li style="width:50px">
              <a-dropdown>
                <span class="a-dropdown-link">
                  {{ oStyle["font-size"] }}
                  <a-icon type="down" />
                </span>
                <a-menu slot="overlay" @click="handleCommand">
                  <a-menu-item key="16px">16px</a-menu-item>
                  <a-menu-item key="14px">14px</a-menu-item>
                  <a-menu-item key="12px">12px</a-menu-item>
                  <a-menu-item key="10px">10px</a-menu-item>
                </a-menu>
              </a-dropdown>
            </li>
            <li>
              <img src="../../assets/img/decoration/A1.png" alt />
            </li>
            <li>
              <el-color-picker
                v-model="oStyle['color']"
                size="mini"
                class="changeColor"
                @change="colorSetting"
              ></el-color-picker>
            </li>
            <li @click="toggleAttrValue('font-weight', 'bold', 'normal')">
              <img src="../../assets/img/decoration/A3.png" alt />
            </li>
            <li @click="toggleAttrValue('font-style', 'italic', 'normal')">
              <img src="../../assets/img/decoration/A4.png" alt />
            </li>
          </ul>
          <ul class="fontSetting2">
            <li @click="toggleAttrValue('text-decoration', 'line-through', 'none')">
              <img src="../../assets/img/decoration/A5.png" alt />
            </li>
            <li @click="toggleAttrValue('text-decoration', 'underline', 'none')">
              <img src="../../assets/img/decoration/A6.png" alt />
            </li>
            <li >
              <img src="../../assets/img/decoration/A7.png" alt />
            </li>
          </ul>
        </div>
        <ul class="secondLine">
          <li @click="handleTextalign('left')">
            <img :src="require(`../../assets/img/decoration/${oStyle['text-align'] == 'left'?'B':'A'}8.png`)" alt />
          </li>
          <li @click="handleTextalign('center')">
            <img :src="require(`../../assets/img/decoration/${oStyle['text-align'] == 'center'?'B':'A'}9.png`)" alt/>
          </li>
          <li @click="handleTextalign('right')">
            <img :src="require(`../../assets/img/decoration/${oStyle['text-align'] == 'right'?'B':'A'}10.png`)" alt />
          </li>
          <li>
            <img
              src="../../assets/img/decoration/A11.png"
              alt
              class="fontSettingImg"
            />
          </li>
          <li>
            <el-color-picker
              v-model="oStyle['background-color']"
              size="mini"
              @change="bgColorSetting"
              class="changeColor"
            ></el-color-picker>
          </li>
          <li>
            <img src="../../assets/img/decoration/A13.png" alt />
          </li>
        </ul>
      </div>
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
          <div class="edgeShow">{{ oStyle["padding-top"] }}</div>
        </div>
        <div class="edge">
          <span class="demonstration">左右边距</span>
          <a-slider
            :max="30"
            class="slider"
            :default-value="parseInt((oStyle['padding-left'] || '0px').split('px')[0])"
            @change="sliderLeft"
          />
          <div class="edgeShow">{{ oStyle["padding-left"] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import clickEvent from "@/components/ClickEvent";

export default {
  name: 'TextEditor',
  components: {clickEvent},
  props: {
    content: Object,
    oStyle: Object,
    aIndex: Number,
    currentIndex: Number,
    activeTab: String
  },
  data(){
    return {
      centered: require("../../assets/img/decoration/A9.png"),
      centeredChecked: require("../../assets/img/decoration/B9.png"),

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
    handleCommand({ key }) {
      this.setStyle(key, 'font-size')

    },
    toggleAttrValue(attr, value, antValue) {
      let newVal
      if (this.oStyle[attr] == antValue){
        newVal = value
      }else {
        newVal = antValue
      }
      this.setStyle(newVal, attr)
    },
    handleTextalign(value){
      this.setStyle(value, 'text-align')

    },
    colorSetting(value) {
      this.setStyle(value, 'color')
    },
    bgColorSetting(value){
      this.setStyle(value, 'background-color')
    },
    sliderTop(value) {
      this.setStyle(value+'px', 'padding-top')
      this.setStyle(value+'px', 'padding-bottom')
    },
    sliderLeft(value){
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";
.edit-wrapper{
  margin: 20px 0;
  .text-edit{
    .fontAttribute {
      list-style: none;
      margin-top: 12px;
      .firstLine {
        display: flex;
        .fontSetting1 {
          @include flex(row, center, center);
          padding-left: 0;
          li {
            @include flex(row, center, center);
          }
          .a-dropdown-link {
            font-size: 12px;
            font-family: SFUIText-Regular, SFUIText;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
        .fontSetting2 {
          @include flex(row, center, center);
          padding-left: 16px;
          li {
            @include flex(row, center, center);
          }
        }
      }
      .secondLine {
        display: flex;
        padding-left: 0;
        margin-top: 0;
        li {
          @include flex(row, center, center);
        }
      }
      li {
        list-style-type: none;
        width: 32px;
        height: 32px;
        border: 1px solid #ececec;
      }
      .getBold {
        color: red;
      }
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
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}
</style>