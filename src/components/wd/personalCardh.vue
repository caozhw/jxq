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
            <span>{{userDetail.weChatHide}}</span>
            <em>(交换名片后可见)</em>
          </p>
          <p>
            <i></i>
            <span>{{result.phone}}</span>
            <em>(交换名片后可见)</em>
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
        <em v-if="!result.gender">暂未添加</em>
      </li>
       <li>
        <label>从业年限</label>
        <span v-if="userDetail.workAge">{{userDetail.workAge}}</span>
        <em v-if="!userDetail.workAge">暂未添加</em>
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
    <div class="btns">
    
      <span @click="handleExchangeClick">交换名片</span>
    </div>



      <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowTipAlert">
      <div class="alert-content">
        <div class="tip-warm">
          <p>请前往金享圈APP交换名片，拓展更多人脉</p>
          <div class="tip-btn">
            <span @click="handleDownloadClick">确定</span>
          </div>
        </div>
       
      </div>
    </div>
    
   
  </div>
</template>
<script>
import $ from 'jquery'
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
import flexible from '@/axios/js/flexible.js'
import {sendRequest_app} from '@/axios/axios_vue';
import {autoSign,viewBusinessCard} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
import util from '@/axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
          title:'名片查看',
          userId:null,//查看他人名片，客户id
          agentId:null,//本人id

          isShowTipAlert:false,

          userDetail:{},
          result:{},

         

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
      this.userId = util.GetUrlParam('userId') || this.$route.query.userId;
      //this.agentId = util.GetUrlParam('agentId') || this.$route.query.agentId;
      //window.callJsRefresh = this.callJsRefresh; 
      let _this = this;
     

     //this.exchangeAgentId =1;
      this.viewBusinessCardRequest();
    },
    methods: {

       //3.8 名片
      viewBusinessCardRequest(){
        let newObj = {};
        newObj.exchangeAgentId = this.userId; 
        newObj.sign = autoSign(newObj)


        // var obj = new Object();
        // obj.exchangeAgentId = this.exchangeAgentId; 
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(viewBusinessCard, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.result = result;
            this.userDetail = result.userDetail;
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //交换名片
      handleExchangeClick(){
      
        this.isShowTipAlert = true;
      },
      //去下载
      handleDownloadClick(){
        this.isShowTipAlert = false; 
        let _url = window.location.href.split('personalCardh')[0];
        window.location.href = _url + 'downloadPage';
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
        width: 100%;
        display: block;
        color:#C1C8D9;
        font-size: 0.32rem;
        margin-bottom:0.18rem;
      }
      span{
        display: block;
         color:#203260;
        font-size: 0.48rem;
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
    span:nth-of-type(1){
      background: #2DC87F;
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
    
      margin:0 auto;
      position: relative;
      top:5.2rem;
      border-radius: 0.12rem;
      
      .tip-btn{
        display: flex;
        
        align-items:center;
        span{
          color:#4780E9;
          border:1px solid #4780E9;
          border-radius:0.1rem;
          width: 2.8rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;

        }

      }
     
      .tip-warm{
        padding: 0.4rem 0.48rem;
        width: 6.68rem;
       
        p{
          color:#203260;
          font-size:0.42rem;
         text-align:left;
          margin-bottom:0.24rem;
          padding:0.4rem 0;
        }
        .tip-btn{
          width: 100%;
         display: flex;
          span{
            flex:1;
            background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
            color:#fff;
          }
        }
      }
      
      
    }
   
   

  }
 

  

}
</style>

