<template>
  <div>
    <a-modal
      width="50vw"
      :title="null"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
          <div class="modal-wapper">
            <div class="list-wapper">
              <div v-for="(item, index) in list" :key="'i'+index">
                <div class="list-item-box" @click="handleClick(item)" :class="item.checked?'checked':''">
                  <div class="icons">
                    <img :src="require(`../assets/img/material/${item.icon}.png`)" alt="">
                    <img :src="require(`../assets/img/material/${item.activeIcon}.png`)" alt="">
                  </div>
                  <div class="name">{{item.name}}</div> 
                  <div class="cu_toolbar"></div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      default: false,
      type: Boolean,
    }
  },
  data() {
    return {
      // visible: false,
      tabs: [{id:'1', name:'系统图标'}, {id:'2', name: '我的图标'}],
      list: [
        {name:'首页',icon: 'home', activeIcon: 'home-active', checked: false},
        {name:'产品',icon: 'product', activeIcon: 'product-active', checked: false},
        {name:'活动',icon: 'activity', activeIcon: 'activity-active', checked: false},
        {name:'关于',icon: 'about', activeIcon: 'about-active', checked: false}
      ]
    }
  },
  methods: {
    handleClick(item) {
      this.list.map(item=>item.checked=false)
      item.checked = !item.checked
    },
    handleOk() {
      let obj = this.list.filter(item=>item.checked === true)[0];
      this.$emit('select', obj)
    },
    handleCancel() {
      this.$emit('cancel')
    },
  }

}
</script>

<style lang='scss' scoped>
@import '../assets/css/mixin.scss';
.modal-wapper{
  height: 420px;
  .list-wapper {
    display: flex;
    flex-wrap: wrap;
    .list-item-box {
      width:128px;
      height:94px;
      background: #f8f8f8;
      margin: 16px;
      @include flex(column, space-around, center);
      cursor: pointer;
      position: relative;
      .cu_toolbar{
        position: absolute;
        top: -2px;
        left: -2px;
        width: 24px;
        height: 24px;
        
        display: none;
      }
      &:hover:not(.checked){
        box-shadow:4px 4px 16px 0px #e7e9ef;
        border:1px dashed #3351E7;
        .cu_toolbar{
          display:block;
          background: no-repeat center/100% url('../assets/img/material/hover-check.png');
        }
      }
      &.checked{
        border:1px solid #3351E7;
        box-shadow:4px 4px 16px 0px #e7e9ef;
        .cu_toolbar{
          display:block;
          background: no-repeat center/100% url('../assets/img/material/check.png');
        }
      }
      .icons{
        width: 70%;
        flex: 2;
        @include flex(row, space-around, center);
        img{
          width: 32px;
          height: 32px;
        }

      }
      .name{
        flex:1;
        font-size: 12px;
        color: #999;
      }
      
    }
  }
}

</style>