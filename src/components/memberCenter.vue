<template>
  <div class="container">
    <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>{{title}}</span>
      <em  @click="handleRechargeListClick">充值记录 </em>
    </div>
    <div class="top">
      <div :class="topRnageBgClass()">
        <p class="top-title"><span>会员升级</span><i  @click="isShowMemberChangeTipAlert=true"></i></p>
        <div class="info">
          <div :class="topRnageBorderClass()">
            <img  src="../assets/images/rmb/pic_wd_tx@3x.png" v-if="!userInfo.avatarUrl" alt>
            <img  :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" alt> 
          </div>
          <div class="time">
            <p><strong>{{userRangeTitleText()}}</strong><i :class="topRnageIconClass()"></i></p>
            <p>有效期至 {{timeFormatter(userInfo.expireTime)}}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="coin">
      <div class="num">
        <label>金币余额 (个) ：</label>
        <span>{{userInfo.accountBalance}}</span>
      </div>
      <div class="coin-btn" @click="handleInvestCoinClick">充值金币</div>
    </div>

    <div class="list">
      <h4><span>会员权益</span><i @click="isShowMemberTipAlert=true"></i></h4>
      <ul>
        <li v-for="(item,index) in rangeList" :key="index">
          <p>
            <i :class="rangeIconClass(item.level)"></i>
            <strong>{{rangeTitleText(item.level)}}（ 赠送<em>{{isNaN(Number(item.amount))?'0':Number(item.amount)}}</em>金币 ）</strong>
          </p>
          <p>
            <span>1.抢单资格</span>
            <span>2.有效期 <em>{{item.validPeriod}}个月</em></span>
          </p>
          
         </li>

         <!-- <li>
          <p>
            <i class="icon-birkin"></i>
            <strong>铂金会员（ 赠送<em>1599</em>金币 ）</strong>
          </p>
          <p>
            <span>1.抢单资格</span>
            <span>2.有效期 <em>6个月</em></span>
          </p>
          
         </li>

         <li>
          <p>
            <i class="icon-diamond"></i>
            <strong>钻石会员（ 赠送<em>4399</em>金币 ）</strong>
          </p>
          <p>
            <span>1.抢单资格</span>
            <span>2.有效期 <em>12个月</em></span>
          </p>
          
         </li> -->

         

         
       </ul>
    </div>
    <div class="btn" @click="handleInvestMemberClick">会员升级</div>


    <!--会员权益说明 弹框 -->
    <div class="alert-msg" v-if="isShowMemberTipAlert">
      <div class="alert-content">
        <div class="tip-warm">
         
          <strong>会员权益说明</strong>
          <p><i>1.</i><span>抢单资格：仅会员才能进行抢单；</span></p>
          <p><i>2.</i><span>有效期：自购买日期生效，黄金会员3个月、铂金会员6个月、钻石会员12个月，会员到期后权益终止；</span></p>
          <p><i>3.</i><span>金币说明：会员到期后剩余金币保留，永久有效使用；</span></p>
          <p><i>4.</i><span>注意事项：会员服务一经购买，不可退款。</span></p>
          <div class="tip-btn">
            <span  @click="isShowMemberTipAlert=false">知道了</span>
          </div>
        </div>
       
      </div>
    </div>

     <!--会员升级变更说明 弹框 -->
    <div class="alert-msg" v-if="isShowMemberChangeTipAlert">
      <div class="alert-content">
        <div class="tip-warm">
         
          <strong>会员升级，权益变更说明</strong>
          <p><i>1.</i><span>会员权益以新会员卡为准，购买日立即生效； </span></p>
          <p><i>2.</i><span>会员有效期叠加；</span></p>
          <p><i>3.</i><span> 赠送金币数量累加。</span></p>
          <div class="tip-btn">
            <span  @click="isShowMemberChangeTipAlert=false">知道了</span>
          </div>
        </div>
       
      </div>
    </div>



  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex'
import flexible from '../axios/js/flexible.js'
import util from '../axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,pushMineRecordVCApp,closeAppPageApp,setNavigationStatusApp} from '@/axios/axios_vue';
import {autoSign,getPayConfig,getDetail} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    components: {
    },
    data () {
        return { 
          title:null,
          isShowMemberTipAlert:false,// 是否显示会员权益说明
          isShowMemberChangeTipAlert:false,//是否显示会员升级变更说明
          level:3,//1黄金 2铂金 3钻石
          userInfo:{},//用户信息

          payVip:1,
          rangeList:[],


          testAppData:{
            appKey:"android_user",
            uuid:"86201e69-6447-4f1e-b587-f40832be8648",
            sessionId:"1f086c5459811b5bb003e03b9a33a0bd",
            source:"JxhOfficial",
            appVersion:'2.3.0',
          },
         
          
        }
    },
    computed:{

    },
    mounted() {
      setNavigationStatusApp(0,0);
      this.title = "会员中心";
      document.title = this.title;  
      
      this.getDetailRequest();
      this.getPayConfigRequest();

      

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
            
            this.level = result.level;
            this.userInfo = result;


            

           
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },
      //用户充值参数页
      getPayConfigRequest(){
        // let newObj = this.testAppData;
        // newObj.payVip = this.payVip;

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
      
        obj.payVip = this.payVip;
        if(AndroidOrIos==1){
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
           this.rangeList = result.list;


          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },
       //充值记录 点击
      handleRechargeListClick(){
        pushMineRecordVCApp();
      },
      //充值金币 点击
      handleInvestCoinClick(){
        setNavigationStatusApp(1,2);

        //  let _url = window.location.href.split('memberCenter')[0];
        // _url = _url + 'investnow';
        // openNewPageApp(_url)
        sessionStorage.setItem('isMember',1);
        this.$router.push({path:'/investnow'});
       
        
      },
       //充值会员 点击
      handleInvestMemberClick(){
        this.$router.push({path:'/memberRecharge'});
      },

      //头部背景样式
      topRnageBgClass(){
        if(this.level==1){
          return 'top-content top-gloden';
        }
        else if(this.level==2){
          return 'top-content top-birkin';
        }
        else if(this.level==3){
          return 'top-content top-diamond';
        }

      },
      //头部边框样式
      topRnageBorderClass(){
        if(this.level==1){
          return 'img-border img-gloden';
        }
        else if(this.level==2){
          return 'img-border img-birkin';
        }
        else if(this.level==3){
          return 'img-border img-diamond';
        }

      },

      //头部图标样式
      topRnageIconClass(){
        if(this.level==1){
          return 'icon-gloden';
        }
        else if(this.level==2){
          return 'icon-birkin';
        }
        else if(this.level==3){
          return 'icon-diamond';
        }

      },
      //会员等级样式 图标
      rangeIconClass(level){
        if(level == '1'){
          return ' icon-gloden';
        }
        else if(level == '2'){
          return ' icon-birkin';
        }
        else if(level == '3'){
          return ' icon-diamond';
        }

      },
      //用户显示文字
      userRangeTitleText(){
       
          if(this.level == '1'){
            return '黄金会员';
          }
          else if(this.level == '2'){
            return '铂金会员';
          }
          else if(this.level == '3'){
            return '钻石会员';
          }else{
            return '非会员';
          }
        
      },
      //会员等级文字
      rangeTitleText(level){
        if(level == '1'){
          return '黄金会员';
        }
        else if(level == '2'){
          return '铂金会员';
        }
        else if(level == '3'){
          return '钻石会员';
        }else{
          return '非会员';
        }
      },
       //时间格式化
      timeFormatter(value){
       if(value == 0 || value.length < 10){return '--';}
        let cellTime =new Date(parseInt(value) * 1000);
        let allTime = util.formatDate.format(cellTime);
        let dateTime = util.formatDate.format(cellTime).split(' ')[0];
        return dateTime;
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
  position: relative;
  .header {
    padding-top: 0.36rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    top:0;
    background: rgba(255,255,255,0);
    text-align: center;
    img {
      width: 0.68rem;
      height: 0.64rem;
      margin-top: 0.34rem;
      position: absolute;
      left: 0.4rem;
      border:0;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      color: #fff;
      font-size:0.48rem;
      vertical-align: middle;
      font-family:PingFangSC-Medium;
      font-weight:500;
    }
    em{
      position: absolute;
      right: 0.4rem;
      top: 0.4rem;
      color: #fff;
      font-size: 0.36rem;
    }
  }
  .icon-gloden{
    background-image: url(../assets/images/rmb/icon_hjhy@3x.png); 
  }
  .icon-birkin{
    background-image: url(../assets/images/rmb/icon_bjhy@3x.png); 
  }
  .icon-diamond{
    background-image: url(../assets/images/rmb/icon_zshy@3x.png); 
  }
  .top{
    width: 10rem;
    height: 4.2rem;
    background: #33353B;
    .top-content{
      margin: 0 auto;
      position: relative;
      top: 1.6rem;
      width: 8.48rem;
      height: 3.4rem;
      padding:0.36rem;
      border-radius: 0.12rem;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;

      .top-title{
        font-size:0.38rem;
        font-weight:500;
        color:#FFF;
        text-align: right;
        span{
          vertical-align: middle;
        }
        i{
          margin-left: 0.2rem;
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          background-size: 100%;
          vertical-align: middle;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(../assets/images/rmb/icon_sjhy@3x.png); 
        
        }
      }
      .info{
        display: flex;
        align-items: center;
        .img-border{
          width: 1.48rem;
          height: 1.48rem;
          border-radius:2rem;
          border:0;
          img{
            width: 100%;
            height: 100%;
            transform: scale(1.1,1.1);
            border:0;
             border-radius:2rem;
          }
        }
        .img-gloden{
          border:0.12rem solid #FFE9BD;
           border-radius:2rem;
        } 
        .img-birkin{
          border:0.12rem solid #D8DEFD;
           border-radius:2rem;
        } 
        .img-diamond{
          border:0.12rem solid #E6D3FF;
           border-radius:2rem;
        } 
        .time{
          margin-left:0.4rem;
          p{
            color:#FFF;
          }
          p:nth-of-type(1){
            strong{
              font-size:0.52rem;
              font-weight:500;
              vertical-align: middle;
            }
            i{
              display: inline-block;
              width: 0.8rem;
              height: 0.8rem;
              margin-left:0.2rem;
              background-size: 100%;
              vertical-align: middle;
              background-position: center;
              background-repeat: no-repeat;
              
            }
          }
           p:nth-of-type(2){
            font-size:0.36rem;
            margin-top: 0.2rem;
           }
        }
      }

    }
    .top-gloden{
     
      background-image: url(../assets/images/rmb/pic_hycz_bjk@3x.png); 
    }
    .top-birkin{
     
      background-image: url(../assets/images/rmb/pic_hyzx_bjhy_bg@3x.png); 
    }
    .top-diamond{
     
      background-image: url(../assets/images/rmb/pic_hycz_zsk@3x.png); 
    }
   
   
   
  }
  .coin{
    background: #fff;
    padding:0 0.4rem;
    padding-top:1.8rem;
    padding-bottom:0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .num{
      font-size:0.42rem;
      label{
        color:#858FAB;
      }
      span{
        font-size:0.5rem;
        color:#FF7D27;
        font-weight:500;
      }
    }
    .coin-btn{
      font-size:0.42rem;
      padding:0.2rem;
      background: #FFA119;
      border-radius: 0.12rem;
      color:#fff;
    }
  }
  .list{
    margin:0 auto;
    margin-top:0.4rem;
    width:9.2rem;
   

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
      margin-bottom:0.6rem;
      li{
        background: #fff;
        border-radius:0.2rem;
        padding:0.46rem 0.36rem;
        margin-top: 0.32rem;
        box-shadow:0px 5px 12px 1px rgba(240,240,240,1);
        p:nth-of-type(1){
          i{
            display: inline-block;
            width: 0.76rem;
            height: 0.76rem;
            margin-right:0.1rem;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            vertical-align: middle;
          }
          strong{
            color:#203260;
            font-size:0.48rem;
            font-weight: 500;
            vertical-align: middle;
            em{
              color:#FFA119;
            }
          }
        }
        p:nth-of-type(2){
          margin-top: 0.2rem;
          padding-left:0.86rem;
          padding-right:0.86rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span{
            color:#858FAB;
            font-size:0.42rem;
            em{
              color:#FFA119;
            }
          }
        }
      }
    }  
  }

  .btn{
  //  position: fixed;
  //  bottom: 0;
  
    width: 100%;
    height: 1.32rem;
    display: flex;
    justify-content: center;
    align-items:center;
    background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
    color:#FFFFFF;
    font-size:0.42rem;
    

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
      width: 78%;
      display: inline-block;
      background: #fff;
      text-align:center;
      padding: 0.4rem;
      margin:0 auto;
      position: relative;
      top:4.6rem;
      border-radius: 0.12rem;
      strong{
        color:#152758;
        margin-bottom: 0.2rem;

      }
      .tip-btn{
        display: flex;
        
        align-items:center;
        font-size: 0.42rem;
        span{
          margin-top: 0.6rem;
          color:#4780E9;
          border:1px solid #4780E9;
          border-radius:0.1rem;
          width: 100%;
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
          background-image: url(../assets/images/ctm/icon_khxq_qdcg@3x.png); 
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
          color: #203260;
          font-size: 0.42rem;
          text-align: left;
          display: flex;
         
          i{
            flex:1;
          }
          span{
            flex:16;
          }
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
          margin-bottom: 0.56rem;
        }
        .tip-btn{
          justify-content:space-between;
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
  }
  
}
</style>

