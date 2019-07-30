import Vue from 'vue'
import axios from 'axios'
import md5 from 'js-md5'
import $ from 'jquery'
import util from './js/util.js'
import {AndroidOrIos} from './js/judge.js'


//axios配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded:charset=UTF-8';
//axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  if(config.method === 'post'){

  }
  return config;
},(error) => {
  return Promise.reject(error);
});

let controlTime = 0;
let env = "test";
let page_env = "local";//local :本地调试  online：和App集成测试;
let baseUrl = null;
console.log('process.env.BASE_API',process.env.BASE_API)
baseUrl = process.env.BASE_API;
// if(env == "test"){
//     baseUrl = "http://youdai-test.bitker.cn/v150";
// }else if (env == "prod"){
// 	 baseUrl = "https://jinxianghui-api.xnxdgj.com/v150";
// }
// console.log(baseUrl);
//url地址





const userDetail = baseUrl + "/v140/user/detail"; //2.2 客户详情
const grabOrder = baseUrl + "/v140/agent/grab-order";//2.1 抢单
const archiveTagList = baseUrl + "/v140/common/archive-tag-list";//3.4 归档标签接口
const archiveList = baseUrl + "/v140/agent/archive-list";//3.1 归档列表接口
const archiveUser = baseUrl + "/v140/agent/archive-user";//3.3 归档客户接口
const getPayConfig = baseUrl + "/v140/agent/get-pay-config";//4.2 用户充值参数页
const pay = baseUrl + "/v140/agent/pay";//4.3 用户充值
const getDetail = baseUrl + "/v140/agent/get-detail";//4.1 获取登录用户基本信息接口
const paySearch = baseUrl + "/v140/agent/pay-search";//4.5 充值订单查询

const inviteList = baseUrl + "/v140/agent/invite-list";//7.4 邀请记录列表
const inviteRegister = baseUrl + "/v140/agent/invite-register";//7.1 邀请注册
const sendSmsCcode = baseUrl + "/v140/common/send-sms-code";//7.3 获取手机验证码
const getCaptcha = baseUrl + "/v140/common/captcha";//7.2 图形验证码
const inviteSummary = baseUrl + "/v140/agent/invite-summary";//7.5 邀请汇总
const taskAward = baseUrl + "/v140/common/task-award";//7.6 任务奖励
const checkPhone = baseUrl + "/v140/common/check-phone";//7.7 检查用户是否已注册

const evaluationUser = baseUrl + "/v140/agent/evaluation-user";//2.5 评价
const wapHome = baseUrl + "/v140/selfinfo/wapHome";//8.8 H5获取个人首页信息
const isAttention = baseUrl +'/wechat/is-attention';//1.11 是否关注微信公众号
const wechatGetGold = baseUrl +'/v140/agent/wechat-get-gold';//1.12 微信公众号送金币
const getWechatConfig = baseUrl + '/v140/common/get-wechat-config';//1.13 微信JSSDK参数
const call = baseUrl + '/v140/user/call';//2.6 打电话
const wapCircleInfo = baseUrl + '/v140/circle/wapCircleInfo';//11.14 H5获取圈子主页信息
const applyCircle = baseUrl + '/v140/circle/apply-circle';//11.1 申请加入圈子
const helpCenter = baseUrl + '/v140/help/index';//帮助中心
const miniShopInfo = baseUrl + '/v140/wap/miniShopInfo';//8.8 H5获取个人微店信息
const miniShop = baseUrl + '/v140/selfinfo/miniShop';//8.8 微店信息
const selfinfoTop = baseUrl + '/v140/selfinfo/top';//8.11 置顶
const deleteMainBusiness = baseUrl + '/v140/selfinfo/deleteMainBusiness';//8.1 删除主营业务
const saveSummary = baseUrl + '/v140/selfinfo/saveSummary';//8.13 维护个人简介
const shopReceiveOrder = baseUrl + '/v140/agent/receiveOrder';//2.15 微店客户接单
const shopArchiveUser = baseUrl + '/v140/agent/archiveUser';//3.6 归档客户接口（新）

const businessCard = baseUrl + '/v140/agent/business-card'; //3.8 名片
const exchangeCards = baseUrl + '/v140/agent/exchange-cards';//3.9 交换名片
const viewBusinessCard = baseUrl + '/v140/agent/view-business-card';//3.9 查看名片









//2.15 微店客户接单




const getvcode = baseUrl + "/v140/agent/getvcode"; //1.1 获取短信验证码接口




const vip_fee = 199;

// 埋点方法
function saveUserEvent(eventCode, eventMsg){
    var obj = new Object();
    obj.eventCode = eventCode;
    obj.eventMsg = eventMsg;
    var appReturnStr = getSignParamFromApp(obj);      
    let newObj = JSON.parse(appReturnStr)
    sendRequest_app(user_saveEvent, newObj).then((res) => {
    });
}

//跳转原生页面
function openAppNativeView(viewName){
    if(AndroidOrIos == 1){
        WebViewJavascriptBridge.openNativeView(viewName);
      }else{
        window.JxhAndroid.openNativeView(viewName);
      }
} 
//打开新页面
function openAppNewPage(pageUrl){
    if(AndroidOrIos == 1){
        WebViewJavascriptBridge.openNewPage(pageUrl);
      }else{
        window.JxhAndroid.openNewPage(pageUrl);
      }
} 
//关闭页面
function closeAppPage(){
  if(AndroidOrIos == 1){
      WebViewJavascriptBridge.webViewClose();
    }else{
      window.JxhAndroid.webViewClose();
    }
}

//打开第三方，加顶部返回及标题
function openAppNewPageWithToolBar(pageUrl){
    if(AndroidOrIos == 1){
        WebViewJavascriptBridge.openNewPageWithToolbar(pageUrl);
      }else{
        window.JxhAndroid.openNewPageWithToolbar(pageUrl);
      }
} 
//返回上一级 
function goBackPage(){
    if(AndroidOrIos == 1){
        WebViewJavascriptBridge.webViewBack();
      }else{
        window.JxhAndroid.webViewBack();
      }
} 
//回到原生页面
function closeAppPageApp() {
  if (AndroidOrIos == 1) {
    WebViewJavascriptBridge.closeAppPage();
  } else {
    window.JxhAndroid.webViewClose();
  }
}

//跳转交易记录
function pushMineRecordVCApp() {
  if (AndroidOrIos == 1) {
    WebViewJavascriptBridge.pushMineRecordVC();
  } else {
    window.JxhAndroid.openNativePage(1);
  }
}


//判断用户是否登录
function checkUserLoginFromApp(){
  var appReturnStatus = null;
  if(AndroidOrIos == 1){
      appReturnStatus = WebViewJavascriptBridge.checkUserLogin();
      return appReturnStatus;
  }else{
    appReturnStatus = window.JxhAndroid.checkUserLogin();
    return appReturnStatus;
  }
}

//app弹框
function showLogDialogApp(params){
   if(AndroidOrIos == 1){
      //alert(params)
    }else{
       window.JxhAndroid.showLogDialog(params);
    }
}

//app 清除路由历史
function clearWebCacheApp(){
  if(AndroidOrIos == 1){
    WebViewJavascriptBridge.clearWebCache();
    }else{
       window.JxhAndroid.clearWebCache();
    }
}

//吊起电话
function callPhoneApp(phone){
  if(AndroidOrIos == 1){
   // alert(phone)
    WebViewJavascriptBridge.callPhone(phone);
    }else{
       window.JxhAndroid.callPhone(phone);
    }
}

//重载页面
function reloadWebViewApp(){
  if(AndroidOrIos == 1){
    WebViewJavascriptBridge.reloadWebView();
    }
}

//打开原生页面
function openNativePageApp(){

} 

//分享朋友
function shareWithFriendsApp(){
  if (AndroidOrIos == 1) {
    WebViewJavascriptBridge.shareWithFriends();
  } else {
    window.JxhAndroid.shareWithFriends();
  }
}

//分享朋友圈
function shareTocircleApp() {
  if (AndroidOrIos == 1) {
    WebViewJavascriptBridge.shareTocircle();
  } else {
    window.JxhAndroid.shareTocircle();
  }
}

//顶部显示隐藏
function setNavigationStatusApp(status, adStatus) {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.setNavigationStatus(status+'');//0隐藏 1显示
  } else {
   // alert(adStatus)
    window.JxhAndroid.setToolBarType(adStatus)  //0隐藏 1显示蓝色 2显示白色
  }
}

//打开新的页面
function openNewPageApp(url) {

  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.setNavigationStatus(url);//0隐藏 1显示
  } else {
    
  }
  
}

//复制文字
function copyContentApp(val) {

  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.copyContent(val);
  } else {
    window.JxhAndroid.copyContent(val);
  }

}

//添加客服微信
function addCustomerServiceApp(val){
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.addCustomerService(val);
  } else {
    window.JxhAndroid.addCustomerService(val);
  }
}


//设置title名称
function setNavigationTitleApp(title){
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.setNavigationTitle(title);
  } else {
    document.title = title;
  }
}

//去认证
function goAuthApp(){
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.goAuth();
  } else {
    window.JxhAndroid.auth();
  }
}

//去主营业务
function goEditBusinessApp() {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.goEditBusiness();
  } else {
    window.JxhAndroid.createBusiness();
  }
}

//分享 2微店 0个人主页 1圈子
function editBusinessShareApp(type) {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.editBusinessShare(type);
  } else {
    window.JxhAndroid.shareWechat(type);
  }
}

//邀请好友 分享
function shareInviteApp() {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.shareInvite();
  } else {
    window.JxhAndroid.shareInvite();
  }
}

//是否登录
function isLoginApp() {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.isLogin();
  } else {
    window.JxhAndroid.isLogin();
  }
}

//ios支付
function buyForIOSApp(pId){
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.buyForIOS(pId);
  } else {
    
  }
}
//获取版本号
function getVersionApp() {
  if (AndroidOrIos == 1) {
    //alert(status)
    let _version = WebViewJavascriptBridge.getVersion();
    if (_version){
      return _version;
    } else {
      return false;
    }
  } else {
    let _version = window.JxhAndroid.getVersion();
    if (_version){
      return _version;
    }else{
      return false;
    }
   
   
  }
}

//交换名片
function exchangeCardSuccessApp() {
  if (AndroidOrIos == 1) {
    //alert(status)
    WebViewJavascriptBridge.exchangeCardSuccess();
  } else {
    window.JxhAndroid.exchangeCardSuccess();
  }
}





// 从app获取签名
function getSignParamFromApp(obj){
    var sendStr = "";
    Object.keys(obj).forEach(function(key){
        sendStr += ",\"" + key + "\":\"" + obj[key] + "\"" ;
    });
    if(sendStr == ""){
      sendStr = "{}";
    } else {
      sendStr = "{" + sendStr.substring(1) + "}";
    }
    var appReturnStr = "";
    if(AndroidOrIos == 1){ //ios
          appReturnStr = WebViewJavascriptBridge.getSignParam(sendStr);
          return appReturnStr;
      }else{
        appReturnStr = window.JxhAndroid.getSignParam(sendStr);
        return appReturnStr;
      }
  }

const sendRequest_app = (url, params) => { 

    let formdata = new FormData();
    Object.keys(params).forEach(function(key){
        formdata.append(key, params[key]) ;
    });
     let _url = JSON.stringify(url)
     //showLogDialogApp('URL:'+_url)
    let obj_str = JSON.stringify(params)
     //showLogDialogApp('params:'+obj_str)
   return axios.post(url,formdata)
        .then(res => res.data);
    
} 

const getRequest_app = (url, params) => {

  let formdata = new FormData();
  Object.keys(params).forEach(function (key) {
    formdata.append(key, params[key]);
  });
  let _url = JSON.stringify(url)
  //showLogDialogApp('URL:'+_url)
  let obj_str = JSON.stringify(params)
  //showLogDialogApp('params:'+obj_str)
  return axios.get(url, formdata)
    .then(res => res.data);

} 

const cpJsonToForm = (url, postData) => {
  //showLogDialogApp(window)
  var newKeyData = Object.keys(postData).sort();
  //showLogDialogApp(document)
  let eleForm = document.createElement('form');
  //showLogDialogApp(eleForm)
  eleForm.method="post";
  eleForm.action = url;
  var str = '';
  for (let i = 0; i < newKeyData.length; i++) {
    let eleIpt = document.createElement('input');

    eleIpt.name = newKeyData[i];
    eleIpt.value = postData[newKeyData[i]].toString().trim();
    eleForm.appendChild(eleIpt);
    str += newKeyData[i] + '=' + postData[newKeyData[i]].toString().trim() + '&';
  }
  str = str.substring(0, str.length - 1);
  
  //showLogDialogApp(eleForm)
  eleForm.submit();
  

  //return str;
}


//测试生成签名
var autoSign = function (postData) {

  for (let item in postData) {
    if (postData[item] == null) {
      delete postData[item];
    }
  }

  // var postData = {
  //     appKey: 'android_user',
  //     uuid: 'd3719288-19c0-4c27-af64-aa8f984a6c5a',
  //     sessionId: 'fed38e50867ec42a79e19c3034505563',
  //     source: 'JxhOfficial',
  //     productId: 1,
  //     sort: 'D haha 椎间盘买个 *&^%$#@)(-__+ ',
  //     adId: '1'
  // };

  //{"sign":"73198b9947adb4c7beda20bbc2e947ad","appKey":"android_user","source":"JxhOfficial","sessionId":"f0d9fa6696a2e6399eb212586b1c79d3","uuid":"76c29904-f4f7-46fa-822e-a93092e6a5db"}

  // 'uuid'      =>  '14c1295c-01dc-45d6-b2e9-235d6f08170e',
  //'sessionId' =>  '41687870330e8b6670feb1c2cdb4e9b9',
  delete postData.sign;
  postData.tstamp = util.setRequestTime();
  var newKeyData = Object.keys(postData).sort();
  var str = '';
  for (var i = 0; i < newKeyData.length; i++) {
    str += newKeyData[i] + '=' + postData[newKeyData[i]].toString().trim() + '&';
  }
  str = str.substring(0, str.length - 1);

  var secretKeyDict = {
    iphone_user: '"(SIGN)*(&Jj**^M<>>9>>kjfie_F4Y_D*&541*(^43_JKHUw116',
    android_user: '(SIGN)998KI(*9225mk)_++_)Y_D9Avh42-+*//**342></./',
    manage_user: 'MJ,986.,*&BYT^///12((&*&HBB&T^U12..\\/\||nc'
  };

  var k = secretKeyDict[postData.appKey];

  var signStr = k + str + k;

  //console.log('==', signStr, '==');
  var sign = md5(signStr);
 //console.log(sign);
  return sign;
};



export {
  sendRequest_app,
  getRequest_app,
  getSignParamFromApp,
  openAppNativeView,
  openAppNewPage,
  vip_fee,
  goBackPage,
  openAppNewPageWithToolBar,
  saveUserEvent,
  checkUserLoginFromApp,
  controlTime,
  closeAppPage,
  showLogDialogApp,
  clearWebCacheApp,
  reloadWebViewApp,
  callPhoneApp,
  copyContentApp,


  cpJsonToForm,

  shareWithFriendsApp,
  shareTocircleApp,

  pushMineRecordVCApp,
  closeAppPageApp,
  setNavigationStatusApp,
  openNewPageApp,
  addCustomerServiceApp,
  setNavigationTitleApp,
  goAuthApp,
  goEditBusinessApp,
  editBusinessShareApp,
  buyForIOSApp,
  shareInviteApp,
  isLoginApp,
  getVersionApp,
  exchangeCardSuccessApp,

  autoSign,
  // 接口地址


 


  userDetail,
  grabOrder,
  archiveList,
  archiveTagList,
  archiveUser,
  getPayConfig,
  pay,
  getDetail,
  paySearch,

  inviteList,
  inviteRegister, 
  sendSmsCcode, 
  getCaptcha,
  inviteSummary,
  taskAward,
  checkPhone,
  evaluationUser,
  wapHome,
  isAttention,
  wechatGetGold,
  getWechatConfig,
  call,
  wapCircleInfo,
  applyCircle,
  helpCenter,
  miniShopInfo,
  miniShop,
  selfinfoTop,
  deleteMainBusiness,
  saveSummary,
  shopReceiveOrder,
  shopArchiveUser,
  businessCard,
  exchangeCards,
  viewBusinessCard,


  getvcode

} 



