<template>
  <div class="container">

    <!-- <div class="header" v-if="isMember">
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/icon_back_white.png" alt>
      </a>
      <span>充值协议</span>
    </div> -->

    <div class="xy_cont" >
      <div class="title">《金币充值协议》</div>
      <p>尊敬的用户，为保障您的合法权益，请您在购买金币前阅读本协议，以了解金币的购买和使用规则并避免产生误解。当您点击“充值”按钮，即视为您已阅读、理解本协议，并同意按照本协议约定的规则进行充值、购买和使用。</p>
      <h4>1、定义</h4>
      <p>金币仅限在金享圈平台上使用，金币仅限购买人本人使用，不得转让、赠与，且无法在其他平台或商户使用。</p>
      <h4>2、充值购买方法</h4>
      <p>用户可以在此充值系统上自由选择具体的支付方式，并按相应页面提示的程序完成购买并充值。用户仅可通过向本平台购买的方式获得金币。金币一经购买不可退款，可长期持有。</p>
      <h4>3、风险提示</h4>
      <p>在使用充值方式时，用户务必仔细确认自己的帐号并仔细选择相关操作选项。若因为用户自身输入帐号错误、操作不当或不了解充值计费方式等因素造成充错帐号、金额等情形而损害自身权益的，本平台将不会作任何补偿或赔偿。</p>
      <p>若用户以非法的方式，或使用非本平台所指定的充值方式进行充值，本平台不保证该充值顺利或者正确完成。若因此造成用户权益受损时，本平台不会作任何补偿或赔偿，本平台同时保留随时冻结该用户帐号及使用各项充值服务的权利。</p>
      <h4>4、订单金额</h4>
      <p>用本平台上发布的订单可能会按其借款金额大小、借款人资质等标准制定不同的费用（该费用以金币计算并结算），用户在获得订单时应按照本平台公布的费用，向本平台支付对应的金币。用户在确认查看本平台发布的借款需求订单时，本平台有权从用户的账户中扣除对应的金币数额。</p>
      <h4>5、服务变更、中断或终止</h4>
      <p>本平台可以随时变更服务或更新本协议的条款，但应在相关的页面上及时提示修改内容。修改后的充值协议一旦在页面上公布即代替原来的服务协议。</p>
      <p>如因系统维护或升级的需要而需暂停网络充值服务，本平台将尽可能事先进行通告。</p>
      <p>如发生下列任何一种情形，本平台有权随时中断或终止向用户提供本协议项下的网络服务而无需通知用户：</p>
      <p>(a) 用户提供的个人资料不真实；</p>
      <p>(b) 用户违反本协议中规定的使用规则；</p>
      <p>(c)用户违反《金享圈平台注册服务协议》的业务规则；</p>
      <p>除前款所述情形外，本平台同时保留在不事先通知用户的情况下随时中断或终止部分或全部网络充值服务的权利，对于充值服务的中断或终止而造成的任何损失，本平台无需对用户或任何第三方承担任何责任。</p>
      <h4>6、免责声明和损害赔偿</h4>
      <p>本平台充值平台不保证以下事宜：</p>
      <p>(a) 本服务将符合您的要求；</p>
      <p>(b) 本服务将不受干扰、及时提供、安全可靠或不会出错。</p>
      <p>用户同意保障和维护本平台及其他用户的利益，如因用户违反有关法律、法规或本协议项下的任何条款而给金享圈或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。</p>
      <h4>7、其他</h4>
      <p>本协议的订立、执行和解释及争议的解决均应适用中国法律。</p>
      <p>如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均有权将相关争议提交至上海仲裁委员会进行仲裁，仲裁裁决将是终局的，对各方均具有约束力。</p>
      <p>本协议项下所有的通知均可通过重要页面公告、电子邮件或常规的信件传送等方式进行；该等通知于发送之日视为已送达收件人。</p>


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
          title:'充值协议',
           isMember:0,//是否是会员进入

        }
    },
    computed:{

      
    },
    mounted() {

     document.title = this.title;
     this.isMember = sessionStorage.getItem('isMember')||0;
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
  background: #FAFAFC;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;

  .header {
   padding-top: 0.32rem;
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0;
    background: #f5f6f8;
    text-align: center;
    border-bottom: 1px solid #DDDDDD;
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-top: 0.45rem;
      position: absolute;
      left: 0.4rem;
    }
    span {
      margin: 0 auto;
      display: inline-block;
      font-weight: bold;
      color: #152758;
      font-size:0.48rem;
      vertical-align: middle;
    }
  }
  .xy_cont{
    width: 90%;
    margin: 0 auto;
    
    padding-bottom: 1.533333rem;
    overflow: hidden;
    .title{
      font-size: 16px;
      color: #5d5d5d;
      text-align: center;
      padding-top: 0.8rem;
      font-weight: bold;
    }
    h4{
      font-weight: bold;
      font-size: 15px;
      color: #333131;
      line-height: 1.2rem;
    }
    p{
      font-size: 14px;
      color: #605d5d;
      line-height: 1rem;
      text-align: left;
      display: -webkit-box;
      display: -ms-flexbox;
      /* display: flex; */
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      text-indent: 28px;
    }
  }
  


}
</style>

