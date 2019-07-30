<template>
  <div class="container">
   
    <!-- <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>{{title}}</span>
    </div> -->

    <!--充值处理中 弹框 -->
    <div class="new-window"   v-if="status!=1&&status!=2">
      <i class="investing"></i>
      <p>充值处理中...</p>
      <div class="btn" @click="handleCloseInvertingClick">返回</div>
    </div>
    <!--成功 弹框 -->
    <div class="new-window"  v-if="status==1">
      <i class="invest-success"></i>
      <p>充值成功</p>
      <div class="btn" @click="handleCloseInvertingClick">返回</div>
    </div>
    <!--失败 弹框 -->
    <div class="new-window"  v-if="status==2">
      <i class="invest-fail"></i>
      <p>充值失败</p>
      <div class="btn" @click="handleCloseInvertingClick">返回</div>
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
import flexible from '../axios/js/flexible.js'
import util from '../axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,closeAppPageApp,setNavigationStatusApp} from '@/axios/axios_vue';
import {autoSign,getPayConfig,pay,getDetail,paySearch} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    data () {
        return {
          loading:false,
          isInvest:-1,//成功1 失败0

          selectPayWay:null,//选择的支付方式 支付渠道，1：支付宝，2：微信
         

          isInvestBack:-1,//充值后返回 1
          status:null,//0: 等待支付 1：支付成功 2：支付失败 3：支付处理中
          payId:null,
          orderNo:null,
          iosStatus:0,//1成功 2失败
          Time:null,


          testAppData:{
            appKey:"android_user",
            uuid:"3072562a-69d5-490c-939e-fc0a562787f8",
            sessionId:"a34056eea8741ea56fe0c884bcabb717",
            source:"JxhOfficial",
          },

          toPayUrl:'#',

          range:3,
          isAgreeTreaty:false,//是否同意协议
          memberRangeInfo:{},//会员等级

          
        }
    },
   computed:{
      ...mapState(['bank'])
    },

    created(){
      //alert('created');
      window.callJsRefresh = this.callJsRefresh; 
    },
    mounted() {
      //setNavigationStatusApp(1);
      //alert('1')
      //this.loading = true;
      this.title = "充值结果";
      document.title = this.title;  

      //获取会员等级信息
      this.memberRangeInfo = this.bank.saveBuyMemberRangeInfo ? this.bank.saveBuyMemberRangeInfo:{};
      


      this.isInvestBack =  util.GetUrlParam('back') || this.$route.query.back;
      this.orderNo =  util.GetUrlParam('orderNo') || this.$route.query.orderNo;

      this.iosStatus = util.GetUrlParam('status') || this.$route.query.status;
      //showLogDialogApp(this.isInvestBack);
      //showLogDialogApp(this.orderNo);
      let _this = this;
      //alert(this.iosStatus)
      if(AndroidOrIos==1){
        if(this.iosStatus==1){
          this.status = 1;
        }
        else if(this.iosStatus==2){
          this.status = 2;
        }
        else{
           this.status = 3;
        }
      }
      else{
        if(this.orderNo){
          let _refresh = 10;
          this.Time = setInterval(() => {
            if(_refresh > 0){
              _refresh --;
              this.paySearchRequest();
            }else{
              window.clearInterval(this.Time);
            } 
          }, 1000);
        }
      }
      
      //alert('2')
     
      //this.getDetailRequest();
      //this.getPayConfigRequest();
    },
    methods: {
      

       //4.5 充值订单查询
      paySearchRequest(){

        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.tagId = this.selectedTagId;

      

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.orderNo = this.orderNo;
        //obj.tagId = this.selectedTagId;

        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(paySearch, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);
          
          //showLogDialogApp(obj_str);
          //alert(obj_str)
          this.isShowAdding = false;
          let _this = this;
          if(code == "00"){
            this.status = result.status;
             clearWebCacheApp();
             if(result.status == 0 || result.status == 3){
              document.title = '充值中';
             }else if(result.status == 1 ){
              document.title = '充值成功';
              window.clearInterval(this.Time);
             }else if(result.status == 2 ){
              document.title = '充值失败';
              window.clearInterval(this.Time);
             }
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });

      },

     
      //关闭充值中弹框 点击
      handleCloseInvertingClick(){
        setNavigationStatusApp(0,0);
        closeAppPageApp();
      },
     
      callJsRefresh(){
       // alert('callJsRefresh');
        //reloadWebViewApp();
        
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
        closeAppPageApp();
      },
   
    }
};
</script>
<style lang="scss" scoped>
.container {
  width: 10rem;
  height: 100vh;
  background: #F6F7FA;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  .header {
   
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0.32rem;
    background: #FFF;
    text-align: center;
    border-bottom: 2px solid #DDD;
    z-index: 99;
    img {
      width: 0.46rem;
      height: 0.64rem;
      margin-top: 0.34rem;
      position: absolute;
      left: 0.4rem;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      font-weight: bold;
      color: #fff;
      font-size:0.48rem;
      vertical-align: middle;
    }
  }

  .new-window{
    width: 100%;
    height: 100%;
    background: #FFF;
    font-family:PingFangSC-Regular;
    text-align:center;
    i{
      display: inline-block;
      width: 2rem;
      height: 2rem;
      margin-top: 2rem;
      background-size: 94%;
      background-repeat: no-repeat;
    }
    .investing{
      background-image: url(../assets/images/ctm/icon_rzxx_rzs@2x.png);
    }
    .invest-success{
      background-image: url(../assets/images/ctm/icon_rzxx_ywc@3x.png);
    }
    .invest-fail{
      background-image: url(../assets/images/ctm/icon_rzxx_rzsb@3x.png);
    }
    p{
      color:#152758;
      font-size:0.46rem;
      line-height:1.2rem;
    }
    .btn{
      margin:0 auto;
      text-align: center;
      display: inline-block;
      width: 5rem;
      height: 1.2rem;
      line-height:1.2rem;
      border-radius:0.6rem;
      background:#4780E9;
      color:#FFF;
      margin-top: 1rem;
      font-size:0.44rem;
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
        background-image: url(../assets/images/ctm/icon_ty_xy_yxz@3x.png);
      }
      .fail{
        background-image: url(../assets/images/ctm/icon_csxz_scxz@3x.png);
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

