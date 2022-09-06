/*********************************************************
  Utility Functions
**********************************************************/





var logDiv = null;

function wLog(){
  return;
  /***
  var msg = '';
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if(typeof arg === 'object'){
      msg = msg + '<br> >>Object>> ' + JSON.stringify(arg) +'<br>';
    }else{
      msg = msg + arg;
    }
  }
  if(!logDiv){
    var tag = document.createElement("div");
    tag.className = 'log-outer'
    tag.innerHTML = "<button style='position:absolute;top:0;right:0;z-index:10' "+
      "onclick=\"document.getElementById('logDiv').innerHTML=''\">로그삭제</button>"+
      "<div id='logDiv'>Started..</div>";
    document.body.appendChild(tag);
    logDiv = document.getElementById('logDiv');
  }
  var tm = (new Date()).toLocaleTimeString();
  logDiv.innerHTML = logDiv.innerHTML + '<br/>[' + tm + '] '+ msg;
  logDiv.scrollTop += 50;
  ***/
}

function EE(fnName){
  wLog('================== ' + fnName + ' =================');
  eval(fnName +'()');
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  exdays = exdays || 365;
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}

var QueryString = (function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var host = window.location.host.split(":")[0];
  query_string.serverIp = host;

  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
   return query_string;
})();

/*********************************************************
  initialize
**********************************************************/
function queueDivInit(capi){
  var queues = capi.getUserQueues();
  console.log(queues);
}

var CAPI = null;
var Rec = new Object(); //부분녹취
var initSocket;

function WindowLoad() {
  var res = initSocket();  
  var sock;
  var sockPort=5002;
  var btns = document.getElementsByTagName('button');
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
  }
  setTimeout("initButtons()", 1800);
  var userid = 'user1000';
  var phone = '1000';  
  var initCAPI;
  if (QueryString.userid) {
    userid = QueryString.userid;
    document.getElementById('userid').innerText = userid;
  }
  if (QueryString.phone) {
    phone = QueryString.phone;
    document.getElementById('phone').innerText = phone;
  }
  try {
    if (res) {
      CAPI = new initCAPI(sock, {
          jv: document.getElementById('js2vb'),
          vj: document.getElementById('vb2js'),
          isPB: ((QueryString.isPB) ? true : false),
          server: QueryString.serverIp,
          port: sockPort,
          phone: phone,
          userid: userid,
          onState: stateChangeCallback,
          onHangup: hangupCallback,
          onSub: subEventCallback,
          //
          optInbAfterHangup: 'NotReady', //인바운드콜 종료 후 모드: NotReady(후처리하는경우), Inbound(기본값:후처리없는경우),
          optOubAfterHangup: 'NotReady', //아웃바운드콜 종료 후 모드: NotReady(후처리하는경우), Outbound(기본값:후처리없는경우),
          optCmpAfterHangup: 'NotReady', //캠페인콜 종료 후 모드: NotReady(후처리하는경우), 또는 Campaign(default:후처리없는경우),
          optInbAutoAnswer : false,       //인바운드콜 자동받기: true(자동받기) or false(기본값:자동받기안함),
          optCmpAutoAnswer : false,       //캠페인콜 자동받기: true(자동받기) or false(기본값:자동받기안함),
          //
          optAllowTxRingMode: 'Inbound' //Idle       : Login여부에 무관하게 Idle 상태이면 아무때나 호전환받음.
                                        //Inbound    : Inbound mode & Idle state 에서만 받음.(default)
                                        //InOutBound : Inbound 또는 Outbound mode & Idle state 에서만 받음.
                                        //AnyLogin   : 로그인한 상태이고 Idle state 이면 mode에 상관없이 받음.
                                        //Never      : 절대안받음.
        });
      if (CAPI) {
        //TODO: enable login button..
        document.body.style.backgroundColor = 'rgb(200, 200, 100)';
        if (QueryString.autoLogin === 'true'||QueryString.autoLogin === '1') {
          setTimeout(login,2000);
        }
      } else {
        document.body.style.backgroundColor = 'rgb(100, 0, 0)';
      }
      // Rec.sm.onenterUNAVAIL(); //부분녹취 초기화
      //
    } else {
      //TODO: disable button..
      document.body.style.backgroundColor = 'rgb(100, 0, 0)';
    }
  } catch (e) {
    alert('[ERROR]WindowLoad:: ' + e.message);
  }
}

function WindowClose() {
  if(CAPI && CAPI.mode!=='Logout'){
    CAPI.logout();
  }
}

function changeAgent(){
  var i = document.getElementById('userid');
  var usr = prompt("변경할 상담원ID를 입력하세요.", i.innerText);
  if (usr == null) {
     return;
  }else{
    i.innerText = usr;
    CAPI.userid = usr;
  }
}

function changePhone(){
  var i = document.getElementById('phone');
  var pp = prompt("변경할 전화기ID를 입력하세요.", i.innerText);
  if (pp == null) {
     return;
  }else{
    i.innerText = pp;
    CAPI.phone = pp;
  }
}

/*********************************************************
  Button Handlers
**********************************************************/
var cBtns = {
  Dial      : null,
  Hangup    : null,
  Answer    : null,
  // QPickup   : null,
  TransferCold  : null,
  TransferWarm  : null,
  Transfer  : null,
  TxComplete: null,
  TxCancel  : null,
  Tx3Connect: null,
  TxToggle  : null,
  IvrSsn    : null,
  IvrAcc    : null,
  IvrRet    : null,
  Record    : null,
  StartAF   : null,
  StopAF    : null
};

var mBtns = {
  Login     : null,
  Logout    : null,
  NotReady  : null,
  Inbound   : null,
  Outbound  : null,
  Campaign  : null,
  Hold      : null,
  Away      : null,
  Rest      : null,
  Lunch     : null,
  Meeting   : null,
  Seminar   : null,
  Etc       : null,
 // Board     : null,
 // Chat      : null,
  GetState  : null
};

var qBtns = {
  QueueAdd  : null,
  QueueSub  : null,
  QueueRun  : null,
  QueuePause: null,
  QueueState: null
};

function initButtons(){
  Object.keys(cBtns).forEach(function(k){
    cBtns[k] = document.getElementById(k);
    cBtns[k].disabled = true;
  });
  Object.keys(mBtns).forEach(function(k){
    mBtns[k] = document.getElementById(k);
    mBtns[k].disabled = (k!=='Login');
  });
  Object.keys(qBtns).forEach(function(k){
    qBtns[k] = document.getElementById(k);
    qBtns[k].disabled = false;
  });
}

function disableCallButtonsEx(ids,disabled){
  //ids: null   --> apply all
  //     string --> one id or comma separated string
  //     array  --> several id's
  //disabled: true  --> disable
  //          false --> enable
  var applyIds = [];
  if(ids===null){
    applyIds = Object.keys(cBtns);
  }else if(typeof ids==='string'){
    applyIds = ids.split(',');
  }else{
    applyIds = ids;
  }
  Object.keys(cBtns).forEach(function(k){
    if(applyIds.indexOf(k) >= 0){
      cBtns[k].disabled = disabled;
    }else{
      cBtns[k].disabled = !disabled;
    }
  });
}
function disableModeButtonsEx(ids,disabled){
  //ids: null   --> apply all
  //     string --> one id or comma separated string
  //     array  --> several id's
  //disabled: true  --> disable
  //          false --> enable
  var applyIds = [];
  if(ids===null){
    applyIds = Object.keys(mBtns);
  }else if(typeof ids==='string'){
    applyIds = ids.split(',');
  }else{
    applyIds = ids;
  }
  Object.keys(mBtns).forEach(function(k){
    if(applyIds.indexOf(k) >= 0){
      mBtns[k].disabled = disabled;
    }else{
      mBtns[k].disabled = !disabled;
    }
  });
}

function getButtonStates(){
  var res = {Mode:CAPI.mode,State:CAPI.state};
  Object.keys(cBtns).forEach(function(k){
    //res[k] = (cBtns[k].disabled) ? 0 : 1;
    res[k] = (cBtns[k].id === 'Record')? (cBtns[k].innerHTML.match(/[가-힣]+/gi)[1] === '종료') ? 0 : 1 :(cBtns[k].disabled) ? 0 : 1;
  });
  Object.keys(mBtns).forEach(function(k){
    res[k] = (mBtns[k].disabled) ? 0 : 1;
  });
  return res;
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
function hangupCallback(){
  console.log("===================================", CAPI.state);
  switch(CAPI.mode){
    case 'Inbound':
      if(CAPI.optInbAfterHangup==='NotReady') notReady();
      break;
    case 'Outbound':
      if(CAPI.optOubAfterHangup==='NotReady') notReady();
      break;
    case 'Campaign':
      if(CAPI.optCmpAfterHangup==='NotReady') notReady();
      break;
    case 'Hold':
      if(CAPI.optCmpAfterHangup==='NotReady') notReady();
      break;
    default:
      break;
  }
  if(QueryString.isPB) sendCallHangup();
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
function subEventCallback(sub) {
  switch (sub) {
  case 'QueuePause':
    //Ext.Msg.show({
    //    title: '비대기중',
    //    message: '전화를 받지않아, 비대기상태로 전환했습니다.<br>대기하시려면 [확인]을 누르세요.',
    //    buttons: Ext.Msg.YES,
    //    icon: Ext.Msg.WARNING,
    //    fn: function(){
    //        console.log('비대기-->대기!!!!');
    //        notReady();
    //    }
    //});
    break;

  case 'QueueDrop':
    //Ext.Msg.show({
    //    title: '고객포기',
    //    message: '인바운드 연결 중 고객이 전화를 끊었습니다.',
    //    buttons: Ext.Msg.YES,
    //    icon: Ext.Msg.WARNING
    //});
    //Ext.defer(function(){ Ext.Msg.close(); },1500);
    break;

  case 'QueueReject':
    //Ext.Msg.show({
    //    title: '비대기(거부)중',
    //    message: '인바운드 콜을 거부(reject) 중 입니다.',
    //    buttons: Ext.Msg.YES,
    //    icon: Ext.Msg.WARNING,
    //    fn: function(){
    //        console.log('비대기-->대기!!!!');
    //        notReady();
    //    }
    //});
    break;
  case 'DialBegin':
    var telInp = document.getElementById('tel');
    if (telInp)
      telInp.value = CAPI.cphone;
    break;

  // case 'DialCancel':
    //Ext.defer(function(){
    //    //Mapp.Crm.hasConn = false;
    //    notReady();
    //    //Mapp.Crm.hasConn = true;
    //    //Ext.getCmp('cons-save-tbar').enable();
    //},100);

   
    var Mapp=null;
    CAPI.sendEvt('@Call', {
      Mode: CAPI.mode,
      State: CAPI.state,
      Cid: Mapp.tel
    });
    break;

  case 'AHangup':
    CAPI.sendEvt('@Call', {
      Mode: CAPI.mode,
      State: CAPI.state,
      Cid: Mapp.tel
    });
    break;

  case 'CHangup':
    console.log("CHangup ============ ", CAPI.state);
    if (['TxConnect','Tx3Connect','TxConnectC'].indexOf(CAPI.state) >= 0){
      disableCallButtonsEx(['Hangup'], false);
      CAPI.state = 'Connect';
    }

    CAPI.sendEvt('@Call', {
      Mode: CAPI.mode,
      State: CAPI.state,
      Cid: Mapp.tel
    });
    break;

  case 'THangup': //호전환상담원 채널종료
    console.log("THangup ============ ", CAPI.state);

    if (CAPI.state !== 'Idle'){
      if (['TxConnectC'].indexOf(CAPI.state) >= 0){
        disableCallButtonsEx(['Hangup'], false);
        CAPI.state = 'Connect';
      }else{
        disableCallButtonsEx('TxCancel', false);
      }
    }
    break;   //카카오 PRI회선 분리로 읺
  case 'DialFail':
         console.log('DialFail ================ ',CAPI.state);
         alert("현재 채널이 부족하여 다이얼에 실패 했으니 다시 시도 해 주세요.");
         break;
  }
  
  
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
function stateChangeCallback(mode, state, time, call_type, sub) {
  var mm = document.getElementById('mode');
  var ss = document.getElementById('state');
  var tt = document.getElementById('time');
  var cc = document.getElementById('call_type');
  //console.log("stateChangeCallback: mode="+mode+',state='+state+',time='+time+',call_type='+call_type+',sub='+sub);
  if (mode !== null) {
    mm.innerText = mode;
    //var mdb = Ext.getCmp('mode-btn-'+mode);
    //if(mdb) mdb.setPressed();
  }
  if (state !== null)
    ss.innerText = state;
  if (time != null)
    tt.innerText = time;
  if (call_type != null)
    cc.innerText = call_type;
  //button enable/disable ..
  if (mode === 'Error') {
    disableModeButtonsEx(null, true);
    disableCallButtonsEx(null, true);
    //Mapp.mBtns.Login.disable();
    //Ext.getCmp('infoTab').mask();
    CAPI.mode = 'Error';
    CAPI.state = 'Error';
  } else if (mode === 'Logout') {
    disableModeButtonsEx('Login', false);
    disableCallButtonsEx(null, true);
    //Mapp.mBtns.NotReady.setIconCls('icon-flag_red');
    //Mapp.mBtns.NotReady.setText('비대기');
  } else if (['NotReady', 'Hold', 'Away', 'Rest', 'Lunch', 'Meeting', 'Seminar', 'Etc','Board','Chat'].indexOf(mode) >= 0) {
    disableCallButtonsEx(null, true);
    if (mode !== 'Hold') {
      disableModeButtonsEx(['Logout', 'NotReady', mode], false);
      disableCallButtonsEx('Dial', false); //enable dial where NotReady
    }
    if (mode === 'NotReady') {
      //Mapp와 달리 통화 종료 후 NotReady 로 가는 경우, 부분 녹취가 종료 되지 않아 추가.?? 체크필요!!
      Rec.setState(state);
    }
    //Mapp.mBtns.NotReady.setIconCls('icon-not_ready');
    //Mapp.mBtns.NotReady.setText('비대기');
  } else {
    //Mapp.mBtns.NotReady.setIconCls('icon-ready');
    //Mapp.mBtns.NotReady.setText('대기중');

    setSession((state === 'Connect') ? 'Init' : 'None');
    Rec.setState(state);
    switch (state) {
    case 'Idle':
      if (['Inbound','IDirect','Internal'].indexOf(mode) > -1) {
        disableModeButtonsEx(['Login', 'Inbound', 'Hold'], true);
        //disableCallButtonsEx(null, true);
        disableCallButtonsEx('Dial', false);
      } else if (mode === 'Outbound') {
        disableModeButtonsEx(['Login', 'Outbound', 'Hold'], true);
        disableCallButtonsEx('Dial', false);
      } else if (mode === 'Campaign') {
        disableModeButtonsEx(['Login', 'Campaign', 'Hold'], true);
        disableCallButtonsEx('Dial', false);
      }
      //disableModeButtonsEx(['Login','Hold'],true);
      break;
    case 'Ring':
      //Mapp.last_call_type = 'Inbound';
      disableModeButtonsEx(null, true);
      disableCallButtonsEx(['Answer', 'Hangup'], false);
      //Mapp.Crm.log('인바운드:링:');
      //Mapp.Crm.log('큐:'+Mapp.Crm.queueName);
      //Mapp.loadCustPanelByAjax({uid:CAPI.uid,chgMode:false});
      //Ext.defer(checkAutoAnswer,500);
      //Mapp.custConnected = false;
      //  var res = confirm("인바운드전화가 왔습니다.\n tel = "+Mapp.tel+"\nQueue = "+Mapp.queue);
      var Mapp=null;
      var num = document.getElementById('tel');
      if(num && typeof num.value!=='undefined') num.value = Mapp.tel;
      if (['QueueRing','Ring'].indexOf(CAPI.sub) > -1) {
        console.log('QueueRing*********************************');
        if (QueryString.isPB)
          sendCallInfo();
        else
          CAPI.sendEvt('@Call', {
            Mode: CAPI.mode,
            State: CAPI.state,
            Cid: Mapp.tel,
            Queue: Mapp.queue,
            Ivr_tag: CAPI.ivr_tag
          });
      } else { //QueueLink
        console.log('QueueLink********************************');
        if(CAPI.mode==='Inbound' && CAPI.optInbAutoAnswer) setTimeout("answer()", 100);
        if(CAPI.mode==='Campaign' && CAPI.optCmpAutoAnswer) setTimeout("answer()", 100);
      }
      break;
    case 'Dial':
      //if(Mapp.regCallId){
      //    Ext.getCmp('reg_call-grid').fireEvent('proc-reg-call',Mapp.regCallId);
      //}
      //Mapp.last_call_type = 'Outbound';
      disableModeButtonsEx(null, true);
      disableCallButtonsEx(['Hangup'], false);
      if (QueryString.isPB)
        sendCallInfo();
      else
        CAPI.sendEvt('@Call', {
          Mode: CAPI.mode,
          State: CAPI.state,
          Cid: Mapp.tel
        });
      //Mapp.Crm.log('아웃바운드:링:Dial:');
      //Mapp.custConnected = false;
      //Mapp.lastCall = {
      //  call_type: CAPI.mode,
      //  uid: CAPI.uid,
      //  tel: Mapp.cust_tel
      //};
      break;
    case 'Connect':
      if (CAPI.role === 'a') {
        disableModeButtonsEx(['Hold'], false);
        disableCallButtonsEx(['Hangup', 'TransferCold', 'TransferWarm', 'Transfer', 'IvrSsn', 'IvrAcc', 'IvrRet', 'Record', 'StartAF', 'StopAF'], false);
        setSession('Init');
        //Mapp.custConnected = true;
      } else {
        disableModeButtonsEx(null, true);
        disableCallButtonsEx(['Hangup'], false);
      }
      //Mapp.lastCall = {
      //  call_type: CAPI.mode,
      //  uid: CAPI.uid,
      //  tel: Mapp.cust_tel
      //};
      //Mapp.Crm.checkRegCall(Mapp.phone_num); //예약콜
      //if(CAPI.mode === 'Inbound') addGlobalOneTime('hangup',Mapp.Crm.procInboundHangup,null,{single:true,delay:50});
      if (QueryString.isPB)
        sendCallInfo();
      else
        CAPI.sendEvt('@Call', {
          Mode: CAPI.mode,
          State: CAPI.state,
          Cid: Mapp.tel
        });
      break;
    case 'TxDial': //only for [A]
      disableModeButtonsEx(null, true);
      //disableCallButtonsEx(['Hangup','TxCancel'],false);
      disableCallButtonsEx(['TxCancel'], false);
      break;
    case 'TxRing': //only for [T]
      disableModeButtonsEx(null, true);
      disableCallButtonsEx(['Hangup', 'Answer'], false);
      //Ext.defer(checkAutoAnswer,500);
      break;
    case 'TxWait': //only for [C] waiting for transfer.
      disableModeButtonsEx(null, true);
      disableCallButtonsEx(['Hangup'], false);
      break;
    case 'TxConnect': //호전환대상(t)과통화
      if (CAPI.role === 'a') {
        disableModeButtonsEx(['Hold'], true);
        disableCallButtonsEx(['TxComplete', 'TxCancel', 'TxToggle', 'Tx3Connect'], false);
      } else if (CAPI.role === 't') {
        disableModeButtonsEx(null, true);
        disableCallButtonsEx(['Hangup'], false);
      }
      break;
    case 'TxConnectC': //고객(c)과통화
      if (CAPI.role === 'a') {
        disableModeButtonsEx(['Hold'], true);
        disableCallButtonsEx(['TxComplete', 'TxCancel', 'TxToggle', 'Tx3Connect'], false);
      } else if (CAPI.role === 't') {
        disableModeButtonsEx(null, true);
        disableCallButtonsEx(['Hangup'], false);
      }
      break;
    case 'Tx3Connect':
      if (CAPI.role === 'a') {
        disableModeButtonsEx(['Hold'], true);
        disableCallButtonsEx(['TxComplete', 'TxCancel'], false);
      } else if (CAPI.role === 'c') {
        disableModeButtonsEx(null, true);
        disableCallButtonsEx(['Hangup'], false);
      } else if (CAPI.role === 't') {
        disableModeButtonsEx(null, true);
        disableCallButtonsEx(['Hangup'], false);
      }
      break;
    case 'TxComplete': //TODO
      //alert("TODO: TxComplete 상태... 어떻하지???");
      if (QueryString.isPB)
        sendCallInfo();
      else
        CAPI.sendEvt('@Call', {
          Mode: CAPI.mode,
          State: CAPI.state,
          Cid: Mapp.tel
        });
      break;
    } //switch(state)

  }
  //CAPI.sendEvt('@Button',getButtonStates());
  setTimeout((function (typ, sts) {
      CAPI.sendEvt(typ, sts);
    }).bind(null, '@Button', getButtonStates()), 200);

  if(sub) subEventCallback(sub);

}//stateChangeCallback


/*********************************************************
  CAPI: Call Control API's
**********************************************************/
function getState() {
/***
*[상담원상태]
*/
  CAPI.getState();
}

function login() {
/***
*[로그인]
*  -- 상담원 로그인.
*/
  if(CAPI.mode!=='Logout'){
    alert('[경고] 이미 로그인한 상태입니다.');
    return false;
  }
  CAPI.login({
    initMode: QueryString.initMode||QueryString.initState||'Outbound',
    override: (QueryString.override=='true')
  });
  setTimeout("queueDivInit(CAPI)",1000);
  setTimeout("getState()",1000); //자동받기 //Admin 기준
}

function logout() {
/***
*[로그아웃]
*  -- 상담원 로그아웃.
*/
  if(CAPI.mode==='Logout'){
    alert('[경고] 이미 로그아웃한 상태입니다.');
    return false;
  }
  CAPI.logout();
  if(QueryString.isPB){
    setTimeout(function(){
      window.location.href = window.location.href;
    },500);
  }
}

function ibMode() {
/***
*[IB모드]
*/
  if(CAPI.mode!=='Inbound'){
    setMode('Inbound');
  }

  console.log("인바운드");
}

function obMode() {
/***
*[OB모드]
*/
  if(CAPI.mode!=='Outbound'){
    setMode('Outbound');
  }
  console.log("아웃바운드");
}

function cbMode() {
/***
*[CB모드]
*/
  if(CAPI.mode!=='Callback'){
    setMode('Callback');
  }
}

function cmMode() {
/***
*[CM모드]
*/
  if(CAPI.mode!=='Campaign'){
    setMode('Campaign');
  }
}

function hangup() {
/***
*[전화끊기]
*  -- 아웃바운드 통화중이면 콜이 끊어짐.
*  -- 인바운드 통화중이면 콜이 끊어짐.
*  -- 3자통화중이면 호전환 완료 후 끊어짐.
*  -- 인바운드 ring중이면 거절이됨.
*/
  if(['Ring','Dial','TxRing','TxDial','Connect','TxConnect','TxToggle','Tx3Connect'].indexOf(CAPI.state) >= 0){
    CAPI.hangup();
    if(CAPI.audioforking) stopAudioFork();
  }else{
    alert('[상태오류] 현재 통화중이 아닙니다.');
    return false;
  }
}

function answer(){
/***
*[전화받기]
*  -- 인바운드 콜 받기.
*/
  if(CAPI.state!=='Ring' && CAPI.state!=='TxRing'){
    //alert('전화 받기는 ring중에만 가능합니다.');
    return;
  }
  if(CAPI.linked===false){
    // answer called before QueueLink event (by user click).
    console.log('before QueueLink: calling answer() again.. ' + new Date() );
    if(CAPI.ansTimer) clearTimeout(CAPI.ansTimer);
      CAPI.ansTimer = setTimeout(answer,500);
    return;
  }
  //now received QueueLink
  if(CAPI.ansTimer) clearTimeout(CAPI.ansTimer);
  CAPI.answer();
}

function hold(){
/***
*[보류설정/보류해제]
*  -- 보류 토글.
*/
  if(CAPI.state==='Hold'){
    //TODO: 보류 해제
  }else if(['Connect','TxConnect'].indexOf(CAPI.state) >= 0){
    //TODO: 보류 설정
  }else{
    alert('보류 기능은 통화중에만 가능합니다.');
    return;
  }
  var tt = mBtns['Hold'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Hold'].innerHTML = tt[1];
  CAPI.hold();
}

function away(){
  var tt = mBtns['Away'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Away'].innerHTML = tt[1];
  CAPI.away();
}

function rest(){
  var tt = mBtns['Rest'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Rest'].innerHTML = tt[1];
  CAPI.rest();
}

function lunch(){
  var tt = mBtns['Lunch'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Lunch'].innerHTML = tt[1];
  CAPI.lunch();
}

function meeting(){
  var tt = mBtns['Meeting'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Meeting'].innerHTML = tt[1];
  CAPI.meeting();
}

function seminar(){
  var tt = mBtns['Seminar'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Seminar'].innerHTML = tt[1];
  CAPI.seminar();
}

function etc(){
  var tt = mBtns['Etc'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Etc'].innerHTML = tt[1];
  CAPI.etc();
}

function board(){
  var tt = mBtns['Board'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Board'].innerHTML = tt[1];
  CAPI.board();
}

function chat(){
  var tt = mBtns['Chat'].innerHTML.match(/^(.+)\/해제$/);
  if(tt && tt.length===2) mBtns['Chat'].innerHTML = tt[1];
  CAPI.chat();
}

function setMode(mode){
    /* mode: Inbound, Outbound, Campaign, Callback */
    return CAPI.setMode(mode);
}

//자동대기설정
function autoReady() {
  if(CAPI.optInbAutoReady){
    setTimeout(function() {
      ibMode();
    }, CAPI.optInbAutoRdyTime);
  }
}

function notReady(){
  var mode = CAPI.mode;
  if(['Away', 'Rest', 'Lunch', 'Meeting', 'Seminar', 'Etc'].indexOf(mode) > -1){
    eval(mode.toLowerCase() +'()');
    return;
  }
  autoReady();
  CAPI.notReady();

}


function dial() {
/***
*[전화걸기]
*/
  var num = document.getElementById('tel').value;
  if(num===''){
    alert('다이얼 할 전화번호를 입력하세요.');
    console.log("다이얼 할 전화번호 적어야지~")
    return;
  }
  if(CAPI.state!=='Idle'){
    alert('[상태오류] 다이얼할 수 없는 상태입니다.');
    return false;
  }
  if(typeof num=='undefined'||num==null){
    console.log("[Err]고객 전화번호를 입력하세요.");
    return;
  }

  dialEx(String(num),{call_type: "Outbound"});
}


function dialEx(num, obj) {
  /***
   * [전화걸기]
   * Ex:
   *    CAPI.dialEx('01033334444',{
   *      prefix    : '9', //외부발신 prefix
   *      cid       : '025224333',
   *      cust_id   : '20039204',
   *      call_type : 'Campaign', //필수
   *      typ_id    : '133'
   *    });
   */
  num = num.replace(/\D/g, '');
  obj = obj || {};
  /*** [체크.1] 로그인 ***/
  if (CAPI.mode === 'Logout') {
    alert('[상태오류] 소프트폰이 로그아웃 상태입니다.');
    return false;
  }
  /*** [체크.2] Idle 상태 ***/
  if (CAPI.state !== 'Idle') {
    alert('[상태오류] 다이얼할 수 없는 상태입니다. (state=' + CAPI.state + ')');
    return false;
  }
  /*** [체크.3] 번호 ***/
  if (num.length < 3) {
    alert('[상태오류] 잘못된 번호입니다.');
    return;
  }
  /*** [파라미터] 발신 call_type ***/
  if (['Outbound', 'Campaign', 'Callback'].indexOf(obj.call_type) < 0) {
    //console.log('dialEx:WARN: rejct dialEx, obj.call_type='+obj.call_type);
    //return false;
    obj.call_type = 'Outbound';
  }

  if (CAPI.mode !== obj.call_type) {
    //CAPI.mode: 'Inbound', 'NotReady','Hold','Away','Rest','Lunch','Meeting','Seminar','Etc'
    //           또는 Outbound 상태에서 Campaign콜 하는 등...
    var _modeChange = (function (n, o, m) {
      // n:번호, o:obj, m:현재모드
      //(1) obj.call_type 으로 mode 변경 후 다이얼.
      console.log('dialEx: modeChange event');
      if (CAPI.mode !== o.call_type) {
        console.log('event:modeChange: fail to change mode.. wanted=' + o.call_type + ',real=' + CAPI.mode);
        return;
      }

      var _consSave = (function (md) {
        //(2) 통화 종료 후 결과저장 창(modal) //Inbound가 아니므로 state=Idle로 그냥둠!!
        console.log('dialEx: hangup event.. 결과창 보이기 [' + md + ']');
        //~Mapp.Crm.fillConsSaveWnd();
        //~Mapp.ConsWnd.show();
        console.log("[_consSave]TODO:1: \n(1)상담저장 윈도우 보여주고.. \n(2)닫으면 \"evtConsWndHidden\" 이벤트..");

        Event.once('evtConsWndHidden', function () {
          console.log('dialEx: ConsWnd hidden.. restore previous mode [' + md + ']');
          //~Mapp.setCustFldsAndResFlds(md); //(3) 다시 원복!
        });

      }).bind(this, m);
      Event.once('hangup', _consSave);
      CAPI.dialEx(n, o);

    }).bind(this, num, obj, CAPI.mode);
    Event.once('modeChange', _modeChange);

    //~Mapp.setCustFldsAndResFlds(obj.call_type);

    setMode(obj.call_type);
    return;
  } else {
    var _consSave = function () {
      //~Mapp.Crm.fillConsSaveWnd(null); //beforehide event 에서 call됨.
      //~Mapp.ConsWnd.show();
      console.log('[_consSave]TODO:2: 상담저장 윈도우');
    };
    Event.once('hangup', _consSave);
  }
  CAPI.dialEx(num, obj);
}


// function qpickup(){
// /***
// *[당겨받기]
// *  -- 인바운드 콜 당겨받기.
// */
//   if(CAPI.state!=='Idle'){
//     alert('Q당겨받기는 Idle 상태에서만 가능합니다.');
//     return;
//   }
//   CAPI.qpickup();
// }

/***************************************************************************/

// Event.listen('qpickup-add',function(item){
//   const btn = document.querySelector('#QPickup');
//   console.log(`[event::qpickup-add] Added Item: ${JSON.stringify(item)}`);
//   btn.disabled = false;
// });

// Event.listen('qpickup-remove',function(item){
//   const btn = document.querySelector('#QPickup');
//   console.log(`[event::qpickup-remove] Removed Item: ${JSON.stringify(item)}`);
//   if(CAPI.qrings.length===0){
//     btn.disabled = true;
//   }
// });



function transferCold(txNumber){
  if(['Connect','TxConnect'].indexOf(CAPI.state) < 0){
    alert('호전환은 통화중에만 가능합니다.');
    return;
  }
  if(typeof txNumber==='undefined'){
    txNumber = prompt("[발신테스트] 고객 전화번호를 입력하세요.", getCookie('txNumber'));
  }
  if (typeof txNumber==='undefined' || txNumber === null) {
     return;
  }else{
    setCookie('txNumber',txNumber,365);
  }
  //if( txNumber.length >= 8 && !/^9/.test(txNumber)){
  //  alert('외부발신은 9를 붙여야 합니다.');
  //  return false;
  //}
  txNumber = oubTelPrefixAdjust(txNumber);
  CAPI.transferCold(txNumber);
}

function transferQueue(){
  if(['Connect','TxConnect'].indexOf(CAPI.state) < 0){
    alert('호전환은 통화중에만 가능합니다.');
    return;
  }
 var txNumber = document.getElementById('SelTransferCold').value
  if(document.getElementById('SelTransferCold') !== null){
    var selCid = document.getElementById('SelTransferCold').value;
    if(selCid === ''){
      alert('[선택오류]전환업무를 선택해주세요 ');
      return false;
    }
  }

  if (typeof txNumber==='undefined' || txNumber === null) {
     return;
  }
  //if( txNumber.length >= 8 && !/^9/.test(txNumber)){
  //  alert('외부발신은 9를 붙여야 합니다.');
  //  return false;
  //}
  txNumber = oubTelPrefixAdjust(txNumber);
  CAPI.transferCold(txNumber);
}













function transferWarm(txNumber){
  if(['Connect','TxConnect'].indexOf(CAPI.state) < 0){
    alert('호전환은 통화중에만 가능합니다.');
    return;
  }
  if(typeof txNumber==='undefined'){
    txNumber = prompt("[발신테스트] 고객 전화번호를 입력하세요.", getCookie('txNumber'));
  }
  if (typeof txNumber==='undefined' || txNumber === null) {
     return;
  }else{
    setCookie('txNumber',txNumber,365);
  }
  //if( txNumber.length >= 8 && !/^9/.test(txNumber)){
  //  alert('외부발신은 9를 붙여야 합니다.');
  //  return false;
  //}
  txNumber = oubTelPrefixAdjust(txNumber);
  CAPI.transferWarm(txNumber);
}

var dialogs;
function transfer(txNumber){
/***
*[호전환]
 *  -- 고객의 콜은 대기상태가 되고, 상담원은 2차상담원과 연결 시도됨.
 *  -- 상담원이 언제 콜을 끊냐에 따라 Blind 또는 Attended 가됨.
 *    -- Blind: 호전환 다이얼 후 ring중에 끊으면 Blind Transfer가됨.
 *    -- Attended: 호전환 다이얼 후 통화가 연결될 때까지 있으면 Attended Tranfer가됨.
 *
 *  -- 2차상담원과 통화연결 후 ..
 *     -- txCancel을 하면 고객과 다시 통화 연결됨.
 *     -- txComplete를 하면 고객과 2차상담원의 콜이 연결되고 상담원은 끊어짐(완료).
 *     -- tx3Connect를 하면 상담원, 고객, 2차상담원 세 명의 콜이 연결됨.
 *     -- tranferf를 다시 호출하면 다른 2차상담원과 연결 시도됨.
 *
 *  -- 3자통화연결 후..
 *     -- txCancel을 하면 2차상담원의 콜이 끊어지고 고객과 다시 통화 연결됨.
 *     -- txComplete(또는 hangup)를 하면 고객과 2차상담원의 콜이 연결되고 상담원은 끊어짐(완료).
*/
  if(['Connect','TxConnect'].indexOf(CAPI.state) < 0){
    alert('호전환은 통화중에만 가능합니다.');
    return;
  }

  if(typeof txNumber==='undefined'){
    if(typeof electron==='undefined'){
      txNumber = prompt("[발신테스트] 고객 전화번호를 입력하세요.", getCookie('txNumber'));
    }else{
      dialogs().prompt('호전환번호입력', function(ok) {
        if(ok){
          txNumber = ok;
          txNumber = oubTelPrefixAdjust(txNumber);
          CAPI.transfer(txNumber);
        }
      })
    }
  }

  if (typeof txNumber==='undefined' || txNumber === null) {
     return;
  }else{
    setCookie('txNumber',txNumber,365);
  }
  console.log("txNumber = ", txNumber);
  txNumber = oubTelPrefixAdjust(txNumber);
  CAPI.transfer(txNumber);
}

function txCancel(){
/***
*[전환취소]
*  -- 다음의 세 상태 중에 전환취소를 하면 다시 고객과 통화 연결됨.
*    -- 호전환 링 중
*    -- 2차상담원과 통화 중
*    -- 3자통화 중
*/
  if(['TxDial','TxConnect','Tx3Connect'].indexOf(CAPI.state)>=0){
    CAPI.txCancel();
  }else{
    alert('호전환 시도중이 아닙니다.');
    return;
  }
}

function txComplete(){
/***
*[전환완료]
*/
  if(['TxConnect','TxConnectC','Tx3Connect'].indexOf(CAPI.state)>=0){
    CAPI.txComplete();
  }else{
    alert('호전환중이 아닙니다.');
    return;
  }
}

function tx3Connect(){
/***
*[3자통화]
*  -- 고객, 상담원(본인), 2차상담원이 동시에 연결됨.
*/
  if(['TxConnect','TxConnectC'].indexOf(CAPI.state)>=0){
    CAPI.tx3Connect();
  }else{
    alert('호전환중이 아닙니다.');
    return;
  }
}

function txToggle(){
/***
*[화자전환]
*  -- 고객 또는 2차상담원간 화자 전환.
*/
  if(['TxConnect','TxConnectC'].indexOf(CAPI.state)>=0){
    CAPI.txToggle();
  }else{
    alert('호전환중이 아닙니다.');
    return;
  }
}


function getTeamAgents(){
/***
*[팀멤버가져오기]
*  -- 팀원 리스트와 상태를 가져옴.
*/
}

function getGroupAgents(){
/***
*[그룹멤버가져오기]
*  -- 그룹멤버 리스트와 상태를 가져옴.
*/
}

function getCenterAgents(){
/***
*[센터멤버가져오기]
*  -- 센터멤버 리스트와 상태를 가져옴.
*/
}

var doAjax;
// "http://"+location.hostname+"/call_logs/dummy?user_id="+CAPI.userid+"&cmd=getRecent";
function getRecentCallInfo(){
  var url = window.location.reload();
  doAjax(url,function(res){
    var rr = JSON.parse(res);
    if(rr && rr.id){
      CAPI.sendEvt('@CallInfo',rr); // EX: @CallInfo!id:123^uid:100-1455697945.49^call_type:Outbound^..
    }else{
      CAPI.sendEvt('@CallInfo',{id:'none'}); // EX: @CallInfo!id:none
      console.log(res);
    }
  });
}


function sendCallInfo(){
  CAPI.sendMsg({
      req: 'getCallInfo',
      uid: CAPI.uid
  });
}

function getLastCallInfo(){
  CAPI.sendMsg({
      req: 'getLastCallInfo',
      uid: CAPI.uid,
      userid : CAPI.userid
  });
}
var Mapp=null;
function sendCallHangup() {
  var uid = CAPI.uid;
  console.log('[sendCallHangup.1]', uid);
  console.log('[sendCallHangup.2]', uid);
  var url = window.location.reload(); 
  // "http://" + location.hostname + "/call_logs/dummy?uid=" + uid + "&cmd=getCallInfo";
  doAjax(url, function (res) {
    var rr = JSON.parse(res);
    if (rr && rr.id) {
      rr.Mode = CAPI.mode;
      rr.State = CAPI.state;
      rr.Cid = Mapp.tel;
      rr.is_end = true; //CHECK: forced to 1.
      console.log('[sendCallHangup.3]is_end=', rr.is_end);
      CAPI.sendEvt('@Call', rr); // EX: @Call!Mode:Inbound^State:Ring^Cid:0102223333^id:123^uid:100-1455697945.49^call_type:Outbound^..
    } else {
      CAPI.sendEvt('@Call', {
        id: 'none'
      }); // EX: @Call!id:none
      console.log(res);
    }
  });
}

function oubTelPrefixAdjust(tel){
  if( tel.length >= 8 && !/^9/.test(tel)){
    return '9'+tel;
  }
  return tel;
}

/*  function vbEvent(){
var tt = document.getElementById('vb2js').value;
if(tt==='open') onOpen();
else if(tt==='close') onClose();
else if(tt==='error') onError();
else onMessage(tt);
} */




// function vbEvent() {
//   var tt = document.getElementById('vb2js').value;
//   eval(tt);
// }

// if(typeof Mapp ==='undefined') Mapp = {};
// if(typeof Mapp.Crm ==='undefined') Mapp.Crm = {};
// Mapp.Crm.forceLogout = function(){
//   console.log('Forced to Logout!');
//   logout();
// };

// Mapp.Crm.tryLoginAfter = function(msec){
//   console.log('Retry Login..');
//     if(typeof msec==='undefined'||!msec){ msec = 1000; };
//   setTimeout(function(){
//     login();
//   },msec);
// };


/***************************************************************************/
/*****************************부분녹취**************************************/

// function record() {
//   var tt = cBtns['Record'].innerHTML.match(/[가-힣]+/gi);
//   if (tt && tt.length === 2) {
//     if (tt[1] === '시작') {
//       cBtns['Record'].innerHTML = tt[0] + ' 종료';
//     } else {
//       cBtns['Record'].innerHTML = tt[0] + ' 시작';
//     }
//   }
//   Rec.doAction();
// };


// Rec.doCmd = function(cmd,callback){ //cmd: recStart, recStop
//   if(cmd==='recStart'){
//       Rec.tag = new Date().tagDate();
//       Rec.uid = Mapp.call_id;//CAPI.uid;
//   }
//   var url = window.location.reload(); 
// // "http://"+location.hostname+"/users/"+CAPI.userid+"?cmd="+cmd+"&uid="+Rec.uid+"&tag="+Rec.tag;
//   var ActiveXObject;
//   window.xmlhttp = window.xmlhttp || (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
//   var ajax = window.xmlhttp;
//   var response;
//   if (typeof callback === 'function') {
//     ajax.onreadystatechange = function () {
//       if (ajax.readyState == 4) { //Complete
//         if (ajax.status == 200) { //Succes
//           var res = JSON.parse(ajax.responseText);
//           //console.warn('me:res: ',res);
//           if (typeof callback === 'function')
//             callback(res.success, res);
//         } else { //failure
//           var text = response.responseText;
//           //console.warn('me:fail:response: ',text);
//           if (typeof callback === 'function')
//             callback(false);
//         }
//       }
//     };
//   };
//   ajax.open("GET", url, true);
//   ajax.send();
// };

// var Stately;

// Rec.sm = Stately.machine({
//     'UNAVAIL': {
//       'setAvail': function () {
//         return this.AVAIL;
//       }
//     },
//     'AVAIL': {
//       'start': function () {
//         Rec.doCmd('recStart', function (ok,obj) {
//           if (ok === false) Rec.sm.stop();
//           else if(obj && obj.file){
//             Rec.file = obj.file;
//             Rec.sendEvt('start');
//             console.log("Rec file: "+Rec.file);
//           }
//         });
//         return this.RUNNING;
//       },
//       'setUnAvail': function () {
//         return this.UNAVAIL;
//       }
//     },
//     'RUNNING': {
//       'stop': function () {
//         Rec.doCmd('recStop', function (res) {
//           Rec.sm.end();
//           if (res) {
//             Rec.sendEvt('success');
//             //alert('부분녹취를 저장했습니다.');
//           } else {
//             Rec.sendEvt('fail');
//             //alert('부분녹취 저장에 실패했습니다.');
//           }
//         });
//         return this.STOPPING;
//       }
//     },
//     'STOPPING': {
//       'end': function () {
//         Rec.sendEvt('end');
//         if (CAPI.state === 'Connect')
//           return this.AVAIL;
//         return this.UNAVAIL;
//       }
//     }
//   }, 'UNAVAIL');

// Rec.sm.onenterUNAVAIL = function (event, oldState, newState) {
//   Rec.btn = Rec.btn || document.getElementById('Record');
//   Rec.btn.className = "icon-record";
//   //Rec.btn.disable();
// };

// Rec.sm.onenterAVAIL = function (event, oldState, newState) {
//   Rec.btn.className = "icon-record-avail";
//   //Rec.btn.enable();
// };

// Rec.sm.onenterRUNNING = function (event, oldState, newState) {
//   Rec.btn.className =  "icon-record-running";
// };

// Rec.sm.onenterSTOPPING = function (event, oldState, newState) {
//   Rec.sm.end();
// };

// Rec.setState = function(state) {
//   var myState = Rec.sm.getMachineState();
//   if(state==='Connect'){
//       Rec.sm.setAvail();
//   }else{
//     switch(myState){
//         case 'UNAVAIL':
//             break;
//         case 'AVAIL':
//             Rec.sm.setUnAvail();
//             break;
//         case 'RUNNING':
//             Rec.sm.stop();
//             break;
//         case 'STOPPING':
//             break;
//     }
//   }
// };

// Rec.doAction = function () {
//   if (Rec.btn.className === 'icon-record-running') {
//     Rec.sm.stop();
//   } else {
//     Rec.sm.start();
//   }
// };

// Rec.sendEvt = function (evt) {
//   setTimeout((function (typ, sts) {
//       CAPI.sendEvt(typ, sts);
//     }).bind(null, '@Button', getButtonStates()), 100)
//   CAPI.record(evt);
//   // CAPI.sendEvt('@Call',{Mode:CAPI.mode,State:CAPI.state,Sub:evt});
// };
/***************************************************************************/

/***************************************************************************/
/***** IVR 호전환 기능 ***/

function setSession(session) {
  //session: none: Connect아닐때, init: Connect됐을때, ssn: IVR get-SSN, account; IVR get-Account
  var nn = document.getElementById('session');
  var rr = document.getElementById('IvrRet');
  var ss = document.getElementById('IvrSsn');
  var aa = document.getElementById('IvrAcc');
  nn.innerText = session;
  switch (session) {
  case 'Init':
    rr.disabled = true;
    ss.disabled = false;
    aa.disabled = false;
    break;
  case 'Ssn':
    rr.disabled = false;
    ss.disabled = true;
    aa.disabled = true;
    CAPI.sendEvt('@Info',{ type: 'ssn', result: 'success', value: 'S' });
    break;
  case 'Account':
    rr.disabled = false;
    ss.disabled = true;
    aa.disabled = true;
    CAPI.sendEvt('@Info',{ type: 'account', result: 'success', value: 'S' });
    break;
  default:
    rr.disabled = true;
    ss.disabled = true;
    aa.disabled = true;
  }
}

/*
function ivrSsn() {
  setSession('Ssn');
  Event.once('ivrTxComplete', function (typ, res, val) {
    console.log('ivrTxComplete: type/res/val = ', typ, res, val);
    setSession('Init');
  });
  CAPI.genAction(
    'Redirect', {
    Channel: CAPI.cchan,
    Context: 'IvrGetInput',
    Exten: CAPI.cphone + '^ssn^get-ssn^13^13^3',
    Priority: 1
  });
}
*/

function ivrSsn() {
  setSession('Ssn');
  Event.once('ivrTxComplete', function (typ, res, val) {
    console.log('ivrTxComplete: type/res/val = ', typ, res, val);
    setSession('Init');
  });
  CAPI.genAction(
    'Redirect', {
    Channel:  CAPI.cchan,
    Context:  'IvrGetInput',
//  Exten:    CAPI.cphone + '^ssn^get-ssn^1^1^3', /* tel + ^type^ment^min^max^try */
    Exten:    CAPI.cphone + '^ssn^get-ssn^13^14^3', /* tel + ^type^ment^min^max^try */
    Priority: 1,
    extraChannel:  CAPI.achan,
    extraContext:  'ConfAgent',
    extraExten:    'A'+CAPI.uid,
    extraPriority: 1
  });
}


function ivrAccount() {
  setSession('Account');
  Event.once('ivrTxComplete', function (typ, res, val) {
    console.log('ivrTxComplete: type/res/val = ', typ, res, val);
    setSession('Init');
  });
  CAPI.genAction(
    'Redirect', {
    Channel: CAPI.cchan,
    Context: 'IvrGetInput',
    Exten: CAPI.cphone + '^account^get-account^1^1^3',
    Priority: 1,
    extraChannel:  CAPI.achan,
    extraContext:  'ConfAgent',
    extraExten:    'A'+CAPI.uid,
    extraPriority: 1
  });
}

function ivrReturn() {
  setSession('Init');
  CAPI.genAction(
    'Redirect', {
    Channel: CAPI.cchan,
    Context: 'IvrGetInput',
    Exten: 'ret',
    Priority: 1
  });
}

/***************************************************************************/

function notiCall(uid,tel){ /* call notification */
  console.log('[notiCall] uid='+uid+', tel='+tel);
}

function startAudioFork(){
  if(CAPI.state!=="Connect"){
    alert("[startAudioFork] 현재 통화상태가 아닙니다.");
    return;
  }
  if(CAPI.audioforking){
    alert("[startAudioFork] 현재 AudioFork 중입니다.");
    return;
  }
  // fetch(`${location.protocol}//${location.host}/audioFork/start`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     channel: CAPI.achan,
  //     cid: CAPI.sippeer_id,
  //     type: "agent",
  //     uid: CAPI.uid
  //   })
  // }).then((response) => {
  //   CAPI.audioforking = true;
  //   console.log("[startAudioFork]", response);
  // });
}


function stopAudioFork(){
  if(CAPI.state!=="Connect"){
    alert("[stopAudioFork] 현재 통화상태가 아닙니다.");
    return;
  }
  if(!CAPI.audioforking){
    alert("[startAudioFork] 현재 AudioFork 중이 아닙니다.");
    return;
  }
  CAPI.audioforking = false; //요청결과 안보고..
  // fetch(`${location.protocol}//${location.host}/audioFork/stop`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     channel: CAPI.achan
  //   })
  // }).then((response) => {
  //   console.log("[stopAudioFork]", response);
  // });
}




