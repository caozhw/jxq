<template>
    <div class="container">
        <div class="header">
            <div class="i_rules" @click="handleRegularClick"></div>
            <div class="i_title"></div>
        </div>
        <div class="i_icon"></div>
        <div class="main_part">
            <div class="m_title">
                <i></i>
                <span>每邀请1位好友认证通过</span>
                <i></i>
            </div>
            <div class="m_earn">
                <i>赚</i>
                <span>{{taskrAward.invite}}</span>
                <i>金币</i>
            </div>
            <div class="m_success">
                <span>好友首充成功&nbsp;再送</span><span>{{taskrAward.recharge}}金币</span>
            </div>
            <div class="m_share">
                <div class="m-inte"  @click="handleShareClick" v-if="isNewVersion"></div>

                <div class="m_wechat" @click="handleFriendClick" v-if="!isNewVersion"></div>
                <div class="m_circle" @click="handleCircleClick" v-if="!isNewVersion"></div>
            </div>
        </div>
        <div class="m_record">
            <div class="m_type">
                <div class="m_part">
                    <p>已邀请</p>
                    <span>{{inviteList[0].inviteNum?inviteList[0].inviteNum:0}}人</span>
                </div>
                 <div class="m_part">
                    <p>已认证</p>
                    <span>{{inviteList[0].rzNum?inviteList[0].rzNum:0}}人</span>
                </div>
                 <div class="m_part">
                    <p>未认证</p>
                    <span>{{inviteList[0].wrzNum?inviteList[0].wrzNum:0}}人</span>
                </div>
            </div>
            <div class="m_detail" @click="handleLookInfoClick">查看详情</div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import flexible from '../axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,shareTocircleApp,shareWithFriendsApp,showLogDialogApp,shareInviteApp,isLoginApp,getVersionApp} from '@/axios/axios_vue';
import {autoSign,inviteSummary} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
import util from '../axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
            title:null,
            isNewVersion:false,//App新版？
            inviteList:null,//邀请汇总
            taskrAward:{},//任务奖励

            testAppData:{
                appKey:"android_user",
                uuid:"4c1f4496-7b5b-43f1-a887-8bca294cc0e4",
                sessionId:"5cfcd339908bf6522d08adc34303283e",
                source:"JxhOfficial",
            },
  
        }
    },

    mounted() {
      this.title = "邀请好友";
      document.title = this.title; 
    //   showLogDialogApp(1)

      //let _appVersion = getVersionApp()||'1.0.0';
      let _appVersion = util.GetUrlParam('v') || '1.0.0';
      let _v = Number(_appVersion.split('.')[1]);
      this.isNewVersion = _v >= 5 ? true : false;
      
    //   showLogDialogApp(_appVersion)
     this.inviteSummaryRequest();
    },
    methods: {
        //7.5 邀请汇总
        inviteSummaryRequest(){
            // let newObj = this.testAppData;
            // newObj.sign = autoSign(newObj)
                 //alert(3)
            var obj = new Object();
            var appReturnStr = getSignParamFromApp(obj);
            let newObj = JSON.parse(appReturnStr);
                 let obj_str = JSON.stringify(newObj)
            // showLogDialogApp(obj_str)
            // alert(obj_str)
            if(!newObj.sessionId){
                isLoginApp();
                return;
            }


           
            sendRequest_app(inviteSummary, newObj).then((res) => {
            let {code,msg,result} = res;
            let obj_str = JSON.stringify(res)
            //showLogDialogApp(obj_str)
            //alert(obj_str)
            
            let _this = this;
            if(code == "00"){
              this.inviteList = result.inviteList;
              this.taskrAward = result.taskrAward;
            }
            else{
                this.toastShowHide(msg,'bottom',2000);
            }
            });
        },
        //查看规则 点击
        handleRegularClick(){
            this.$router.push({path:'/inviteRegular',query:{invite:this.taskrAward.invite,recharge:this.taskrAward.recharge}});
        },
        //查看详情
        handleLookInfoClick(){
            this.$router.push({path:'/inviteRecord'});
        },
        //分享好友
        handleFriendClick(){
          shareWithFriendsApp();
        },
        //分享朋友圈
        handleCircleClick(){
           shareTocircleApp();
        },
        //分享
        handleShareClick(){
            shareInviteApp();
            //app分享
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
    background: url("../assets/images/if/bg@3x.png") no-repeat;
    background-size: 100% 100%;
    font-family:PingFangSC-Regular;
    font-weight:400;
    padding-bottom: 1.307rem;
    .header{
        padding-top:0.32rem;
        .i_rules{
            float: right;
            width: 1.973rem;
            height: 0.8rem;
            background: url("../assets/images/if/pic_hdgz@3x.png") no-repeat;
            background-size: 100% 100%;
        } 
        .i_title{
            width: 7.387rem;
            height: 0.987rem;
            background: url("../assets/images/if/pic_yqhyzjb@3x.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            margin-top: 1.2rem;
        }
    }
    .i_icon{
        width: 1.493rem;
        height: 1.533rem;
        background: url("../assets/images/if/pic_bb@3x.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 2rem;
        left: 0.293rem;
    }
    .main_part{
        width: 10rem;
        height: 12.587rem;
        background: url("../assets/images/if/pic_hb@3x.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
        margin-top: -1.3rem;
        .m_title{
            margin: 0 auto;
            text-align: center;
            height: 0.307rem;
            padding-top: 1.027rem;
            i{
                display: inline-block;
                width: 0.453rem;
                height: 0.027rem;
                background: url("../assets/images/if/pic_tt@3x.png") no-repeat;
                background-size: 100% 100%;   
                vertical-align: middle;
            }
            span{
                display: inline-block;
                font-size:0.32rem;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(212,128,51,1);
                vertical-align: middle;
            }
        }
        .m_earn{
            width: auto;
            height: 2.267rem;
            margin: 0 auto;
            margin-top: 0.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
            i{  
                height: 0.507rem;
                font-size:0.5rem;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(253,67,83,1);
            }
            span{
                font-size:2.2rem;
                font-family:PingFangSC-Regular;
                font-weight:500;
                color:rgba(253,67,83,1);
                text-shadow:4px 2px 1px rgba(253,67,83,0.23);;
            }
        }
        .m_success{
            
            margin: 0 auto;
            margin-top: 1.573rem;
            display: flex;
            justify-content: center;
            align-items: center;
            span{
                font-size:0.44rem;
                font-family:PingFangSC-Regular;
                color:rgba(155,15,17,1);
                font-weight:400;
            }
            span:nth-of-type(2){
                color: #9B0F11;
                font-weight:500;
            }
        }
        .m_share{
            width: 8.107rem;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            margin-top: 0.747rem;
            .m-inte{
                width: 6.4rem;
                height: 1.56rem;
                background: url("../assets/images/if/btn_yq@3x.png") no-repeat;
                background-size: 100% 100%; 
                
            }
            .m_wechat{
                width: 4rem;
                height: 1.56rem;
                background: url("../assets/images/if/btn_wxan@3x.png") no-repeat;
                background-size: 100% 100%; 
            }
            .m_circle{
                width: 4rem;
                height: 1.56rem;
                background: url("../assets/images/if/btn_pyq@3x.png") no-repeat;
                background-size: 100% 100%; 
            }
        }
        
    }
    .m_record{
        width: 8.747rem;
        height: 4.467rem;
        background: url("../assets/images/if/pic_yqjl@3x.png") no-repeat;
        background-size: 100% 100%;   
        margin: 0 auto;  
        margin-top: -0.8rem;   
        .m_type{
            display: flex;
            justify-content: space-around;
            justify-items: center;
            padding-top: 1.3rem;
            .m_part{
                width: 1.2rem;
                text-align: center;
                p{
                    font-size:0.373rem;
                    font-weight:400;
                    color:rgba(179,116,76,1);
                    margin-bottom: 0.333rem;
                }
                span{
                    font-size:0.373rem;
                    font-weight:400;
                    color:rgba(179,116,76,1);
                }
            }
        } 
        .m_detail{
            width: 2.88rem;
            height: 0.907rem;
            margin: 0 auto;
            border: 0.026rem solid #B3744C;
            border-radius: 0.133rem;
            display: flex;
            justify-content: space-around;
            align-items: center; 
            font-size:0.373rem;
            font-weight:400;
            color:rgba(179,116,76,1);
            margin-top: 0.4rem;
        }
    }
  
  

}
</style>

