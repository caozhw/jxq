<template>
    <div class="container" >
        <!-- <div class="header">
            <i></i>
            <div class="i_title">{{title}}</div>
        </div> -->
        <div class="m_body">
            <div class="m_title"></div>
            <div class="m_ways">
                <span>下载认证可赚取<i>5金币</i></span> 
            </div>
            <div style="height:1.06rem" v-if="isIphoneX"></div>
            <div class="m_phone">
                <img  src="@/assets/images/dl/sj_shouji@3x.png" />
            </div>
            <div class="m_footer" @click="handleDownloadClick">立即下载</div>
        </div>


        <div class="new-window" v-if="isShowAlert" @click="isShowAlert=false">
            <i class="arrow"></i>
            <p>请在浏览器打开</p>
           
            </div>
        
    </div>

    
</template>
<script>
import $ from 'jquery'
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
            isWeixin:false,
            isIphoneX:false,

            isShowAlert:false,
          
        }
    },
    created(){
        this.isIPhoneX();
        this.is_weixin();
    },

    mounted() {
        $(".container").css({height:$(window).height()});
        this.title = '金享圈';
        document.title = this.title;

        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

       

        if(isiOS){
            window.location.href = 'https://itunes.apple.com/cn/app/%E9%87%91%E4%BA%AB%E5%9C%88-%E4%BF%A1%E8%B4%B7%E7%BB%8F%E7%90%86%E6%8A%A2%E5%8D%95%E8%8E%B7%E5%AE%A2/id1464490639?mt=8' 
        }else{
            if(this.isWeixin){
                this.isShowAlert = true;
            }else{
                window.location.href = 'http://res.feijinkeji.com/download/platformapi/startApp/jinxiangquan.apk';
            }
        }
        // if(this.isWeixin){
        //     if(isiOS){
        //         window.location.href = 'https://itunes.apple.com/cn/app/%E9%87%91%E4%BA%AB%E5%9C%88-%E4%BF%A1%E8%B4%B7%E7%BB%8F%E7%90%86%E6%8A%A2%E5%8D%95%E8%8E%B7%E5%AE%A2/id1464490639?mt=8'
        //     }else{
        //         this.isShowAlert = true;
        //     }
        // }else{
        //     if(isiOS){
        //         window.location.href = 'https://itunes.apple.com/cn/app/%E9%87%91%E4%BA%AB%E5%9C%88-%E4%BF%A1%E8%B4%B7%E7%BB%8F%E7%90%86%E6%8A%A2%E5%8D%95%E8%8E%B7%E5%AE%A2/id1464490639?mt=8'
        //     }else{
        //          window.location.href = 'http://res.feijinkeji.com/download/platformapi/startApp/jinxiangquan.apk';
        //     }
        // }
    
    },
    methods: {
        //返回上一级
        goBack(){
            goBackPage();
        },

        //下载
        handleDownloadClick(){
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if(isiOS){
               // window.location.href = '/download/ios';
                window.location.href = 'https://itunes.apple.com/cn/app/%E9%87%91%E4%BA%AB%E5%9C%88-%E4%BF%A1%E8%B4%B7%E7%BB%8F%E7%90%86%E6%8A%A2%E5%8D%95%E8%8E%B7%E5%AE%A2/id1464490639?mt=8'

            }else{
                window.location.href = 'http://res.feijinkeji.com/download/platformapi/startApp/jinxiangquan.apk';       
            }
        },
        is_weixin(){ 
            let ua = window.navigator.userAgent;
            if(ua.toLowerCase().match(/MicroMessenger/i)=="micromessenger") {
                this.isWeixin = true;
                
            } else {
                this.isWeixin = false;
            }
        },
        isIPhoneX(){
            var u = navigator.userAgent;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isIOS) {    	
                if (screen.height == 812 && screen.width == 375){
                    //是iphoneX
                    this.isIphoneX = true;
                   // console.log('x')
                   
                }else{
                    //不是iphoneX
                    this.isIphoneX = false;
                } 
            }
        },


   
    }
};
</script>
<style lang="scss" scoped>
.container {
    width: 10rem;
    
    background-image: url("../assets/images/dl/pic_xzy_beijing@3x.png");
    background-repeat: no-repeat; 
    background-size: 100% 100%;
    
    font-family:PingFangSC-Regular;
    font-weight:400;
    
    .header{
        height: 1.28rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: rgb(240, 242, 245);
        i{
            width: 0.213rem;
            height: 0.373rem;
            background: url("../assets/images/ir/icon_dh_back_black@3x.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 0.4rem;
        }
        .i_title{
            font-size:0.48rem;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(22,39,88,1);
        }
    }
    .m_body{
        .m_title{
            width: 4.947rem;
            height: 1.493rem;
            background: url("../assets/images/dl/pic_zt@3x.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            margin-bottom: 0.4rem;
            position: relative;
            top: 1rem;
        }
        .m_ways{
            position: relative;
            top: 1rem;
            width: 4.547rem;
            height: 0.787rem;
            margin: 0 auto;
            border: 0.026rem solid #6DA0CB;
            display: flex;
            justify-content: space-around;
            align-items: center;
            span{
                font-size:0.4rem;
                font-weight:400;
                color: #6DA0CB;
                i{
                    color: #FF8230;
                }
            }
        }
        .m_phone{
            margin: 0 auto;
            margin-top: 1.36rem;
            
            text-align: center;
            position: relative;
            top: 1.2rem;
            // height: 11.987rem;
          
            // position: absolute;
            // bottom: 0;
            // left: 50%;
            //margin-left: -3.407rem;
            img{
                height: 10.4rem;
            }
        }
        .m_footer{
            width:10rem;
            height:1.293rem;
            background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
            // position: absolute;
            // bottom: 0;
            font-size:0.48rem;
            color: #fff;
            display: flex;
            justify-content: space-around;
            align-items: center;

            position: relative;
            top: 0;
        }
    }


    .new-window{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        background: rgba(0,0,0,.6);
        font-family:PingFangSC-Regular;
        text-align:center;
        .arrow{
            display: inline-block;
            width: 2rem;
            height: 2.4rem;
            background: url("../assets/images/rs/pic_jt@3x.png") no-repeat;
            background-size: 100% 100%;
            width: 3.2rem;
            height: 5rem;
            position: relative;
            left: 2.4rem;
        }

        p{
        color:#fff;
        font-size:0.46rem;
        line-height:1.2rem;
        position: relative;
        top: 2.6rem;
        }
       
    }
    
    
    


  

}
</style>

