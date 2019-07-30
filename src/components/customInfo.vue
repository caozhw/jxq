<template>
  <div class="container" >
    <!-- <div class="header" >
      <a href="javascript:void(0)" @click="goBack">
        <img src="../assets/images/api/icon_back_white@3x.png" alt>
      </a>
      <span>客户详情</span>
    </div> -->

    <div class="bg user">
      <div class="user-ct">
          <!-- 已被抢 -->
        <i class="sold" v-if="userInfo.status==1&&agentUserTag.isOwn==0"></i>
        <h2>
          <span>{{userInfo.userName}}</span>
          <i v-if="isPlaceOnFile && agentUserTag.tagName">{{agentUserTag.tagName}}</i>
          <em v-if="!isPlaceOnFile && userInfo.yysTag">运营商认证</em>
          <em v-if="!isPlaceOnFile && userInfo.identityTag">身份认证</em>
        </h2>
        <p class="time">发布时间：{{alltimeFormatter(userInfo.applyTime)}}</p>
        <p class="time" v-if="isPlaceOnFile&&isShop!=1">订单编号：{{userInfo.orderNo}}<i @click="handleCopyContentClick(userInfo.orderNo)">复制</i></p>
        <div class="area">
          <p>
            <i class="m"></i>
            <span><em>{{userInfo.quota}}</em>/{{userInfo.deadline}}</span>
          </p>
          <p>
            <i class="l" ></i>
            <span>{{userInfo.city}}</span>  
          </p>
        </div>
        <div class="phone">
          <em>电话：{{userInfo.phone_mask}}</em>
          <span v-if="!isPlaceOnFile">（抢单后可拨打）</span>
          <i @click="handleOpenPhoneClick(userInfo.phone)" v-if="userInfo.status==1&&agentUserTag.isOwn==1"></i> 
        </div>
      </div>
    </div>
      <div class="bg info">
        <h2><i></i>基础信息</h2>
        <ul>
          <li>
            <p>
              <label>姓名：</label>
              <span>{{baseInfo.userName}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>年龄：</label>
              <span>{{baseInfo.age}}岁</span>
            </p>
          </li>
           <li>
            <p>
              <label>教育程度：</label>
              <span>{{baseInfo.education}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>户籍：</label>
              <span>{{baseInfo.census}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>电话：</label>
              <span>{{baseInfo.phoneAttribution}}</span>
            </p>
          </li>
        </ul>
      </div>


      <div class="bg info">
        <h2><i></i>工作信息</h2>
        <!-- 上班人群 -->
        <ul v-if="workInfo.vocationId==1 || workInfo.vocationId==0">  
          <li>
            <p>
              <label>职业身份：</label>
              <span>{{workInfo.vocation?workInfo.vocation:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>单位名称：</label>
              <span>{{workInfo.company?workInfo.company:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>当前工龄：</label>
              <span>{{workInfo.seniority.indexOf('未知')>-1?'未知':workInfo.seniority+'年'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>月均工资：</label>
              <span>{{workInfo.wages?workInfo.wages:'未知'}}</span>
            </p>
          </li>
        </ul>

        <!-- 企业主 -->
        <ul v-if="workInfo.vocationId==2">
          <li>
            <p>
              <label>职业身份：</label>
               <span>{{workInfo.vocation?workInfo.vocation:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>经营流水：</label>
              <span>{{workInfo.turnover?workInfo.turnover:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>经营年限：</label>
              <span>{{workInfo.businessLife?workInfo.businessLife + '年':'未知'}}</span>
            </p>
          </li>
         
        </ul>

        <!-- 个体商户 -->
        <ul v-if="workInfo.vocationId==3">
           <li>
            <p>
              <label>职业身份：</label>
               <span>{{workInfo.vocation?workInfo.vocation:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>经营流水：</label>
              <span>{{workInfo.turnover?workInfo.turnover:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>经营年限：</label>
              <span>{{workInfo.businessLife?workInfo.businessLife + '年':'未知'}}</span>
            </p>
          </li>
        </ul>

        <!-- 学生 -->
        <ul v-if="workInfo.vocationId==4">
          <li>
            <p>
              <label>职业身份：</label>
              <span>{{workInfo.vocation?workInfo.vocation:'未知'}}</span>
            </p>
          </li>
        </ul>

        <!-- 无固定职业 -->
        <ul v-if="workInfo.vocationId==5">
          <li>
            <p>
              <label>职业身份：</label>
              <span>{{workInfo.vocation?workInfo.vocation:'未知'}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>月均工资：</label>
              <span>{{workInfo.wages?workInfo.wages:'未知'}}</span>
            </p>
          </li>
        </ul>


      </div>
      <div class="bg info">
        <h2><i></i>资质信息</h2>
        <ul>
          <li v-show="!fix">
            <p>
              <label>信用卡：</label>
              <span>{{qualificationInfo.hasCreditCard}}</span>
            </p>
          </li>
          <li v-show="!fix">
            <p>
              <label>商业保险：</label>
              <span>{{qualificationInfo.hasInsure}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>社保：</label>
              <span>{{qualificationInfo.hasSocialSecurity}}</span>
            </p>
            <p v-show="!fix">
              <label>连续存缴：</label>
              <span>{{qualificationInfo.socialSecurityMonth}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>公积金：</label>
              <span>{{qualificationInfo.hasProvidentFund}}</span>
            </p>
             <p v-show="!fix">
              <label>连续存缴：</label>
              <span>{{qualificationInfo.providentFundMonth}}</span>
            </p>
          </li>
          <li>
            <p>
              <label>名下有车：</label>
              <span>{{qualificationInfo.hasCar}}</span>
            </p>
            <p v-if="qualificationInfo.hasCar.indexOf('有') >-1" v-show="!fix">
              <label>车辆估值：</label>
              <span>{{qualificationInfo.carValue}}</span>
            </p>
          </li>
           <li>
            <p>
              <label>名下有房：</label>
              <span>{{qualificationInfo.hasHouse}}</span>
            </p>
            <p v-if="qualificationInfo.hasHouse.indexOf('有') >-1" v-show="!fix">
              <label>房产估值：</label>
              <span>{{qualificationInfo.houseValue}}</span>
            </p>
          </li>
        </ul>
      </div>
      <!-- 按钮 -->
      <div class="price-btn" v-if="!isPlaceOnFile && (userInfo.status == 2||userInfo.status == 0)">
        <p style="padding-left: 0">
          <label>价格：</label>
          <span>{{isNaN(parseInt(userInfo.price))?'0':userInfo.price}} 金币</span>
        </p>
        <p  class="btn" @click="handleGrabOrderClick">立即抢单</p>
      </div>

      <!-- <div class="price-btn" v-if="isPlaceOnFile" @click="handleShowTagListClick">
        <p class="btn" ><span style="position:relative;left:-0.6rem;color:#FFF">归档客户</span></p>
      </div> -->

      <div class="price-btn" v-if="isPlaceOnFile">
        <p style="padding-left: 0" @click="handleShowEvaluationAlertClick">
          <span>优质评单返金币</span>
        </p>
        <p  class="btn" @click="handleShowTagListClick">归档客户</p>
      </div>

      <!-- 微店客户按钮 -->
      <div class="price-btn" v-if="!isPlaceOnFile&&(userInfo.status == 2||userInfo.status == 0)&&isShop==1">
        <p style="padding-left: 0">
          <label>价格：</label>
          <span>0 金币</span>
        </p>
        <p  class="btn" @click="handleGrabOrderClick">接单</p>
      </div>

      <!-- <div class="price-btn" v-if="isPlaceOnFile" @click="handleShowTagListClick">
        <p class="btn" ><span style="position:relative;left:-0.6rem;color:#FFF">归档客户</span></p>
      </div> -->

      <div class="price-btn" v-if="isPlaceOnFile&&isShop==1">
        <p  class="btn" @click="handleShowTagListClick">归档客户</p>
      </div>
      


    <!-- 弹框 -->
   
    <!--抢单成功！ 弹框 -->
    <div class="alert-msg" v-if="isShowSuccessAlert">
      <div class="alert-content">
        <div class="tip-ok">
          <i></i>
          <strong>抢单成功！</strong>
        </div>
       
      </div>
    </div>


    <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowRobbedAlert">
      <div class="alert-content">
        <div class="tip-warm">
         
          <strong>温馨提示</strong>
          <p>该订单已被抢走，请抢其他订单</p>
          <div class="tip-btn">
            <span @click="handleHideRobbedAlertClick">知道了</span>
          </div>
        </div>
       
      </div>
    </div>
    <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowRechargeAlert">
      <div class="alert-content">
        <div class="tip-phone">
         
          <strong style="text-align:left">温馨提示</strong>
          <p style="text-align:left">余额不足，请先充值</p>
          <div class="tip-btn">
            <span @click="isShowRechargeAlert=false">先不抢了</span>
            <span @click="handleRechargeClick">立即充值</span>
          </div>
        </div>
      </div>
    </div>

    <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowMemberAlert">
      <div class="alert-content">
        <div class="tip-phone">
         
          <strong style="text-align:left">温馨提示</strong>
          <p style="text-align:left">仅会员才能抢单，请先充值会员</p>
          <div class="tip-btn">
            <span @click="isShowMemberAlert=false">先不抢了</span>
            <span @click="handleMemberClick">购买会员</span>
          </div>
        </div>
       
      </div>
    </div>

     <!--温馨提示 弹框 -->
    <div class="alert-msg" v-if="isShowRecAlert">
      <div class="alert-content">
        <div class="tip-phone">
         
          <strong style="text-align:left">温馨提示</strong>
          <p style="text-align:left">您尚未认证，认证审核通过后才能抢单</p>
          <div class="tip-btn">
            <span @click="isShowRecAlert=false">先不认证</span>
            <span @click="handleRecClick">立即认证</span>
          </div>
        </div>
       
      </div>
    </div>

    <!--手机号 弹框 -->
    <div class="alert-msg" v-if="isShowPhoneAlert">
      <div class="alert-content">
        <div class="tip-phone">
         
          <strong>{{userInfo.phone_mask}}</strong>
         
          <div class="tip-btn">
            <span @click="handleClosePhoneAlertClick">取消</span>
            <span><a href="#" @click="handleCellPhoneClick(userInfo.phone)">呼叫</a></span>
            <!-- <span><a :href="'tel:' + userInfo.phone" >呼叫</a></span> -->
          </div>
        </div>
       
      </div>
    </div>

    <!--客户归档 选择 弹框 -->
    <div class="alert-msg" v-if="isShowTagListAlert">
      <div class="alert-content st-content">
        <div class="tip-select">
          <p>
           <span @click="handleHideTagListClick()">取消</span>
           <span @click="handleSureArchiveTagClick()">确定</span>
          </p>
          <ul>
           <li v-for="(item,index) in archiveTagListData" :key="index" :class="selectedTagId==item.tagId?'active':''" @click="handleSelectArchiveTagClick(item)">{{item.tagName}}</li>
          </ul>
        </div>
       
      </div>
    </div>


     <!--评价 弹框 -->
    <div class="alert-msg" v-if="isShowEvaluationAlert" :style="{top:isEveFocus?'-4rem':'0'}">
      <div class="alert-content e-content">
        <div class="tip-warm">
         
          <strong>优质评单立返3金币</strong>
          <h4>能联系到客户吗？</h4>
          <div class="select">
            <span @click="hasContact=1" :class="hasContact==1?'active':''">能</span>
            <span @click="hasContact=2" :class="hasContact==2?'active':''">否</span>
          </div>
          <h4>客户符合你的资质要求吗？</h4>
          <div class="select">
            <span  @click="hasConform=1" :class="hasConform==1?'active':''">大致符合</span>
            <span  @click="hasConform=2" :class="hasConform==2?'active':''">资质较差</span>
            <span  @click="hasConform=3" :class="hasConform==3?'active':''">信息错乱</span>
          </div>
          <h4>客户评价</h4>
          <textarea placeholder="填写你的跟进记录，优质评单立返3金币" v-model="content" maxlength="40" @keyup="handleContentKeyup" @focus="isEveFocus=true" @blur="isEveFocus=false">

          </textarea>
          <span class="t-num"><em>{{iptLength}}</em>/40</span>
          <div class="tip-btn">
            <span @click="evaluationUserRequest()" v-if="!isEvaluation">提交</span>
            <span @click="isShowEvaluationAlert=false;" v-if="isEvaluation">返回</span>
          </div>
        </div>
       
      </div>
    </div>


    <!-- loading -->
    <!-- <div class="loadmask" v-if="loading" @touchmove.prevent>
      <div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div> -->

  
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex'
import flexible from '../axios/js/flexible.js'
import util from '../axios/js/util.js'
import {sendRequest_app, getSignParamFromApp, openAppNativeView, goBackPage,controlTime,showLogDialogApp,callPhoneApp,copyContentApp,closeAppPage,goAuthApp} from '@/axios/axios_vue';
import {autoSign,userDetail,grabOrder,archiveTagList,archiveUser,evaluationUser,call,shopReceiveOrder,shopArchiveUser} from '@/axios/axios_vue';
import {AndroidOrIos} from '../axios/js/judge.js' 
export default {
    name:'',
    data () {
        return {
          isPlaceOnFile:false,//是否归档
          isShowPhoneAlert:false,//手机号码弹窗
          isShowSuccessAlert:false,//抢单成功
          isShowRobbedAlert:false,//被抢弹框
          isShowTagListAlert:false,//归档列表弹框
          isShowEvaluationAlert:false,//评价弹框

          isShowRechargeAlert:false,//充值弹框
          isShowMemberAlert:false,//充值弹框
          isShowRecAlert:false,//认证弹框

          isEvaluation:false,//是否已经提交
          isEveFocus:false,//评价是否获取焦点


          // isWorkPeople:false,
          // isBoss:false,
          // isSelfEmployed:false,
          // isStudent:false,
          // isFreeOccupation:false,

          baseInfo:{},//基础信息
          qualificationInfo:{},//资质信息
          userInfo:{},//用户信息
          workInfo:{},//工作信息
          agentUserTag:{},

          archiveTagListData:[],//归档列表

          selectedTagId:null,//选择的归档标签id


          userId:null,//客户 id

          hasContact:1,//能否联系到客户：1 能，2否
          hasConform:1,//	是否符合要求：1大致符合，2资质较差，3信息错乱
          content:'',//	评价内容

          iptLength:0,//内容长度

          hasEvaluate:null,//	是否可以评价：1 是，2否
          tencentPstnCall:null,//是否使用虚拟电话：1 是，2否


          
         


          //测试参数
          testAppData:{
            appKey:"android_user",
            uuid:"682300c8-3aa9-4445-8139-b763b1ae8518",
            sessionId:"7bfb373aa39896a9518ddc629b162752",
            source:"JxhOfficial",
          },

          
        }
    },
    computed:{

      
    },
    mounted() {
     
      
      document.title = "客户详情";  
      this.userId = util.GetUrlParam('userId') || this.$route.query.userId;
      this.isShop = util.GetUrlParam('isShop') || this.$route.query.isShop;//1微店       
      //alert(this.isShop)
      this.userDetailRequest();
      this.archiveTagListRequest();
     // this.archiveUserRequest();

      let _this = this;
      if(AndroidOrIos==1){

        document.body.addEventListener('focusin', () => {
          //软键盘弹出的事件处理
          if(isIphone()){

          }
        })
        document.body.addEventListener('focusout', () => {
          //软键盘收起的事件处理
          if(isIphone()){
            _this.isEveFocus = false;
          }
        })

      }else{
         //获取原窗口的高度
        var originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
        window.onresize=function(){
          //键盘弹起与隐藏都会引起窗口的高度发生变化
          var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
          if(resizeHeight-0<originalHeight-0){
          //当软键盘弹起，在此处操作
          }else{
            _this.isEveFocus = false;   
           //当软键盘收起，在此处操作
          }
        }
      }

    



     




    },
    methods: {

      //客户详情 信息接口
      userDetailRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = 203;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        //showLogDialogApp(obj)
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)

        //showLogDialogApp(obj_str)
        //alert(obj_str)
        sendRequest_app(userDetail, newObj).then((res) => {
          let {code,msg,result} = res;
           let obj_str = JSON.stringify(res)
           //showLogDialogApp('RES:'+obj_str)
          //alert(obj_str)
          this.isShowAdding = false;
          let _this = this;
          if(code == "00"){

            this.baseInfo = result.baseInfo;//基础信息
            this.qualificationInfo = result.qualificationInfo;//资质信息
            this.userInfo = result.userInfo;//用户信息
            this.workInfo = result.workInfo;//工作信息
            this.agentUserTag = result.agentUserTag;
            this.isPlaceOnFile = this.agentUserTag.isOwn==1&&this.userInfo.status==1?true:false;
            this.isShowRobbedAlert = this.agentUserTag.isOwn==0&&this.userInfo.status==1?true:false;
            this.hasEvaluate = result.hasEvaluate;
            this.tencentPstnCall  = result.tencentPstnCall ;
            this.fix = result.fix;

            // this.isPlaceOnFile = true;
            //let _vocationId = this.workInfo.vocationId;
            // switch(_vocationId){
            //   case 1://上班人群
            //     this.isWorkPeople = true;
            //     break;
            //   case 2://企业主
            //     this.isBoss = true;
            //     break;
            //   case 3://个体商户
            //     this.isSelfEmployed = true;
            //     break;
            //   case 4://学生
            //     this.isStudent = true;
            //     break;
            //   case 5://无固定职业
            //     this.isFreeOccupation = true;
            //     break;

            // }

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

       //抢单接口
      grabOrderRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)

        //alert(obj_str)
        sendRequest_app(grabOrder, newObj).then((res) => {
          let {code,msg,result} = res;
           let obj_str = JSON.stringify(res)
          //alert(obj_str)
          this.isShowAdding = false;
          let _this = this;
          if(code == "00"){
            this.isShowSuccessAlert = true;
            let _this = this;
            let _Time = setTimeout(() => {
              _this.isShowSuccessAlert = false;
              _this.userDetailRequest();
            }, 2000);
          }
          else{

            // 510：您尚未实名认证，认证通过才能抢单。
            // 511：您尚未工作认证，认证审核通过才能抢单。
            // 512：仅会员才能抢单，请先充值会员
            // 513：余额不足，请先充值
            if(code==510||code==511){
              this.isShowRecAlert = true;
            }
            else if(code==513){
              this.isShowRechargeAlert = true;
            }
            else if(code==512){
              this.isShowMemberAlert = true;
            }
            else{
              this.toastShowHide(msg,'bottom',2000);
            }
           
            
            
          }
        });
      },

      //归档列表接口
      archiveTagListRequest(){
        // let newObj = {};
        // newObj.appKey = this.testAppData.appKey;
        // newObj.source = this.testAppData.source;
        // newObj.sign = autoSign(newObj)
       
        var obj = new Object();
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)

        // alert(obj_str)
        //showLogDialogApp(obj_str)
        sendRequest_app(archiveTagList, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str)
          //alert(obj_str)
          let _this = this;
          if(code == "00"){
           this.archiveTagListData = result.list;
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //归档客户接口
      archiveUserRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.tagId = this.selectedTagId;

      

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        obj.tagId = this.selectedTagId;

        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //alert(obj_str)
        sendRequest_app(archiveUser, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //alert(obj_str)
          this.isShowAdding = false;
          let _this = this;
          if(code == "00"){
            this.userDetailRequest();
            this.isShowTagListAlert = false;
            this.toastShowHide('归档成功','bottom',2000);
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //评价接口
      evaluationUserRequest(){
        // let newObj = this.testAppData;
        // newObj.hasContact = this.hasContact;
        // newObj.hasConform = this.hasConform;
        // newObj.content = this.content;

      

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.hasContact = this.hasContact;
        obj.hasConform = this.hasConform;
        obj.content = this.content.trim();
        obj.userId = this.userId;

        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj);
        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(evaluationUser, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);  
          //showLogDialogApp(obj_str);
          //alert(obj_str)
          //this.isShowAdding = false;
          let _this = this;
          if(code == "00"){
            
            this.isShowEvaluationAlert = false;
            this.isEvaluation = true;
            this.toastShowHide('评价成功','bottom',2000);
            this.userDetailRequest();

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //电话接口
      callRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj);

        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(call, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res);
          //showLogDialogApp(obj_str);
          //alert(obj_str)
          //this.isShowAdding = false;
          let _this = this;
          this.isShowPhoneAlert = false;
          if(code == "00"){
          

          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //2.15 微店客户接单
      shopReceiveOrderRequest(){
         // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(shopReceiveOrder, newObj).then((res) => {
          let {code,msg,result} = res;
           let obj_str = JSON.stringify(res)
           //showLogDialogApp(obj_str);
          //alert(obj_str)
          this.isShowAdding = false;
           let _this = this;
          if(code == "00"){
            this.isShowSuccessAlert = true;
            let _this = this;
            let _Time = setTimeout(() => {
              _this.isShowSuccessAlert = false;
              _this.userDetailRequest();
            }, 2000);
          }
          else{

            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      //3.6 归档客户接口（新）
      shopArchiveUserRequest(){
        // let newObj = this.testAppData;
        // newObj.userId = this.userId;
        // newObj.tagId = this.selectedTagId;

      

        // newObj.sign = autoSign(newObj)


        var obj = new Object();
        obj.userId = this.userId;
        obj.tagId = this.selectedTagId;
        obj.userType = 2;

        var appReturnStr = getSignParamFromApp(obj);
        let newObj = JSON.parse(appReturnStr);
        let obj_str = JSON.stringify(newObj)
        //showLogDialogApp(obj_str);
        //alert(obj_str)
        sendRequest_app(shopArchiveUser, newObj).then((res) => {
          let {code,msg,result} = res;
          let obj_str = JSON.stringify(res)
          //showLogDialogApp(obj_str);
          //alert(obj_str)
          this.isShowAdding = false;
          let _this = this;
          if(code == "00"){
            this.userDetailRequest();
            this.isShowTagListAlert = false;
            this.toastShowHide('归档成功','bottom',2000);
          }
          else{
            
            this.toastShowHide(msg,'bottom',2000);
            
          }
        });
      },

      



      //显示电话 弹窗 点击
      handleOpenPhoneClick(phone){
         //callPhoneApp(phone);
        //this.isShowPhoneAlert = true;
        if(this.tencentPstnCall==1){
          this.callRequest();
        }else{
          callPhoneApp(phone);
        }
      },
      //关闭电话弹框 点击
      handleClosePhoneAlertClick(){
        this.isShowPhoneAlert = false;
      },
       //打电话 点击
      handleCellPhoneClick(phone){
        if(this.tencentPstnCall==1){
          this.callRequest();
        }else{
          callPhoneApp(phone);
        }
      
      },
      //抢单 点击
      handleGrabOrderClick(){
        if(this.isShop==1){
          this.shopReceiveOrderRequest();
        }else{
          this.grabOrderRequest();
        }
        
      },
      //隐藏 被抢弹框 点击
      handleHideRobbedAlertClick(){
        this.isShowRobbedAlert = false;
      },
      //客户归档 点击
      handleShowTagListClick(){
        
        this.isShowTagListAlert = true;
      },
      //客户归档 点击
      handleHideTagListClick(){
        this.isShowTagListAlert = false;
      },

      //选择归档标签 点击
      handleSelectArchiveTagClick(item){
        this.selectedTagId = item.tagId;
      },
      //确定选择归档标签 点击
      handleSureArchiveTagClick(){
        if(this.selectedTagId){
          if(this.isShop==1){
            this.shopArchiveUserRequest();
          }else{
             this.archiveUserRequest();
          }
         
        }else{
          this.toastShowHide('请选择归档类型','bottom',2000);
        }
      },
      handleShowEvaluationAlertClick(){
        if(this.hasEvaluate == 1){
          this.isShowEvaluationAlert = true;
        }else{
          this.toastShowHide('该客户您已评价','bottom',2000);
        }
        
      },

      //评价内容输入
      handleContentKeyup(e){
        e.target.value = e.target.value.replace(/[\r\n]/g,"");//去掉回车换行
        this.content = this.content.replace(/[\r\n]/g,"");//去掉回车换行
        this.iptLength = this.content.length;
        if(this.iptLength >= 40){
          e.target.value = e.target.value.substring(0,40);
        }
       
      },

      //复制no
      handleCopyContentClick(val){
        copyContentApp(val);
        //this.toastShowHide('复制成功','center',2000);

      },
      //无完善信息
      handleRecClick(){
        //closeAppPage();
        goAuthApp();
        
      },
      //购买会员
      handleMemberClick(){
        let _url = window.location.href.split('customInfo')[0];
        window.location.href = _url + 'memberRecharge';
      },
      //充值
      handleRechargeClick(){
        let _url = window.location.href.split('customInfo')[0];
        window.location.href = _url + 'investnow';
      },

     






      //时间格式化
      timeFormatter(value){
        value = value + '';
       if(value == 0 || value.length < 10){return '--';}
        let cellTime =new Date(parseInt(value) * 1000);
        let allTime = util.formatDate.format(cellTime);
        let dateTime = util.formatDate.format(cellTime).split(' ')[0];
        return dateTime;
      },
      //具体时间格式化
      alltimeFormatter(value){
         value = value + '';
       if(value == 0 || value.length < 10){return '--';}
        let cellTime =new Date(parseInt(value) * 1000);
        let allTime = util.formatDate.format(cellTime);
        let dateTime = util.formatDate.format(cellTime).split(' ')[0];
        return allTime;
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
  min-height: 100vh;
  background: #F6F7FA;
  background-size: 100% 100%;
  font-family:PingFangSC-Regular;
  font-weight:400;

  padding-top: 0.4rem;
  padding-bottom: 2rem;
  position: relative;
  .header {
   
    width: 10rem;
    height: 1.24rem;
    line-height: 1.24rem;
    position: fixed;
    top:0;
    background: #FFF;
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

  .bg{
    margin:0 auto;
    margin-top:0.4rem;
    width:9.2rem;
    background:#FFF;
    border-radius:0.2rem;
    box-shadow:0px 0.1rem 0.2rem 0.01rem rgba(240,240,240,1);


  }
  .user{
    position: relative;
    margin-top:0;
    .user-ct{
      padding:0.6rem;
      .sold{
        display: inline-block;
        width:2rem;
        height:2rem;
        margin-left:0.36rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url(../assets/images/ctm/pic_khxq_ybq@3x.png); 
        position: absolute;
        right: 0;
        top: 0;
      }
      h2{
        color:#152758;
        font-size:0.52rem;
        font-weight:600;
        margin-bottom:0.02rem;
        span{
          vertical-align: middle;
        }

        i{
          display:inline-block;
          font-size:0.28rem;
          padding:0.08rem 0.06rem;
          border-radius:0.1rem;
          margin-left:0.28rem;
          border:1px solid #FF7D27;
          color:#FF7D27;
          font-weight:400;
          vertical-align: middle;
        }
        em{
          display:inline-block;
          font-size:0.28rem;
          padding:0.08rem 0.06rem;
          border-radius:0.1rem;
          margin-left:0.28rem;
          border:1px solid #4780E9;
          color:#4780E9;
          font-weight:400;
          vertical-align: middle;
        }
      }
      .time{
        color:#858FAB;
        font-size: 0.38rem;
        i{
          display: inline-block;
          padding: 0.04rem 0.2rem;
          color:#858FAB;
          border:1px solid #858FAB;
          border-radius: 0.08rem;
          margin-left:0.12rem;
          font-size: 0.32rem;
              
        }
      }
      .area{
        height: 1.2rem;

        display: flex;
        align-items: center;
        justify-content:space-between;
        p{
          flex:1;
          font-size:0.44rem;
          span{
            color:#283865;
            vertical-align: middle;
            em{
              color:#FF7D27;
            }
          }
          i{
            display: inline-block;
            width:0.4rem;
            height:0.4rem;
            background-size: 100%;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right:0.2rem;
          }
          .m{
            background-image: url(../assets/images/ctm/icon_qd_ka@3x.png); 
          }
          .l{
            background-image: url(../assets/images/ctm/icon_qd_wz@3x.png); 
          }
        }
      }
      .phone{
        font-size:0.4rem;
        color:#858FAB;
        position: relative;
        em{
          vertical-align: middle;
          font-weight: 400;
        }
        span{
          color:#4780E9;
          vertical-align: middle;
        }
        i{
          position:absolute;
          right: -0.36rem;
          bottom: -0.4rem;
          display: inline-block;
          width:1.4rem;
          height:1.4rem;
         
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url(../assets/images/ctm/icon_kh_dh@3x.png); 
          vertical-align: middle;
        }
      }
    }

  }
 
  .info{ 
    h2{
      height: 1.2rem;
      border-bottom:1px solid #DDDDDD;
      color:#203260;
      font-size:0.44rem;
      text-align:left;
      padding-left:0.4rem;
      display: flex;
      align-items: center;
      i{
        display: inline-block;
        width:0.14rem;
        height: 0.44rem;
        margin-right:0.2rem;
        border-radius:0.1rem;
        vertical-align: middle;
        background:linear-gradient(180deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);

      }
    }
    ul{
      padding:0.2rem 0;
      li{
        height: 1.2rem;

        display: flex;
        align-items: center;
        padding:0 0.6rem;
        p{
          flex:1;
          text-align: left;


          display: flex;
          align-items: center;
         
          
          label{
            color:#858FAB;
            font-size:0.38rem;
            vertical-align: middle;
            display: inline-block;
            min-width: 2.2rem;
          }
          span{
            color:#203260;
            font-size:0.38rem;
            vertical-align: middle;
          }
        }
      }
    }

  }
  .bg:last-child{
    margin-bottom:2rem;
  }
  .price-btn{
    width: 100%;
    position: fixed;
    bottom:0;
   
    background:#FFF;
    display: flex;
    align-items: center;
    justify-content:space-around;
    p{
      flex:1;
      font-size:0.48rem;
      height: 1.6rem;
      line-height:1.6rem;
      text-align:center;

    }
    p:first-child{
      padding-left:0.8rem;
      label{
        color:#858FAB;
      }
      span{
        color:#FF7D27;
        font-size:0.48rem;
      }
    }
    .btn{
      text-align:center;
      color:#FFF;
      background:linear-gradient(270deg,rgba(95,152,237,1) 0%,rgba(37,101,221,1) 100%);
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
          line-height:1.2rem;
          margin-bottom:0.24rem;
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
          text-align: center;
          display: inline-block;
          font-size:0.48rem;
          margin-bottom: 0.3rem;
        }
        p{
          color:#203260;
          font-size:0.42rem;
          line-height:1.2rem;
          margin-bottom:0.24rem;
        }
        .tip-btn{
          font-size:0.42rem;
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

   .loadmask{
        width: 10rem;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.3);
        text-align:center;
    }
    .loadEffect{
        width: 1.333rem;
        height: 1.333rem;
        position: fixed;
        margin: 0 auto;
        top: 50%;
        left: 50%;
        margin-top:-0.666rem;
        margin-left: -0.666rem;
    }
    .loadEffect span{
        display: inline-block;
        width: 0.213rem;
        height: 0.213rem;
        border-radius: 50%;
        background: #212019;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    @keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    .loadEffect span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-0.107rem;
        -webkit-animation-delay:0.13s;
    }
    .loadEffect span:nth-child(2){
        left: 0.187rem;
        top: 0.187rem;
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3){
        left: 50%;
        top: 0;
        margin-left: -0.107rem;
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4){
        top: 0.187rem;
        right:0.187rem;
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-0.107rem;
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6){
        right: 0.187rem;
        bottom:0.187rem;
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7){
        bottom: 0;
        left: 50%;
        margin-left: -0.107rem;
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8){
        bottom: 0.187rem;
        left: 0.187rem;
        -webkit-animation-delay:1.04s;
    }


    ::-webkit-input-placeholder { /* WebKit browsers */
    color: #858FAB;
    }
     ::-webkit-textarea-placeholder { /* WebKit browsers */
    color: #858FAB;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #858FAB;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #858FAB;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #858FAB;
    }
    :-ms-textarea-placeholder { /* Internet Explorer 10+ */
        color: #858FAB;
    }

}
</style>

