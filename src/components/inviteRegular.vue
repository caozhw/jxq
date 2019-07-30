<template>
    <div class="container">
        <!-- <div class="header">
            <i></i>
            <div class="i_title">活动规则</div>
        </div> -->
        <div class="r_rules">
            <div class="r_img"></div>
            <div class="r_text">
                <div class="r_one">
                    <i></i>
                    <span>每邀请一人通过认证 </span>
                    <span>送{{invite}}金币</span>
                </div>
                <div class="r_two">
                    <i></i>
                    <span>邀请的好友首充成功 </span>
                    <span>再送{{recharge}}金币</span>
                </div>
            </div>
        </div>
        <div class="b_side">
            <div class="b_left"></div>
            <div class="b_right"></div>
        </div>
        <div class="r_explain">
            <div class="r_img"></div>
            <div class="r_type">
                <div class="t_one ">
                    <div class="t_img one"></div>
                    <div class="t_text">分享给好友或朋友圈</div>
                </div>
                <div class="t_icon"></div>
                <div class="t_one ">
                    <div class="t_img two"></div>
                    <div class="t_text">好友通过链接注册下载</div>
                </div>
                <div class="t_icon"></div>
                <div class="t_one ">
                    <div class="t_img three"></div>
                    <div class="t_text">好友通过认证审核</div>
                </div>
                <div class="t_one ">
                    <div class="t_img four"></div>
                    <div class="t_text">您获得{{invite}}金币奖励</div>
                </div>
                <div class="t_icon"></div>
                <div class="t_one ">
                    <div class="t_img five"></div>
                    <div class="t_text">好友首次充值成功</div>
                </div>
                <div class="t_icon"></div>
                <div class="t_one ">
                    <div class="t_img six"></div>
                    <div class="t_text">您再获得{{recharge}}金币奖励</div>
                </div>
            </div>
            <div class="a_rules">
                <div class="a_type">
                    <div class="a_one">
                        <i></i>
                        <span>邀请的好友必须通过认证才算有效好友</span>
                    </div>
                    <div class="a_two">
                        <i></i>
                        <span>邀请好友的纪录请在“邀请记录”中查看邀请成功的奖励直接发放至个人中心，请注意查收</span>
                    </div>
                    <div class="a_three">
                        <i></i>
                        <span>本活动解释权归上海数鸟信息科技有限公司 所有，如有疑问可咨询客服</span>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { mapState } from 'vuex';
import flexible from '../axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime} from '@/axios/axios_vue';
import {autoSign,getMyOrderList} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
import util from '../axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
            title:null,
            invite:0,//邀请奖励
            recharge:0,//首冲奖励
            
        }
    },

    mounted() {
        this.title = "活动规则";
        document.title = this.title;

        this.invite = util.GetUrlParam('invite') || this.$route.query.invite; 
        this.recharge = util.GetUrlParam('recharge') || this.$route.query.recharge;
    
    },
    methods: {
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
    background: url("../assets/images/ir/pic_beijing@3x.png") no-repeat;
    background-size: 100% 100%;
    font-family:PingFangSC-Regular;
    font-weight:400;
    padding-bottom: 0.4rem;
    padding-top: 1.2rem;
    .header{
        padding-top:0.32rem;
        height: 0.667rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        i{
            width: 0.213rem;
            height: 0.373rem;
            background: url("../assets/images/ir/icon_dh_back@3x.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 0.4rem;
        }
        .i_title{
            font-size:0.48rem;
            font-weight:500;
            color:rgba(255,255,255,1);
        }
    }
    .r_rules{
        width: 9.2rem;
        height: 3.067rem;
        margin: 0 auto;
        background: #fff;
        border-radius: 0.187rem;
        .r_img{
            width: 4.507rem;
            height: 1.253rem;
            background: url("../assets/images/ir/list_jlgz@3x.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            position: relative;
            top: -0.8rem;
        }
        .r_text{
            margin-top: -0.3rem;
            .r_one{
                height: 0.6rem;
                margin-left: 1rem;
                margin-bottom: 0.32rem;
                i{
                    width: 0.427rem;
                    height: 0.427rem;
                    background: url("../assets/images/ir/pic_shuzi1@3x.png") no-repeat;
                    background-size: 100% 100%;  
                    display: inline-block;
                    vertical-align: middle;
                }
                span{
                    height: 0.6rem;
                    font-size:0.427rem;
                    font-weight:500;
                    color:rgba(22,39,88,1);
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 0.267rem;
                }
                span:nth-of-type(2){
                    color: #FF8451;
                }
            }
            .r_two{
                height: 0.6rem;
                margin-left: 1rem;
                i{
                    width: 0.427rem;
                    height: 0.427rem;
                    background: url("../assets/images/ir/pic_shuzi2@3x.png") no-repeat;
                    background-size: 100% 100%; 
                    display: inline-block;
                    vertical-align: middle;
                }
                span{
                    height: 0.6rem;
                    font-size:0.427rem;
                    font-weight:500;
                    color:rgba(22,39,88,1);
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 0.267rem;
                }
                span:nth-of-type(2){
                    color: #FF8451;
                }
            }
        }
    }
    .b_side{
        display: flex;
        justify-content: space-between; 
        margin-top: -0.5rem;
        .b_left{
            width: 0.267rem;
            height: 2.293rem;
            background: url("../assets/images/ir/ys_yuansu@3x.png") no-repeat;
            background-size: 100% 100%;   
            margin-left: 1rem;    
        }
        .b_right{
            width: 0.267rem;
            height: 2.293rem;
            background: url("../assets/images/ir/ys_yuansu@3x.png") no-repeat;
            background-size: 100% 100%;  
            margin-right: 1rem;
        }
    }
    .r_explain{
        width: 9.2rem;
        height: 13.08rem;
        background: #fff;
        border-radius: 0.187rem;
        margin: 0 auto;
        margin-top: -0.5rem;
        .r_img{
            width: 4.507rem;
            height: 1.253rem;
            background: url("../assets/images/ir/list_yqsm@3x.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            position: relative;
            top: -0.8rem;
        }
        .r_type{
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin: 0rem 0.8rem;
            margin-top: -0.4rem;
            .t_one{
                width: 2rem;
                text-align: center;
                margin: 0 auto;
                .t_img{
                    width: 1.547rem;
                    height: 1.547rem;
                   
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    margin: 0 auto;
                }
                .t_text{
                    font-size:0.293rem;
                    font-weight:400;
                    color:rgba(22,39,88,1);
                    text-align: center;
                    margin-top: 0.213rem;
                    margin-bottom: 0.507rem;
                }
                .one{
                    background-image: url("../assets/images/ir/icon_fx@3x.png");
                }
                .two{
                    background-image: url("../assets/images/ir/icon_xz@3x.png");
                }
                .three{
                    background-image: url("../assets/images/ir/icon_sh@3x.png");
                }
                .four{
                    background-image: url("../assets/images/ir/icon_jl@3x.png");
                }
                .five{
                    background-image: url("../assets/images/ir/icon_cz@3x.png");
                }
                .six{
                    background-image: url("../assets/images/ir/icon_zjl@3x.png");
                }
            }
            
            .t_icon{
                width: 0.627rem;
                height: 0.267rem;
                background: url("../assets/images/ir/icon_jiantou@3x.png") no-repeat;
                background-size: 100% 100%;  
                margin-top: 0.774rem;
            }
        }
        .a_rules{
            width: 7.707rem;
            height: 4.973rem;
            background: url("../assets/images/ir/pic_xuxian@3x.png") no-repeat;
            background-size: 100% 100%;
            margin:  0 auto;
            .a_type{
                padding-top: 1rem;
                .a_one{
                    padding-left: 0.267rem;
                    padding-right: 0.4rem;
                    padding-bottom: 0.25rem;
                    display: flex;
                    justify-content: space-around;
                    flex: 5;
                    align-items: center;
                    i{
                        width: 0.16rem;
                        height: 0.16rem;
                        border-radius: 50%;
                        background: #8A93AB;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    span{
                        display: inline-block;
                        font-size:0.347rem;
                        font-family:PingFangSC-Regular;
                        font-weight:400;
                        color:rgba(21,39,88,0.5);
                        vertical-align: middle;
                        padding-left: 0.267rem;
                        flex: 4;
                    }
                }
                .a_two{
                    padding-left: 0.267rem;
                    padding-right: 0.4rem;
                    padding-bottom: 0.25rem;
                    display: flex;
                    justify-content: space-around;
                    flex: 5;
                    align-items: center;
                    i{
                        width: 0.16rem;
                        height: 0.16rem;
                        border-radius: 50%;
                        background: #8A93AB;
                        display: inline-block;
                        margin-top: -1rem;
                    }
                    span{
                        display: inline-block;
                        font-size:0.347rem;
                        font-family:PingFangSC-Regular;
                        font-weight:400;
                        color:rgba(21,39,88,0.5);
                        padding-left: 0.267rem;
                        flex: 4;
                    }
                }
                .a_three{
                    padding-left: 0.267rem;
                    padding-right: 0.4rem;
                    display: flex;
                    justify-content: space-around;
                    flex: 5;
                    align-items: center;
                    i{
                        width: 0.16rem;
                        height: 0.16rem;
                        border-radius: 50%;
                        background: #8A93AB;
                        display: inline-block;
                        margin-top: -0.4rem;
                    }
                    span{
                        display: inline-block;
                        font-size:0.347rem;
                        font-family:PingFangSC-Regular;
                        font-weight:400;
                        color:rgba(21,39,88,0.5);
                        padding-left: 0.267rem;
                        flex: 4;
                    }
                }
            }
        }
    }


  

}
</style>

