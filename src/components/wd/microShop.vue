<template>
  <div class="container">
    <!-- <div class="header">
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/icon_back_white.png" alt>
      </a>
      <span>{{title}}</span>
    </div> -->
    <div class="top">
      <div class="nav">
        <i class="back" @click="goBack"></i>
        <i class="share" @click="handleShareClick"></i>
      </div>
       <div class="info-ipt">
         <div  class="info"  >
            <img :src="agent.avatarUrl" />
            <div class="name">
             <p>
               <span>{{agent.name}}</span>
                <em class="n1" v-show="agent.idVerify"><i class="ni">已实名认证</i></em>
                <em class="w1" v-show="agent.workVerify"><i class="wi">已工作认证</i></em>
               <!-- <em class="n1" @mouseenter="isShowName=true" @mouseend="isShowName = false"><i :style="{display:isShowName?'block':'none'}">已实名认证</i></em>
               <em class="w1"  @touchstart="isShowWork=true" @touchend="isShowWork = false"><i v-if="isShowWork">已工作认证</i></em> -->
             </p>
             <p>
               {{agent.area}} | {{agent.orgType}} | {{orgNameFmt(agent.orgShortName)}}
             </p>
           </div>
           <div class="thro">
             <p style="position:relative;left:0.08rem">{{agent.scanNum}}</p>
             <p><i></i><span>浏览人数</span></p>
           </div>
         </div>
         <div class="ipt">
           <p @click="isShowIpt=true" v-show="!isShowIpt">{{summary}}</p>
           <textarea v-model="summary" v-show="isShowIpt" @blur="isShowIpt=false;saveSummaryRequest();">

           </textarea>
         </div>
       </div>
    </div>
    <div style="height: 2.4rem;background:#F6F7FA"></div>
    <div class="wrapper">
     
      
      
      <div></div>
      <h4>
        <span>主营业务</span>  
        <span @click="handleBussinessClick"><i></i><em>添加业务</em></span>
      </h4>
      <ul class="product">
        <li v-for="(item,index) in businessList" :key="index">
          <i v-if="item.applyNum">{{item.applyNum}}人申请</i>
          <div class="title">
            <span>{{item.tagName}}</span>
          </div>
          <div class="num">
            <p>
              <span>{{item.deadlineMax}}～{{item.deadlineMin}}</span>
              <label>额度</label>
            </p>
            <p>
              <span>{{item.quotaMin}}～{{item.quotaMin}}</span>
              <label>期限</label>
            </p>
            <p>
              <span>{{item.interestRateMin}}～{{item.interestRateMax}}</span>
              <label>月利息</label>
            </p>
           
          </div>
          <div class="ct">{{item.otherCondition}}</div>
          <div class="btn">
            <span @click="handleSelfinfoTopClick(item.id)">置顶</span>
            <span @click="handleDeleteMainBusinessClick(item.id)">删除</span>
          </div> 
        </li>

        <!-- <li>
          <i>20人申请</i>
          <div class="title">
            <span>信用贷</span>
          </div>
          <div class="num">
            <p>
              <span>5000～3万</span>
              <label>额度</label>
            </p>
            <p>
              <span>3～5月</span>
              <label>期限</label>
            </p>
            <p>
              <span>0.5～0.6%</span>
              <label>月利息</label>
            </p>
           
          </div>
          <div class="ct">应急短借特批渠道当天放款生意周转创业资金贷款手续 简单当场放款无任何抵押利息超低应急短借特批渠道当天放款生意周转创业资金贷款手续 简单当场放款无任何抵押利息超</div>
          <div class="btn">
            <span>置顶</span>
            <span>删除</span>
          </div> 
        </li> --> 
      </ul>
<!-- 
       <h4>
        <span>用户评价</span>
      </h4>
      <ul class="evaluate">
        <li>
          <p class="name">王先生：</p>
          <div class="star">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <p class="say">提交了很多资料，最后还是没有批下来</p>
        </li>
         <li>
          <p class="name">王先生：</p>
          <div class="star"></div>
          <p class="say">提交了很多资料，最后还是没有批下来</p>
        </li>
      </ul> -->

    </div>
     <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowTipAlert">
      <div class="alert-content">
        <div class="tip-phone" style="text-align: left;">
         
          <strong>温馨提示</strong>
          <p style="margin-bottom: 0.46rem;">确定删除该主营业务</p>
           <div class="tip-btn">
            <span @click="isShowTipAlert=false">取消</span>
            <span @click="handleDelClick">确定</span>
          
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
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,shareTocircleApp,shareWithFriendsApp,showLogDialogApp,goEditBusinessApp,editBusinessShareApp,setNavigationStatusApp} from '@/axios/axios_vue';
import {autoSign,miniShopInfo,miniShop,selfinfoTop,deleteMainBusiness,saveSummary} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
import util from '@/axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
          title:'个人微店',

          isShowIpt:false,
          summary:'',

          isShowName:false,
          isShowWork:false,
          delId:-1,

          isShowTipAlert:false,
          

          agent:{},
          businessList:{},


          testAppData:{
            appKey:"android_user",
            uuid:"7398f6ef-502c-4867-829a-3530a41773e7",
            sessionId:"d9dd3ee4dcc4e10f6ad789182fc6fd11",
            source:"JxhOfficial",
          },



        }
    },
    computed:{

      
    },
    mounted() {
      document.title = this.title;
      window.callJsRefresh = this.callJsRefresh; 
      let _this = this;
      $('.n1').on('touchstart',() => {
        $('.ni').css('display','inline-block');
      })
      $('.n1').on('touchend',() => {
        $('.ni').css('display','none');
      })
      $('.w1').on('touchstart',() => {
        $('.wi').css('display','inline-block');
      })
      $('.w1').on('touchend',() => {
        $('.wi').css('display','none');
      })
      //setNavigationStatusApp(0)
    
    this.miniShopRequest();
    },
    methods: {

       //8.12 个人微信信息
      miniShopRequest(){
        // let newObj = this.testAppData;
        
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
       
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(miniShop, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.agent = result.agent;
            if(result.agent.summary && result.agent.summary!='null'){
              this.summary = result.agent.summary;
            }else{
               this.summary = '一句话介绍自己，让更多客户了解你吧';
            }
            this.businessList = result.businessList;
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

       //置顶
      selfinfoTopRequest(id){
        // let newObj = this.testAppData;
        // newObj.businessId = id;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.businessId = id;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(selfinfoTop, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
           this.miniShopRequest();
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },
       //删除
      deleteMainBusinessRequest(id){
        let _this = this;
        // let newObj = this.testAppData;
        // newObj.businessId = id;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.businessId = id;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(deleteMainBusiness, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          
          if(code == "00"){
           // alert(123)
           _this.toastShowHide('删除成功','bottom',2000);

            _this.miniShopRequest();
            _this.isShowTipAlert=false;
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },
      //修改个人简介
      saveSummaryRequest(id){
        // let newObj = this.testAppData;
        // newObj.desc = this.summary;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.desc = this.summary;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(saveSummary, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
           this.miniShopRequest();
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

     
      //置顶 点击
      handleSelfinfoTopClick(id){
        this.selfinfoTopRequest(id);
      },
      //删除 点击
      handleDeleteMainBusinessClick(id){
        this.isShowTipAlert = true;
        this.delId = id;
       
      },

      handleDelClick(){
         this.deleteMainBusinessRequest(this.delId);
      },
      //主营业务
      handleBussinessClick(){
        goEditBusinessApp();
      },
      //分享
      handleShareClick(){
        editBusinessShareApp('2');
      },
      callJsRefresh(){
        this.miniShopRequest();
      },
      //公司信息格式化
      orgNameFmt(str){
        let _retStr = '';
        if(str.length>6){
          _retStr = str.substr(0,6) + '...';
        }
        else{
          _retStr = str;
        }
        return _retStr;
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
  background: #FAFAFC;
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
    height:3rem;
    background:linear-gradient(270deg,rgba(249,187,82,1) 0%,rgba(252,199,91,1) 100%);  
    padding-top:1rem;
    .nav{
      height: 1rem;
      padding: 0 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      i{
        display: inline-block;
        width: 0.4rem;
        height: 0.6rem;
        background-position: center;
        background-size:100%;
        background-repeat: no-repeat; 
       
      }
      i.back{
        width: 0.24rem;
         background-image: url(../../assets/images/ir/icon_dh_back@3x.png);
      }
      i.share{
         background-image: url(../../assets/images/wd/icon_fenxiang@3x.png);
      }
      i.edit{
         background-image: url(../../assets/images/wd/icon_bianji@3x.png);
      }

    }
    .info-ipt{
      height: 4rem;
      margin:0 0.4rem;
      background: #fff;
      position: relative;
      top:0;
      border-radius:0.12rem;
      .info{
        padding:0.4rem 0;  
        margin:0 0.4rem;
        border-bottom:1px solid #DDD;
        display: flex;
        align-items: center;
        position: relative;
        
        img{
          width: 1.2rem;
          height: 1.2rem;
        }
        .name{
          margin-left: 0.2rem;
          p{
            .org-name{
              display: flex;
              align-items: center;
              justify-content: center;
              width: 1rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            
          }
          p:first-child{
            display: flex;
            align-items: center;
            span{
              font-size:0.36rem;
              font-weight:500;
              color:#121C32;
            }
            em{
              display: inline-block;
              width: 0.4rem;
              height: 0.4rem;
              margin-left:0.1rem;
              background-position: center;
              background-size:100%;
              background-repeat: no-repeat; 
              i{
                
               display: none;
                position: relative;
                top: -0.84rem;
                left: -0.8rem;
                width: 2rem;
                height: 0.8rem;   
                text-align: center;
                line-height: 0.68rem;
                color:#FFF;
                background-position: center;
                background-size:100%;
                background-repeat: no-repeat; 
                background-image: url(../../assets/images/wd/icon_tankuang@3x.png);
              }
              
            }
            .n1{
              background-image: url(../../assets/images/wd/icon_grzy_smrz_zy@3x.png);
              margin:0 0.12rem;
            }
            .w1{
              background-image: url(../../assets/images/wd/icon_grzy_gzrz_zy@3x.png);
            }
            
          }
          p:last-child{
            color:#3A599E;
            font-size:0.32rem;
          }
          
        }
        .thro{
          position: absolute;
          right: 0;
          color:#84878A;
          p:first-child{
            text-align:center;
            font-size:0.40rem;
          }
          p:last-child{
             display: flex;
            align-items: center;
          }
          p{
            font-size:0.28rem;
           
            i{
              display: inline-block;
              width: 0.4rem;
              height: 0.4rem;
              background-position: center;
              background-size:100%;
              background-repeat: no-repeat; 
              background-image: url(../../assets/images/wd/icon_yincang@3x.png);
              margin-right:0.12rem;
            }
          }
        }
      }
      .ipt{
        color:#84878A;
        font-size:0.32rem;

           
        margin: 0.2rem 0.4rem;
        textarea{
          width: 100%;
          border: 0;
        }
        p{
           min-height: 0.8rem;
          width: 100%;
          height: 100%;
        }
      }

      
    }
  }
 
  .wrapper{

    padding:0 0.4rem;
    background: #F6F7FA;
    h4{
      padding-bottom: 0.36rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        font-size:0.36rem;
        color:#121C32;
      }
      span:first-child{
        font-weight:500;
       
      }
      span:last-child{
        display: flex;
        align-items: center;
        i{
          display: inline-block;
          width: 0.36rem;
          height: 0.36rem;
          background-position: center;
          background-size:100%;
          background-repeat: no-repeat; 
          background-image: url(../../assets/images/wd/icon_grzy_fbxdt@3x.png);
          margin-right:0.12rem;
        }
       
      }
    }
    .product{
      
      li{
        background: #fff;
        box-shadow:0px 2px 2px 0px rgba(0,0,0,0.08);
        border-radius:0.1rem;
        margin-bottom:0.32rem;
        padding:0.4rem;
        padding-bottom:0.2rem;
        position: relative;
        i{
          display: inline-block;
          font-size:0.36rem;
          color:#FFF;
          padding:0.12rem 0.24rem;
          background:linear-gradient(270deg,rgba(234,177,82,1) 0%,rgba(234,177,82,1) 100%);
          border-radius:0px 0px 0.12rem 0.12rem;
          position: absolute;
          top:0;
          right:0.6rem;
        }
        .title{
          span{
            color:#121C32;
            font-size:0.36rem;
          }
        }
        .num{
          margin:0.32rem 0;
          padding-right: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          p{
            display: flex;
            flex-direction: column;
            span{
              color:#EAB152;
              font-size:0.34rem;
              font-weight:500;
              

            }
            label{
              display: inline-block;
              margin-top:0.12rem; 
              font-size:0.34rem;
              color:#84878A;
            }
            
           
          }
        }
        .ct{
          font-size:0.32rem;
          color:#84878A;
          width: 100%;
          
          position: relative;
   
          overflow: hidden;
        }
        .ct::after{
          content: "...";
          position: absolute;
          bottom: 0;
          right: 7px; //可变
        }
        .btn{
          border-top:1px solid #DDDDDD;
          margin-top:0.32rem;
          padding:0.2rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span{
            font-size: 0.34rem;
            flex:1;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#84878A;
            margin-top:0.2rem;
          }
          span:first-child{
            color:#FF9F44;
            border-right:1px solid #DDD;

          }
        }
      }
    }
    .evaluate{
        background: #fff;
        box-shadow:0px 2px 2px 0px rgba(0,0,0,0.08);
        border-radius:0.1rem;
        margin-bottom:0.32rem;
        padding:0.4rem;
        padding-top:0;
        li{
          padding:0.4rem 0;
          border-bottom:1px solid #ddd;
          .name{
            font-size:0.36rem;
            color:#121C32;
          }
          .star{

            i{
              display: inline-block;
              width: 0.4rem;
              height: 0.4rem;
              background-position: center;
              background-size:100%;
              background-repeat: no-repeat; 
              background-image: url(../../assets/images/wd/pic_pj_xx@3x.png);
             
            }
          }
          .say{
            color:#84878A;
            font-size:0.32rem;
            
            margin-top:0.32rem;
          }
        }
        li:last-child{
          border:0;
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
    display: flex;
    align-items: center;
    justify-content: center;
    .alert-content{
      width: 72%;
      display: inline-block;
      background: #fff;
      text-align:center;
      padding: 0.4rem;
      margin:0 auto;
      // position: relative;
      // top:35%;
      border-radius: 0.12rem;
      strong{
        color:#152758;

      }
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
      .tip-ok{
        i{
          display: block;
          width: 1.28rem;
          height: 1.28rem;
          margin:0 auto;
          margin-bottom: 0.2rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../../assets/images/ctm/icon_khxq_qdcg@3x.png); 
        }
        strong{
          text-align:center;
          font-size:0.44rem;
          position: relative;
          left: 0.18rem;
        }
      }
      .tip-warm{
        padding: 0.2rem 0.48rem;
        strong{
          text-align: left;
          width: 100%;
          display: inline-block;
          font-size:0.43rem;
        }
        p{
          color:#203260;
          font-size:0.42rem;
          text-align: left;
          margin:0.42rem 0;
        }
        .tip-btn{
          justify-content:center;
          span{
            background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
            color:#fff;
          }
        }
      }
      .tip-phone{
         padding: 0.28rem 0.28rem;
         strong{
          
          display: inline-block;
          font-size:0.48rem;
          margin-bottom: 0.1rem;
        }
        p{
          color:#203260;
          font-size:0.42rem;
          line-height:1.2rem;
          margin-bottom:0.24rem;
        }
        .tip-btn{
          justify-content:space-between;
          font-size:0.42rem;
          span:first-child{
            margin-right:0.4rem;
          }
          span:last-child{
            background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
            color:#fff;
            a{
              color:#fff;
            }
          }
        }
      }
      
    }
    .st-content{
      width: 100%;
      height: auto;
      position: absolute;
      top: auto;
      bottom: 0;
      left: 0;
      padding: 0;
      border-radius:0.4rem 0.4rem 0 0;
      .tip-select{
        p{
          height: 1.4rem;
          padding:0 0.52rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size:0.42rem;
          font-weight:500;
          span:first-child{
            color:#C1C8D9;
          }
          span:last-child{
            color:#4780E9;
          }
        }
        ul{
          li{
            height: 1.4rem;
            font-size:0.42rem;
            color:#203260;
            display: flex;
            justify-content:center;
            align-items: center;
            border-top:1px solid #EEE;
          }
          li.active{
            background-color:#4780E9;
            color:#FFF;
          }
        }
      }
      
      
    }
    .e-content{
        width: 8rem;
        top: 1rem;
      .tip-warm{
        padding:0.2rem 0.1rem;
        strong{
          text-align: center;
        }
        h4{
          color:#203260;
          font-size: 0.4rem;
          text-align: left;
          line-height: 1.2rem;
        }
        .select{
          display: flex;
          align-items: center;
          span{
            width: 1.88rem;
            height: 0.72rem;
            
            
            background: #F6F7FA;
            border-radius:0.1rem;
            color:#152758;
            font-size: 0.38rem;
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-right:0.2rem;
          }
          
          span.active{
            background: #FF7D27;
            color:#fff;
          }
        }
        textarea{
          border: 0;
          background: #F6F7FA;
          border-radius: 0.1rem;
          width: 94%;
          height: 2.4rem;
          padding: 0.32rem 0.2rem;
          color:#152758;
          font-size: 0.38rem;
        }
        .t-num{
          color:#858FAB;
          font-size:0.36rem;
          position: relative;
          top: -0.78rem;
          left: 3rem;
          em{
            color:#4780E9;
          }
        }
        .tip-btn{
           margin-top: 0.8rem;
          span{
            width: 100%;
          }
        }
      }

    }

  }

  
 

  

}
</style>

