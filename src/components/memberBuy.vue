<template>
  <div class="container">
     <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>购买</span>
    </div>

    <div class="list">
       
      <ul>
        <li>
          <div class="name">
            <span class="range gloden" v-if="memberRangeInfo.level==1"><i></i><em>黄金会员</em></span> 
            <span class="range birkin" v-if="memberRangeInfo.level==2"><i></i><em>铂金会员</em></span> 
            <span class="range diamond" v-if="memberRangeInfo.level==3"><i></i><em>钻石会员</em></span> 
          </div>
          <div class="number-btn">
            <div class="num">
                <strong>{{memberRangeInfo.originalPrice}}</strong>
                <span>( 赠<em>{{isNaN(Number(memberRangeInfo.amount))?'0':Number(memberRangeInfo.amount)}}金币</em> )</span>    
            </div>
          </div>
          <div class="month">
            <i></i>
            <span>{{memberRangeInfo.desc}}</span>
            
          </div>
        </li>
      </ul>
    </div>

    <div class="money">
      <label>实际需支付金额</label>
      <span>￥{{memberRangeInfo.money}}</span>
    </div>

    <div class="content">
      <h2 v-if="!isIOS">支付方式</h2>
      <ul class="way" v-if="!isIOS">
        <li @click="handleSelectPayWayClick(1)">
          <span>支付宝支付</span>
          <i :class="selectPayWay==1?'active':''"></i>
        </li>
        <li @click="handleSelectPayWayClick(2)">
          <span>微信支付</span>
          <i :class="selectPayWay==2?'active':''"></i>
        </li>
         <li @click="handleSelectPayWayClick(3)">
          <span>银行卡支付</span>
          <i :class="selectPayWay==3?'active':''"></i>
        </li>
        
      </ul>
      <p class="treaty">
        <i :class="isAgreeTreaty?'active':''" @click="isAgreeTreaty = !isAgreeTreaty"></i>
        <span>点击充值即表示你已同意</span>
        <em @click="handleTreatyClick">《充值协议》</em>
      </p>
      
      
    </div>
    <div class="btn" @click="handleInvestClick">确认充值</div>


    <!--充值处理中 弹框 -->
    <div class="new-window"  v-if="isInvestBack==1">
      <i class="investing"></i>
      <p>充值处理中...</p>
      <div class="btn" @click="handleCloseInvertingClick">返回</div>
    </div>
    <!--成功 弹框 -->
    <div class="new-window"  v-if="isInvestBack==1&&status==1">
      <i class="invest-success"></i>
      <p>充值成功</p>
      <div class="btn" @click="handleCloseInvertingClick">返回</div>
    </div>
    <!--失败 弹框 -->
    <div class="new-window"  v-if="isInvestBack==1&&status==2">
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
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,setNavigationStatusApp,callPhoneApp,buyForIOSApp} from '@/axios/axios_vue';
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
          productId:null,
          Time:null,
          isIOS:false,
          isSureInvest:true,


          testAppData:{
            appKey:"android_user",
            uuid:"3072562a-69d5-490c-939e-fc0a562787f8",
            sessionId:"a34056eea8741ea56fe0c884bcabb717",
            source:"JxhOfficial",
          },

          toPayUrl:'#',

          range:3,
          isAgreeTreaty:true,//是否同意协议
          memberRangeInfo:{},//会员等级

          
        }
    },
   computed:{
      ...mapState(['bank'])
    },

    created(){
     setNavigationStatusApp(0,0);
      //alert('created');
      window.callJsRefresh = this.callJsRefresh; 
    },
    mounted() {
      window.callJsRefresh = this.callJsRefresh; 
      setNavigationStatusApp(0,0);
      //alert('1')
      //this.loading = true;
      document.title = "购买";  
     
      //获取会员等级信息
      let _saveBuyMemberRangeInfo = localStorage.getItem('saveBuyMemberRangeInfo');
       //alert(_saveBuyMemberRangeInfo)
      this.memberRangeInfo =  JSON.parse(_saveBuyMemberRangeInfo);
      this.payId = _saveBuyMemberRangeInfo ? this.memberRangeInfo.payId:null;
      this.productId = _saveBuyMemberRangeInfo ? this.memberRangeInfo.productId:null;


      // this.memberRangeInfo = this.bank.saveBuyMemberRangeInfo ? this.bank.saveBuyMemberRangeInfo:{};
      // this.payId = this.bank.saveBuyMemberRangeInfo ? this.bank.saveBuyMemberRangeInfo.payId:null;


      this.isInvestBack =  util.GetUrlParam('back') || this.$route.query.back;
      this.orderNo =  util.GetUrlParam('orderNo') || this.$route.query.orderNo;
      //showLogDialogApp(this.isInvestBack);
      //showLogDialogApp(this.orderNo);
      let _this = this;

      if(AndroidOrIos==1){
        this.isIOS = true;
      }else{
        this.isIOS = false;
      }
      //alert(AndroidOrIos)
      //showLogDialogApp(AndroidOrIos);
      //alert(this.isIOS)


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
      

      //setNavigationStatusApp(1);
      //var obj = new Object();
      //var appReturnStr = getSignParamFromApp(obj);
      //callPhoneApp('18721637427')


      //alert('2')
     
      //this.getDetailRequest();
      //this.getPayConfigRequest();
    },
    methods: {

      //用户充值
      payRequest(){
        // let newObj = this.testAppData;
        // newObj.payChannel = this.selectPayWay;
        // newObj.payId = this.payId;
        // newObj.sign = autoSign(newObj);
       


        var obj = new Object();
        obj.payId = this.payId;
        obj.payChannel = this.selectPayWay;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str);
        // alert(obj_str)
        

        sendRequest_app(pay, newObj).then((res) => {
          let {code,msg,result} = res;
           let obj_str = JSON.stringify(res)
           //showLogDialogApp(obj_str);
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
              this.loading = false;
           // if(this.selectPayWay==3){
              setNavigationStatusApp(1,2)
              clearWebCacheApp();
              //setNavigationStatusApp(1);
              var eleLink = document.createElement('a');
              eleLink.style.display = 'none';
              eleLink.innerHTML = '支付跳转中...'
              eleLink.href = result.url;
              // 触发点击
              document.body.appendChild(eleLink);
              eleLink.click();
              // 然后移除
              document.body.removeChild(eleLink);
            //}
            // else{
            //   var eleDiv = document.createElement('div');
            //   eleDiv.appendChild(result.url);
            //   document.body.appendChild(eleDiv);
            //   var form = document.getElementById('alipay_submit');
            //   //再次修改input内容

            //   form.submit();
            //   //eleLink.style.display = 'none';
            // }
            
           
             //this.isInvest = 1;

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

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

      //充值 点击
      handleInvestClick(){
        // alert('充值')
        // callPhoneApp('13650505050')
       
         
        //showLogDialogApp(document);
        if(!this.selectPayWay && !this.isIOS){
          this.toastShowHide('请选择支付方式','bottom',2000);
          return false;
        }
        else if(!this.isAgreeTreaty){
          this.toastShowHide('请先阅读《充值协议》','bottom',2000);
          return false;
        }
        else{
          
          let _this = this;
          if(this.isIOS){
            if(this.isSureInvest){
               buyForIOSApp(this.payId);
               //_this.loading = true;
              _this.isSureInvest=false;
              let _time = setTimeout(() => {
                _this.isSureInvest=true;
               // _this.loading = false;
                clearTimeout(_time);
              }, 2000);
            }
          }else{
            this.loading = true;
            this.payRequest();
          }
        }

        
      },

     
      //选择支付方式 点击
      handleSelectPayWayClick(val){
        this.selectPayWay = val;
      },
      //关闭充值中弹框 点击
      handleCloseInvertingClick(){
        document.title = "购买"; 
        this.isInvestBack = -1;
        this.getDetailRequest();
        //this.getPayConfigRequest();
      },
      //查看协议
      handleTreatyClick(){
        sessionStorage.setItem('isMember',1);
        setNavigationStatusApp(1,2);
        this.$router.push({path:'/memberTreaty'});
      },
      callJsRefresh(){
        setNavigationStatusApp(0,0);
        let _saveBuyMemberRangeInfo = localStorage.getItem('saveBuyMemberRangeInfo');
        this.memberRangeInfo =  JSON.parse(_saveBuyMemberRangeInfo);
        this.payId = _saveBuyMemberRangeInfo ? this.memberRangeInfo.payId:null;
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
  background: #F6F7FA;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  padding-top:1.4rem;
  .header {
    padding-top: 0.32rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    top:0;
    background: #4780E9;
    text-align: center;
    border-bottom: 2px solid #FAFAFC;
    z-index: 99;
    img {
       width: 0.68rem;
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

  .list{
    margin:0 auto;
    width:9.2rem;
    margin-bottom: 0.68rem;
    box-shadow: 0px 0.02rem 0.1rem 1px rgba(240,240,240,1);
    h4{
      font-size: 0.44rem;
      color:#858FAB;
      font-weight:500;
      span{
        vertical-align: middle;
      }
      i{
        display: inline-block;
        width: 0.46rem;
        height: 0.46rem;
        margin-left:0.1rem;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(../assets/images/rmb/icon_hycz_hyqy@3x.png); 
        vertical-align: middle;
      }
    }
    ul{
      margin-top:0.2rem;
      li{
        background: #fff;
        border-radius:0.2rem;
        padding: 0.32rem;
        margin-top: 0.4rem;
        .name{
          height: 1rem;
          padding-left: 0.4rem;
          display: flex;
          align-items: center;
          .range{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.8rem;
            line-height: 0.8rem;
            border-radius:0 0.4rem 0.4rem 0;
            font-weight: 500;
            font-size: 0.42rem;
            
            i{
              display: inline-block;
              width: 0.8rem;
              height: 0.8rem;
              position: relative;
              left: -0.4rem;
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
            }
            em{
              position: relative;
              left: -0.3rem;
            }
          }
          .discount{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.48rem;
            height: 0.6rem;
            margin-left: 0.2rem;
            color: #fff;
            font-size: 0.32rem;
            font-style: normal;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(../assets/images/rmb/piv_hycz_zk@3x.png); 
          }
          .gloden{
            background:linear-gradient(90deg,rgba(233,201,140,0.2) 0%,rgba(244,217,165,0.2) 100%);
            color:#AB7323;
            i{
              background-image: url(../assets/images/rmb/icon_hjhy@3x.png); 
            }
          }
          .birkin{
            background:linear-gradient(90deg,rgba(224,228,255,0.2) 0%,rgba(159,172,255,0.2) 100%);
            color:#524DA9;
            i{
              background-image: url(../assets/images/rmb/icon_bjhy@3x.png); 
            }
          }
          .diamond{
            background:linear-gradient(90deg,rgba(226,203,255,0.2) 0%,rgba(189,135,255,0.2) 100%);
            color:#6A40A6;
            i{
              background-image: url(../assets/images/rmb/icon_zshy@3x.png); 
            }
          }
        }
        .number-btn{
          
          margin-top:0.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .num{
            strong{
              font-size:0.52rem;
              color:#152758;
            }
            span{
              color:#858FAB;
              font-size: 0.44rem;
              em{
                color:#FFA119;
              }
            }
          }
          .btn{
            
          
            color:#fff;
            border-radius:0.12rem;
            padding:0.16rem 0.18rem;
            font-size: 0.32rem; 
            display: flex;
            align-items: center;
            justify-content: space-between;

          }
          .can-buy{
            background: #4780E9;
          }
          .no-buy{
            background:linear-gradient(90deg,rgba(212,217,225,1) 0%,rgba(188,196,211,1) 100%);
          }
        }
        .month{
          margin-top:0.36rem;
          display: flex;
          align-items: center;
          font-size: 0.36rem;
          color:#858FAB;
          i{
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(../assets/images/rmb/icon_hycz_qy@3x.png); 
          }
          span{
            display: inline-block;
            margin-left:0.12rem;
          }
          em{
            display: inline-block;
            margin-left:0.36rem;
          }
          .origin-cost{
            position: relative;
            top: -0.96rem;
            left: 1.6rem;
            text-decoration:line-through;
            color:#858FAB;
          }
        }
        
      }
    }
  }

  .money{
    height: 1.2rem;
    margin-bottom: 0.32rem;
    padding: 0 0.4rem;
    font-size: 0.46rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    label{
      color:#858FAB;
    }
    span{
      color:#FF7D27;
    }
  }


  .content{ 
    margin:0 auto;
    padding: 0 0.4rem;
    padding-top: 0.2rem;
    background: #fff;

    padding-bottom: 0.4rem;
    
    h2{
      font-size:0.46rem;
      color:#162758;
      font-weight:600;
      padding:0.2rem 0;
    }
      
    .way{
        height: 7rem;
      li{
        height: 1.2rem;
        display: flex;
        justify-content:space-between;
        align-items:center;
        font-size:0.4rem;
        color:#162758;
        span{
          height: 100%;
          display: flex;
          justify-content: center;
          align-items:center;
          padding-left:0.72rem;
          background-size: 18%;
          background-position-y: center;
          background-repeat: no-repeat;
          

        }
        i{
          display: inline-block;
          width: 0.48rem;
          height: 0.48rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../assets/images/ctm/icon_ty_xy_wxz@3x.png);
        }
        i.active{
          background-image: url(../assets/images/ctm/icon_ty_xy_yxz@3x.png);
        }
      }
      li:nth-of-type(1){
        span{
          background-image: url(../assets/images/ctm/pic_zfb@2x.png);
        }
      }
      li:nth-of-type(2){
        span{
          background-image: url(../assets/images/ctm/weixinzhifu2.png);
          background-size: 22%;
        }
      }
      li:nth-of-type(3){
        span{
          background-image: url(../assets/images/ctm/icon_cz_yhk@3x.png);
          background-size: 18%;
        }
      }
    }
    .treaty{
      text-align: center;
      position: absolute;
      bottom: 1.6rem;
      left: 0;
      right: 0;
      font-size: 0.328rem;
      color:#858FAB;
     
      span{
         vertical-align: middle;
      }
     
      em{
        color:#FFA11A;
        vertical-align: middle;
      }
      i{
        display: inline-block;
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.2rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../assets/images/ctm/icon_ty_xy_wxz@3x.png);
        vertical-align: middle;
      }
      i.active{
        background-image: url(../assets/images/ctm/icon_ty_xy_yxz@3x.png);
      }
    }
    
  }
  .btn{
    position: absolute;
    bottom:0;
    width: 100%;
    height: 1.28rem;
    display: flex;
    justify-content: center;
    align-items:center;
    
    background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
    color:#FFFFFF;
    font-size:0.42rem;

  }

  .new-window{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
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

