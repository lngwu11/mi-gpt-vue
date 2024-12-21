# MiGPT 前端项目

MiGPT 的 Web 配置界面，基于 Vue.js 开发。

## Project setup

安装项目依赖:

```
npm install
```

### 开发模式

启动开发服务器(支持热重载):

```
vite
```

### 生产构建

构建生产版本:

```
vite build
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── views/          # 页面组件
│   └── config/     # 配置页面
│       ├── index.vue        # 主配置页面
│       ├── templates.js     # 配置模板
│       ├── ttsEngines.js    # TTS 引擎配置
│       └── style.css       # 页面样式
├── App.vue         # 根组件
└── main.js         # 入口文件
```

## 主要功能

- 基础配置

  - 智能助手配置
  - 用户配置
  - 账号设置
  - 音箱配置

- AI 服务配置

  - 支持多种 AI 服务
  - 模型选择
  - 接口配置

- TTS 配置

  - TTS 引擎选择
  - 音色配置
  - 自定义引擎

- 高级设置
  - 关键词配置
  - 提示语设置
  - 调试选项

## 开发指南

### 添加新功能

1. 在 `views/config` 下创建新的组件
2. 在 `index.vue` 中引入并使用
3. 添加相关配置到 `templates.js`

### 修改样式

- 组件样式在 `style.css` 中统一管理
- 使用 BEM 命名规范
- 支持 scoped CSS

### 构建部署

1. 运行构建命令

```bash
vite build
```

2. 构建产物在 `dist` 目录
3. 后端会自动 serve 这些静态文件

## 自定义配置

更多配置选项请参考 [Vue CLI 配置指南](https://cli.vuejs.org/config/).

node 版本要求：>=18.19.0
