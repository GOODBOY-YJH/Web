import Vue from 'vue'
import App from './App.vue'
// 完整引入
// // 引入ElementUI组件库
// import ElementUI from 'element-ui';
// // 引入ElementUI全部样式
// import 'element-ui/lib/theme-chalk/index.css';
//应用ElementUI
// Vue.use(ElementUI);

// 按需引入组件，引入需要的部分

import {
  Pagination,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Form,
  FormItem,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Carousel,
  CarouselItem,
  Container,
  Header,
  Main,
  Footer,
  Divider,
  CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui';


Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Container)
Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(CascaderPanel)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Divider)
Vue.use(Tag)

Vue.use(Loading.directive);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;



//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
// 引入全局样式
import '../src/assets/style/style.css'

// 引入封装的axios
import serviceAxios from "../src/http/index";

// import store from './store'

//关闭Vue的生产提示
Vue.config.productionTip = false
//应用插件
Vue.use(VueRouter)
// 把axios封装到vue原型链上
Vue.prototype.$ajax = serviceAxios


new Vue({
  render: h => h(App),
  router,
  // store
}).$mount('#app')
