import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import flexibleAndVw from '@/components/flexibleAndVw'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/flexibleAndVw',
      name: 'flexibleAndVw',
      component: flexibleAndVw
    }
  ]
})
