<template>
  <div class="container">
    <!-- <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>{{title}}</span>
      <em>在线客服</em>
    </div>-->
    <!-- <a href="http://localhost:8080/#/jxqRegister"  target='_blank'>测试1</a>
    <a href="" @click="toNew">测试2</a> -->
    <div class="h-top">
      <div class="top-item" v-for="(item,index) in helpList" :key="index" @click="handleListClick(item.type)">
        <img :src="item.img" />
        <p>{{item.text}}</p> 
      </div>
    </div> 

    <div class="list-head" @click="handleListClick(1)">
      <div>
        <i></i>
        <span>常见问题</span>
        <em></em>
      </div>
     
    </div>
    <ul class="h-list">
      <li v-for="(item,index) in list" :key="index" @click="handleListClick(item.type,item.id)">
        <span> {{index+1}}.{{item.title}}</span>
        <i></i>
      </li>
     
      
    </ul>
    <div class="h-link">
      <p @click="handleAddWxClick">
        <i></i>
        <span>添加微信</span>
      </p>
       <p @click="handlePhoneClick">
        <i></i>
        <span>客服热线</span>
      </p>
    </div>


     <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowTipAlert">
      <div class="alert-content">
        <div class="tip-phone" style="text-align: left;">
         
          <strong>温馨提示</strong>
          <p style="margin-bottom: 0.46rem;">已为您复制专属客服微信号 ( jxq13120892167 ） 可以打开微信搜索客服完成添加</p>
           <div class="tip-btn">
            <span @click="isShowTipAlert=false">先不加了</span>
            <span><a href="" >去加客服</a></span>
          
          </div>
        </div>
       
      </div>
    </div>

     <!--手机号 弹框 -->
    <div class="alert-msg" v-if="isShowPhoneAlert">
      <div class="alert-content">
        <div class="tip-phone">
         
          <strong>400 1141 005</strong>
         
          <div class="tip-btn">
            <span @click="isShowPhoneAlert=false">取消</span>
            <span><a href="" >呼叫</a></span>
            <!-- <span><a :href="'tel:' + userInfo.phone" >呼叫</a></span> -->
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
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,pushMineRecordVCApp,closeAppPageApp,setNavigationStatusApp,copyContentApp,addCustomerServiceApp,callPhoneApp} from '@/axios/axios_vue';
import {autoSign,helpCenter} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    components: {
    },
    data () {
        return { 
          title:null,

          helpList:[
            {img:require('@/assets/images/hp/icon_resh@2x.png'),text:'认证审核',type:'2'},
            {img:require('@/assets/images/hp/icon_qdxg@2x.png'),text:'抢单相关',type:'3'},
            {img:require('@/assets/images/hp/icon_cz@2x.png'),text:'充值',type:'4'},
            {img:require('@/assets/images/hp/icon_yqjl@2x.png'),text:'邀请奖励',type:'5'},
            {img:require('@/assets/images/hp/icon_tdxg@2x.png'),text:'退单相关',type:'6'},
            {img:require('@/assets/images/hp/icon_wt@2x.png'),text:'APP问题',type:'7'},
          ],

          list:null,
          type:0,

          isShowTipAlert:false,
          isShowPhoneAlert:false,


         


          testAppData:{
            appKey:"android_user",
            uuid:"682300c8-3aa9-4445-8139-b763b1ae8518",
            sessionId:"f06afc533bf6e1d725d36c0d73335b96",
            source:"JxhOfficial",
            appVersion:'2.3.0',
          },
         
          
        }
    },
    computed:{

    },
    mounted() {
     
      this.title = "帮助中心";
      document.title = this.title;  

      
      this.helpCenterRequest();

      

    },
    methods: { 
       //4.1 获取登录用户基本信息接口
      helpCenterRequest(){
        // let newObj = this.testAppData;
        // newObj.type = this.type;
        // newObj.sign = autoSign(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)

        var obj = new Object();
        obj.type = this.type;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
          //showLogDialogApp(obj_str)
        sendRequest_app(helpCenter, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          
          let _this = this;
          if(code == "00"){
            this.list = result.list;
         


            

           
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      handleListClick(type,id){
        
        let _url = window.location.href.split('helpCenter')[0];
        if(id){
         
           window.location.href = _url + 'helpList?type='+ type + '&id=' + id;
        }else{
          
           window.location.href = _url + 'helpList?type='+ type;
        }
            //window.location.replace( _url + 'downloadPage');
           
      },
      handleAddWxClick(){
        addCustomerServiceApp('jxq13120892167');
      },
       handlePhoneClick(){
        callPhoneApp('4001141005')
      },
      toNew(){
        window.open('http://localhost:8080/#/jxqRegister') 
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
  min-height:100vh;
  background: #F6F7FA;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  position: relative;
  padding-top:0.4rem;
  .header {
    padding-top: 0.36rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    
    top:0;
    background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
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
      right: 0.2rem;
      top: 0.4rem;
      color: #fff;
      font-size: 0.36rem;
    }
  }
  .h-top{
    margin:0 0.4rem;
    padding-top:0.4rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 12px 1px rgba(240,240,240,1);
    border-radius:  0.2rem;
    .top-item{
      
      width: 3rem;
      text-align: center;
      img{
        width: 1.68rem;
        height: 1.68rem;
      }
      p{
        color:#162758;
        font-size:0.36rem;
        margin-bottom: 0.4rem;
        margin-top: 0.2rem;
        
      }
    }
    
  }
  .list-head{
    height: 1.2rem;
    margin:0 0.4rem;
    
    margin-top: 0.4rem; 
  
    background: #fff;
   border-radius:0.2rem  0.2rem 0 0 ;
    div{
      height: 100%;
          margin: 0 0.4rem;
      border-bottom:1px solid #EEEEEE;
      display: flex;
      align-items: center;
      position: relative;
       i{
        display: inline-block;
        width: 0.1rem;
        height: 0.38rem;
        background:linear-gradient(360deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
        border-radius:0.1rem;
        margin-right: 0.2rem;
      }
      span{
        font-size: 0.38rem;
        font-weight: 500;
        color:#162758; 
      }
      em{
        
        display: inline-block;
        width: 0.46rem;
        height: 0.38rem;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(../assets/images/hp/icon-fh@2x.png);
        position: absolute;
        right: 0;
        
      }
    }
   
  }
  .h-list{
    margin:0 0.4rem;
    padding-bottom:0.2rem;
    background: #fff;
    box-shadow:0px 5px 12px 1px rgba(240,240,240,1);
    border-radius:0 0 0.2rem  0.2rem;
    li:last-child{
      border: 0;
    }
    li{
      height: 1.2rem;
      margin:0 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:1px solid #EEEEEE;
      span{
        font-size: 0.38rem;
        color:#162758; 
      }
      i{
        display: inline-block;
        width: 0.46rem;
        height: 0.38rem;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(../assets/images/hp/icon-fh@2x.png);
      }
    }
  }
  .h-link{
    padding:0 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.4rem;
    p:first-child{
      i{
        background-image: url(../assets/images/hp/icon_tjwx@2x.png);
      }
    }
    p:last-child{
      i{
        background-image: url(../assets/images/hp/icon_kfrx@2x.png);
      }
    }
    p{
      width: 4rem;
      height: 0.8rem;
      padding: 0.2rem 0;
      background: #fff;
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:0px 5px 12px 1px rgba(240,240,240,1);
      border-radius:0.2rem;
      i{
        display: inline-block;
        width: 0.46rem;
        height: 0.46rem;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        margin-right:0.12rem;
        span{
          color:#858FAB;
          font-size: 0.44rem;
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
          width: 72%;
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

