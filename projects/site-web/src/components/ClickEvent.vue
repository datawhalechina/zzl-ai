<template>
  <div class="event-bind">
    <span class="label">点击事件</span>
    <div class="content">
      <div
        v-for="el in elements"
        :key="el.id"
        :class="[
          el.classname,
          'event-btn',
          components[editIndex].event.type == el.type
            ? 'event-btn-active'
            : ''
        ]"
        v-on:click="activate(el)"
      >
        {{ el.name }}
      </div>
      <div class="drawerBox" v-if="components[editIndex].event.type == 'href'">
        <!--//* 选择页面 -->
        <a-select
          placeholder="选择页面"
          style="width: 100%"
          class="weiliu-components-base-input-index-input"
          v-model="components[editIndex].event.linkId"
        >
          <a-select-option v-for="(item, index) in pages" :value="index" :key="'j'+index" :disabled="item.id == pages[pageIndex].id">
            {{item.content.title}}
          </a-select-option>
        </a-select>
        <!-- 选择页面 -->
      </div>
      <div class="drawerBox" v-if="components[editIndex].event.type == 'tel'">
        <!--//* 输入电话 -->
        <input
          type="text"
          placeholder="请输入电话"
          v-model="telephone"
          class="weiliu-components-base-input-index-input"
          :class="error?'error-input':''"
          autocomplete="on"
          
          @blur="handlePhone"
        />
        <p class="tips" v-if="error">{{error}}</p>
      </div>
      
    </div>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
import { mapState } from 'vuex';

export default {
  name: "ClickEvent",
  data: function() {
    return {
      elements: [
        { id: 0, classname: "nothing", name: "无", type: 'none' },
        { id: 1, classname: "page", name: "页面", type: 'href'  },
        { id: 2, classname: "call", name: "电话", type: 'tel' }
      ],
      classname: ["nothing", "page", "call"],
      telephone: "",
      error: '',
    };
  },
  computed:{
    ...mapState({
      pages: state=>state.site.pages,
      pageIndex:state=>state.site.pageIndex,
      components: state=>state.site.components,
      editIndex: state=>state.site.editIndex,
    }),
  },
  methods: {
    activate: function(el) {
      console.log(el)
      this.error = ''
      this.$set(this.components[this.editIndex].event, 'type', el.type);

    },
    handlePhone() {
      if(!validPhone(this.telephone)){
        this.error = '请填写正确手机号';
      }else {
        this.error = '';
        this.$set(this.components[this.editIndex].event, 'tel', this.telephone);
      }
    },
    handleChange(value){
      this.$set(this.components[this.editIndex].event, 'linkId', value);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
.event-bind{
    height: auto;
    font-size: 14px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 236, 236, 1);
    padding: 16px;
    .label{
      display: block;
      width: 56px;
      height: 18px;
      margin-bottom: 16px;
      color: #333333;
      font-weight: 400;
    }
    .content{
      display: flex;
      flex-wrap: wrap;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      @include flex(row, space-between, center);
      .event-btn{
        padding: 6px 24px;
        background: rgba(242, 244, 246, 1);
        border-radius: 2px;
        border: 1px solid rgba(236, 236, 236, 1);
        margin-bottom: 16px;
        cursor: pointer;
      }
      .event-btn-active{
        border: 1px solid #3351E7!important;
        color: rgba(51, 81, 231, 1);
      }
      .drawerBox{
        width: 100%;
        input{
          width: 100%;
          height: 40px;
          padding-left: 12px;
          background: rgba(248, 248, 248, 1);
          border-radius: 2px;
          border: 1px solid rgba(236, 236, 236, 1);
          color: #666666
        }
        .error-input{
          border: 1px solid #FF515E!important;
        }
        .tips{
          font-size: 12px;
          height: 18px;
          color: #FF515E;
          margin: 10px 0;
        }

      }
      
    }
  }
</style>
