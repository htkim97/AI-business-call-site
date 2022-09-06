if (typeof console === "undefined" || typeof console.log === "undefined") {
  console = { log: function () {}, error: function () {} };
}
setTimeout(function () {
  var wsInfo = document.getElementById("ws-info");
  if (wsInfo) {
    var msg = '<span style="color:red">[Error] No WebSocket Available!!</span>';
    if (WebSocket) {
      if (WebSocket.__flash)
        msg = '<span style="color:olive">Using Flash WebSocket (5002)</span>';
      else
        msg = '<span style="color:green">Using Native WebSocket (5002)</span>';
    }
    wsInfo.innerHTML = msg;
  }
}, 500);
document.addEventListener("init-capi", function (e) {
  WindowLoad();
});
function init() {
  setTimeout(function () {
    document.dispatchEvent(new CustomEvent("init-capi"));
  }, 100);
}

//window.onload = function() 은 1번만 지정할 수 있음
window.addEventListener("load", function() {
  init();
  
  document.getElementById("vb2js").addEventListener("change", () => {vbEvent();}, false);
  
  document.getElementById("Login").addEventListener("click", () => {EE('login');}, false);
  document.getElementById("Logout").addEventListener("click", () => {EE('logout');}, false);
  document.getElementById("NotReady").addEventListener("click", () => {EE('notReady');}, false);
  document.getElementById("Inbound").addEventListener("click", () => {EE('ibMode');}, false);
  document.getElementById("Outbound").addEventListener("click", () => {EE('obMode');}, false);
  document.getElementById("Campaign").addEventListener("click", () => {EE('cmMode');}, false);
  document.getElementById("Dial").addEventListener("click", () => {EE('dial');}, false);
  document.getElementById("Hangup").addEventListener("click", () => {EE('hangup');}, false);
  document.getElementById("Record").addEventListener("click", () => {EE('record');}, false);
  document.getElementById("Answer").addEventListener("click", () => {EE('answer');}, false);
  document.getElementById("QPickup").addEventListener("click", () => {EE('qpickup');}, false);
  document.getElementById("TransferCold").addEventListener("click", () => {EE('transferCold');}, false);
  document.getElementById("TransferWarm").addEventListener("click", () => {EE('transferWarm');}, false);
  document.getElementById("Transfer").addEventListener("click", () => {EE('transfer');}, false);
  document.getElementById("TxComplete").addEventListener("click", () => {EE('txComplete');}, false);
  document.getElementById("TxCancel").addEventListener("click", () => {EE('txCancel');}, false);
  document.getElementById("TxToggle").addEventListener("click", () => {EE('txToggle');}, false);
  document.getElementById("Tx3Connect").addEventListener("click", () => {EE('tx3Connect');}, false);
  document.getElementById("StartAF").addEventListener("click", () => {EE('startAudioFork');}, false);
  document.getElementById("StopAF").addEventListener("click", () => {EE('stopAudioFork');}, false);
  document.getElementById("Hold").addEventListener("click", () => {EE('hold');}, false);
  document.getElementById("Away").addEventListener("click", () => {EE('away');}, false);
  document.getElementById("Rest").addEventListener("click", () => {EE('rest');}, false);
  document.getElementById("Lunch").addEventListener("click", () => {EE('lunch');}, false);
  document.getElementById("Meeting").addEventListener("click", () => {EE('meeting');}, false);
  document.getElementById("Seminar").addEventListener("click", () => {EE('seminar');}, false);
  document.getElementById("Etc").addEventListener("click", () => {EE('etc');}, false);
  document.getElementById("Board").addEventListener("click", () => {EE('board');}, false);
  document.getElementById("Chat").addEventListener("click", () => {EE('chat');}, false);
  document.getElementById("GetState").addEventListener("click", () => {EE('getState');}, false);
  document.getElementById("QueueAdd").addEventListener("click", () => {EE('queueAdd');}, false);
  document.getElementById("QueueSub").addEventListener("click", () => {EE('queueSub');}, false);
  document.getElementById("QueueRun").addEventListener("click", () => {EE('queueRun');}, false);
  document.getElementById("QueuePause").addEventListener("click", () => {EE('queuePause');}, false);
  document.getElementById("QueueState").addEventListener("click", () => {EE('queueState');}, false);
  document.getElementById("IvrSsn").addEventListener("click", () => {EE('ivrSsn');}, false);
  document.getElementById("IvrAcc").addEventListener("click", () => {EE('ivrAccount');}, false);
  document.getElementById("IvrRet").addEventListener("click", () => {EE('ivrReturn');}, false);
});

window.addEventListener("beforeunload", function(event) {
  console.log("UNLOAD:1");
  WindowClose();
});
