


document.eventQueue = [];
document.eventTime = (new Date).getTime();
document.eventTimeOut = null;

var sockPort = '5002'; /***** socket.io=5001 / WebSocket=5002 / TcpSocket=5003 *****/
var sockSSLPort = '8011';
var sock = null;
var ActiveXObject;
var Mapp;
if(typeof Mapp==='undefined') Mapp = { call_id: '', call_seq: '' };

function doAjax(url, callback) {
  window.xmlhttp  = window.xmlhttp || (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
  var ajax = window.xmlhttp;
  if(typeof callback==='function'){
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) callback(ajax.responseText);
    };
  }
  ajax.open("GET", url, true);
  ajax.send();
}

function objToStr(obj){
  var res = [];
  Object.keys(obj).forEach(function(k){
    var val = obj[k];
    if(/^201\d-\d\d-\d\d/.test(val)) val = obj[k].replace(/\D/g,'');
    res.push(k+':'+val);
  });
  return res.join('^');
}

Date.prototype.tagDate = function()
{
    var yyyy = this.getFullYear().toString();
    var mo = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();

    //return yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]) + (hh[1] ? hh : '0'+hh[0]) + (mm[1] ? mm : '0'+mm[0]) + (ss[1] ? ss : '0'+ss[0]);
    return yyyy + (mo.length > 1 ? mo : '0'+mo) + (dd.length > 1 ? dd : '0'+dd) + (hh.length > 1 ? hh : '0'+hh) + (mm.length > 1 ? mm : '0'+mm) + (ss.length > 1 ? ss : '0'+ss);
}

function wsPing(){
  var sock = this;
  if(sock.readyState===WebSocket.OPEN) sock.send('{"req":"ping"}');
  setTimeout(wsPing.bind(sock),30000);
}

function initSocket(){
  try{
    if(typeof WebSocket=='undefined'){
      alert('[심각한오류] 브라우저가 WebSocket을 지원하지 않습니다.!!');
      return false;
    }
    if(location.protocol==='https:'){
      sock = new WebSocket('wss://' + 'cc.intelloid.click'+ ':' + sockSSLPort );
    }
    else{
      sock = new WebSocket('ws://' + 'cc.intelloid.click' + ':' + sockPort );
    }
    sock.onclose = function (event) {
      document.body.style.backgroundColor = 'rgb(100, 0, 0)';
      console.log('sock:close: WebSocket connection closed ..');
      document.dispatchEvent(new CustomEvent("init-capi"));
    };

    sock.onerror = function (event) {
      document.body.style.backgroundColor = 'rgb(200, 0, 0)';
      console.log('sock:error: WebSocket connection error..');
    };

    sock.onopen = function (event) {
      document.body.style.backgroundColor = 'rgb(200, 200, 100)';
      console.log('sock:connect: WebSocket connected.. --> now you can login..');
    };

    /************************
     * 메시지 타입:
     * [1] request에 대한 응답
     *    [sample] {req:'login', res:'success', msg:'ok'}
     * [2] server-side event
     *    [sample] {evt:'ring', tm:'2014-12-09 14:35:11', p1:'02077778888', p2:'1234324.434'}
     ***/
    sock.onmessage = function (event) {
      var data = event.data;
      var CAPI;
      if(/^{.+}$/.test(data)){
        try{
          data = JSON.parse(data);
        }catch(e){
          alert('[onMessage/ERROR]JSON.parse failed.. ',data);
        }
        if(data.action){
          console.log('sock:message:action: ',data);
        }else if(data.req){
          console.log('sock:message:response for req=',data.req);
          if(CAPI.respHandler){
            if(CAPI.respHandler[data.req]){
              CAPI.respHandler[data.req](data);
            }else{
              alert('sock:message::WARNING: No respHandler['+ data.req +']');
            }
          }else{
            alert('sock:message::WARNING: unhandled response !!!');
          }
        }else if(data.evt){
          if(CAPI.eventHandler){
            if(CAPI.eventHandler[data.evt]) CAPI.eventHandler[data.evt](data);
            else alert('sock:message::WARNING: No eventHandler['+ data.evt +']');
          }else{
            alert('sock:message::WARNING: unhandled event !!!');
          }
        }else{
          alert('sock:message: UNKNOWN data from server !!!');
        }
      }else{
        alert('sock:message: NOT a JSON data = ',data);
      }
    };

    setTimeout(wsPing.bind(sock),30000);

  }catch(e){
    alert('ERROR::initSocket:: WebSocket init Failed!!',e.message);
    return false;
  }
  return true;
}


function initCAPI(sock,config){
    var me         = this;
    me.sock        = sock;
    me.apiVersion  = '1.0.1';
    me.server      = config.server;
    me.port        = config.port;
    me.phone       = config.phone;
    me.userid      = config.userid;
    me.onState     = null; //state change callback including sub-event handler.
    me.onHangup    = null; //hangup callback handler.
    me.onSub       = null; //sub-event callback handler (when no state change)
    me.role        = 'Unknown';
    me.call_type   = 'Idle';
    me.sockType    = 'WebSocket';

    me.mode        = 'Logout';
    me.state       = 'Idle';
    me.sub         =  null; //sub-state
    me.linked      =  false; //QueueLink mark
    me.session     = 'None'; // None,Ssn,Account
    me.msTimestamp = (new Date()).getTime();
    me.calls       = []; //최근10콜
    me.hupCalls    = []; //최근Hangup10콜

    me.version     = '1.0'; //CAPI protocol version
    me.optInbAfterHangup  = config.optInbAfterHangup||'Inbound';  //인바운드콜 종료 후 모드: NotReady(후처리하는경우), Inbound(기본값:후처리없는경우),
    me.optOubAfterHangup  = config.optOubAfterHangup||'Outbound'; //아웃바운드콜 종료 후 모드: NotReady(후처리하는경우), Outbound(기본값:후처리없는경우),
    me.optCmpAfterHangup  = config.optCmpAfterHangup||'Campaign'; //캠페인콜 종료 후 모드: NotReady(후처리하는경우), Campaign(기본값:후처리없는경우),
    // me.optInbAutoAnswer   = config.optInbAutoAnswer || false,     //인바운드콜 자동받기: true(자동받기) or false(기본값:자동받기안함),
    // me.optCmpAutoAnswer   = config.optCmpAutoAnswer || false,     //캠페인콜 자동받기: true(자동받기) or false(기본값:자동받기안함),
    //
    me.optAllowTxRingMode  = config.optAllowTxRingMode||'Inbound';  //호전환 받기 옵션.
    //Idle       : Login여부에 무관하게 Idle 상태이면 아무때나 호전환받음.
    //Inbound    : Inbound mode & Idle state 에서만 받음.(default)
    //InOutBound : Inbound 또는 Outbound mode & Idle state 에서만 받음.
    //AnyLogin   : 로그인한 상태이고 Idle state 이면 mode에 상관없이 받음.
    //Never      : 절대안받음.
    me.optObdPrefix = config.optObdPrefix||'9';

    me.jv = config.jv||null;
    me.vj = config.vj||null;
    me.isPB = config.isPB||null;
    me.qrings = []; // calls in QueueRing or QueueLink state, before Answer. (keys: uid,tm,userid,phone,tel,queueId,queueName)
    
    if(typeof config.onState==='function'){
        me.onState = config.onState;
    }
    if(typeof config.onHangup==='function'){
        me.onHangup = config.onHangup;
    }
    if(typeof config.onSub==='function'){
        me.onSub = config.onSub;
    }

    /********************************
   * 상담원 상태변경은 서버에서 request 응답시나 event시에 state를 설정해줌.
   ********************************
   * mode : Logout         : 로그아웃
   *        Inbound        : 인바운드 대기,
   *        Outbound       : 아웃바운드 only (인바운드콜 안받음. 아웃바운드는 가능),
   *        NotReady       : 후처리나 기타 업무 중(토글).
   *                         optPostInCallMode 옵션은 통해 인바운드콜 종료후 후처리로 설정.
   *                         수동으로 설정시는 Idle state에서만 가능.
   *        Hold           : 홀드(토글), 통화중(Connect,TxConnect,TxConnectC,Tx3Connect)에만 가능.
   *        Away(자리비움)/Rest(휴식)/Lunch(식사)/Meeting(회의)/Seminar(교육)/Etc(기타)
   *                       :상태토글 ~ Idle state 상태에서만 전환 가능,
   *        Error          : 에러상태 (리셋해야함).
   *
   * state: 통화상태에 따른 상담원 상태.
   *        Idle,          : idle state
   *        Ring           : 인바운드 링 중. (state0 에 Inbound 기록하고 콜 종료 후 Inbound로 돌려놈)
   *        Dial           : 아웃바운드 다이얼 중. (state0 에 이전 state 기록하고 콜 종료 후 돌려놈)
   *        TxRing         : 호전환 인바운드 링 중.
   *        TxDial         : 호전환 아웃바운드 다이얼 중.
   *        Connect        : 통화중.
   *        TxConnect      : 호전환시도(Txing) 통화중.
   *        TxConnectC     : 호전환시도(Txing) 중 고객과 통화.
   *        Tx3Connect     : 3자통화중.
   *        Error          : 에러상태 (리셋해야함).
   *******************************/

    me.modes = {
        Logout:   '로그아웃',
        Inbound:  'IB',
        Outbound: 'OB',
        Campaign: 'CMP',
        Callback: 'CBK',
        NotReady: '비업무',
        Hold:     '보류',
        Internal: '내선통화',
        Away:     '자리비움',
        Rest:     '휴식',
        Lunch:    '식사',
        Meeting:  '회의',
        Seminar:  '교육',
        Etc:      '기타',
        Board:    '게시판',
        Chat:     '채팅',
        Error:    '에러',
        CallEnd:  '콜종료'
    };

    me.states = {
        Idle: '대기',
        Ring: '링',
        Dial: '링',
        TxRing: '호전환링',
        TxDial: '호전환시도',
        Connect:'통화중',
        TxConnect:'호전환시도통화',
        TxConnectC:'호전환중고객통화',
        Tx3Connect: '3자통화',
        Error:'에러상태'
    };

    me.stateString = function(){
      if(['Logout','Hold','Away','Rest','Lunch','Meeting','Seminar','Etc','Board','Chat','Error','CallEnd'].indexOf(me.mode)>-1) return me.modes[me.mode];
      if(me.mode==='NotReady'){
        if(me.state==='Idle') return '후처리';
      }
      if(me.state==='Idle'){
        if(me.mode==='Inbound') return 'IB대기';
        if(me.mode==='Outbound') return 'OB대기';
        if(me.mode==='Campaign') return 'CMP대기';
        if(me.mode==='Callback') return 'CBK대기';
      }
      return me.modes[me.mode]+"/"+me.states[me.state];
    };

  //////////////////////////////////////////////////
  // sendMsg: send data to IPCC
  //////////////////////////////////////////////////
  me.sendMsg = function(prm){
    if(typeof prm === 'object'){
      if(!prm.userid) prm.userid = me.userid;
      prm = JSON.stringify(prm);
    }
    if(me.sock){
      switch(me.sock.readyState){
      case WebSocket.CONNECTING:
        console.log('[sendMsg:에러] WebSocket 연결 시도중.. (CONNECTING)');
        break;
      case WebSocket.OPEN:
        me.sock.send(prm);
        return 1;
      case WebSocket.CLOSING:
        console.log('[sendMsg:에러] WebSocket 연결 닫는중.. (CLOSING)');
        break;
      case WebSocket.CLOSED:
        console.log('[sendMsg:에러] WebSocket 연결 종료 (CLOSED)');
        break;
      }
    }else{
      console.log('[에러] WebSocket 초기화 오류.');
    }
    return -1;
  };

  //////////////////////////////////////////////////
  // sendEvt: send event to CS
  //          실제 Event는 js2vb element에서 읽어감.
  //          (Ex) @Button!Login:0^Dial:1^Hangup:0
  // - evtTyp: event type (@Button:버튼상태, @Call:콜상태)
  // - msg: object 또는 string
  //       (Ex-1) {Login:0,Dial:1,Hangup:0}
  //       (Ex-2) "Login:0^Dial:1^Hangup:0"
  //////////////////////////////////////////////////
  /*********************************
  me.sendEvt = function(evtTyp,msg){
    if(!me.jv) return -1;
    if(typeof msg === 'object'){
      msg = objToStr(msg);
    }
    try{
      var evt = evtTyp + '!' + msg;
      if(me.jv.value === evt) return; //Filter out same message
      me.jv.value = evt;
      console.log('[sendEvt]evt = '+evt);
      if(me.isPB){
        document.title = ((document.title==='+') ? '-' : '+'); // PowerBuilder: webbrowser.titlechange event !!
      }else{
        if(me.jv.fireEvent) me.jv.fireEvent('onchange');
      }
    }catch(e){
      console.dir(e);
      console.log('[에러] Event 전송 오류.');
    }
    return -1;
  };
*************************/


  document.sendEvt = (function(m){
    return function(evtMsg){
      if(document.eventTimeOut){
        clearTimeout(document.eventTimeOut);
        document.eventTimeOut = null;
      }
      var tt = (new Date).getTime() - document.eventTime;
      if(tt<200){
        if(evtMsg && evtMsg!=='') document.eventQueue.push(evtMsg);
        if(document.eventQueue.length>0) document.eventTimeOut = setTimeout(function(){ document.sendEvt(); },200);
        console.log('['+(new Date()).toLocaleTimeString()+'] RETURN. eventTime = '+document.eventTime+', eventTimeOut = '+document.eventTimeOut);
        return;
      }
      //console.log('*** Really Sending ***');
      if(document.eventQueue.length>0){
        if(evtMsg && evtMsg!=='') document.eventQueue.push(evtMsg);
        evtMsg = document.eventQueue.shift();
        console.log('['+(new Date()).toLocaleTimeString()+'] POP event: evtMsg = '+evtMsg);
      }
      if(!evtMsg){
        console.log('['+(new Date()).toLocaleTimeString()+'] NO event..');
        return;
      }
      m.jv.value = evtMsg;
      console.log('['+(new Date()).toLocaleTimeString()+'] SEND event: evtMsg = '+evtMsg);
      if(m.isPB) document.title = ((document.title==='+') ? '-' : '+'); // PowerBuilder: webbrowser.titlechange event !!
      else{
        if(m.jv.fireEvent) m.jv.fireEvent('onchange');
      }
      document.eventTime = (new Date).getTime(); //이벤트 보낸시간 기록.
      //다음 시도 예약!!
      if(document.eventQueue.length>0){
        document.eventTimeOut = setTimeout(function(){ document.sendEvt(); },200);
      }
    }
  })(me);

  me.sendEvt = function(evtTyp,msg){
    if(!me.jv) return -1;
    if(typeof msg === 'object') msg = objToStr(msg);
    var evt = evtTyp + '!' + msg;
    //if(me.jv.value === evt) return; //Filter out same message
    document.sendEvt(evt);
    return -1;
  };



  /*
  me.changeState = function(newStateFromServer){
    if(me.state===newStateFromServer){
      //토글..
      if(['Reject','Hold','Away','Rest','Lunch','Meeting','Seminar','Etc'].indexOf(newStateFromServer) > -1){
        if(['Inbound','Outbound','NotReady'].indexOf(me.state0) < 0){
          alert('[경고] invalid state0 = '+me.state0 '\n...강제로 [Inbound]로 설정합니다.');
          me.state0 = 'Inbound';
        }
        me.state  = me.state0;
        me.state0 = 'Unknown';
      }
      return;
    }
    if(['Ring','Dial','NotReady','Reject','Hold','Away','Rest','Lunch','Meeting','Seminar','Etc'].indexOf(newStateFromServer) > -1){
      me.state0 = me.state;
      me.state  = newStateFromServer;
    }
  }
  */

    //////////////////////////////////////////////////
    // register response event handlers
    //////////////////////////////////////////////////
    me.respHandler = {};

    var defaultRespHandler = function(respName,dat){
        var stateChanged = false;
        var conf;
        var CAPI;
        me.sub = dat.sub;
        console.log('[res]'+respName+': ',JSON.stringify(dat));
        if(dat.res==='error'){
            if(dat.msg){
                if(dat.fn) conf.fn = eval(dat.fn);
                console.log('[에러]'+respName+', msg = '+dat.msg);
            }else{
                var fn = eval(dat.fn);
                if(typeof fn==='function') setTimeout(fn,0);
            }
            console.log('['+respName+'/에러]'+dat.msg);
            return;
        }
        if(dat.time)  me.time  = dat.time;
        if(dat.mode && me.mode !== dat.mode){
            stateChanged = true;
            me.mode  = dat.mode;
            console.log('[CAPI:RespHandler] modeChange');
            Event.trigger('modeChange');
        }
        if(dat.state && (me.state !== dat.state)){
            if(/Connect/.test(me.state) && ['Idle','NotReady'].indexOf(dat.state)>-1){
              Event.trigger('hangup');
              CAPI.sendEvt('@Call',{Mode:CAPI.mode,State:CAPI.state,Cid:Mapp.tel,Sub:'Hangup'});
              //Mapp.Crm.log('[CAPI:RespHandler] hangup');
            }
            stateChanged = true;
            me.state = dat.state;
        }
        if(stateChanged){
            me.msTimestamp = (new Date()).getTime();
            if(typeof me.onState==='function') me.onState(me.mode,me.state,me.time);
        }else if(me.sub){
            if(typeof me.onSub==='function') me.onSub(me.sub);
        }
    };

    var CAPI;
    me.respHandler['getState'] = function(dat){
        if(dat && dat.json){
          var res = dat.json;
          if(typeof res==='string') res = JSON.parse(res);
          CAPI.optInbAutoAnswer  = (res.optInbAutoAnswer == "Y")?true:false; //자동받기설정
          CAPI.optInbAutoReady = (res.optInbAutoReady == "Y")?true:false; //자동대기여부
          CAPI.optInbAutoRdyTime   = parseInt(res.optInbAutoRdyTime)*1000 || 1; //자동대기시간
          console.log('[getCallInfo/resp]: getState info = '+JSON.stringify(res));
        }else{
          console.log('[getCallInfo/resp]: No getState info = '+JSON.stringify(dat));
        }
        // 

        defaultRespHandler('getState',dat);
    }.bind(me);

    me.respHandler['login'] = function(dat){
        if(dat.res==='error'){
          alert("[오류] "+dat.msg);
        }else{
          setTimeout(function(){
            me.changeOption({
              version         : me.version,
              //optInbAfterHangup  : me.optInbAfterHangup, // <--local option
              //optOubAfterHangup  : me.optOubAfterHangup, // <--local option
              optAllowTxRingMode : me.optAllowTxRingMode,
              optObdPrefix : me.optObdPrefix
            });
          },500);
          CAPI.center_id  = dat.center_id;
          CAPI.group_id   = dat.group_id;
          CAPI.team_id    = dat.team_id;
          CAPI.name       = dat.name;
          CAPI.user_id    = dat.user_id;
          CAPI.sippeer_id = dat.sippeer_id;
          CAPI.phone      = dat.phone;
        }
        console.log("dat = ",dat["json"]);
        defaultRespHandler('login',dat);
    }.bind(me);

    me.respHandler['logout'] = function(dat){
        defaultRespHandler('logout',dat);
    }.bind(me);

    me.respHandler['notReady'] = function(dat){
        defaultRespHandler('notReady',dat);
    }.bind(me);

    me.respHandler['dial'] = function(dat){
        defaultRespHandler('dial',dat);
    }.bind(me);

    me.respHandler['answer'] = function(dat){
        defaultRespHandler('answer',dat);
    }.bind(me);

    me.respHandler['txAnswer'] = function(dat){
        defaultRespHandler('txAnswer',dat);
    }.bind(me);

    me.respHandler['transfer'] = function(dat){
        defaultRespHandler('transfer',dat);
    }.bind(me);

    me.respHandler['transferCold'] = function(dat){
        defaultRespHandler('transferCold',dat);
    }.bind(me);

    me.respHandler['transferWarm'] = function(dat){
        defaultRespHandler('transferWarm',dat);
    }.bind(me);

    me.respHandler['txComplete'] = function(dat){
        defaultRespHandler('txComplete',dat);
    }.bind(me);

    me.respHandler['tx3Connect'] = function(dat){
        defaultRespHandler('tx3Connect',dat);
    }.bind(me);

    me.respHandler['tx3Complete'] = function(dat){
        defaultRespHandler('tx3Complete',dat);
    }.bind(me);

    me.respHandler['txToggle'] = function(dat){
        defaultRespHandler('txToggle',dat);
    }.bind(me);

    me.respHandler['hangup'] = function(dat){
        defaultRespHandler('hangup',dat);
    }.bind(me);

    me.respHandler['txRingDeny'] = function(dat){
        defaultRespHandler('txRingDeny',dat);
    }.bind(me);

    me.respHandler['txDialCancel'] = function(dat){
        defaultRespHandler('txDialCancel',dat);
    }.bind(me);

    me.respHandler['txDeny'] = function(dat){
        defaultRespHandler('txDeny',dat);
    }.bind(me);

    me.respHandler['reject'] = function(dat){
        defaultRespHandler('reject',dat);
    }.bind(me);

    me.respHandler['cancel'] = function(dat){
        defaultRespHandler('cancel',dat);
    }.bind(me);

    me.respHandler['txCancel'] = function(dat){
        defaultRespHandler('txCancel',dat);
    }.bind(me);

    me.respHandler['hold'] = function(dat){
        defaultRespHandler('hold',dat);
    }.bind(me);

    me.respHandler['away'] = function(dat){
        defaultRespHandler('away',dat);
    }.bind(me);

    me.respHandler['rest'] = function(dat){
        defaultRespHandler('rest',dat);
    }.bind(me);

    me.respHandler['lunch'] = function(dat){
        defaultRespHandler('lunch',dat);
    }.bind(me);

    me.respHandler['meeting']  = function(dat){
        defaultRespHandler('meeting',dat);
    }.bind(me);

    me.respHandler['seminar']  = function(dat){
        defaultRespHandler('seminar',dat);
    }.bind(me);

    me.respHandler['etc'] = function(dat){
        defaultRespHandler('etc',dat);
    }.bind(me);

    me.respHandler['board'] = function(dat){
      defaultRespHandler('board',dat);
    }.bind(me);

    me.respHandler['chat'] = function(dat){
    defaultRespHandler('chat',dat);
    }.bind(me);

    var mode;
    me.respHandler['setMode'] = function(dat){
        me.prevMode = me.mode; // keeep previous mode..
        defaultRespHandler('setMode',dat);
        me.call_type = mode;
    }.bind(me);

    me.respHandler['getUserQueues'] = function(dat){
        console.log('res:getUserQueues',dat);
        console.log('[TODO] 큐 기능 버튼들 추가!!!!!');
    }.bind(me);

    me.respHandler['getUserQueuesList'] = function(dat){
		  console.log('res:getUserQueuesList',dat);
    }.bind(me);

    me.respHandler['queuePause'] = function(dat){
        defaultRespHandler('queuePause',dat);
    }.bind(me);

    me.respHandler['changeOption'] = function(dat){
        defaultRespHandler('changeOption',dat);
    }.bind(me);

    me.respHandler['record'] = function(dat){
        defaultRespHandler('record',dat);
    }.bind(me);

    me.respHandler['ping'] = function(dat){
        //defaultRespHandler('ping',dat);
    }.bind(me);


    /*
    {"req":"getCallInfo","res":"error","msg":"unknown request","time":"00:53:34","json":"{"id":1261,"uid":"900-1480002789.906","call_type":"Inbound","dnis":"4061","tel":"01052639222","queue_id":8552,"ivr_tag":"8552","is_ans":1,"is_end":0,"tm_que":0,"tm_ring":0,"tm_conn":0,"created_at":"2016-11-24T15:53:11.000Z","updated_at":"2016-11-24T15:53:19.000Z"}"}
    */
    me.respHandler['getCallInfo'] = function(dat){
        //defaultRespHandler('getCallInfo',dat);
        //var rr = JSON.parse(dat);
        if(dat && dat.json){
          var res = dat.json;
          if(typeof res==='string') res = JSON.parse(res);
          res.Mode  = me.mode;
          res.State = me.state;
          res.Cid   = res.tel;
          me.sendEvt('@Call',res); // EX: @Call!Mode:Inbound^State:Ring^Cid:0102223333^id:123^uid:100-1455697945.49^call_type:Outbound^..
          console.log('[getCallInfo/resp]: call info = '+JSON.stringify(res));
        }else{
          me.sendEvt('@Call',{id:0}); // EX: @Call!id:none
          console.log('[getCallInfo/resp]: No call info = '+JSON.stringify(dat));
        }
    }.bind(me);

    me.respHandler['getLastCallInfo'] = function(dat){
        //defaultRespHandler('getLastCallInfo',dat);
        //var rr = JSON.parse(dat);
        if(dat && dat.json){
          var res = dat.json;
          if(typeof res==='string') res = JSON.parse(res);
          res.Mode  = me.mode;
          res.State = me.state;
          res.Cid   = res.tel;
          me.sendEvt('@Call',res); // EX: @Call!Mode:Inbound^State:Ring^Cid:0102223333^id:123^uid:100-1455697945.49^call_type:Outbound^..
          console.log('[getLastCallInfo/resp]: call info = '+JSON.stringify(res));
        }else{
          me.sendEvt('@Call',{id:0}); // EX: @Call!id:none
          console.log('[getLastCallInfo/resp]: No call info = '+JSON.stringify(dat));
        }
    }.bind(me);

    //////////////////////////////////////////////////
    // register WebSocket response (async) event handlers
    //////////////////////////////////////////////////
    me.eventHandler = {};

    me.eventHandler.info = function(info){
        if(info.name==='ivr'){
          /* come from amiEvents.js
            evt  : 'info',
            name : 'ivr',
            type : data.gType,
            result: data.result,
            value: data.value,
            time : data.Time,
            uid  : data.uid
          */
          //Event.trigger('ivrTxComplete',info.type,info.result,info.value);
          Mapp.ivrInfo = { type: info.type, result: info.result, value: info.value };
          Event.trigger('ivrTxComplete');
        }
        else if(info.name==='qpickup'){
          if(info.type==='add'){
            //const item = {uid: data.uid, tm: data.tm, userid: data.userid, phone: data.phone, tel: data.tel, queueId: data.queueId, queueName: data.queueName };
            const item = info.data;
            me.qrings.push(item);
            Event.trigger('qpickup-add',item);
          }else if(info.type==='remove'){
            const uid = info.data.uid;
            const idx = me.qrings.findIndex(item => item.uid===uid);
            if(idx){
              const item = me.qrings.splice(idx,1);
              Event.trigger('qpickup-remove',item);
            }
          }
        }
        console.log('[info-evt]',info);
    };

    me.eventHandler.call = function(evt){
        var stateChanged = false;
        var sub = null;
        console.log('[call-evt]',JSON.stringify(evt));
        me.sub = evt.sub;
        if(evt.sub) sub = me.sub = evt.sub;
        if(evt.role) me.role = evt.role;
        if(evt.call_type) me.call_type = evt.call_type;
        if(evt.uid){
            me.uid = evt.uid;
            Mapp.call_id = evt.uid;
        }
        if(evt.seq){
            me.seq = evt.seq;
            Mapp.call_seq = evt.seq;
        }
        if(evt.queue) Mapp.queue = evt.queue;
        if(evt.queue_id) Mapp.queue_id = evt.queue_id;
        if(evt.aphone)me.aphone = evt.aphone;
        if(evt.cphone){
          me.cphone = evt.cphone;
          Mapp.tel = evt.cphone;
        }
        if(evt.tphone)me.tphone = evt.tphone;
        if(evt.achan) me.achan  = evt.achan;
        if(evt.cchan) me.cchan  = evt.cchan;
        if(evt.tchan) me.tchan  = evt.tchan;
        if(evt.qchan) me.qchan  = evt.qchan;
        if(evt.aPos)  me.aPos   = evt.aPos;  //from UserEvent.Connect //Context,Exten,Priority
        if(evt.cPos)  me.cPos   = evt.cPos;  //from UserEvent.DialLink
        if(evt.time)  me.time   = evt.time;
        if(evt.mode && me.mode !== evt.mode){
            stateChanged = true;
            me.mode  = evt.mode;
            console.log('[CAPI:eventHandler] modeChange');
            Event.trigger('modeChange');
        }
        if(evt.state && me.state !== evt.state){
            //if(/Connect/.test(me.state) && ['Idle','NotReady'].indexOf(evt.state)>-1){
            //  Event.trigger('hangup');
            //  //Mapp.Crm.log('[CAPI:eventHandler] hangup');
            //}
	        stateChanged = true;
	        me.state = evt.state;
        }

        if(evt.ivr_tag) me.ivr_tag = evt.ivr_tag;
        if(evt.ivr_data) me.ivr_data = evt.ivr_data;
        if(evt.dnis_memo) me.dnis_memo = evt.dnis_memo;
        if(evt.queue_waittime) me.queue_waittime = evt.queue_waittime;

        if(['Ring','Dial'].indexOf(evt.state) > -1) me.pushCalls(evt.uid);
//      if(['Hangup','AHangup','CHangup','THangup'].indexOf(sub) > -1) me.pushHupCalls(evt.uid,true); //event생성!
        if(['Hangup','AHangup','CHangup'].indexOf(sub) > -1 && (['TxConnect','Tx3Connect','TxConnectC'].indexOf(me.state) < 0)) me.pushHupCalls(evt.uid,true); //event생성! // <==== 20190216 인터파크!!
        else if(me.role==='t' && sub==='THangup') me.pushHupCalls(evt.uid,true);

        if(evt.state==='Ring'){
          if(sub==='QueueLink'){
  				    me.linked = true;
              stateChanged = true;
              me.state = 'Ring';
          }
        }
        else if(evt.state==='TxRing'){
          if(sub==='TxLink'){
  				    me.linked = true;
              stateChanged = true;
              me.state = 'TxRing';
          }
        }else{
          me.linked = false;
        }

        if(sub==='CHangup'){
//console.log('[CHangup.0]',evt);
//console.log('[CHangup.1]',me.state,evt.state);
          if(/Tx/.test(me.state)){
            console.log('*****[CHangup] during '+me.state+'*****');
          }else{
            stateChanged = true;
            me.state = 'Idle'; //CHECK: forced state to 'Idle' to fix when CHangup comes before AHangup
            //if(me.onState) me.onState(me.mode,me.state,me.time,me.call_type,sub);
          }
        }
        if(sub==='AHangup'){
            if(me.mode==='Hold'){
              stateChanged = true;
              me.mode = me.prevHoldMode;
              me.state = 'Idle';
            }
        }
        if(sub==='DialBegin'){ // remote dialReq:  curl "http://localhost:5001/dialReq/1701?num=010778177&call_type=Outbound&cid=0233334444"
          /* sample evt: {
              achan:"SIP/1701-00000008", call_type:"Outbound",cphone:"01075778177",evt:"call",role:"a",seq:0,
              seqCnt:0,state:"Dial",sub:"DialBegin",time:"00:27:43",uid:"100-1479050863.41"} */
            me.cphone = evt.cphone;
        }
        if(evt.fn){
            var fn = eval(evt.fn);
            if(typeof fn==='function') setTimeout(fn,0);
        }
        if(evt.queue_id){
            //Mapp.queueNme = Mapp.Crm.queueMap[evt.queue_id]||'일반1'; //for benefit
        }
        if(stateChanged){
            me.msTimestamp = (new Date()).getTime();
            if(me.onState) me.onState(me.mode,me.state,me.time,me.call_type,sub);
        }else if(sub){
            if(typeof me.onSub==='function') me.onSub(sub);
        }
    };

    me.eventHandler.user = function(evt){
        console.log('[user-evt]',evt);
        if(evt.fn){
            var fn = eval(evt.fn);
            if(typeof fn==='function') setTimeout(fn,0);
        }
    };

    me.pushCalls = function(uid){
      if(me.calls.length>10) me.calls.splice(0,1);
      if(me.calls.indexOf(uid)===-1)me.calls.push(uid);
    }

    me.pushHupCalls = function(uid,fireEvent){
      if(me.hupCalls.length>10) me.hupCalls.splice(0,1);
      if(me.hupCalls.indexOf(uid)===-1){
        me.hupCalls.push(uid);
        //var hangupEvent = new CustomEvent('HANGUP_EVENT');
        //hangupEvent.uid = uid;
        //document.dispatchEvent(hangupEvent); //document.addEventListener('HANGUP_EVENT',HangupHandler);

        /*if(fireEvent && typeof me.onHangup==='function'){
          debugger;
          tt = me.onHangup.bind(me);
          setTimeout(me.onHangup.bind(me),10);
        }else{
          debugger;
        }*/

        if(fireEvent && typeof me.onHangup==='function') setTimeout(me.onHangup.bind(me),10);
      }
    }

    //////////////////////////////////////////////////
    // CTMP API's
    //////////////////////////////////////////////////

    me.getState = function(){
        return me.sendMsg({
            req    : 'getState',
            version: me.apiVersion,
            userid : me.userid
        });
    };

    me.login = function(conf){
        /* conf: string => initMode
           object =>
            - initMode : initial after login mode.
            - override : override prior login.
        */
        if(typeof conf === 'undefined') conf = {};
        if(typeof conf === 'string') conf = { initMode: conf };
        if(conf.userid) me.userid = conf.userid;
        if(conf.passwd) me.passwd = conf.passwd;
        if(!me.passwd)  me.passwd = me.userid;
        return me.sendMsg({
            req    : 'login',
            override: conf.override || false,
            version: me.apiVersion,
            userid : me.userid,
            passwd : me.passwd,
            mode   : conf.initMode  || 'Inbound',
            state  : 'Idle'
        });
    };

    me.logout = function(){
        return me.sendMsg({
            req    : 'logout',
            userid : me.userid
        });
    };

    me.getUserQueues = function(){
        return me.sendMsg({
            req    : 'getUserQueues',
            userid : me.userid
        });
    };

    me.getUserQueuesList = function(){
      return me.sendMsg({
        req    : 'getUserQueuesList',
        userid : me.userid
      });
    };

    me.queueAdd = function(queueName,pauseFlag){
        return me.sendMsg({
            req    : 'queueAdd',
            queue  : queueName,
            userid : me.userid,
            pauseFlag : pauseFlag /* Boolean */
        });
    };

    me.queueSub = function(queueName){
        return me.sendMsg({
            req    : 'queueSub',
            queue  : queueName,
            userid : me.userid
        });
    };

    me.queuePause = function(queueName,pauseFlag){
        queueName = queueName||'all';
        return me.sendMsg({
            req    : 'queuePause',
            queue  : queueName, /* queueName : all 이면 전체 대상 */
            userid : me.userid,
            phone  : me.phone,
            pauseFlag : pauseFlag /* Boolean */
        });
    };

    me.dial = function(num,cid){
        if(num.length >= 7 && me.optObdPrefix && me.optObdPrefix!==''){
            num = me.optObdPrefix + num;
        }
        var req = {
            req    : 'dial',
            num    : num,
            call_type: CAPI.call_type,
            cid    : cid||'useDefault'
        };
        if(me.state!=='Idle'){
            return false;
        }
        //me.call_type = 'Outbound'; // thru.. Dial event reception...
        //me.state = 'Dial';     // thru.. Dial event reception...
        me.sendMsg(req);
        return true;
    };

    /*
     * @description:
     *    obj.call_type 과 CAPI.mode 가 다르면
     *    (1) obj.call_type 으로 mode 변경 후 다이얼.
     *    (2) 통화 종료 후 다시 원복!
     * @example:
     *    CAPI.dialEx('01033334444',{
     *      cid       : '025224333',
     *      call_type : 'Campaign', //필수
     *      cust_id   : '20039204'
     *    });
     */
    me.dialEx = function(num,obj){
        if(obj.call_type!='Campaign' && num.length >= 7 && me.optObdPrefix && me.optObdPrefix!==''){
            num = me.optObdPrefix + num;
        }
        console.log("obj = ", obj);
        obj = obj || {};
        if(me.state!=='Idle'){
            return false;
        }
        var req = {
            req : 'dial',
            num : num
        };
        req = Object.assign(req,obj);
        me.sendMsg(req);
        return true;
    };


    me.hangup = function(num,cid){
        var req = {
            req    : 'hangup',
            achan  : me.achan,
            cchan  : me.cchan,
            tchan  : me.tchan  /* 내가 호전환 받는경우 myChannel = tchan */
        };
        if(['Connect'].indexOf(me.state) >= 0){
            req.req = 'hangup';
        }else if(['TxConnect','TxConnectC','Tx3Connect'].indexOf(me.state) >= 0){
            if(me.role==='t') req.req = 'txDeny'; /* txDeny: 호전환 통화중 t상담원이 취소 */
            else req.req = 'txCancel'; /* txCancel: 호전환 통화중 a상담원이 취소하고 고객과 다시 연결 */
        }else if(['Ring','TxRing'].indexOf(me.state) >= 0){
            if(me.role==='t') req.req = 'txRingDeny'; /* txRingDeny: 호전환 링중 t상담원이 거부 */
            else req.req = 'reject'; /* reject: 인바운드 링중 a상담원이 거부 */
        }else if(me.state==='Dial'){
            req.req = 'cancel';
        }else if(me.state==='TxDial'){
            req.req = 'txComplete'; /* ????? 호전환 다이얼 중 완료 (blind transfer) */
        }else{
            console.log('hangup할 수 없는 상태입니다.(m/s='+me.mode+'/'+me.state+')');
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.answer = function(){
        var req = {
            req    : 'answer',
            uid    : me.uid,
            achan  : me.achan,
            cchan  : me.cchan,
            tchan  : me.tchan
        };
        if(me.state==='TxRing') req.req = 'txAnswer';
        //console.log("req:answer req="+req+", tm="+(new Date));
        me.sendMsg(req);
        return true;
    };

    // me.qpickup = async function(){
    //   if(me.qpickuping){
    //     console.warn('[qpickup](1) in progress!!');
    //     return;
    //   }
    //   if(me.qrings.length==0){
    //     console.warn('[qpickup](2) No inbound-calls in Ring state!!');
    //     return;
    //   }
    //   me.qpickuping = true;
    //   let i = null;
    //   while(i = me.qrings.shift()){ 
    //     console.warn('[qpickup](3) i=${JSON.stringify(i)}');
    //     // let res = await fetch(`${location.protocol}//${location.host}/qpickup/${i.uid}/${CAPI.userid}/${CAPI.user_id}/${CAPI.phone}`);
    //     let data = await res.json();
    //     if(data.success){
    //       me.qpickuping = false;
    //       return;
    //     }
    //   }
    //   me.qpickuping = false;
    //   console.warn('[qpickup](4) Failed to QPickup!!');
    // };

    me.transfer = function(num,cid){
        var req = {
            req    : 'transfer',
            num    : num,
            uid    : me.uid,
            cid    : cid||'useDefault',
            achan  : me.achan
        };
        if(me.state==='Connect'){
            //me.prevPos = me.aPos; /* Context,Exten,Priority */ //TODO: 필요해?
            req.cchan = me.cchan;
            req.req   = 'transfer';
        }else if(['TxConnect','TxConnectC'].indexOf(me.state) >= 0){
            req.tchan = me.tchan; /* 2차상담원 채널 */
            req.req   = 'reTransfer';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.transferCold = function(num,cid){
        var req = {
            req    : 'transferCold',
            num    : num,
            uid    : me.uid,
            cid    : cid||'useDefault',
            achan  : me.achan,
            cphone : me.cphone
        };
        if(me.state==='Connect'){
            //me.prevPos = me.aPos; /* Context,Exten,Priority */ //TODO: 필요해?
            req.cchan = me.cchan;
            req.req   = 'transferCold';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.transferWarm = function(num,cid){
        var req = {
            req    : 'transferWarm',
            num    : num,
            uid    : me.uid,
            cid    : cid||'useDefault',
            achan  : me.achan
        };
        if(me.state==='Connect'){
            //me.prevPos = me.aPos; /* Context,Exten,Priority */ //TODO: 필요해?
            req.cchan = me.cchan;
            req.req   = 'transferWarm';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.txComplete = function(){
        var req = {
            req    : 'txComplete',
            uid    : me.uid,
            achan  : me.achan, /* 상담원 채널 */
            cchan  : me.cchan, /* 고객 채널 */
            tchan  : me.tchan  /* 2차상담원 채널 */
        };
        if(['TxConnect','TxConnectC'].indexOf(me.state) >= 0){
            req.req = 'txComplete';
        }else if(me.state==='Tx3Connect'){
            req.req = 'tx3Complete';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.txCancel = function(){
        var req = {
            req    : 'txCancel',
            uid    : me.uid,
            //aPos   : me.prevPos /* Context,Exten,Priority */
            cchan  : me.cchan
        };
        if(me.state==='TxDial'){
            req.achan = me.achan;
            req.tphone = me.tphone;
            req.req   = 'txDialCancel';
        }else if(['TxConnect','Tx3Connect','TxConnectC'].indexOf(me.state) >= 0){
            req.achan = me.achan; //???
            req.tchan = me.tchan;
            req.req = 'txCancel';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.tx3Connect = function(){
        var req = {
            req    : 'tx3Connect',
            uid    : me.uid,
            achan  : me.achan,
            cchan  : me.cchan,
            tchan  : me.tchan
        };
        if(['TxConnect','TxConnectC'].indexOf(me.state) >= 0){
            req.req = 'tx3Connect';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    me.txToggle = function(){
        var req = {
            req    : 'txToggle',
            uid    : me.uid,
            achan  : me.achan,
            cchan  : me.cchan,
            tchan  : me.tchan
        };
        if(['TxConnect','TxConnectC'].indexOf(me.state) >= 0){
            req.req = 'txToggle';
        }else{
            return false;
        }
        me.sendMsg(req);
        return true;
    };

    /* mode: Inbound, Outbound, Campaign, Callback */
    me.setMode = function(mode){
        if(me.state!=='Idle'){
          console.log('CAPI:setMode: reject.. state='+me.state);
          return false;
        }
        if(me.mode===mode) return true;
        var req = {
            req : 'setMode',
            mode: mode
        };
        me.sendMsg(req);
        return true;
    };

    me.toggleMode = function(mode){
        var req = {
            req    : mode,
            uid    : me.uid,
            achan  : me.achan,
            cchan  : me.cchan,
            tchan  : me.tchan
        };
        me.sendMsg(req);
        return true;
    };

    me.recordPart = function(sub){
        var req = {
            req    : 'record',
            uid    : me.uid,
            sub    : sub
        };
        me.sendMsg(req);
        return true;
    };

    me.hold = function(){
        if(me.mode!=='Hold') me.prevHoldMode = me.mode;
        return me.toggleMode('hold');
    };

    me.away = function(){
        return me.toggleMode('away');
    };

    me.rest = function(){
        return me.toggleMode('rest');
    };

    me.lunch = function(){
        return me.toggleMode('lunch');
    };

    me.meeting = function(){
        return me.toggleMode('meeting');
    };

    me.seminar = function(){
        return me.toggleMode('seminar');
    };

    me.etc = function(){
        return me.toggleMode('etc');
    };

    me.board = function(){
      return me.toggleMode('board');
    };

    me.chat = function(){
      return me.toggleMode('chat');
    };

    me.notReady = function(){
        return me.toggleMode('notReady');
    };

    me.getTeamAgents = function(){
        //TODO
    };
    me.getGroupAgents = function(){
        //TODO
    };
    me.getCenterAgents = function(){
        //TODO
    };
    me.seminar = function(){
        return me.toggleMode('seminar');
    };
    me.record = function(res){
        return me.recordPart(res);
    };
    me.genAction = function(act,argObj){
        /* SAMPLES
   * CAPI.genAction('Ping',{})
   * CAPI.genAction('Hangup',{Channel:CAPI.achan})
   * CAPI.genAction('Hangup',{Channel:CAPI.cchan})
   * CAPI.genAction('Hangup',{Channel:CAPI.tchan})
   * CAPI.genAction('Status',{Channel:CAPI.achan})
   * CAPI.genAction('SetVar',{Channel:CAPI.achan, Variable:'var1', Value:'VAL1'})
   * CAPI.genAction('GetVar',{Channel:CAPI.achan, Variable:'var1'})
   * CAPI.genAction('QueueStatus',{Queue:'gno1', Member:'xxx'})
   * CAPI.genAction('QueueStatus',{Queue:'gno1', Member:'LOCAL/SIP-63620-2117250@QueueMemberConnector'})
   */
        var req = {
            req: 'genAction',
            action: act,
            argObj: argObj||'NONE'
        };
        me.sendMsg(req);
        return true;
    };

    me.changeOption = function(argObj){
        var req = {
            req    : 'changeOption'
        };
        Object.keys(argObj).forEach(function(k){
            me[k] = req[k] = argObj[k];
        });
        me.sendMsg(req);
        return true;
    };

    me.getModeStateDesc = function(mode,state,msTimestamp){
        var mm = mode||me.mode;
        var ss = state||me.state;
        var tt = msTimestamp||me.msTimestamp;
        var res = {
            mode: me.modes[mm]||mm,
            state: me.states[ss]||ss,
            tdiff: (((new Date()).getTime() - tt)/1000).toFixed(0)
        };
        return res;
    };
}



