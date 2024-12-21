/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页 - MiGPT'
    }
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('../views/config/index.vue'),
    meta: {
      title: '配置管理 - MiGPT'
    }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'MiGPT';
  next();
});

export default router; 