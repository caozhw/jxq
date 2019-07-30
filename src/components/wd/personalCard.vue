<template>
  <div class="container">
    <!-- <div class="header">
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/icon_back_white.png" alt>
      </a>
      <span>{{title}}</span>
    </div> -->
    <div class="top">
     <!-- <a href="jxq://">苹果金享圈</a>
     <a href="app://android/jxq">安卓金享圈</a> -->
     <div class="card"> 
        <div class="name">
          <div class="info">
           <p>
              <strong>{{result.name}}</strong>
              <i v-if="result.idVerifyFlag==1"></i>
              <i v-if="result.verifyFlag==2"></i>
           </p>
            <p>
              <span>{{userDetail.orgName?userDetail.orgName:userDetail.orgShortName}}</span>
            </p>
          </div>
          <img :src="result.avatarUrl" />
        </div>
        <div class="link">
          <p>
            <i></i>
            <span>{{userDetail.workCityName}}</span>
            <em></em>
          </p>
           <p>
            <i></i>
            <span>{{userDetail.weChatHide?userDetail.weChatHide:'--'}}</span>
            <em v-if="result.state==2">(交换名片后可见)</em>
            <em class="copy" v-if="result.state==1&&exchangeAgentId!=agentId" @click="handleCopyWeChatClick">复制</em>
          </p>
          <p>
            <i></i>
            <span>{{result.phone?result.phone:'--'}}</span>
            <em v-if="result.state==2">(交换名片后可见)</em>
            <em class="copy" v-if="result.state==1&&exchangeAgentId!=agentId" @click="handleCallClick">呼叫</em>
          </p>
        </div>
     </div>
     <div class="num">
       <p>
         人脉：{{result.peopleCount}}
       </p>
        <p>
         动态：{{result.postCount}}
       </p>
     </div>
    </div>
   
    <ul>
      <li>
        <label>职位</label>
        <span v-if="userDetail.job">{{userDetail.job}}</span>
        <em v-if="!userDetail.job">暂未添加</em>
      </li>
       <li>
        <label>性别</label>
        <span v-if="result.gender">{{genderFmt(result.gender)}}</span>
        <em v-if="!Number(result.gender)">暂未添加</em>
      </li>
       <li>
        <label>从业年限</label>
        <span v-if="userDetail.workAge&&userDetail.workAge!='0'">{{userDetail.workAge}}</span>
        <em v-if="!userDetail.workAge||userDetail.workAge=='0'">暂未添加</em>
      </li>
       <li>
        <label>业务</label>
        <span v-if="userDetail.business">{{userDetail.business}}</span>
        <em v-if="!userDetail.business">暂未添加</em>
      </li>
      <li>
        <label>个人介绍</label>
        <span v-if="userDetail.summary">{{userDetail.summary}}</span>
        <em v-if="!userDetail.summary">暂未添加</em>
      </li>
    </ul>
    <!-- 未交换 -->
    <div class="btns" v-if="result.state==2">
      <span class="share-btn" @click="handleShareClick" v-if="exchangeAgentId==agentId">分享名片</span>
      <span class="exchange-btn" @click="handleExchangeClick" v-if="exchangeAgentId!=agentId">交换名片</span>
    </div>
     <!-- 已经交换 -->
    <div class="btns" v-if="result.state==1">
      <span class="share-btn" @click="handleShareClick" v-if="exchangeAgentId==agentId">分享名片</span>
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
import $ from 'jquery'
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
import flexible from '@/axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,shareTocircleApp,shareWithFriendsApp,showLogDialogApp,goEditBusinessApp,editBusinessShareApp,setNavigationStatusApp,copyContentApp, callPhoneApp,exchangeCardSuccessApp} from '@/axios/axios_vue';
import {autoSign,businessCard,exchangeCards,call} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
import util from '@/axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
          title:'名片查看',
          loading:false,
          exchangeAgentId:null,//查看他人名片，客户id
          agentId:null,//本人id

          userDetail:{},
          result:{},
          isChanged:false,
          tencentPstnCall:-1,//虚拟电话 1调用虚拟电话

         

          testAppData:{
            appKey:"android_user",
            uuid:"682300c8-3aa9-4445-8139-b763b1ae8518",
            sessionId:"6b0b0708a62aab448576c3883be64730",
            source:"JxhOfficial",
          },



        }
    },
    computed:{

      
    },
    mounted() {
      document.title = this.title;
      this.exchangeAgentId = util.GetUrlParam('exchangeAgentId') || this.$route.query.exchangeAgentId;
      this.agentId = util.GetUrlParam('agentId') || this.$route.query.agentId;
      window.callJsRefresh = this.callJsRefresh; 
      let _this = this;
     

     //this.exchangeAgentId =2;
     //this.agentId = 15;   
      this.businessCardRequest();
    },
    methods: {

       //3.8 名片
      businessCardRequest(){
        // let newObj = this.testAppData;
        // newObj.exchangeAgentId = this.exchangeAgentId; 
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.exchangeAgentId = this.exchangeAgentId; 
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(businessCard, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.result = result;// state 名片交换状态：1 已交换，2未交换   id	信贷员id 
            this.userDetail = result.userDetail;
            this.tencentPstnCall = result.tencentPstnCall;//虚拟电话

            delete  newObj.exchangeAgentId;
            
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

       //3.9 交换名片
      exchangeCardsRequest(){
        // let newObj = this.testAppData;
        // newObj.agentId = this.exchangeAgentId; 
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.agentId = this.userDetail.agentId; 
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(exchangeCards, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          let _this = this;
          if(code == "00"){
            this.isChanged = true;
            this.loading=false;
            this.toastShowHide('交换成功','center',2000);
            this.businessCardRequest();
            exchangeCardSuccessApp();
           
          }
          else{
            this.toastShowHide(msg,'bottom',2000);
          }
        });
      },

      //电话接口
      callRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj);

        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(call, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);
          //showLogDialogApp(obj_str);
          //alert(obj_str)
          //this.isShowAdding = false;
          let _this = this;
          this.isShowPhoneAlert = false;
          if(code == "00"){
          

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },
      //复制微信
      handleCopyWeChatClick(){
        copyContentApp(this.userDetail.weChat);
        this.toastShowHide('复制成功','center',2000);
      },
      //拨打电话  
      handleCallClick(){

        if(this.tencentPstnCall==1){
          this.callRequest();
        }else{
         callPhoneApp(this.result.phone);
        }
        
      },

      //分享名片
      handleShareClick(){
        editBusinessShareApp('3');
      },
      //交换名片
      handleExchangeClick(){
        this.loading=true;
        if(!this.isChanged){
          this.exchangeCardsRequest();
        }
       
      },

      //性别转换 性别 1：男 2：女
      genderFmt(gender){
        if(gender==1){
          return '男';
        }
        else if(gender==2){
          return '女'
        }
      },

      callJsRefresh(){
        this.businessCardRequest();
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
  .header {
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    top:0;
    background: #fff;
    text-align: center;
    border-bottom: 2px solid #FAFAFC;
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
  }

  .top{
   
    padding:0 0.4rem;
    padding-top:1rem;
    .card{
      height: 4rem;
      padding: 0.4rem;
      background-size:100%;
      background-repeat: no-repeat; 
      background-image: url(../../assets/images/mp/pic_mpbg@3x.png);
      .name{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info{
          p{
            display: flex;
            align-items: center;
            strong{
              font-size:0.48rem;
              font-weight:500;
              color:#FFF;

            }
            i{
              display: inline-block;
              width:0.4rem;
              height: 0.4rem;
              margin-left:0.2rem;
              background-size:100%;
              background-repeat: no-repeat; 
            }
            i:nth-of-type(1){
               background-image: url(../../assets/images/mp/icon_grzy_smrz@3x.png);
            }
            i:nth-of-type(2){
               margin-left:0.1rem;
               background-image: url(../../assets/images/mp/icon_grzy_gzrz@3x.png);
            }
            span{
              font-size:0.3rem;
              color:rgba(255,255,255,0.8);
            }
          }
        }
        img{
          width:1.32rem;
          height: 1.32rem;
          border-radius:50%;
          border:0;
        }
      }
      .link{
        margin-top:0.6rem;
        p{
          display: flex;
          align-items: center;
          font-size:0.3rem;
          margin-top:0.12rem;
          i{
            display: inline-block;
            width:0.56rem;
            height: 0.56rem;
            margin-right:0.2rem;
            background-size:100%;
            background-repeat: no-repeat; 
          }
          span{
             color:#fff;
          }
          em{
            display: inline-block;
            margin-left:0.2rem;
            color:rgba(255,255,255,0.5);
          }
          .copy{
            padding:0.04rem 0.26rem;
            border:1px solid rgba(255,255,255,0.5);
            border-radius:0.12rem;
          }
        }
        p:nth-of-type(1){
          i{
             background-image: url(../../assets/images/mp/icon_mp_dinwei@3x.png);
          }
        }
        p:nth-of-type(2){
          i{
             background-image: url(../../assets/images/mp/icon_mp_weixin@3x.png);
          }
        }
        p:nth-of-type(3){
          i{
             background-image: url(../../assets/images/mp/icon_mp_shouji@3x.png);
          }
        }
      }
    }
    .num{
      display: flex;
      align-items: center;
      justify-content: space-around;
      p{
        flex:1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:0.4rem;  
        color:#858FAB;  
        margin:0.24rem 0;
      }
      p:last-child{
        border-left:1px solid #CBD5E5;
      }
    }
    
    
      

    

  }
  ul{
   
    background: #fff;
    padding:0.4rem 0.4rem 0.56rem 0.4rem;
    li{
      padding:0.2rem 0;
      border-bottom:1px solid #EEEEEE;  
      label{
        display: block;
        color:#C1C8D9;
        font-size: 0.32rem;
        margin-bottom:0.18rem;
      }
      span{
        width: 100%;
        display: block;
         color:#203260;
        font-size: 0.48rem;
        word-break:break-all;
      }
      em{
        display: block;
        color:#C1C8D9;
        font-size: 0.46rem;
      }
    }
    
  }
  .btns{
    margin: 0.2rem 0;
    padding:0 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    span{
      flex:1;
      display: inline-block;
      padding:0.32rem 0;
      text-align: center;
      font-size:0.42rem;
      color:#FFF;
      border-radius:0.12rem;  
    }
    .share-btn{
      background: #4780E9;
    }
    .exchange-btn{
      background: #2DC87F;
      margin-left:0.32rem;
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

