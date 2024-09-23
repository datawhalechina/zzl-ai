let site = []
let siteData = JSON.parse(window.sessionStorage.getItem('siteData'));
if (siteData !== null){
  site = siteData
}

let pages = []
let pageData = JSON.parse(window.sessionStorage.getItem('pageData'));
if (pageData !== null){
  pages = pageData
}

let components = [] 
let localData = JSON.parse(window.sessionStorage.getItem('localData'));
if (localData !== null){
  components = localData
}
const state = {
  
  site,
  pages,
  components,
  pageIndex: 0, // 当前页面编辑索引
  editIndex: 0,   // 当前组件编辑索引
}

const mutations = {
  setState(state, {name, key}) {
    state[name] = key
  },
  pushPageList(state, item) {
    state.pages.push(item)
  },
  setComponent(state, key){
    state.components = key
  },
  deleteCp(state, index){
    state.components.splice(index, 1)
  },
  delPage(state, index){
    state.components.splice(index, 1)

  },
  setCommon(state){ // 控制编辑栏是否显示以及显示的Index
    let arg = arguments[1];
    if (arg.hasOwnProperty('index') && arg.hasOwnProperty('flag')){
      let timer = null;
      if (state.editIndex === arg['index']){ //样式编辑栏假装切换
        state.isComponent = arg['flag'];
      } else {
        // state.isComponent = !arg['flag'];
        clearTimeout(timer);
        timer = setTimeout(() =>{
          state.isComponent = arg['flag'];
        }, 150);
      }
      state.editIndex = arg['index'];
    }
  },
}

const actions = {
  addPage({ state, commit }){  // 添加页面
      let newPage = {
        id: Math.random(),
        name: '新页面'+state.pages.length,
        isIndex: 0,
        operType: 0,
        content: {
          name: '新页面'+state.pages.length,
          background: '#fff'
        }
      };
      commit('pushPageList', newPage)
  },
  addCp({ commit }, {components, res}){  // 添加组件
    let cmType = res.item.getAttribute('type');
    let cmName = res.item.getAttribute('name');
    let cmDesc = res.item.getAttribute('description');
    let cmVersion = res.item.getAttribute('version');

    let cmTitle = res.item.innerText;
    console.log(cmTitle)

    let dataTime = new Date().getTime();
    let dataCode = cmType + dataTime;
    let aIndex = res.newIndex;
    let uiComponent
    uiComponent= {
        type:cmType,
        version: cmVersion,
        name: cmName,
        description: cmDesc,
        content: {},
        style: {},
        event: {}
    };
    if(cmName.indexOf('Text')!==-1){
        uiComponent.content.text = '请输入文本内容',
        uiComponent.style = {    // 默认填充文本组件样式
          'font-size': '14px',
          'color': '#333',
          'background-color': '',
          'font-weight': 'normal',
          'font-style': 'normal',
          'text-decoration': 'none',
          'text-align': 'inherit',
          'padding-top': '15px',
          'padding-bottom': '15px',
          'padding-left': '10px',
          'padding-right': '10px'
        }
    } else if(cmName.indexOf('Btn')!==-1) {
        uiComponent.content.text = '按钮'
    } else if(cmName.indexOf('Pic')!==-1) {
        uiComponent.content.url = ''
        uiComponent.style = {  //默认填充文本组件样式
          'padding-top': '0px',
          'padding-bottom': '0px',
          'padding-left': '0px',
          'padding-right': '0px',
        }
    }
    
    components.splice(res.newIndex, 0, uiComponent)

    commit('setComponent', components);
    commit('setCommon', {flag: true, index: aIndex})
  },
  sortCp({ state, commit }, res){   // 组件排序
    let Target = state.components[res.oldIndex];
    let aIndex = res.newIndex;
    state.components.splice(res.oldIndex, 1);
    state.components.splice(res.newIndex, 0, Target);
    commit('setCommon', {flag: true, index: aIndex});
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}