# bzt_app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### css 样式编写规范


- (必须)采用 UTF-8 编码，在 CSS 代码头部使用：@charset "utf-8";

- (必须)命名空间规范

       以 js 为命名空间，表示特定给 JavaScript 调用的类名，例如：js-request、js-open。
       选择器命名 用小写字母，链接字符用“-”

- (必须)杜绝使用id,标签（除基础样式外）作为选择器。

- 代码中尽量少用!important。

- 嵌套层级最好不要超过3层，包括(less/sass/stylus)

- 代码编写要干净整洁，尽量遵守属性顺序:

- 文档流相关属性（display, position, float, clear, visibility, table-layout）

- 盒模型相关属性（margin, padding, width, height, border）

- background, opacity

- 文字排版（color，line-height, text-align, text-indent, vertical-align, letter-spacing, font）

- overflow, z-index, cursor

- 一些 css3 属性

###  js 规范
- (必须)方法命名使用驼峰，例如 setBodyWidth

- (必须)尽量不要在全局（window）挂载方法，可以定义命名空间，把方法放在命名空间(命名空间大写)中，例如 EASTFAIR.setBodyWidth

- 代码尽量函数化，一个函数一块功能，通用功能单独提出，并按功能类型分类，如工具类型，业务类型的，接口类型的等等

- 常用参数数据要抽离集中并且可以配置， 如接口api

- 常量必须大写

- 变量定义，尽量集中，减少使用多个var,let,const，可以在多个变量间用","分割

### vue 编写规范
- (必须)组件命名 组件名为多个单词

- 尽量少用watch监听，用计算属性（computed）

- (必须)为v-for设置键值

- 避免 v-if 和 v-for 用在一起

- (必须)组件结构化:
         // name 属性
         name: 'RangeSlider',

         // 使用组件
         components: {},

         // 使用指令
         directives: {},

         // 使用过滤器
         filters: {},

         // 使用mixins 共享通用功能
         mixins: [],

         // 组成新的组件
         extends: {},

         // 组件属性、变量
         props: { },

         // 变量
         data () {},

         // 计算属性
         computed: {},

         // 响应式事件，监测方法
        watch: {},

       // 生命周期
       beforeCreate () {},created () {},beforeMount () {},mounted () {},beforeUpdate () {},updated () {},activated () {},deactivated () {},beforeDestroy () {},destroyed () {},

       // 方法
       methods: {}；


