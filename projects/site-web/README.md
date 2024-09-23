# 动手撸一个页面生成器

## 数据结构

1、梳理 datajson 数据流

site、page、components

```
site: [{
    "id":10,
    "name":"测试公司",
    "industry": "测试行业",
    "topNav":{
      type: 0,
      background: '#fff',
      title: '',
      titleColor: '#000',
      buttonColor: '#000'
    },
    bottomNav: {
      status: true,
      list: [
        name: '首页',
        link: 'www.baidu.com',
        icon: '',
      ]
    },
    "pages":[
        {
            "id":4,
            "siteId": 10,
            "name":"index",
            "isIndex":1,
            "content":{
                "title":"新建页面",
                "background":"#F1E5E5"
            },
            "components":[
                {
                    "id":0,
                    "pageId": 4,
                    "name":"TextCom",
                    "description":"文本",
                    "content":{
                        "text":"请输入文本内容发发发",
                    },
                    "style":{},
                    "event":{}
                },
            ]
        },
    ]
}]
```

一个网站可以完整的表示为一个树形 JSON。该树中包含了站点下所有页面和页面下所有组件内容和配置。

2、数据监听以及响应

项目中站点、页面以及组件三个概念的数据需要相互牵制并保持同步，网站数据填充是从顶层向下浸润，组件数据变动是从底层像顶层发布更新。

在 Dcoration.vue 页面下实现了 site、page、components 的数据监听以及同步到本地存储的过程。

```
  watch: {
    site: {
      handler(newVal, oldVal){
        window.sessionStorage.setItem('siteData', JSON.stringify(newVal));
      },
      deep: true
    },
    pages: {
      handler(newVal, oldVal) {
        window.sessionStorage.setItem('pageData', JSON.stringify(newVal));
        this.$set(this.site, 'pages', newVal)
      },
      deep: true
    },
    components: {
      handler(newVal, oldVal){
        window.sessionStorage.setItem('localData', JSON.stringify(newVal));
        this.$set(this.pages[this.pageIndex], 'components', newVal)
        this.$set(this.site.pages[this.pageIndex], 'components', newVal)

      },
      deep: true
    },
    pageIndex: {
      handler(newVal, oldVal){
        let comData = this.pages[newVal].components?this.pages[newVal].components:[]
        this.$store.commit('site/setState', {name: 'components', key: comData})
      },
      deep: true
    }
  }
```

## 前置知识

### Vue.Draggable

在动手实现编写页面和组件之前，需要了解 vuedraggable 作为前置知识

Draggable 为基于 Sortable.js 的 vue 组件，用以实现拖拽功能。 对 vuedraggable 插件 api 还不熟悉的童鞋可以参考 [Vue.Draggable 官方文档](https://github.com/SortableJS/Vue.Draggable)

## 装修页面布局

1、左侧——widget

左侧的可拖拽 widgets 被包裹在一组 draggable 拖拽组件中，要实现的效果是拖动左侧的 widget 到中间的页面生成区，所以两个 draggable 需要设置相同的 group 名称，需要注意的是左侧 draggable 只允许拖拽不允许拖放，pull 时需要克隆一个元素在中间的 draggable 组件中。 对应目录 components 中的 LeftMenu 文件

2、中间——页面生成

这个区域需要再包裹一个 draggable 拖放组件，用来接受从左侧拖放过来的 widget，所以需要设置和左侧相同的 group 名称。对应目录 components 中的 MainView 文件
注意这里用到了 vue 动态组件，相关概念不清楚可以区官方文档关于[动态组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)。

3、右侧——编辑区

这里还是实现了一个动态组件，根据 component 的 name 属性加载对应的 edit 组件。对应目录 components 中的 BaseEditor 文件

## 添加 widget 以及 widgetEdit 组件

这里是实现页面生成的核心，需要 widgetEdit 组件控制 widget 组件，实现 widget 属性的联动。可以查看 components 文件下 Widgets 目录以及 Editors 目录。 widgetEdit 组件控制当前 widget 组件的 style、content、以及事件绑定，主要用到\$set 方法

## 新增一个 widget 的基本思路

1、左侧编辑区添加需要拖拽生成的 widgets

2、vuex 添加组件创建时需要初始化的数据

3、写 xxx.vue 组件（在 mainView 视图中显示）

4、写 xxxEdit.vue 组件（组件的特有编辑器）

## 项目启动

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

启动项目后，访问 http://localhost:8080，需要先新建一个页面后，操作组件拖动生成视图

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
