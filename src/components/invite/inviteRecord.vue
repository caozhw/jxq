<template>
  <div class="container">
    <!-- <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../../assets/images/icon_back_white.png" alt>
      </a>
      <span>{{title}}</span>
    </div>  -->
    <div class="top-top"></div>
    <div class="top-wrapper">
       <div class="top">
        <div class="top-item">
          <label>已邀请（人）</label>
          <span>{{inviteNum}}</span>
        </div>
        <div class="top-item">
          <label>已获得（金币）</label>
          <span>{{awardTotal}}</span>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-title">
        <span :class="setStateList==1?'active':''" @click="handleSetStateClick(1,null,null)">全部</span>
        <span :class="setStateList==2?'active':''" @click="handleSetStateClick(2,0,null)">未认证</span>
        <span :class="setStateList==3?'active':''" @click="handleSetStateClick(3,1,null)">已认证</span>
        <span :class="setStateList==4?'active':''" @click="handleSetStateClick(4,null,1)">已充值</span>
      </div>
      <div class="no-record" v-if="isShowNoRecord">
        <img src="../../assets/images/rs/pic_zwyq@3x.png" >
        <p>您还没有邀请成功的好友～</p>
      </div>
      <ul v-if="!isShowNoRecord">
        <li v-for="(item,index) in recordList" :key="index">
          <p>
            <span>{{item.phone}}</span>
            <span :class="item.award?'gloden':'gray'">{{item.award ? '+' + item.award + '金币' : '--'}}</span>
          </p>
          <p>
            <span>{{item.createTime}}</span>
             <span :class="listStatusClass(item.status)">{{item.status}}</span>
            <!-- <span :class="listStatusClass(item.status,item.rechargeStatus)">{{listStatusFormatter(item.status,item.rechargeStatus)}}</span> -->
          </p>
        </li>
        <!-- <li>
          <p>
            <span>158 **** 2712</span>
            <span class="gloden">+10金币</span>
          </p>
          <p>
            <span>2019-02-03 13:56:27</span>
            <span class="green">已认证</span>
          </p>
        </li>-->
      </ul>
    </div>

   








    <!-- loading -->
    <div class="loadmask" v-if="loading" @touchmove.prevent>
      <div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>


  
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex'
import flexible from '@/axios/js/flexible.js'
import util from '@/axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp} from '@/axios/axios_vue';
import {autoSign,inviteList} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
export default {
    name:'',
    data () {
        return {
          loading:false,
          title:null,
          setStateList:1,//选择 筛选条件 1全部 2未认证 3已认证 4已充值
          isShowNoRecord:false,//是否显示无记录
          isNoLastRecord:false,//没有余下数据
          isScroll:false,//是否下拉

          status:null,//认证状态 0 未认证，1已认证，2未通过
          rechargeStatus:null,//是否首充 0 未充值，1 已充值
          pageSize:20,//页数
          pageNum:1,//页码

          testAppData:{
            appKey:"android_user",
            uuid:"4c1f4496-7b5b-43f1-a887-8bca294cc0e4",
            sessionId:"5cfcd339908bf6522d08adc34303283e",
            source:"JxhOfficial",
          },

          //返回
          inviteNum:0,//邀请总人数
          awardTotal:0,//邀请总奖励
          recordList:[],//



          
        }
    },
    computed:{

      
    },
    created(){
      //alert('created');
      window.callJsRefresh = this.callJsRefresh; 
      window.addEventListener('scroll', this.onScroll);
    },
    mounted() {
      //alert('1')
      //this.loading = true;
      this.title = "邀请记录";
      document.title = this.title; 
      
      this.inviteListRequest();

    },
    methods: {
      //7.4 邀请记录列表
      inviteListRequest(){
        // let newObj = this.testAppData;
        // newObj.status = this.status;
        // newObj.rechargeStatus = this.rechargeStatus;
        // newObj.pageSize = this.pageSize;
        // newObj.pageNum = this.pageNum;

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.status = this.status;
        obj.rechargeStatus = this.rechargeStatus;
        obj.pageSize = this.pageSize;
        obj.pageNum = this.pageNum;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(inviteList, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.loading = false;
            this.isScroll = false;
            this.inviteNum = result.total.inviteNum?result.total.inviteNum:0;
            this.awardTotal = result.total.awardTotal?result.total.awardTotal:0;
            this.isNoLastRecord = this.recordList.length!=0&&result.list.length==0?true:false;
            this.recordList =  this.recordList.concat(result.list);
            
            this.isShowNoRecord = this.recordList.length==0?true:false;
            

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //状态列表 点击
      handleSetStateClick(_state,status,rechargeStatus){
        this.loading = true;
        this.setStateList = _state;
        this.status = status;
        this.rechargeStatus = rechargeStatus;
        this.recordList =  [];
        this.pageNum = 1;
        this.inviteListRequest();
      },

      //状态 显示 文字
      listStatusFormatter(status,rechargeStatus){
        if(rechargeStatus == '已充值'){
          return rechargeStatus;
        }else{
          return status;
        }

      },
      //状态 显示 颜色
      listStatusClass(status){
        if(status == '未认证'){
          return 'blue';
        }
        else if(status == '已认证'){
          return 'green';
        }
        else{
          return 'gray';
        }
      },


      onScroll() {
        //可滚动容器的高度
        let innerHeight = document.querySelector('#app').clientHeight;
        //屏幕尺寸高度
        let outerHeight = document.documentElement.clientHeight;
        //可滚动容器超出当前窗口显示范围的高度
        let scrollTop = document.documentElement.scrollTop;
        //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
        console.log(innerHeight + " " + outerHeight + " " + scrollTop);
        if (innerHeight == (outerHeight + scrollTop)) {
            this.isScroll = true;
            if(this.isScroll && !this.isNoLastRecord){
              //加载更多操作
              this.pageNum ++;
              this.inviteListRequest();
              console.log("loadmore",this.pageNum);
              
            }
           
            

        }
      },
     
      //提示框
      toastShowHide(msg,pos,time){
         Toast({
          message: msg,
          position: pos,
          duration: time,
          className:'.j-toast'
        });
      },
       //返回上一级
      goBack(){
        goBackPage();
      },
   
    }
};
</script>
<style lang="scss" scoped>
.container {
  width: 10rem;
  min-height: 100vh;
  background: #FFF;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  .header {
   
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0;
    background: #F6F7FA;
    text-align: center;
    border-bottom: 2px solid #DDDDDD;
    z-index: 99;
    img {
      width: auto;
      height: 0.72rem;
      margin-top: 0.34rem;
      position: absolute;
      left: 0.4rem;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      font-weight: bold;
      color: #152758;
      font-size:0.48rem;
      vertical-align: middle;
    }
  }
  .top-top{
    background: #F6F7FA;
    height: 0.4rem;
  }
  .top-wrapper{
    background: #F6F7FA;
    margin:0 auto;
    height: 4.2rem;
    .top{
      height: 100%;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/if/pic_yqjl_ka_bg@3x.png);
      display: flex;
      justify-content: space-around;
      align-items: center;
      .top-item{
        display: flex;
        flex-direction: column;
        position: relative;
        top: -0.48rem;
        label{
          color:rgba(255,255,255,.55);;
          font-size:0.38rem;
          text-align: center;
        }
        span{
          margin-top: 0.2rem;
          color:#FFFFFF;
          font-weight: 500;
          font-size:0.72rem;
          text-align: center;
        }
      }
      
    }
  }
  
  .list{
    background:#fff;
    position: relative;
    top: -0.36rem;
    .list-title{
      display: flex;
      align-items: center;
      height: 1.4rem;
      span{
        margin: 0 0.4rem;
        color: #9099B2;
        font-size: 0.42rem;
        height: 1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      span:hover{
        color:#4780E9;
        border-bottom:2px solid #4780E9;
      }
      span.active{
        color:#4780E9;
        border-bottom:2px solid #4780E9;
      }
    }
    .no-record{
      text-align: center;
      padding-top: 1.6rem;
      img{
        width: 3.6rem;
        height: 2.8rem;
      }
      p{
        color:#162758;
        font-size: 0.34rem;
        margin-top: 0.4rem;
      }
    }
    ul{
      border-top:1px solid #EEEEEE;
      li{
        height: 1rem;
        padding:0.4rem 0;
        margin:0 0.4rem;
        border-bottom:1px solid #EEEEEE;
        display: flex;
        flex-direction: column;
        p{
         
          display: flex;
          justify-content: space-between;
          align-items: center;
          .gloden{
            color:#FFA119;
          }
          .blue{
            color:#4780E9;
          }
          .green{
            color:#6ACC02;
          }
          .gray{
            color:#858FAB;
          }
        }
        P:first-child{
          font-weight: 500;
          span:first-child{
            font-size:0.4rem;
            color:#333943;
          }
          span:last-child{
            font-size:0.46rem;
            
          }
        }
        P:last-child{
          margin-top: 0.06rem;
          font-weight: 500;
          span:first-child{
            font-size:0.36rem;
            color:#858FAB;
          }
          span:last-child{
            font-size:0.36rem;
            
          }
        }
      }
    }
    
  }


  .alert-msg{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    background: rgba(0,0,0,.6);
    font-family:PingFangSC-Regular;
    text-align:center;
    .alert-content{
      display: inline-block;
      background: #fff;
      text-align:center;
      padding: 0.4rem;
      padding-right: 0.8rem;
      margin:0 auto;
      position: relative;
      top:4.6rem;
      border-radius: 0.12rem;
      strong{
        height: 0.64rem;
        display: inline-block;
        color:#333943;
        font-size:0.44rem;
        padding-left: 1rem;
        background-size: 22%;
        background-repeat: no-repeat;
            
      }
      .success{
        background-image: url(../../assets/images/ctm/icon_ty_xy_yxz@3x.png);
      }
      .fail{
        background-image: url(../../assets/images/ctm/icon_csxz_scxz@3x.png);
      }
    }
  }


   .loadmask{
        width: 10rem;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.3);
        text-align:center;
    }
    .loadEffect{
        width: 1.333rem;
        height: 1.333rem;
        position: fixed;
        margin: 0 auto;
        top: 50%;
        left: 50%;
        margin-top:-0.666rem;
        margin-left: -0.666rem;
    }
    .loadEffect span{
        display: inline-block;
        width: 0.213rem;
        height: 0.213rem;
        border-radius: 50%;
        background: #212019;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    @keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    .loadEffect span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-0.107rem;
        -webkit-animation-delay:0.13s;
    }
    .loadEffect span:nth-child(2){
        left: 0.187rem;
        top: 0.187rem;
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3){
        left: 50%;
        top: 0;
        margin-left: -0.107rem;
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4){
        top: 0.187rem;
        right:0.187rem;
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-0.107rem;
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6){
        right: 0.187rem;
        bottom:0.187rem;
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7){
        bottom: 0;
        left: 50%;
        margin-left: -0.107rem;
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8){
        bottom: 0.187rem;
        left: 0.187rem;
        -webkit-animation-delay:1.04s;
    }




}
</style>

