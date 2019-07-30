import Vue from 'vue'
import Router from 'vue-router'


import error from '@/components/error' 
import error_header from '@/components/error_header' 

import customInfo from '@/components/customInfo' 
import investnow from '@/components/investnow'
import placeOnFile from '@/components/placeOnFile'
import investTreaty  from '@/components/investTreaty'
import investTreatyTwo  from '@/components/investTreatyTwo'
import memberTreaty from '@/components/memberTreaty'

import invite  from '@/components/invite'
import investResult from "@/components/investResult";
import inviteRegular  from '@/components/inviteRegular'
import downloadPage  from '@/components/downloadPage'

import memberRecharge from '@/components/memberRecharge'
import memberCenter from '@/components/memberCenter'
import memberBuy from '@/components/memberBuy'

import jxqRegister from '@/components/invite/jxqRegister'
import inviteRecord from "@/components/invite/inviteRecord";

import personShare from "@/components/circle/personShare";
import circleShare from "@/components/circle/circleShare";
import giveCoin from "@/components/weixin/giveCoin";
import helpCenter from "@/components/helpCenter";
import helpList from "@/components/helpList";
import microShop from '@/components/wd/microShop'
import microShoph from '@/components/wd/microShoph'
import personalCard from '@/components/wd/personalCard'
import personalCardh from '@/components/wd/personalCardh'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  //去掉地址中的哈希#
  //mode: "history", 
  saveScrollPosition: true ,//记住页面的滚动位置 html5模式适用
  routes: [
    // {
    //   path: '/',
    //   name: 'VIP',  
    //   component: VIP,
    //   meta: {
    //     title:'首页'
    //   }
    // },
    {
      path: '/error',
      name: 'error',
      component: error,
      meta: {
        title: '页面出错'
      }
    },
    {
      path: '/error_header',
      name: 'error_header',
      component: error_header,
      meta: {
        title: '页面出错'
      }
    },

    {
      path: '/investTreaty',
      name: 'investTreaty',
      component: investTreaty,
      meta: {
        title: '注册协议'
      }
    },
    {
      path: '/investTreatyTwo',
      name: 'investTreatyTwo',
      component: investTreatyTwo,
      meta: {
        title: '充值协议'
      }
    },
    {
      path: '/memberTreaty',
      name: 'memberTreaty',
      component: memberTreaty,
      meta: {
        title: '充值协议'
      }
    },


    {
      path: '/placeOnFile',
      name: 'placeOnFile',
      component: placeOnFile,
      meta: {
        title: '客户归档'
      }
    },

    {
      path: '/customInfo',
      name: 'customInfo',
      component: customInfo,
      meta: {
        title: '客户详情'
      }
    },
    {
      path: '/investnow',
      name: 'investnow',
      component: investnow,
      meta: {
        title: '立即充值'
      }
    },
    {
      path: '/invite',
      name: 'invite',
      component: invite,
      meta: {
        title: '邀请好友'
      }
    },
    {
      path: '/inviteRegular',
      name: 'inviteRegular',
      component: inviteRegular,
      meta: {
        title: '活动规则'
      }
    },
    {
      path: '/downloadPage',
      name: 'downloadPage',
      component: downloadPage,
      meta: {
        title: '下载页',
        isShare: true
      }
    },
    {
      path: '/memberRecharge',
      name: 'memberRecharge',
      component: memberRecharge,
      meta: {
        title: '会员充值'
      }
    },
    {
      path: '/memberCenter',
      name: 'memberCenter',
      component: memberCenter,
      meta: {
        title: '会员中心'
      }
    },
    {
      path: '/memberBuy',
      name: 'memberBuy',
      component: memberBuy,
      meta: {
        title: '会员购买'
      }
    },
    {
      path: '/jxqRegister',
      name: 'jxqRegister',
      component: jxqRegister,
      meta: {
        title: '注册',
        isShare: true
      }
    },
    {
      path: '/inviteRecord',
      name: 'inviteRecord',
      component: inviteRecord,
      meta: {
        title: '邀请记录'
      }
    },
    {
      path: '/investResult',
      name: 'investResult',
      component: investResult,
      meta: {
        title: '充值结果'
      }
    },

    {
      path: '/personShare',
      name: 'personShare',
      component: personShare,
      meta: {
        title: '个人主页分享'
      }
    },
    {
      path: '/circleShare',
      name: 'circleShare',
      component: circleShare,
      meta: {
        title: '圈子分享'
      }
    },

    {
      path: '/giveCoin',
      name: 'giveCoin',
      component: giveCoin,
      meta: {
        title: '超简单，来送金币'
      }
    },
    {
      path: '/helpCenter',
      name: 'helpCenter',
      component: helpCenter,
      meta: {
        title: '帮助中心'
      }
    },
    {
      path: '/helpList',
      name: 'helpList',
      component: helpList,
      meta: {
        title: '帮助中心'
      }
    },

     {
      path: '/microShop',
       name: 'microShop',
       component: microShop,
      meta: {
        title: '个人微店'
      }
    },
    {
      path: '/microShoph',
      name: 'microShoph',
      component: microShoph,
      meta: {
        title: '分享个人微店'
      }
    },
    {
      path: '/personalCard',
      name: 'personalCard',
      component: personalCard,
      meta: {
        title: '名片查看'
      }
    },
    {
      path: '/personalCardh',
      name: 'personalCardh',
      component: personalCardh,
      meta: {
        title: '分享名片'
      }
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        title: 'test'
      }
    },
    
  ] 
  
})
