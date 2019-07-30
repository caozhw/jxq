<template>
  <div class="container"  :style="{paddingTop:isIOS?'1.32rem':'0'}">
    <!-- <div class="header" > -->
     <!-- <div class="header" v-if="isMember">
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/api/icon_back_white@3x.png" alt>
      </a>
      <span>立即充值</span>
      <em  @click="handleRechargeListClick">充值记录 </em>
    </div>  -->

    <!-- <div class="content" :style="{marginTop:isMember?'1.74rem':0}"> -->
   
    <div class="content">
      <div class="money">
        <label>金币余额<em>（会员可使用金币进行抢单）</em></label>
        <span>{{accountBalance}}</span>
      </div>

      <h2>选择充值金币</h2>
      <div class="select">
        <div v-for="(item,index) in coinList" :key="index" :class="selectCoinIndex==index?'select-item active':'select-item'" @click="handleSelectCoinClick(item,index)">
          <i class="tj" v-if="item.isSpecial==1"></i>
          <strong>{{item.name}}</strong>
          <span>¥{{isNaN(parseInt(item.amount))?'00':item.amount}}</span>
        </div>

        <!-- <div class="select-item active" >
          <i></i>
          <strong>1000币</strong>
          <span>¥1000</span>
        </div>

        <div class="select-item">
          <i></i>
          <strong>2000币</strong>
          <span>¥2000</span>
        </div>

        <div class="select-item">
          <i class="tj"></i>
          <strong>3000币</strong>
          <span>¥2800</span>
        </div>

        <div class="select-item">
          <i class="tj"></i>
          <strong>5000币</strong>
          <span>¥4500</span>
        </div>

        <div class="select-item">
          <i class="tj"></i>
          <strong>8888币</strong>
          <span>¥8000</span>
        </div> -->
        
        
      </div>

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
      <div style="height:auto"></div>
       <p class="treaty">
        <i :class="isAgreeTreaty?'active':''" @click="isAgreeTreaty = !isAgreeTreaty"></i>
        <span>点击充值即表示你已同意</span>
        <a href="#" @click="handleTreatyClick">《充值协议》</a>
      </p>
      
      
    </div>
    <div class="btn" @click="handleInvestClick">确认充值</div>

     <!--成功 弹框 -->
    <!-- <div class="alert-msg" v-if="isInvest==1">
      <div class="alert-content">
       <strong class="success">支付成功</strong>
      </div>
    </div> -->
    <!--失败 弹框 -->
   <!--  <div class="alert-msg" v-if="isInvest==0">
      <div class="alert-content">
       <strong class="fail">支付失败</strong>
      </div>
    </div> -->

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
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,pushMineRecordVCApp,buyForIOSApp,setNavigationStatusApp} from '@/axios/axios_vue';
import {autoSign,getPayConfig,pay,getDetail,paySearch} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    data () {
        return {
          loading:false,
          isInvest:-1,//成功1 失败0

          selectPayWay:null,//选择的支付方式 支付渠道，1：支付宝，2：微信
          selectCoinIndex:-1,//选择的金币
          selectCoinData:{},
          coinList:[],//金币列表
          accountBalance:0,//账户余额

          isInvestBack:-1,//充值后返回 1
          status:null,//0: 等待支付 1：支付成功 2：支付失败 3：支付处理中
          payId:null,
          orderNo:null,
          Time:null,
          productId:null,

          isIOS:false,
          isSureInvest:true,


          testAppData:{
            appKey:"android_user",
            uuid:"3072562a-69d5-490c-939e-fc0a562787f8",
            sessionId:"a34056eea8741ea56fe0c884bcabb717",
            source:"JxhOfficial",
          },

          toPayUrl:'#',

          isAgreeTreaty:true,//是否同意协议

          isMember:0,//是否是会员进入

          
        }
    },
    computed:{

      
    },
    // beforeCreate(){
    //   //alert('beforeCreate');
    //   window.callJsRefresh = this.callJsRefresh; 
    //   //setNavigationStatusApp(1,1);
     
    // },

    created(){
      //setNavigationStatusApp(1,1);
      //alert('created');
      window.callJsRefresh = this.callJsRefresh; 
    },
    mounted() {
      //alert('1')
      window.callJsRefresh = this.callJsRefresh;
      this.loading = true;
      document.title = "立即充值";  
      this.isInvestBack =  util.GetUrlParam('back') || this.$route.query.back;
      this.orderNo =  util.GetUrlParam('orderNo') || this.$route.query.orderNo;
      //showLogDialogApp(this.isInvestBack);
      //showLogDialogApp(this.orderNo);

      if(AndroidOrIos==1){
        this.isIOS = true;
      }else{
        this.isIOS = false;
      }


      let _this = this;
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
      //alert('2')
     // window.callJsRefresh = this.callJsRefresh; 
      this.getDetailRequest();
      this.getPayConfigRequest();

      this.isMember = sessionStorage.getItem('isMember')||0;
    },
    methods: {
      //4.1 获取登录用户基本信息接口
      getDetailRequest(){
        // let newObj = this.testAppData;

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
      

        
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(getDetail, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
           this.loading = false;
           // let _accountBalance = result.accountBalance;
            this.accountBalance =  result.accountBalance;
            //this.accountBalance = isNaN(parseInt(_accountBalance))?'00':parseInt(_accountBalance);

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //用户充值参数页
      getPayConfigRequest(){
        // let newObj = this.testAppData;

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
      
        if(this.isIOS){
          obj.isIos = 1;
        }
        
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj);
        //showLogDialogApp(obj_str);
        //alert(obj_str)

        sendRequest_app(getPayConfig, newObj).then((res) => {
          let {code,msg,result} = res;
           let obj_str = JSON.stringify(res);
           //showLogDialogApp(obj_str);
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
           this.loading = false;
           this.coinList = result.list;



          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //用户充值
      payRequest(){
        // let newObj = this.testAppData;
        // newObj.amount = this.selectCoinData.amount;
        // newObj.name = this.selectCoinData.name;
        // newObj.payChannel = this.selectPayWay;

        // newObj.sign = autoSign(newObj);
       


        var obj = new Object();
        obj.amount =  this.selectCoinData.amount;
        obj.name = this.selectCoinData.name;
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
              clearWebCacheApp();
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
        //showLogDialogApp(document);
        if(this.selectCoinIndex == -1){
          this.toastShowHide('请选择充值金币','bottom',2000);
          return false;
        }

        else if(!this.selectPayWay && !this.isIOS){
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
              // _this.loading = true;
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

      //选择充值金币 点击
      handleSelectCoinClick(item ,index){
        this.selectCoinIndex = index;
        this.selectCoinData = item;
        this.payId = item.payId;
        this.productId = item.productId;
      },
      //选择支付方式 点击
      handleSelectPayWayClick(val){
        this.selectPayWay = val;
      },
      //关闭充值中弹框 点击
      handleCloseInvertingClick(){
        document.title = "立即充值"; 
        this.isInvestBack = -1;
        this.getDetailRequest();
        this.getPayConfigRequest();
      },
      //查看协议
      handleTreatyClick(){
        this.$router.push({path:'/investTreatyTwo'});
      },

      //充值记录
      handleRechargeListClick(){
        pushMineRecordVCApp();
      },


      callJsRefresh(){
       //alert('callJsRefresh');
        //reloadWebViewApp();
        //setNavigationStatusApp(1,1);
        this.getDetailRequest();
        this.getPayConfigRequest();
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
        sessionStorage.setItem('isMember',0);
        goBackPage();
        
        
      },
   
    }
};
</script>
<style lang="scss" scoped>
.container {
  width: 10rem;
 
  background: #fff;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  .header {
    padding-top: 0.32rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0;
    background: #FFF;
    text-align: center;
    border-bottom: 1px solid #DDDDDD;
    img {
      width: 0.28rem;
      height: 0.5rem;
      margin-top: 0.45rem;
      position: absolute;
      left: 0.4rem;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      font-weight: bold;
      color: #1d1b1b;
      font-size:0.48rem;
      vertical-align: middle;
    }
    em{
      position: absolute;
      right: 0.4rem;
      color: #FFA11A;
      font-size: 0.36rem;
    }
  }
  .content{ 
    margin:0 auto;
    // margin-top:1.32rem;
    margin-bottom: 0.4rem;
    width:9.2rem;
      .money{
       
        margin-top:2vh;  
       
        height: 2.6rem;
        padding-top:0.6rem;
        padding-left:0.4rem;
        
        border-radius:0.2rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../assets/images/ctm/pic_ld@3x.png);
        background-color:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
        label{
          color:rgba(255,255,255,1);
          display: block;
          font-size: 0.36rem;
          font-weight: 300;
          em{
            font-size: 0.34rem;
            color:rgba(255,255,255,0.7);
          }
        } 
        span{
          display: block;
          font-size:0.86rem;
          font-weight:500;
          color:#FFFFFF;
          margin-top:0.2rem;
        }
      }
      h2{
        font-size:0.46rem;
        color:#162758;
        font-weight:600;
        padding:0.2rem 0;
      }
      .select{
        display: flex;
        flex-wrap:wrap;
        justify-content: space-between;
        div{
          width: 30%;
        }
        .select-item{
          height: 1.8rem;
          border:1px solid #EEEEEE;
          border-radius:0.2rem;
          display: flex;
          flex-direction:column;
          align-items:center;
          justify-content: center;
          color:#162758;
          margin-bottom: 0.28rem;
          position: relative;
          strong{
            display: block;
            font-weight:400;
            font-size:0.48rem;
          }
          span{
            display: block;
          }
          .tj{
            display: inline-block;
            width: 1rem;
            height: 0.6rem;
            position: absolute;
            right: 0;
            top: -0.18rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url(../assets/images/ctm/pic_tt@3x.png);
          }
        }
        div.active{
          border:1px solid #FFA11A;
          color:#FFA321;
          background:rgba(255,251,245,0.76);
        }
      }
      .way{
        li{
          height: 1rem;
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
        // position: absolute;
        // bottom: 1.6rem;
        // left: 0;
        // right: 0;
        text-align: center;
        //  margin-top: 1rem;
        //margin-top: 4.4rem;
        margin-bottom:0.32rem;
        font-size: 0.328rem;
        color:#858FAB;
        span{
         vertical-align: middle;
        }
        a{
          color:#FFA11A;
           vertical-align: middle;
        }
        i{
          display: inline-block;
          width: 0.48rem;
          height: 0.48rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../assets/images/ctm/icon_ty_xy_wxz@3x.png);
          margin-right: 0.2rem;
          vertical-align: middle;
        }
        i.active{
          background-image: url(../assets/images/ctm/icon_ty_xy_yxz@3x.png);
        }
      }
     

  }
  .btn{
  //  position: fixed;
  //  bottom: 0;
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

