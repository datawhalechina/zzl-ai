import Vue from 'vue';
import {
  Button,
  Upload,
  Input,
  Layout,
  Tabs,
  Switch,
  Table,
  Cascader,
  Tag,
  message,
  Spin,
  Form,
  Row,
  Col,
  Empty,
  Pagination,
  Icon,
  Checkbox,
  Dropdown,
  Menu,
  Badge,
  Modal,
  Select,
  DatePicker,
  ConfigProvider,
  Rate,
  Radio,
  Carousel,
  Slider,
  
} from 'ant-design-vue';




Vue.use(Layout);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(Table);
Vue.use(Pagination);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Badge);
Vue.use(Modal);
Vue.use(Spin);
Vue.prototype.$confirm = Modal.confirm;
Vue.use(message)
Vue.prototype.$message = message;

Vue.use(Button);
Vue.use(Upload);
Vue.use(Input);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(ConfigProvider);
Vue.use(Rate);
Vue.use(Radio);
Vue.use(Carousel);
Vue.use(Cascader);
Vue.use(Tag)
Vue.use(Form)
Vue.use(Empty)
Vue.use(Slider);
Vue.use(Tabs)
// Vue.use(FormModel)
