
import {addDecoratePage} from '@/api/decoration.js'
import siteData from '../../assets/js/test1.json'

let site = []
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
  pages: pages,
  pageIndex: 0, // 当前页面编辑索引

  components,
  editIndex: 0,   // 当前组件编辑索引
  isComponent: true, // 组件控制编辑框显示/隐藏
  activeTab: 'first'
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
    state.pages.splice(index, 1)

  },
  setActiveTab(state, key){
    state.activeTab = key
  },
  setCommon(state){ // 控制编辑栏是否显示以及显示的Index
    let arg = arguments[1];
    if (arg.hasOwnProperty('index') && arg.hasOwnProperty('flag')){
      let timer = null;
      if (state.editIndex === arg['index']){ //样式编辑栏假装切换
        state.isComponent = arg['flag'];
      } else {
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
  addPage({ state, commit }){
    let newPage = {
      stId: state.site.id,
      name: '新页面'+state.pages.length,
      isIndex: 0,
      operType: 0,
      content: {
        title: '新页面'+state.pages.length,
        background: '#fff'
      }
    };

    commit('pushPageList', newPage)
  },
  deletePage({ state, commit }){
    console.log('test')
  },
  addCp({ state, commit }, {components, res}){

    let cmName = res.item.getAttribute('name');
    let cmDesc = res.item.getAttribute('description');

    let cmTitle = res.item.innerText;
    console.log(cmTitle)

    let dataTime = new Date().getTime();
    let aIndex = res.newIndex;
    let uiComponent
    if(cmName.indexOf('Text')!==-1){
      uiComponent= {
        pageId: state.pages[state.pageIndex].id,
        name: cmName,
        description: cmDesc,
        content: {
          text: '请输入文本内容',
        },
        style: {
          'font-size': '14px',
          'color': '',
          'background-color': '',
          'font-weight': 'normal',
          'font-style': 'normal',
          'text-decoration': 'none',
          'text-align': 'inherit',
          'padding-top': '15px',
          'padding-bottom': '15px',
          'padding-left': '10px',
          'padding-right': '10px'
        },
        event: {
          type: 'none',
        }
  
      };
    } else if(cmName.indexOf('Btn')!==-1) {
      uiComponent= {
        pageId: state.pages[state.pageIndex].id,
        name: cmName,
        description: cmDesc,
        content: {
          text: cmTitle,
        },
        style: {},
        event: {
          type: 'none',
        }
      } 
    } else if(cmName.indexOf('Pic')!==-1) {
      uiComponent= {
        pageId: state.pages[state.pageIndex].id,
        name: cmName,
        description: cmDesc,
        content: {
          url: '',
        },
        style: {
          'width': '100%',
          'height': '210px',
          'padding-top': '0px',
          'padding-bottom': '0px',
          'padding-left': '0px',
          'padding-right': '0px',
        },
        event: {
          type: 'none',
        }
      } 
    } else if(cmName.indexOf('Carousel')!==-1) {
      uiComponent= {
        name: cmName,
        pageId: state.pages[state.pageIndex].id,
        description: cmDesc,
        content: {
          title: '',
          list: [],
          index: 0,
        },
        style: {
          'width': '100%',
          'height': '210px',
          'padding-top': '0px',
          'padding-bottom': '0px',
          'padding-left': '0px',
          'padding-right': '0px',
        },
        event: {
          type: 'none',
        }
      } 
    };;
    
    components.splice(res.newIndex, 0, uiComponent);
    console.log(components)
    commit('setComponent', components);
    commit('setCommon', {flag: true, index: aIndex});
  },
  sortCp({ state, commit }, res){
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