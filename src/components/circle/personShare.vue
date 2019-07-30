<template>
    <div class="container">
      <div class="top">
        <div class="top-wrap">
          <div class="icon-btn">
            <div class="icon">
              <!-- <img src="../../assets/images/rmb/pic_wd_tx@3x.png" alt="" /> -->
              <img :src="data.avatarUrl" alt="" onload="this.style.marginTop = (parseInt(this.parentNode.style.height) - this.height)/2 + 'px';this.style.marginLeft = (parseInt(this.parentNode.style.width) - this.width) /2 + 'px'"  />
              <i :class="levelClass(data.level)"></i>
            </div>
            
            <div class="btns">
              <span @click="handleRegClick"><i></i><em>聊天</em></span>
              <span  @click="handleRegClick"><i></i><em>关注</em></span>
            </div>
          </div>
          <h4>{{data.name}}</h4>
          <p>
            <span>{{data.area}}</span>
            <i></i>
            <span>{{data.orgType}}</span>
            <i></i>
            <span>{{data.orgShortName}}</span>
          </p>
          <em class="tel">{{data.phone}}</em>

        </div>

      </div>
      <div class="title">最新动态</div>
      <ul class="trends">

        <!-- <li class="bg-w">
          <div class="tip">
            <span class='tip_1'></span>
          </div>
          <p>信贷资源合作，优质客户单子大量推广，有意者请速速联系我，同时接收渠道合作，客户转化率高，每天可接1万的量，按A收费，一个A 12元。</p>
          <div class="btm">
            <span>1000分钟前</span>
            <em>私聊</em>
          </div>
        </li> -->
        <li class="bg-w" v-for="(item,index) in postList" :key="index">
          <!-- <div class="tip">
            <span :class='tipClass(item.typeName)'></span>
          </div> -->
          <p>{{item.content}}</p>
          <div class="img">
            <img v-for="(a,i) in item.atlas" :key="i" :src="a" v-if="item.atlas.length!=0" />
            <!-- <img src="../../assets/images/psn/pic_bg@3x.png" />
            <img src="../../assets/images/psn/pic_bg@3x.png" />
            <img src="../../assets/images/psn/pic_bg@3x.png" /> -->
            
          </div>
          <div class="btm">
            <span>{{item.time}}</span>
            <!-- <span>{{timeFomtter(item.time)}}</span> -->
            <em  @click="handleRegClick"><i></i><span>私聊</span></em>
          </div>
        </li>
      </ul>
      <div class="title">主营业务</div>
      <ul class="work bg-w">
        <li v-for="(item,index) in businessList" :key="index">
          <h4>{{item.tagName}}</h4>
          <div class="info">
            <div class="info-item">
              <span>{{isNaN(parseInt(item.quotaMin))?'0':parseInt(item.quotaMin)}}万～{{isNaN(parseInt(item.quotaMax))?'0':parseInt(item.quotaMax)}}万</span>
              <label>额度</label>
            </div>
            <div class="info-item">
              <span>{{item.deadlineMin}}～{{item.deadlineMax}}</span>
              <label>期限</label>
            </div>
            <div class="info-item">
              <span>{{item.interestRateMin}}～{{item.interestRateMax}}</span>
              <label>月利息</label>
            </div>
          </div>
          <p>{{item.otherCondition}}</p>
        </li>
      </ul>

      <div class="title">同行评价 <em  @click="handleRegClick">评价TA</em></div>
      <ul class="evaluate bg-w">
        <li v-for="(item,index) in evaluate" :key="index">
          <div class="e-top">
            <div class="e-icon">
              <img :src="item.avatarUrl" alt="" />
              <i :class="levelClass(item.level)"></i>
            </div>
            <div class="e-info">
              <h4>{{item.name}}</h4>
              <span>{{item.area}} I {{item.orgType}} I {{item.orgShortName}}</span>

            </div>

          </div>
          <p>来自{{item.name}}的评价：{{item.content}}</p>
        </li>
      </ul>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import flexible from '@/axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,shareTocircleApp,shareWithFriendsApp,showLogDialogApp} from '@/axios/axios_vue';
import {autoSign,inviteSummary,wapHome} from '@/axios/axios_vue';
import {AndroidOrIos} from '@/axios/js/judge.js' 
import util from '@/axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
            title:null,

            evaluate:[],//其他信贷员的评价
            postList:[],//	动态列表
            businessList:[],//主营业务列表
            data:{},//个人数据

            testAppData:{
                appKey:"android_user",
                
                //sessionId:"5cfcd339908bf6522d08adc34303283e",
                source:"JxhOfficial",
            },

            uuid:null,
            userId:null,
  
        }
    },

    mounted() {
        
      this.title = "个人主页分享";
      document.title = this.title;

      this.uuid = util.GetUrlParam('uuid') || this.$route.query.uuid;
      this.userId =  util.GetUrlParam('userId') || this.$route.query.userId;
      
      this.wapHomeRequest();
      
    },
    methods: {
        //8.8 H5获取个人首页信息
        wapHomeRequest(){
            let newObj = this.testAppData;
            newObj.uuid = this.uuid;
            newObj.sign = autoSign(newObj)

            // var obj = new Object();
            // var appReturnStr = getSignParamFromApp(obj);
            // let newObj = JSON.parse(appReturnStr);
            // let obj_str = JSON.stringify(newObj)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            sendRequest_app(wapHome, newObj).then((res) => {
            let {code,msg,result} = res;
            let obj_str = JSON.stringify(res)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            
            let _this = this;
            if(code == "00"){
              this.evaluate = result.evaluate;  
              this.postList = result.postList;
              this.businessList = result.businessList;
              this.data = result;
             
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
          let _url = window.location.href.split('personShare')[0];
          window.location.href = _url + 'jxqRegister?inviterAgentId=' + this.userId;
        },

        //标签 样式
        tipClass(typeName){
          if(typeName=='曝光'){
            return 'tip_1';
          }
          else if(typeName=='甩单'){
            return 'tip_2';
          }
          else{
            return 'tip_3';
          }
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
    
    .top{
      height: 5.8rem;
      background: url(../../assets/images/psn/pic_bg@3x.png) no-repeat;
      background-size: 100%;
      .top-wrap{
        padding:0 0.4rem;
        padding-top:1.6rem;
        .icon-btn{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon{
            width: 1.4rem;
            height: 1.4rem;
            border:0.12rem solid rgba(255,255,255,0.19);
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
          .btns{
           
            span{

              display: inline-block;
              padding: 0.16rem 0.48rem;
              border-radius: 0.6rem;
              font-size: 0.33rem;
              i{
                display: inline-block;
                width: 0.38rem;
                height: 0.38rem;
                background-size: 100%;
                background-repeat: no-repeat;
                margin-right:0.12rem;
                vertical-align: middle;
              }
              em{
                vertical-align: middle;
              }
            }
            span:first-child{
              border:1px solid #FFFFFF;
              color:#FFF;
              i{
                background-image: url(../../assets/images/psn/icon_gz_sl@3x.png); 
              }
            }
            span:last-child{
              margin-left: 0.2rem;
              background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(63,121,231,1) 100%);
             
              color:#FFF;
              i{
                background-image: url(../../assets/images/psn/icon_jia@3x.png); 
              }
            }
          }

        }
       h4{
         font-size: 0.48rem;
         font-weight: 600;
         color:#fff; 
         line-height: 0.88rem;
        }
        p{
          font-size: 0.36rem;
          color:#fff;
          line-height: 0.68rem;
          span{
            vertical-align: middle;
          }
          i{
            display: inline-block;
            width: 1px;
            height: 0.36rem;
            background: #fff;
            vertical-align: middle;
            margin:0 0.1rem;
          }
        }
        .tel{
          display: block;
          padding-left:0.4rem;
          margin-top: 0.12rem;
          color:#FFF;
          background-size: 3.2%;
          
          background-repeat: no-repeat;
          background-position: left center;
          background-image: url(../../assets/images/psn/icon_dianhua@3x.png); 
        }
      }

    }
    .title{
      color:#152758;
      background: #fff;
      font-size: 0.46rem;
      font-weight: 500;
      padding: 0.42rem 0.4rem 0.4rem 0.4rem;
      em{
        color:#4780E9;
        float: right;
      }
    }
    .trends{
      
      li{
        padding:0.4rem 0.4rem;
        .tip{
          height: 1rem;
          span{
            display: inline-block;
            height: 0.68rem;
            width: 1.6rem;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .tip_1{
            background-image: url(../../assets/images/psn/icon_tb_baoguang@3x.png); 
          }
          .tip_2{
            background-image: url(../../assets/images/psn/icon_tb_shuaidan@3x.png); 
          }
          .tip_3{
            background-image: url(../../assets/images/psn/icon_tb_qita@3x.png); 
          }
        }
        p{
          color:#152758;
          font-size: 0.4rem;
          
        }
        .btm{
          display: flex;
          align-items: center;
          justify-content: space-between;
          color:#C1C8D9;
          margin-top:0.2rem;
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
           }
        }
        .img{
          display: flex;
          
          align-items: center;
          flex-wrap: wrap ;
          margin-top: 0.12rem;  
          img{
            width:2.12rem;
            height: 2.12rem;
            margin-right:0.12rem;
          }
        }
      }

    }
    .work{
      li{
         padding:0.32rem 0.4rem;
         
        h4{
          color: #152758;
          font-size: 0.47rem;
          font-weight:400;
        }
        .info{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.32rem 0;
          padding-right: 1rem; 
          .info-item{
            display: flex;
            flex-direction: column;

            span{
              color:#4780E9;
              font-size: 0.46rem;
            }
            label{
              color:#203260;
              font-size:0.34rem;
              margin-top: 0.12rem;
            }
          }
         
        }
        p{
          // border-top:1px solid #F6F7FA;
          color:#858FAB;
          font-size:0.34rem;
          padding-top: 0.2rem;
        }
      }
    }
    .evaluate{
      li{
         padding:0.4rem 0.4rem;
        .e-top{
          display: flex;
          align-items: center;
         
          .e-icon{
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
          .e-info{
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
          font-size: 0.42rem;
          margin-top: 0.4rem;
        }
      }
    }


    
    
  
  

}
</style>

