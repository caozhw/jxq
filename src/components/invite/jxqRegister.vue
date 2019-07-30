<template>
  <div class="container">
    <div class="wrapper">

      <!-- <div class="header" >
        <a href="javascript:void(0)" @click="goBack">
          <img src="../../assets/images/api/icon_back_white@3x.png" alt>
        </a>
        <span>立即充值</span>
      </div> -->

      <div class="icon">
        <img  src="../../assets/images/rs/pic_logoo.png"/>
        <div class="icon-font">
          <p>金享圈</p>
          <p>信贷经理展业神器</p>
        </div>
      </div>
      <div class="content">

        <div class="title">
          <img  src="../../assets/images/rs/pic_qdhkcxry@3x.png"/>
          <p>
            <span>注册即送</span>
            <em>{{invite}}金币</em>
            <i></i>
            <span>认证再送 </span>
            <em>{{register}}金币</em>
          </p>
        </div>
        <div class="banner">
          <img  src="../../assets/images/rs/pic_renwu@3x.png"/>
        </div>
        <div class="ipt">
          <div class="ipt-item">
            <input placeholder="请输入手机号" v-model="phone" @blur="handlePhoneBlur" />
          </div>
          <div class="ipt-item">
            <input placeholder="图形验证码" v-model="verifyCaptcha" />
            <span @click="handlegetCaptchaClick"><img :src="captchaImg" /></span>
          </div>
          <div class="ipt-item code">
            <input placeholder="验证码" v-model="verifiyCode"  />
            <span  @click="handleGetCodeClick"  v-if="!sendCodeSuccess">获取验证码</span>
            <span href="#" v-if="sendCodeSuccess">{{sendCodeNum}}</span>
          </div>

          <div class="btn" @click="handleRegNowClick">立即注册</div>
          
        </div>



      </div>



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
import { mapState } from 'vuex'
import flexible from '@/axios/js/flexible.js'
import util from '@/axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp} from '@/axios/axios_vue';
import {autoSign,inviteRegister,sendSmsCcode,getCaptcha,taskAward,checkPhone} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
export default {
    name:'',
    data () {
        return {
          loading:false,
          refresh:1,//刷新验证码
          verifyCaptcha:null,//图形验证码
          phone:null,//手机号
          verifiyCode:null,//	手机验证码
          inviterAgentId:null,//邀请用户id
          channelSource:null,//用户来源
         
          Time:null,//倒计时
          sendCodeSuccess:false,
          sendCodeNum:null,

          isAgreeTreaty:false,//是否同意协议

          invite:0,//邀请金币
          register:0,//首冲金币
          captchaImg:null,//图形码图片

          sourceUrl:null,//来源url


          testAppData:{
            appKey:"android_user",
            //uuid:null,
            //sessionId:null,
            source:"JxhOfficial",
            appVersion:'2.3.0',
          },

          isPass:false,//手机验证通过
          isSend:false,//是否点注册

          circleId:null,
          isJoin:false,
        

          

          
        }
    },
    computed:{

      
    },

    created(){
      //alert('created');
      window.callJsRefresh = this.callJsRefresh; 
       let _referrer;
      //if (document.referrer.length > 0) {
      _referrer= document.referrer;
     // }

      this.sourceUrl = _referrer;
      console.log('_referrer',_referrer)
    },
    mounted() {
     
     
     

      //this.loading = true;
      document.title = "注册"; 
      this.inviterAgentId = util.GetUrlParam('inviterAgentId') || this.$route.query.inviterAgentId; 
      this.channelSource = util.GetUrlParam('channelSource') || this.$route.query.channelSource;

      this.circleId = util.GetUrlParam('circleId') || this.$route.query.circleId;

      this.taskAwardRequest();
      this.captchaImg = getCaptcha;
      //this.getCaptchaRequest();
      
    },
    methods: {
       //7.7 检查用户是否已注册
       checkPhoneRequest(){
        //let newObj = this.testAppData;
        var newObj = new Object();
        newObj.phone = this.phone;
        if(this.circleId && this.circleId !="undefined"){
          newObj.circleId = this.circleId;
        }
        
       
        //newObj.sign = autoSign(newObj)


        // var obj = new Object();
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
         let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
       //alert(obj_str)
        sendRequest_app(checkPhone, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
         //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.isPass = true;

            if(this.circleId&&result.agentId){
              this.isJoin = result.result;//2已加入 1等待审核
              if(result.result==2){
                  this.isJoin = 3;
                }
              //this.isJoin = result.result==1:0;//2已加入 1等待审核
               let _url = window.location.href.split('jxqRegister')[0];
              //window.location.replace( _url + 'downloadPage');
              window.location.href = _url + 'circleShare?circleId=' + this.circleId 
              + '&agentId=' + result.agentId 
              + '&level=' +result.level
              + '&verifyFlag=' +result.verifyFlag
              + '&completeFlag=' +result.completeFlag
              + '&isJoin=' +this.isJoin;
              

            }


            
            
            
            
          }
          else{
            if(code=="500" && this.circleId){
               this.isPass = true;

              if(this.circleId&&result.agentId){
                this.isJoin = result.result;//2已加入 1等待审核
                if(result.result==2){
                  this.isJoin = 3;
                }
                //this.isJoin = result.result==1:0;//2已加入 1等待审核
                let _url = window.location.href.split('jxqRegister')[0];
                //window.location.replace( _url + 'downloadPage');
                window.location.href = _url + 'circleShare?circleId=' + this.circleId 
                + '&agentId=' + result.agentId 
                + '&level=' +result.level
                + '&verifyFlag=' +result.verifyFlag
                + '&completeFlag=' +result.completeFlag
                + '&isJoin=' +this.isJoin;
                

              }
            }
             else if(code == "-3" && this.circleId){
              this.isJoin = 2;//2已加入 1等待审核
               //this.isJoin = result.result;//2已加入 1等待审核
              let _url = window.location.href.split('jxqRegister')[0];
              //window.location.replace( _url + 'downloadPage');
              window.location.href = _url + 'circleShare?circleId=' + this.circleId 
              + '&agentId=' + result.agentId 
              + '&level=' +result.level
              + '&verifyFlag=' +result.verifyFlag
              + '&completeFlag=' +result.completeFlag
               + '&isJoin=' +this.isJoin;
             
            }
             else if(code == "-4" && this.circleId){
              this.isJoin = 1;//2已加入 1等待审核
               //this.isJoin = result.result;//2已加入 1等待审核
              let _url = window.location.href.split('jxqRegister')[0];
              //window.location.replace( _url + 'downloadPage');
              window.location.href = _url + 'circleShare?circleId=' + this.circleId 
              + '&agentId=' + result.agentId 
              + '&level=' +result.level
              + '&verifyFlag=' +result.verifyFlag
              + '&completeFlag=' +result.completeFlag
               + '&isJoin=' +this.isJoin;
             
            }
            
            else if(code == "-2" && this.circleId){
              this.isJoin = result.result;//2已加入 1等待审核
               //this.isJoin = result.result;//2已加入 1等待审核
              let _url = window.location.href.split('jxqRegister')[0];
              //window.location.replace( _url + 'downloadPage');
              window.location.href = _url + 'circleShare?circleId=' + this.circleId 
              + '&agentId=' + result.agentId 
              + '&level=' +result.level
              + '&verifyFlag=' +result.verifyFlag
              + '&completeFlag=' +result.completeFlag
               + '&isJoin=' +this.isJoin;
             
            }else{
              this.toastShowHide(msg,'center',2000);
              let _url = window.location.href.split('jxqRegister')[0];
              //window.location.replace( _url + 'downloadPage');
              window.location.href = _url + 'downloadPage';
            }

            //  let _url = window.location.href.split('jxqRegister')[0];
            // //window.location.replace( _url + 'downloadPage');
            // window.location.href = _url + 'downloadPage';
            
            //this.$router.push({path:'/downloadPage'});
          }
        });
      },
      //7.6 任务奖励
       taskAwardRequest(){
        //let newObj = this.testAppData;
        var newObj = new Object();
       
        //newObj.sign = autoSign(newObj)


        // var obj = new Object();
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(taskAward, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);
          //showLogDialogApp(obj_str)   
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.invite = result.invite?result.invite:0;
            this.register = result.register?result.register:0;
          }     
          else{
            this.toastShowHide(msg,'center',2000);
          }
        });
      },

      //7.2 图形验证码
      getCaptchaRequest(){
        //let newObj = this.testAppData;
        
       


         var obj = new Object();
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(getCaptcha+'?refresh=1', obj).then((res) => {
         // let {code,msg,result} = res;
         let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
         
          if(res){
           
            let _url = res.url.split('?')[1];
            this.captchaImg = getCaptcha + '?' + _url;
          }
          else{
            
            this.toastShowHide(msg,'center',2000);
            
          }
        });
      },

      //7.3 获取手机验证码
      sendSmsCcodeRequest(){
        let newObj = this.testAppData;
        //let newObj = {};
        newObj.phone = this.phone;
        newObj.verifyCaptcha = this.verifyCaptcha;
        newObj.sign = autoSign(newObj);

        let _this = this;

        $.ajax({
            url: sendSmsCcode,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            type: 'post',
            dataType: 'json',
            data: newObj,
            success: function (data) {
              _this.isSend = false;
              if(data.code == "00"){
                _this.countdownSendCode();
              }else{
                _this.toastShowHide(data.msg,'center',2000);
              }
            },
            error: function (error) {
               _this.isSend = false;
                _this.toastShowHide('系统异常稍后重试','center',2000);
            }
        });
 



        // var obj = new Object();
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        // sendRequest_app(sendSmsCcode, newObj).then((res) => {
        //   let {code,msg,result} = res;
        //   let obj_str = JSON.stringify(res)
        //   //showLogDialogApp(obj_str)
        //   //alert(obj_str)
          
        //   let _this = this;
        //   if(code == "00"){
        //    this.countdownSendCode();
           
            
        //   }
        //   else{
            
        //     this.toastShowHide(msg,'center',2000);
            
        //   }
        // });
      },

     
      

     
      //7.1 邀请注册
      inviteRegisterRequest(){
        let newObj = this.testAppData;
        newObj.phone = this.phone;
        newObj.verifiyCode = this.verifiyCode;
        newObj.inviterAgentId = this.inviterAgentId;
        newObj.channelSource = this.channelSource;
        newObj.sourceUrl = this.sourceUrl;
        newObj.sign = autoSign(newObj);


        // var obj = new Object();
        // obj.phone = this.phone;
        // obj.verifiyCode = this.verifiyCode;
        // obj.inviterAgentId = this.inviterAgentId;
        // obj.channelSource = this.channelSource;
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(inviteRegister, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            let _url = window.location.href.split('jxqRegister')[0];
            //window.location.replace( _url + 'downloadPage');
            window.location.href = _url + 'downloadPage';

           //this.$router.push({path:'/downloadPage'});

          }
          else{
            
            this.toastShowHide(msg,'center',2000);
            
          }
        });
      },


      //图形验证码点击
      handlegetCaptchaClick(){
        this.getCaptchaRequest();
       
      },
      //获取验证码 点击
      handleGetCodeClick(){
        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;//手机号验证
        if(!this.phone){
          this.toastShowHide('请输入手机号','center',2000);
          return false;
        }
        else if(!phoneReg.test(this.phone)){
          this.toastShowHide('手机号输入错误','center',2000);
          return false;
        }
        else if(!this.verifyCaptcha){
          this.toastShowHide('请输入图形码','center',2000);
          return false;
        }else{
          if(this.isPass){
            if(!this.isSend){
              this.isSend = true;
               this.sendSmsCcodeRequest();
            }
            
          }else{
            this.toastShowHide('手机号已注册','center',2000);
          }

         
          
        }
        
      },
      //手机失去焦点 判断
      handlePhoneBlur(){
        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;//手机号验证
         if(!this.phone){
          this.toastShowHide('请输入手机号','center',2000);
          return false;
        }
        else if(!phoneReg.test(this.phone)){
          this.toastShowHide('手机号输入错误','center',2000);
          return false;
        }else{
          this.checkPhoneRequest();
        }
      },

      //立即注册 点击
      handleRegNowClick(){

        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;//手机号验证
        if(!this.phone){
          this.toastShowHide('请输入手机号','center',2000);
          return false;
        }
        else if(!phoneReg.test(this.phone)){
          this.toastShowHide('手机号输入错误','center',2000);
          return false;
        }
        else if(!this.verifiyCode){
          this.toastShowHide(' 请输入验证码','center',2000);
          return false;
        }
        else{
         
          this.inviteRegisterRequest();
         
         
         
        }
        
      },

      //倒计时
      countdownSendCode(){
        //debugger;
        this.sendCodeSuccess = true;
        let _this = this;
        let second = 59;
        //修改发送验证码按钮
        this.Time = window.setInterval(()=>{
          if(second > 0){
            _this.sendCodeNum = `${second}s`;
            second --;
          }
          else{
            _this.sendCodeNum = null;
            _this.sendCodeSuccess = false;
            window.clearInterval(_this.Time);
          }
        },1000);
      },

      //图片换成base64
      getBase64Image(img) {  
        var canvas = document.createElement("canvas");  
        canvas.width = img.width;  
        canvas.height = img.height;  
        var ctx = canvas.getContext("2d");  
        ctx.drawImage(img, 0, 0, img.width, img.height);  
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
        var dataURL = canvas.toDataURL("image/"+ext);  
        return dataURL;  
      } ,



      
      //刷新
      callJsRefresh(){
       
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
  font-family:PingFangSC-Regular;
  font-weight:400;
  background-color: #4981ea;

  
  

  .header {
   
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0;
    background: #FFF;
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
  .wrapper{
    min-height: 100vh;
    height: 100%;
    padding-bottom: 0.8rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url(../../assets/images/rs/bgq@3x.png);
    .icon{
      margin:0.32rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      img{
        width: 1.6rem;
      }
      .icon-font{
        margin-left:0.16rem;
        p:first-child{
          color:#203260;
          font-size: 0.48rem;
          font-weight: 500;
        }
        p:last-child{
          color:#858FAB;
          font-size: 0.28rem;
        }
      }
    }
    .content{ 
     
     
      margin:0 auto;
      width:9.2rem;
      .title{
        text-align: center;
        img{
          width: 8.4rem;
        }
        p{
          font-family:PingFangSC-Medium;
          font-weight:500;
          font-size:0.56rem;
          span{
            color:#152758;
          }
          em{
            color:#FFA119;
          }
          i{
            display: inline-block;
            width: 0.28rem;
            height: 0.48rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url(../../assets/images/rs/line@3x.png);
          }
        }
      }
      .banner{
        position: relative;
        top: 0.86rem;
        img{
          width: 9rem;
        }
      }
      .ipt{
        background:linear-gradient(180deg,rgba(246,247,255,1) 0%,rgba(234,237,254,1) 100%);
        border-radius:0.16rem;
        padding:0.6rem 0.6rem;
        text-align:center;
        font-size: 0.38rem;
        .ipt-item{
          height: 1.2rem;
          margin-top: 0.24rem;
          display: flex;
          align-items: center;
          input{
            flex:1;
            height:100%;
            border-radius:0.08rem;
            padding-left: 0.4rem;
            color:#152758;
          }
        }
        .ipt-item:nth-of-type(2){
          input{
            flex:2.5;
          }
          span{
            flex:1;
            height: 100%;
            display: flex;
            align-items: center;
            background: #fff;
            border-radius: 0.08rem;
            margin-left:0.2rem;
            img{
              width: 100%;
              height: 100%;
              border-radius: 0.08rem;
    
            }
          }
        }
        .ipt-item:nth-of-type(3){
          background: #fff;
          border-radius: 0.08rem;
          input{
            flex:2.5;
            background: rgba(255,255,255,0);
          }
          span{
            flex:1;
            border-radius: 0.08rem;
            margin-left:0.1rem;
            color:#FFA119;
            text-align: right;
            padding-right:0.2rem;
          }
        }
      }

      .btn{
        font-size: 0.38rem;
        height: 1.2rem;
        background: #4780E9;
        color:#fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.08rem;
        margin-top:0.6rem;
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


    ::-webkit-input-placeholder { /* WebKit browsers */
    color: #858FAB;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #858FAB;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #858FAB;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #858FAB;
    }




}
</style>

