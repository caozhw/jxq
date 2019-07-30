<template>
    <div class="container">
      <div class="c-title">

        <div class="ct-icon">
          <img :src="detail.pic" alt="" />
          <!-- <img src="../../assets/images/psn/pic_bg@3x.png" /> -->
        </div>
        <div class="ct-info">
          <h4>{{detail.name}}</h4>
          <span>{{detail.describe}}</span>
        </div>

      </div>
       <div class="c-btn" @click="handleRegClick">加入圈子</div>
      <!-- <div class="list-s">
        <span class="active" @click="handleRegClick">全部</span>
        <span @click="handleRegClick">曝光区</span>
        <span @click="handleRegClick">甩单区</span>
        <span @click="handleRegClick">通知<i></i></span>
      </div> -->
      <ul class="cr-list">
        <li v-for="(item,index) in list" :key="index">
          <div class="lc-top">
            <div class="lc-icon">
              <img :src="item.avatarUrl" alt="" />
              <!-- <img src="../../assets/images/psn/pic_bg@3x.png" /> -->
              <i :class="levelClass(item.level)"></i>
            </div>
            <div class="lc-info">
              <h4>{{item.name}}<i></i></h4>
              <span>{{item.cityName}} I {{item.orgType}} I {{item.orgName}}</span>

            </div>

          </div>
          <p>{{item.content}}</p>
          <div class="img">
            <img v-for="(a,i) in item.atlas" :key="i" :src="a" v-if="item.atlas.length!=0" /> 
            <!-- <img src="../../assets/images/psn/pic_bg@3x.png" />
            <img src="../../assets/images/psn/pic_bg@3x.png" />
            <img src="../../assets/images/psn/pic_bg@3x.png" /> -->
            
            
          </div>
          <div class="btm">
            <span>{{timeFomtter(item.createTime)}}</span>
            <em  @click="handleRegClick"><i></i><span>私聊</span></em>
          </div>

        </li>
      </ul>


    <!--未认证 弹框 -->
    <div class="alert-msg" v-if="isShowVerifyFlagAlert">
      <div class="alert-content">
        <div class="tip-warm">
          <strong>温馨提示</strong>
          <!-- <p><span>您尚未认证，请前往APP认证</span></p> -->
          <p><span>您尚未完善信息，请前往APP完善</span></p>
          <div class="tip-btn">
            <span  @click="isShowVerifyFlagAlert=false">我知道了</span>
          </div>
        </div>
      </div>
    </div>

    <!--提交申请 弹框 -->
    <div class="alert-msg" v-if="isShowApplyAlert">
      <div class="alert-content">
        <div class="tip-warm">
          <strong>温馨提示</strong>
          <p><span>已经为您提交申请，请耐心等待圈主审核</span></p>
          <div class="tip-btn">
            <span  @click="isShowApplyAlert=false">我知道了</span>
          </div>
        </div>
      </div>
    </div>

    <!--加入成功 弹框 -->
    <div class="alert-msg" v-if="isShowJoinAlert">
      <div class="alert-content">
        <div class="tip-warm">
          <strong>温馨提示</strong>
          <p><span>您已加入该圈子</span></p>
          <!-- <p><span>加入成功，请前往APP查看</span></p> -->
          <div class="tip-btn">
            <span  @click="isShowJoinAlert=false">我知道了</span>
          </div>
        </div>
      </div>
    </div>

     <!--加入成功 弹框 -->
    <div class="alert-msg" v-if="isShowJoinNowAlert">
      <div class="alert-content">
        <div class="tip-warm">
          <strong>温馨提示</strong>
          
          <p><span>加入成功，请前往APP查看</span></p>
          <div class="tip-btn">
            <span  @click="isShowJoinNowAlert=false">我知道了</span>
          </div>
        </div>
      </div>
    </div>

     
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
import flexible from '@/axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,shareTocircleApp,shareWithFriendsApp,showLogDialogApp} from '@/axios/axios_vue';
import {autoSign,wapCircleInfo,applyCircle} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
import util from '@/axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
            title:null,

           
            detail:{},
            list:[],
            testAppData:{
                appKey:"android_user",
                
                //sessionId:"5cfcd339908bf6522d08adc34303283e",
                source:"JxhOfficial",
            },

            uuid:null,
            userId:null,

            circleId:null,
            uuid:null,
            sessionId:null,


            agentId:null,
            level:null,
            verifyFlag:null,
            isJoin:false,
            completeFlag:-1,

            isShowVerifyFlagAlert:false,
            isShowApplyAlert:false,
            isShowJoinNowAlert:false,
            isShowJoinAlert:false,

            
  
        }
    },

    mounted() {
        
      this.title = "圈子分享";
      document.title = this.title;

      this.circleId = util.GetUrlParam('circleId') || this.$route.query.circleId;
      //this.uuid = util.GetUrlParam('uuid') || this.$route.query.uuid;
      //this.sessionId = util.GetUrlParam('sessionId') || this.$route.query.sessionId;



      this.agentId = util.GetUrlParam('agentId') || this.$route.query.agentId;
      this.level =  util.GetUrlParam('level') || this.$route.query.level;
      this.verifyFlag =  util.GetUrlParam('verifyFlag') || this.$route.query.verifyFlag;
      this.completeFlag =  util.GetUrlParam('completeFlag') || this.$route.query.completeFlag;
      this.isJoin =  util.GetUrlParam('isJoin') || this.$route.query.isJoin;


      // let _uuid = sessionStorage.getItem('UUID');
      // if(_uuid){
      //   this.uuid = _uuid;
      // }else{
      //   sessionStorage.setItem('UUID',this.uuid);
      // }

      // let _sessionId = sessionStorage.getItem('SESSIONID');
      // if(_sessionId){
      //   this.sessionId = _sessionId;
      // }else{
      //   sessionStorage.setItem('SESSIONID',this.sessionId);
      // }
//2已加入 1等待审核
//alert(this.isJoin)
      if(this.completeFlag==1){

        if(this.isJoin==2){
          this.isShowJoinAlert = true;
        }else if(this.isJoin==1){
          this.isShowApplyAlert = true;
        }else if(this.isJoin ==3){
          this.isShowJoinNowAlert = true;
        }
        else{
          //this.isShowJoinAlert = true;
        }
      }
      else if(this.completeFlag==0){
        if(this.isJoin==2){
          this.isShowJoinAlert = true;
        }else if(this.isJoin==1){
          this.isShowApplyAlert = true;
        }else{
          this.isShowVerifyFlagAlert = true;
        }
      }



      this.wapCircleInfoRequest();
      
      
      
    },
    methods: {
        //11.14 H5获取圈子主页信息
        wapCircleInfoRequest(){
            let newObj = this.testAppData;
            newObj.id = this.circleId;
            newObj.sign = autoSign(newObj)

            // var obj = new Object();
            // var appReturnStr = getSignParamFromApp(obj);
            // let newObj = JSON.parse(appReturnStr);
            // let obj_str = JSON.stringify(newObj)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            sendRequest_app(wapCircleInfo, newObj).then((res) => {
            let {code,msg,result} = res;
            let obj_str = JSON.stringify(res)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            
            let _this = this;
            if(code == "00"){
             this.detail = result.detail;
             this.list = result.list;
             
            }
            else{
                this.toastShowHide(msg,'bottom',2000);
            }
            });
        },
         //11.1 申请加入圈子
        applyCircleRequest(){
            let newObj = this.testAppData;
            newObj.circleId = this.circleId;
            newObj.uuid = this.uuid;
            newObj.sessionId = this.sessionId;

            //newObj.sign = autoSign(newObj)

            // var obj = new Object();
            // var appReturnStr = getSignParamFromApp(obj);
            // let newObj = JSON.parse(appReturnStr);
            // let obj_str = JSON.stringify(newObj)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            sendRequest_app(applyCircle, newObj).then((res) => {
            let {code,msg,result} = res;
            let obj_str = JSON.stringify(res)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            
            let _this = this;
            if(code == "00"){
              this.isShowApplyAlert = true;
              // this.isShowApplyAlert = false;
              // this.isShowJoinAlert = true;
             
            }
            else{
                this.toastShowHide(msg,'bottom',2000);
            }
            });
        },
        levelClass(level){
          if(level==1){
            return 'icon-gloden';
          }
          else if(level==2){
            return 'icon-birkin';
          }
          else if(level==3){
            return 'icon-diamond';
          }

        },
        //去注册页
        handleRegClick(){
          let _url = window.location.href.split('circleShare')[0];
          window.location.href = _url + 'jxqRegister?circleId=' + this.circleId;
        },

       
        //计算时间
        timeFomtter(time){
          let _timeStr = new Date(time);
          let _timeStamp = _timeStr.getTime();

          let _nowStamp = new Date().getTime();
          let _seconds = _nowStamp - _timeStamp;


          let _days=Math.floor(_seconds/(24*3600*1000));
          //计算出小时数
          let _leave1=_seconds%(24*3600*1000);    //计算天数后剩余的毫秒数
          let _hours=Math.floor(_leave1/(3600*1000));
          //计算相差分钟数
          let _leave2=_leave1%(3600*1000);        //计算小时数后剩余的毫秒数
          let _minutes=Math.floor(_leave2/(60*1000));
          if(_days>=1){
            return time;
          }
          else if(_days<1 && _hours>=1){
            return _hours+"时"+_minutes+"分钟前";
          }
          else{
            return _minutes+"分钟前";
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
 
    font-family:PingFangSC-Regular;
    font-weight:400;
    padding-bottom: 1.307rem;
    .bg-w{
      background: #fff;
    }
    .icon-gloden{
      background-image: url(../../assets/images/rmb/icon_hjhy@3x.png); 
    }
    .icon-birkin{
      background-image: url(../../assets/images/rmb/icon_bjhy@3x.png); 
    }
    .icon-diamond{
      background-image: url(../../assets/images/rmb/icon_zshy@3x.png); 
    }

    .c-title{
      margin-top:0.4rem;
      padding:0 0.4rem;
      height: 2.4rem;
      display: flex;
      align-items: center;
      .ct-icon{
        width: 1.6rem;
        height: 1.6rem;
        
        border-radius: 50%;
        position: relative;
        img{
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
        }
      }
      .ct-info{
        margin-left: 0.4rem;
        h4{
          color:#152758;
          font-size: 0.46rem;
          font-weight:500;
          margin-top: 0.12rem;
          margin-bottom: 0.12rem;
        }
        span{
          font-size: 0.34rem;
          color:#858FAB;
        }
      }
      
    }
    .c-btn{
      width: 5.2rem;
   
      padding: 0.18rem 0;
      text-align: center;
      margin: 0 auto;
      margin-top: 0.2rem;
      border-radius: 0.12rem;
      border: 1px solid #4780E9;
      color:#4780E9;
      font-size: 0.44rem;
      position: relative;
      left: 0.08rem;
    }
    .list-s{
      padding:0 0.4rem;
      margin-top:0.68rem;
      margin-bottom:0.56rem;
      display: flex;
      align-items: center;
      span{
        display: inline-block;
        font-size: 0.4rem;
        color: #858FAB;
        padding-right:0.4rem;
        position: relative;
        i{
          display: inline-block;
          width: 0.16rem;
          height: 0.16rem;
          border-radius: 50%;
          background: #F75310;
          position: absolute;
          top: 0.01rem;
          right: 0.32rem;
        }
      }
      span.active{
        color:#4780E9;
      }
    }
    .cr-list{
       padding:0 0.4rem;

       li{
         margin-top: 0.6rem;
         .lc-top{
            display: flex;
            align-items: center;
           .lc-icon{
            width: 1.4rem;
            height: 1.4rem;
            border-radius: 50%;
            position: relative;
            img{
              width: 1.4rem;
              height: 1.4rem;
              border-radius: 50%;
            }
            i{
              display: inline-block;
              width: 0.6rem;
              height: 0.6rem;
             
              background-size: 100%;
              position: absolute;
              right: -0.1rem;
              top: 0.9rem;
            }

           }
           .lc-info{

             margin-left: 0.4rem;
            h4{
              color:#152758;
              font-size: 0.46rem;
              font-weight:500;
              margin-top: 0.12rem;
            }
            span{
              font-size: 0.34rem;
              color:#858FAB;
            }

           }
         }
         p{
          color:#152758;
          font-size: 0.4rem;
          margin-top: 0.32rem;
          margin-bottom:0.12rem;
         }
         .img{
            display: flex;
            align-items: center;
             flex-wrap: wrap ;
            img{
              width:2.12rem;
              height: 2.12rem;
              margin-right:0.12rem;
            }
         }
         .btm{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color:#C1C8D9;
            margin-top:0.12rem;
           font-size: 0.36rem;
           em{
              
              display: flex;
              align-items: center;
             
              height: 0.6rem;
              
              i{
                display: inline-block;
                width: 0.6rem;
                height: 0.56rem;
                background-size: 100%;
                background-repeat: no-repeat;
                
                background-image: url(../../assets/images/psn/icon_gz_slq@3x.png);  
              }
              span{
                display: flex;
                align-items: center;
                margin-left:0.08rem;
                height: 0.6rem;
                font-weight: 400;
              }
             
              // background-size: 42%;
              
              // background-repeat: no-repeat;
              // background-position: left center;
              // background-image: url(../../assets/images/psn/icon_gz_slq@3x.png);  
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
      // display: flex;
      // align-items: center;
      // justify-content: center;
      .alert-content{
        width: 72%;
        display: inline-block;
        background: #fff;
        text-align:center;
        padding: 0.4rem;
        margin:0 auto;
        position: relative;
        top:5rem;
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
            width: 50%;
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
            color: #203260;
            font-size: 0.38rem;
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

