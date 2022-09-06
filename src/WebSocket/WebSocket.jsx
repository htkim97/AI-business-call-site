import React from 'react';
import '../WebSocket_all/Socket.css';
import { Helmet } from 'react-helmet';




const WebSocket  = () => {

  
  return(



<div id='body' Onload="init()" OnUnload= "WindowClose()">


  
<Helmet>
<meta charset="utf-8"/>
<title >리액트</title>
<script type='text/javascript' src='./Js/webSocket_Head.js'></script>
<script type="text/javascript" src="Js/Stately.js"></script>
<script type="text/javascript" src="Js/customEvent.js"></script>
<script type="text/javascript" src="Js/wsApp.js"></script>
<script type="text/javascript" src="Js/wsCapi.js"></script>
{/* <script type="text/javascript" src="http://cc.intelloid.click:5001/wsStt.js"></script> */}


</Helmet>




<button id='Login'      onClick={()=>'login'}    className='wsButton'   disabled>   로그인   </button>
  <button id='Logout'     onClick={()=>'logout'}   className='wsButton'   disabled>   로그아웃 </button>
  <span style={{"width":"10px"}}></span>
  {/* <button id='NotReady'   onClick= {()=>'notReady'} className='wsButton'   disabled>   NotReady </button> */}
  <span style={{"width":"10px"}}></span>
  {/* <button id='Inbound'    onClick= {()=>'ibMode'}   className='wsButton'   disabled>   IB모드   </button>
  <button id='Outbound'   onClick={()=>'obMode'}   className='wsButton'   disabled>   OB모드   </button> */}
  <button id='Campaign'   onClick={()=>'cmMode'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   캠페인   </button>



  {/* <label htmlFor='tel'>전화번호</label><input id='tel'/>
  <button id='Dial'    onClick={()=>'dial'}   className='wsButton'   disabled>   다이얼       </button>
  <button id='Hangup'  onClick={()=>'hangup'} className='wsButton'   disabled>   끊기/거절    </button> */}
  <button id='Record'  onClick={()=>'record'} className='wsButton'   disabled  style={{visibility:"collapse"}}>   부분녹취 시작</button>
  <a href="#" id='getText' onClick={()=>"getRecentCallText()"}  style={{visibility:"collapse"}}>   최근통화 조회</a>



  {/* <button id='Answer'  onClick={()=>'answer'} className='wsButton'   disabled>    전화받기 </button> */}
  <button id='QPickup'  onClick={()=>'qpickup'} className='wsButton'   disabled  style={{visibility:"collapse"}}>    Q당겨받기 </button>
  

  
  <button id="TransferCold"   onClick={()=>'transferCold'} className='wsButton'   disabled  style={{visibility:"collapse"}}>   Cold호전환  </button>
  <button id="TransferWarm"   onClick={()=>'transferWarm'} className='wsButton'   disabled  style={{visibility:"collapse"}}>   Warm호전환  </button>
  <button id="Transfer"       onClick={()=>'transfer'}     className='wsButton'   disabled  style={{visibility:"collapse"}}>   Attend호전환</button>
  <button id="TxComplete"     onClick={()=>'txComplete'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   전환완료    </button>
  <button id="TxCancel"       onClick={()=>'txCancel'}     className='wsButton'   disabled  style={{visibility:"collapse"}}>   전환취소    </button>
  <button id="TxToggle"       onClick={()=>'txToggle'}     className='wsButton'   disabled  style={{visibility:"collapse"}}>   화자전환    </button>
  <button id="Tx3Connect"     onClick={()=>'tx3Connect'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   3자통화     </button>

  <button id="StartAF"     onClick={()=>'startAudioFork'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   STT시작  </button>
  <button id="StopAF"      onClick={()=>'stopAudioFork'}    className='wsButton'   disabled  style={{visibility:"collapse"}}>   STT정지  </button>

  


  <button id="Hold"      onClick={()=>'hold'}    className='wsButton'   disabled  style={{visibility:"collapse"}}>   홀드      </button>
  <button id="Away"      onClick={()=>'away'}    className='wsButton'   disabled  style={{visibility:"collapse"}}>   자리비움   </button>
  <button id="Rest"      onClick={()=>'rest'}    className='wsButton'   disabled  style={{visibility:"collapse"}}>   휴식      </button>
  <button id="Lunch"     onClick={()=>'lunch'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   식사      </button>
  <button id="Meeting"  onClick={()=>'meeting'} className='wsButton'   disabled  style={{visibility:"collapse"}}>   회의      </button>
  <button id="Seminar"   onClick={()=>'seminar'}  className='wsButton'   disabled  style={{visibility:"collapse"}}>   교육      </button>
  <button id="Etc"       onClick={()=>'etc'}     className='wsButton'   disabled  style={{visibility:"collapse"}}>   기타      </button>
  <button id="Board"     onClick={()=>'board'}   className='wsButton'   disabled  style={{visibility:"collapse"}}>   게시판    </button>
  <button id="Chat"     onClick={()=>'chat'}     className='wsButton'   disabled  style={{visibility:"collapse"}}>   채팅      </button>
  <button id='GetState'  onClick={()=>'getState'}  className='wsButton'   style={{visibility:"collapse"}}> 상태체크 </button>
  

  <button onClick={()=>'getTeamAgents'}   className='wsButton'    style={{visibility:"collapse"}}>  팀멤버   </button>
  <button onClick={()=>'getGroupAgents'}  className='wsButton'    style={{visibility:"collapse"}}>  그룹멤버 </button>
  <button onClick={()=>'getCenterAgents'} className='wsButton'    style={{visibility:"collapse"}}>  전체멤버 </button>


  <button id='QueueAdd'    onClick={()=>'queueAdd'}   className='wsButton'    style={{visibility:"collapse"}}> 큐로그인   </button>
  <button id='QueueSub'    onClick={()=>'queueSub'}   className='wsButton'    style={{visibility:"collapse"}}> 큐로그아웃 </button>
  <button id='QueueRun'    onClick={()=>'queueRun'}   className='wsButton'    style={{visibility:"collapse"}}> 큐활성화   </button>
  <button id='QueuePause'  onClick={()=>'queuePause'} className='wsButton'    style={{visibility:"collapse"}}> 큐비활성화 </button>
  <button id='QueueState'  onClick={()=>'queueState'} className='wsButton'    style={{visibility:"collapse"}}> 큐상태체크 </button>


  <button id='IvrSsn'  onClick={()=>'ivrSsn'}     className='wsButton'   disabled  style={{visibility:"collapse"}}> 주민번호받기 </button>
  <button id='IvrAcc'  onClick={()=>'ivrAccount'} className='wsButton'   disabled  style={{visibility:"collapse"}}> 계좌번호받기 </button>
  <button id='IvrRet'  onClick={()=>'ivrReturn'}  className='wsButton'   disabled  style={{visibility:"collapse"}}> IVR전환취소  </button>
  
  <div  style={{visibility:"collapse"}}>
  <input id='js2vb' size="100"/>  VB로 명령/메시지 전달
  <input id='vb2js' size="100" onchange="vbEvent()"/>  VB에서 메시지 받음
  <div id='custEv' style={{'display':'none'}}></div>
 </div>

  <div id='queue-div'>
  </div>

  <div style={{'position':'fixed','top':'5px','right':'5px','height':'100','width':'400','border':'1px solid green','font-size':'11px'}}>
  <table style={{"width":"480px","text-align":"center"}} border="1px">
     <tr>
      <th>상담원</th><th>전화기</th><th>모드</th><th>상태</th><th>세션</th><th>갱신</th><th>호타입</th>
     </tr>
    <tr>
      <td style={{'color':'blue'}} onClick={()=>'changeAgent()'} id='userid'>1600</td>
      <td style={{'color':'blue'}} onClick={()=>'changePhone()'} id='phone'>1600</td>
      <td id='mode'>Logout</td>
      <td id='state'>Idle</td>
      <td id='session'>None</td>
      <td id='time'>00:00:00</td>
      <td id='call_type'>Idle</td>
     </tr>
     <tr>
       <td colspan="7" id='ws-info'>Using WebSocket (5002)</td>
     </tr>
  </table>
  </div>
   
</div>

  );
};



export default WebSocket;
