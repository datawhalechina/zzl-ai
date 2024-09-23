const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,

  site: state => state.site.site,
  pages: state => state.site.pages,
  pageIndex: state => state.site.pageIndex, // 当前页面编辑索引
  components:state => state.site.components, // 当前页面编辑索引,
  editIndex:state => state.site.editIndex,    // 当前组件编辑索引
}
export default getters
