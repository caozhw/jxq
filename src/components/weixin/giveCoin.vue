<template>
  <div class="container" v-wechat-title="$route.meta.title">
    <div class="wrapper">
      <div class="coin">
        <span>
        </span>
      </div>
      <div class="phone">
        <div>
          <i></i>
          <input type="tel" placeholder="请输入手机号" v-model="phone" ref="phone" @keyup="handlePhoneKeyup" @blur.native.capture="handlePhoneBlur" maxlength="11"  />
        </div>
       
      </div>
      <div class="btn" @click="handlegetCoinClick"></div>
    </div>


     <!--1 弹框 -->
    <div class="alert-msg" v-if="isShowSuccessAlert">
      <div class="a-success"  v-if="isShowSuccessText"></div>
      <div class="alert-content">
        
        <div class="tip" v-if="isShowGivenText">
          <p>您已领取</p>
          <p>不能重复领取哦～</p>
        </div>

        <div class="a-tt"  v-if="isShowSuccessText"></div>
        <div class="a-phone"  v-if="isShowSuccessText">已放入账户{{phone}}</div>

        <div class="a-btn" @click="isShowSuccessAlert=false;isShowShareAlert=true" :style="{top:isShowGivenText?'3.6rem':'3.52rem'}">分享同行好友一起领</div>
        <div class="a-down" @click="handleDownloadClick">
          <span>下载APP立即使用</span>
          <i></i>
        </div>
      </div>
      <div class="a-close" @click="isShowSuccessAlert=false"></div>
    </div>

<!-- 二维码 弹框 -->
    <div class="alert-msg" v-if="isShowAttentionAlert">    
      <div class="ewm-content">
        <i @click="isShowAttentionAlert=false"></i>
        <p>关注公众号领取哦～</p>
        <img src="../../assets/images/wx/ewm.png" />
        <div>长按识别二维码</div>
      </div>
      
    </div>
<!-- 分享 弹框 -->
    <div class="alert-msg" v-if="isShowShareAlert" @click="isShowShareAlert=false">
      <div class="arrow-content" >
      </div>
      
    </div>

 
    <!-- loading -->
    <div class="loadmask" v-if="loading">
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
import {AndroidOrIos} from '@/axios/js/judge.js' 
import {autoSign,sendRequest_app,getRequest_app} from '@/axios/axios_vue';
import {isAttention,wechatGetGold,getWechatConfig} from '@/axios/axios_vue';







//import wx from 'weixin-js-sdk'
export default {
  name: "",
  data() {
    return {
        loading:false,
        phone:null,//手机号

        source:null,
        isAttention:null,//0未关注 1已关注
        isShowSuccessAlert:false,//成功弹框
        isShowSuccessText:false,//领取文字
        isShowGivenText:false,//已领取文字
        isShowAttentionAlert:false,//关注微信？
        isShowShareAlert:false,//分享弹框？

        testAppData:{
          appKey:"android_user",
         
         
        },
    };
  },
  mounted () {
     $(".wrapper").css({height:$(window).height()});

     $('input').on('blur', function () {
        setTimeout(function(){
          var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
    });

    this.source = util.GetUrlParam('source') || this.$route.query.source;

    this.isAttention = util.GetUrlParam('isAttention') || this.$route.query.isAttention;
    this.isShowAttentionAlert = this.isAttention==0?true:false;

    // this.Resgitercommon.query = _source?{source:this.source}:null;



    //获取当前时间戳  获取了当前毫秒的时间戳
    var timestamp = (new Date()).getTime(); 
    //获取浏览器唯一标识
    var userAgent = window.navigator.userAgent;
    isAttention
    //this.isAttentionRequest();
    this.getWechatConfigRequest();
    


  },
  methods: {
    //1.12 微信公众号送金币
    wechatGetGoldRequest(){
      let newObj = this.testAppData;
      newObj.source = this.source;
      newObj.phone = this.phone;
      newObj.sign = autoSign(newObj);

      sendRequest_app(wechatGetGold, newObj).then((res) => {
        let {code,msg,result} = res;
        let obj_str = JSON.stringify(res)
        //showLogDialogApp(obj_str)
        //alert(obj_str)
        
        let _this = this;
        if(code == "00"){
          
          if(result.code==0){
            this.toastShowHide('领取失败','center',2000);
          }
          else{
            this.isShowSuccessAlert = true;
           
            if(result.code==1){
             
              this.isShowSuccessText = true;
              this.isShowGivenText = false;
            }else{
              this.isShowSuccessText = false;
              this.isShowGivenText = true;
            }
          }
         
          
        }
        else{
          
        }
      });
    },

    // //1.11 是否关注微信公众号
    // isAttentionRequest(){
    //   var newObj = new Object();

    //   getRequest_app(isAttention, newObj).then((res) => {
    //     let {code,msg,result} = res;
    //     let obj_str = JSON.stringify(res)
    //     //showLogDialogApp(obj_str)
    //     alert(obj_str)
        
    //     let _this = this;
    //     if(code == "00"){
    //       this.isShowAttentionAlert = result.isAttention==0?true:false;
          
    //     }
    //     else{
    //       this.toastShowHide(msg,'center',2000);
    //     }
    //   });
    // },

    //获取微信分享参数
    getWechatConfigRequest(){
      let newObj = this.testAppData;
      newObj.source = this.source;
      newObj.url = location.href.split('#')[0];
      newObj.sign = autoSign(newObj)
      let obj_str = JSON.stringify(newObj)

      //newObj.url = location.href.split('#')[0];
      //let signatureData = {pageUrl:location.href.split('#')[0]};
      //let formdata = new FormData();
      //formdata.pageUrl = location.href.split('#')[0];
      //signatureData = JSON.stringify(signatureData);
      sendRequest_app(getWechatConfig, newObj).then((res) => {         
        let {code,msg,result} = res; 
         let obj_str = JSON.stringify(res)
         
        //showLogDialogApp(obj_str)


        //1.通过config接口注入权限验证配置
        wx.config({
          debug: false,
          appId: result.appId,
          timestamp: result.timestamp,
          nonceStr: result.nonceStr,
          signature: result.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareQQ','onMenuShareAppMessage'] 
        });
       
        //2.通过ready接口处理成功验证
        wx.ready(function(){
          wx.onMenuShareAppMessage({ 
            title: '金享圈', // 分享标题
            desc: '【福利】超简单，来就送金币', // 分享描述
            link: result.jump_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //imgUrl: 'http://youdai-test.bitker.cn/static/share/wechat_share/fenxiang.png', // 分享图标
            imgUrl:'http://quan-api.jinxianghui.net/assets/fenxiang.png',
            success: function () {
              
              // 设置成功
            }
          });

          wx.onMenuShareQQ({ 
            title: '金享圈', // 分享标题
            desc: '【福利】超简单，来就送金币', // 分享描述
            link: result.jump_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //imgUrl: 'http://youdai-test.bitker.cn/static/share/wechat_share/fenxiang.png', // 分享图标
             imgUrl:'http://quan-api.jinxianghui.net/assets/fenxiang.png',
            success: function () {
              
              // 设置成功
            }
          });

          wx.onMenuShareTimeline({ 
            title: '金享圈', // 分享标题
            link: result.jump_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 
            //imgUrl: 'http://youdai-test.bitker.cn/static/share/wechat_share/fenxiang.png', // 分享图标
             imgUrl:'http://quan-api.jinxianghui.net/assets/fenxiang.png',
            success: function () {
              
              // 设置成功
            }
          });

        });
        wx.error(function(obj){
        });



      });

    },
    //去下载
    handleDownloadClick(){
      let _url = window.location.href.split('giveCoin')[0];
      window.location.href = _url + 'downloadPage';
    },
    handlePhoneKeyup(e){
      if(e.target.value.length>11){
        e.target.value = e.target.value.substring(0,11);
      }
    },

     //手机失去焦点 判断
      handlePhoneBlur(){

      let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
      window.scrollTo(0, Math.max(scrollHeight - 1, 0))


        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;//手机号验证
         if(!this.phone){
          this.toastShowHide('请输入手机号','center',2000);
          return false;
        }
        else if(!phoneReg.test(this.phone)){
          this.toastShowHide('请输入正确的手机号','center',2000);
          return false;
        }else{
          //this.checkPhoneRequest();
        }
      },
      //获取金币 点击
      handlegetCoinClick(){

        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;//手机号验证
        if(!this.phone){
          this.toastShowHide('请输入手机号','center',2000);
          return false;
        }
        else if(!phoneReg.test(this.phone)){
          this.toastShowHide('请输入正确的手机号','center',2000);
          return false;
        }
        
        else{
         
          this.wechatGetGoldRequest();
         
         
         
        }
        
      },







    //获取地址参数方法
    GetQueryString(name){
    　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    　　var r = window.location.search.substr(1).match(reg);
    　　if(r!=null)return unescape(r[2]);
       return null;
    },


      //打开第三方网站
      gotoThirdParty(item){
        this.getapplyproductAction(item.productId);
        window.location.href = item.thirdPartyUrl;
          //this.applyUserProduct(productId);
          //openAppNewPageWithToolBar(pageUrl);
      },
      //产品申请记录接口
      getapplyproductAction(e){
        var getReady = localStorage.getItem('onlyReady');
        if(!getReady){
          this.handleuuid();
          getReady = localStorage.getItem('onlyReady');
        }
        var channel = this.GetUrlParam("channel");
        if(channel === undefined || channel === null){
          channel = "";
        }
        
        
        var newObj = {appKey:'weixinh5',uuid:getReady,productId:e,channel:channel};

        sendRequest_app(find_applyProduct_weixin, newObj).then((res) => {
          
        });
      },

      //获取channel
      GetUrlParam(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");
　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;
　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");
　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　  },

      //发现信息接口
      getFindMessageAction(){
       
        let newObj = {appKey:'weixinh5'};
        sendRequest_app(find_loanMarket_weixin, newObj).then((res) => {
          let {code,msg,result} = res;
          this.loading = false;
             if(code == "00"){
            //    console.log('发现信息接口成功');
               this.messageList = result;
             } else {
            //    console.log('发现信息接口错误');
             }
        });
      },

    //js生成UUID
    handleuuid(){
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
  
      var uuid = s.join("");
      localStorage.setItem('onlyReady', uuid);
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
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 10rem;
  background: #fff;
  font-family:PingFangSC-Regular;
  font-weight:400;
  .wrapper{
    min-height: 100vh;
    height: 100%;
    text-align: center;
        background-color: #fe1535;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url(../../assets/images/wx/bg_coin@3x.png);
    .coin{
      font-family:HYHeiFangW;
      position: relative;
      top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        display: inline-block;
        width: 6rem;
        height: 2rem;
        color: #BF7B0F;
        font-weight: 600;
       
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../../assets/images/wx/pic_zt@3x.png);
      }
     
    }
    .phone{
      position: relative;
      top: 8.8rem;
      div{
        width: 6.4rem;
        height: 0.72rem;
        margin:0 auto;
        padding:0.32rem 0.4rem;
        background: rgba(0,0,0,.3);
        border-radius:0.02rem;
        display: flex;
        align-items: center;
        i{
          display: inline-block;
          width: 0.4rem;
          height: 0.7rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../../assets/images/wx/icon_shouji@3x.png);
        }
        input{
          width: 5.6rem;
          margin-left:0.2rem;
          background: rgba(255,255,255,0);
          color:#F4CAA0;
          font-size: 0.48rem;
        }

      }
      

    }
    .btn{
      position: relative;
      top: 9.4rem;
      margin:0 auto;

      width: 7.4rem;
      height: 1.32rem;

      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/wx/btn@3x.png);
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
    .a-success{
      position: relative;
      top:1.6rem; 
      margin: 0 auto;
      width: 7.2rem;
      height: 1rem;

      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/wx/pic_gx@3x.png);
    }
    .a-close{
      margin: 0 auto;
      width: 1rem;
      height: 1rem;

      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/wx/pic_X@3x.png);

      position: relative;
      top: 3rem;
    }
    .alert-content{
      display: inline-block;
      text-align:center;
      margin:0 auto;
      position: relative;
      top:2.4rem;
      //top:4.6rem;
      border-radius: 0.12rem;

      width: 8.8rem;
      height: 8.8rem;

      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/wx/pic_yjq@3x.png);

      .a-tt{
        width: 2.68rem;
        height: 1.6rem;
        margin:0 auto; 
        position: relative;
        top: 1.2rem;
        left: 0.28rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../../assets/images/wx/pic_10jb@3x.png);
      }
      .a-phone{
        position: relative;
        top: 1.4rem;

        color:#CB8625;
        font-size:0.42rem;
      }
      .a-btn{
        position: relative;
        top: 3.6rem;
        font-size: 0.5rem;
        color: #A75307;
        font-weight: 500;
      
      }
      .a-down{
        height: 1rem;
        position: relative;
        top: 4.68rem;
        left: 0.4rem; 
        color: #FFE3AB;
        font-size: 0.42rem;
        font-weight: 500;
        span{
          vertical-align: middle;
        }
        i{
          vertical-align:middle;
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../../assets/images/wx/jt@3x.png);
          
        }
      }
      .tip{
          height: 2.12rem;
          position: relative;
          top: 1.4rem;
          left: 0.2rem;
        p{
          font-size:0.56rem;
          font-weight:500;
          color:#FF621C;
        }
        
      }
     
    }

    .ewm-content{
      position: relative;
      top:4rem;
      margin:0 auto;
      width: 7rem;
      height: 7rem;
      padding:0.4rem;
      border-radius: 0.4rem;
      background:linear-gradient(0deg,rgba(254,211,169,1),rgba(254,228,200,1));
      i{
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        float: right;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../../assets/images/wx/Group-@3x.png);
      }
      p{
        color:#BF7B0F;
        font-size:0.48rem;
        font-weight:500;
        position: relative;
        top: 0.48rem;
        left: 0.2rem;
      }
      img{
        width: 3.6rem;
        height: 3.6rem;
        position: relative;
        top: 0.8rem;
      }
      div{
        width: 4.2rem;
        height: 1rem;
        margin:0 auto;
        border-radius:1rem;
        background:linear-gradient(0deg,rgba(254,90,54,1),rgba(254,0,54,1));
        font-size: 0.38rem;
        font-weight: 500;
        color:#FEE4C8;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        top: 1.2rem;
      }
    }
    .arrow-content{
      width: 6rem;
      height: 6rem;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(../../assets/images/wx/pic_jt_2@3x.png);
      position: relative;
      left: 3.2rem;
      top: 0.4rem;
    }
  }


   ::-webkit-input-placeholder { /* WebKit browsers */
    color: #F4CAA0;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #F4CAA0;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #F4CAA0;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #F4CAA0;
    }

}
</style>

