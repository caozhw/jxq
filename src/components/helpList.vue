<template>
  <div class="container">
    <!-- <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/rmb/icon_ty_back_white.png" alt>
      </a>
      <span>{{title}}</span>
      
    </div> -->
    

  
    <ul class="h-list">
      <li v-for="(item,index) in list" :key="index" @click="handleListClick(item)">
        <span :class="selsectId==item.id&&isShowThis?'active':''"><em>{{index+1}}.{{item.title}}</em><i></i></span>

        <p v-show="selsectId==item.id&&isShowThis" v-html="item.content.replace(/↵/g,'<br>')">
          
        </p>
      </li>
      <!-- <li>
        <span ><em>1.常见问题</em><i></i></span>
        <p>这里是常见问题的回答，这里是常见问题的回答这里是常见问题的回答这里是常见问题的回答，这里是常见问题的回答，这里是常见问题的回答。</p>
      </li>
      <li>
       <span ><em>1.常见问题</em><i></i></span>
        <p>这里是常见问题的回答，这里是常见问题的回答这里是常见问题的回答这里是常见问题的回答，这里是常见问题的回答，这里是常见问题的回答。</p>
      </li> -->
      
    </ul>
   







  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex'
import flexible from '../axios/js/flexible.js'
import util from '../axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,clearWebCacheApp,reloadWebViewApp,pushMineRecordVCApp,closeAppPageApp,setNavigationStatusApp,setNavigationTitleApp} from '@/axios/axios_vue';
import {autoSign,helpCenter} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    components: {
    },
    data () {
        return { 
          title:null,

          showIndex:1,
          type:null,
          list:null,
          selsectId:null,
          isShowThis:false,

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
    created(){
       this.type = util.GetUrlParam('type') || this.$route.query.type;
      this.selsectId = util.GetUrlParam('id') || this.$route.query.id;
      if(this.selsectId){
        this.isShowThis = true;
      }
      switch(this.type){
        case '1': this.title = "常见问题";break;
        case '2': this.title = "认证审核";break;
        case '3': this.title = "抢单相关";break;
        case '4': this.title = "充值";break;
        case '5': this.title = "邀请奖励";break;
        case '6': this.title = "退单相关";break;
        case '7': this.title = "APP问题";break;
        default:break;
      }
      document.title = this.title; 
      setNavigationTitleApp(this.title);
    },
    mounted() {

      
      
      this.helpCenterRequest();

      

    },
    methods: { 

       //4.1 获取登录用户基本信息接口
      helpCenterRequest(){
       let newObj = this.testAppData;
        newObj.type = this.type;
        newObj.sign = autoSign(newObj)
        //showLogDialogApp(obj_str)
        //alert(obj_str)

        // var obj = new Object();
        // obj.type = this.type;
        // var appReturnStr = getSignParamFromApp(obj);
        // let newObj = JSON.parse(appReturnStr);
        // let obj_str = JSON.stringify(newObj)
        sendRequest_app(helpCenter, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);
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
      handleListClick(item){
        if(this.selsectId!=item.id){
          this.isShowThis = true;
        }else{
           this.isShowThis = !this.isShowThis;
        }
        this.selsectId=item.id;

       
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
  padding-top: 0.4rem;
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
      right: 0.4rem;
      top: 0.4rem;
      color: #fff;
      font-size: 0.36rem;
    }
  }
  
  .h-list{
    padding:0 0.4rem;
   
    padding-bottom:0.2rem;
    background: #fff;
    li:last-child{
     border:0;
     
    }
    li{
     border-bottom:1px solid #eee;
      span{
        height: 1.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
       
        em{
          font-size: 0.40rem;
          font-weight: 600;
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
      span.active{
        
        em{
          color:#4780E9;
        }
        i{
          background-image: url(../assets/images/hp/icon-fhd@2x.png);
        }
      }
      p{
        color:#162758;
        font-size: 0.36rem;
        padding: 0 0.46rem;
        padding-top:0.2rem;
        line-height: 0.6rem;
        margin-bottom:0.4rem;
      }
      
    }
  }
  

 
 
}
</style>

