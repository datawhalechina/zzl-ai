<template>
  <div class="nav-wapper">
    <div class="logo-wapper">
      <div class="logo">
        <img src="@/assets/img/navi/enterprise.png" alt="" />
      </div>
    </div>
    <ul class="list">
      <li
        v-for="item in navList"
        :key="item.id"
        :class="activeId === item.id ? 'active' : ''"
        class="cp"
        @click="changeNav(item)"
      >
        <img
          class="mr10"
          :src="
            require('@/assets/img/navi/nav-' +
              item.id +
              (activeId === item.id ? '-active' : '') +
              '.png')
          "
          alt=""
        />
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        { id: 1, name: "概览", path: "/dashboard" },
        { id: 2, name: "设计", path: "/site" },
        { id: 3, name: "素材", path: "/material" },
        { id: 4, name: "设置", path: "/setting" }
      ],
      activeId: 1
    };
  },
  mounted(){
    this.fillPath()
  },
  methods: {
    fillPath(){
      const { path } = this.$route
      this.activeId = this.navList.filter(item=>item.path===path)[0].id
      // console.log(id)
    },
    changeNav(nav) {
      this.activeId = nav.id;
      this.$router.push({ path: nav.path || "/" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";

.nav-wapper {
  flex: 0 0 144px;
  background: #17191e;
  min-height: 100vh;
  display: inline-block;
  .logo-wapper {
    margin: 14px;
    text-align: center;
    @include flex(row, center, center);
    .logo {
      width: 36px;
      height: 36px;
      @include flex(row, center, center);
      background: rgba(38, 41, 50, 1);
      border-radius: 2px;
      border: 1px solid rgba(48, 51, 59, 1);
    }
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    li {
      width: 100%;
      @include flex(row, center, center);
      height: 56px;
      // font-size: 14px;
      color: #d8d8d8;
    }
    li.active {
      background: linear-gradient(
        90deg,
        rgba(51, 81, 231, 0.1) 0%,
        rgba(51, 81, 231, 0.6) 100%
      );
    }
  }
}
</style>
