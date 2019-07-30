<template>
  <div class="container">

    <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>{{title}}</span>
      <em v-if="isVip" @click="handleRechargeListClick">充值记录 </em>
    </div>
    <div class="top">
      <div :class="isVip&&!isTimeExceed?'img-border img-gloden':'img-border  img-gray'">
        <!-- <img  src="../assets/images/rmb/pic_wd_tx@3x.png" alt> -->
        <img  src="../assets/images/rmb/pic_wd_tx@3x.png" v-if="!userInfo.avatarUrl" alt>
        <img  :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" alt>  
      </div>
      
      <span :class="isVip&&!isTimeExceed?'bg-gloden':'bg-gray'"><em>{{userRangeTitleText()}}</em></span>
      <p v-if="!isVip">新用户首次充值会员，专享折扣哦！</p>
    </div>
   
    <div class="list">
      <h4><span>会员权益</span><i @click="isShowMemberTipAlert=true"></i></h4>
      <ul>
        <li v-for="(item,index) in rangeList" :key="index">
           <div class="name">
             <span :class="rangeTitleClass(item.level)"><i></i><em>{{rangeTitleText(item.level)}}</em></span> 
             <i class="discount" v-if="Number(item.discount)!=10">{{Number(item.discount).toFixed(1)}}折</i>
           </div>
           <div class="number-btn">
             <div class="num">
                <strong>{{item.name}}</strong>
                <span>( 赠<em>{{Number(item.amount)}}金币</em> )</span>    
             </div>
             <div :class="buyBtnClass(item.level)" :style="{position:Number(item.discount)!=10?'relative':'static',top: Number(item.discount)!=10?'-1.08rem':'0'}" @click="handleMemberBuyClick(item)">立即购买</div>
             
            
           </div>
           <div class="month">
             <i></i>
             <span>{{item.desc}}</span>
             <!-- <em>有效期3个月</em> -->
             <p class="origin-cost" v-if="Number(item.discount)!=10&&isIos!=1"> 原价：{{item.originalPrice}}</p>
           </div>
         </li>

         <!-- <li>
           <div class="name">
             <span class="range birkin"><i></i><em>铂金会员</em></span> 
             <i class="discount">7.5折</i>
           </div>
           <div class="number-btn">
             <div class="num">
                <strong>1599元</strong>
                <span>( 赠<em>899金币</em> )</span>    
             </div>
             <div class="btn can-buy" :style="{position:isOriginCost?'relative':'static',top: isOriginCost?'-1.08rem':'0'}">立即购买</div>
            
           </div>
           <div class="month">
             <i></i>
             <span>抢单资格</span>
             <em>有效期6个月</em>
           </div>
         </li>

         <li>
           <div class="name">
             <span class="range diamond"><i></i><em>钻石会员</em></span> 
             <i class="discount">7.5折</i>
           </div>
           <div class="number-btn">
             <div class="num">
                <strong>3666元</strong>
                <span>( 赠<em>419金币</em> )</span>    
             </div>
             <div class="btn can-buy" :style="{position:isOriginCost?'relative':'static',top: isOriginCost?'-1.08rem':'0'}">立即购买</div>
            
           </div>
           <div class="month">
             <i></i>
             <span>抢单资格</span>
             <em>有效期12个月</em>
           </div>
         </li> -->
       </ul>
    </div>

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
          isVip:0,//是否是会员 	是否会员 0：否 1：是
          leave:0,//会员等级 0：默认 1：黄金 2：铂金 3：钻石
          isTimeExceed:null,//会员是否过期

          isCanBuy:false,//是否可以购买
          isOriginCost:true,//是否显示原价
          isShowMemberTipAlert:false,//是否显示会员权益说明

          userInfo:{},//用户信息

          payVip:1,

          rangeList:[],
          isIos:false,
         

          testAppData:{
            appKey:"android_user",
            uuid:"bb2a0867-419f-4a0f-88a4-5c84c5733ba7",
            sessionId:"2c61360e28a1f205bdd2478e934aa24c",
            source:"JxhOfficial",
            appVersion:'2.3.0',
          },
          
        }
    },
    computed:{
      
    },
    mounted() {
      
      //setNavigationStatusApp(0);
      this.title = "会员充值";
      document.title = this.title; 

      if(AndroidOrIos==1){
        this.isIos  = true;
      }
      else{
        this.isIos = false;
      }
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
            let _nowtimestamp = new Date().getTime();
            let _expireTime = Number(result.expireTime + '000');
            this.isTimeExceed =  _nowtimestamp >= _expireTime ? true : false;
            this.isVip = result.isVip;
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

      //会员 立即购买 点击
      handleMemberBuyClick(item){
      
        if(this.isVip !=0 && !this.isTimeExceed && Number(this.level) > Number(item.level)){
          return false;
        }else{
          this.$store.dispatch('saveBuyMemberRangeInfoAction',item);

              localStorage.setItem('saveBuyMemberRangeInfo',JSON.stringify(item));
              this.$router.push({path:'/memberBuy'});
        }

        // if(this.isVip == 0){
        //   this.$store.dispatch('saveBuyMemberRangeInfoAction',item);

        //   sessionStorage.setItem('saveBuyMemberRangeInfo',JSON.stringify(item));
        //   this.$router.push({path:'/memberBuy'});
        // }else{
        //   if(this.isTimeExceed){
        //     this.$store.dispatch('saveBuyMemberRangeInfoAction',item);

        //     sessionStorage.setItem('saveBuyMemberRangeInfo',JSON.stringify(item));
        //     this.$router.push({path:'/memberBuy'});
           
        //   }else{
        //     if(Number(this.level) > Number(item.level)){
        //       return false;
        //     }else{
        //       this.$store.dispatch('saveBuyMemberRangeInfoAction',item);

        //       sessionStorage.setItem('saveBuyMemberRangeInfo',JSON.stringify(item));
        //       this.$router.push({path:'/memberBuy'});
        //     }

        //   }
         
        // }



        // if(this.isCanBuy){
        //   this.$store.dispatch('saveBuyMemberRangeInfoAction',item);

        //   sessionStorage.setItem('saveBuyMemberRangeInfo',JSON.stringify(item));
        //   this.$router.push({path:'/memberBuy'});
        // }else{
        //   return false;
        // }

      },
      //充值记录
      handleRechargeListClick(){
        pushMineRecordVCApp();
      },
      //用户显示文字
      userRangeTitleText(){
        if(this.isTimeExceed){
           return '非会员';
        }else{
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
        }
      },

      //会员等级样式
      rangeTitleClass(level){
        if(level == '1'){
          return ' range gloden';
        }
        else if(level == '2'){
          return ' range birkin';
        }
        else if(level == '3'){
          return ' range diamond';
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

      //会员购买 按钮 样式
      buyBtnClass(level){
        if(this.isVip == 0){
          this.isCanBuy = true;
          return 'btn can-buy';
        }else{
          if(this.isTimeExceed){
            this.isCanBuy = true;
            return 'btn can-buy';
          }else{
            if(Number(this.level) > Number(level)){
              this.isCanBuy = false;
              return 'btn no-buy';
            }else{
              this.isCanBuy = true;
              return 'btn can-buy';
            }

          }
         
        }
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
  min-height: 100vh;
  position: relative;
  .header {
    padding-top: 0.32rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    top: 0;
    background: rgba(255,255,255,0);
    text-align: center;
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
      color: #fff;
      font-size:0.48rem;
      vertical-align: middle;
      font-family:PingFangSC-Medium;
      font-weight:500;
    }
    em{
      position: absolute;
      right: 0.4rem;
      color: #fff;
      font-size: 0.36rem;
    }
  }
  .top{
    width: 10rem;
    height: 5.8rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url(../assets/images/rmb/pic_hycz_bg@3x.png); 
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .img-border{
      width: 2rem;
      height: 2rem;
      border-radius:2rem;
      margin-top: 0.9rem;
    }
    img{
      width: 100%;
      height: 100%;
      transform: scale(1.1,1.1);
      border-radius:2rem;
    }
    .img-gray{
      border:0.2rem solid #CFCFCF;
    }
    .img-gloden{
      border:0.2rem solid #FFC54E;
    }
    span{
      display: block;
      width: 3.1rem;
      height: 0.8rem;
      color: #fff;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;

      position: relative;
      top: -0.5rem;
      em{
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        top: 0.08rem;
        font-size: 0.38rem;
        
      }
    }
    .bg-gray{
      background-image: url(../assets/images/rmb/pic_hycz_fhy@3x.png); 
    }
    .bg-gloden{
      background-image: url(../assets/images/rmb/pic_hycz_hy@3x.png); 
    }
    p{
      color:#fff; 
      font-size: 0.4rem;
      position: relative;
      top: -0.2rem;
    }
  }
  .list{
      margin:0 auto;
      width:9.2rem;
      padding-bottom: 0.4rem;
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
            font-size: 0.36rem;
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
            font-size: 0.36rem; 
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
            right: -1.72rem;
            text-decoration:line-through;
            color:#858FAB;
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

