import Vue from 'vue'
import Router from 'vue-router'
import address from '../views/address/address'
import addressCreate from '../views/address/addressCreate'
import count from '../views/count/count'
import evaluate from '../views/evaluate/evaluate'
import evaluateCreate from '../views/evaluate/evaluateCreate'
import goods from '../views/goods/goods'
import goodsCreate from '../views/goods/goodsCreate'
import order from '../views/order/order'
import orderCreate from '../views/order/orderCreate'
import seller from '../views/seller/seller'
import sellerCreate from '../views/seller/sellerCreate'
import user from '../views/user/user'
import userCreate from '../views/user/userCreate'
import weiUser from '../views/weiUser/weiUser'
import weiUserCreate from '../views/weiUser/weiUserCreate'
import login from '../views/login'
import main from '../views/main'



Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      meta: { 
        requireAuth: '0'
      },
      component: main,
      children: [
        {
          path: 'address',
          name: 'address',
          component: address
        },
        {
          path: 'addressCreate',
          name: 'addressCreate',
          component: addressCreate
        },
        {
          path: 'evaluate',
          name: 'evaluate',
          component: evaluate
        },
        {
          path: 'evaluateCreate',
          name: 'evaluateCreate',
          component: evaluateCreate
        },
        {
          path: 'goods',
          name: 'goods',
          component: goods
        },
        {
          path: 'goodsCreate',
          name: 'goodsCreate',
          component: goodsCreate
        },
        {
          path: 'order',
          name: 'order',
          component: order
        },
        {
          path: 'orderCreate',
          name: 'orderCreate',
          component: orderCreate
        },
        {
          path: 'user',
          name: 'user',
          component: user
        },
        {
          path: 'userCreate',
          name: 'userCreate',
          component: userCreate
        },
        {
          path: 'weiUser',
          name: 'weiUser',
          component: weiUser
        },
        {
          path: 'weiUserCreate',
          name: 'weiUserCreate',
          component: weiUserCreate
        },
        {
          path: 'seller',
          name: 'seller',
          component: seller
        },
        {
          path: 'sellerCreate',
          name: 'sellerCreate',
          component: sellerCreate
        },
        {
          path: 'count',
          name: 'count',
          component: count
        }
      ]
    },    
    {
      path: '*',
	    redirect: '/login'
    }
  ]
})
export default router;
