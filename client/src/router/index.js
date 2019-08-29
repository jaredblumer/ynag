import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Posts from '@/components/Posts';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/test',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    }
  ]
});
