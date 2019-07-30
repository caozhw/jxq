<template>
  <div class="container">
    <div class="bar">
      <span :style="{left:tipLeft+'%'}">仅差{{gapPrice}}元</span>
      <div class="bar-out">
        <div class="bar-in" :style="{width:BarInWidthPercent +'%'}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import flexible from '../axios/js/flexible.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime} from '@/axios/axios_vue';
import {autoSign,getMyOrderList} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
import util from '../axios/js/util.js';
export default {
    name:'',
    data () {
        return { 
          title:'啦啦啦啦',
          gapPrice:0,
          allPrice:80,
          havePrice:0,
          BarInWidthPercent:0,
          tipLeft:10,
          

         
          
        }
    },
    computed:{

      
    },
    mounted() {
      this.havePrice = 6.23;
      this.gapPrice = this.allPrice - this.havePrice;
      this.BarInWidthPercent =  (this.havePrice/this.allPrice) * 100;
      console.log(this.BarInWidthPercent)
      this.tipLeft = this.BarInWidthPercent - 15;

    
    },
    methods: {

     
       //返回上一级
      goBack(){
        goBackPage();
      },

      // numChange(n){
      //   let _this = this;
      //   //let _m = this.num;
      //   let Time = setInterval(function(){
      //     if(_this.num < n){
      //       ++_this.num  ;
      //     }
      //   },0.1)
        

      // }

   
    }
};
</script>
<style lang="scss" scoped>
.container {
  width: 10rem;
  background: #FAFAFC;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;
  .header {
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: absolute;
    top:0;
    background: #fff;
    text-align: center;
    border-bottom: 2px solid #FAFAFC;
    img {
     width: 0.28rem;
      height: 0.5rem;
      margin-top: 0.45rem;
      position: absolute;
      left: 0.4rem;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      font-weight: bold;
      color: #1d1b1b;
      font-size:0.48rem;
      vertical-align: middle;
    }
  }

  .bar{
    margin:0 auto;
    width:9.2rem;
    padding-top: 0.92rem;
    position: relative;
    span{
      position: absolute;
      top:0;
      left:0;
      display: inline-block;
      width: 2.8rem;
      height: 1rem;
      text-align: center;
      line-height: 0.8rem;
      color:#CB2C21;
      font-size:0.3rem; 
      background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../assets/images/h/pic_kk@2x.png);
    }
    .bar-out{
      width:100%;
      height: 0.24rem;
      border-radius:0.6rem;
      border:0;
      background:#811714;
      
      .bar-in{
        border:1px solid #ffeded;
        position: relative;
        left:-1px;
        width:100%;
        height: 100%;
         border-radius:0.6rem;
         background:linear-gradient(90deg,rgba(236,212,166,1),rgba(255,237,237,1));
      } 
    }
  } 
}
</style>

