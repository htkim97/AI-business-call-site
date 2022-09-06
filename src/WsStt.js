

function getRecentCallText(){
  var num = document.getElementById('tel').value;
  var url = "/getSTT/" + num;
  doAjax(url,function(res){     //STT 결과 조회
    var rr = JSON.parse(res);
    console.log(rr);
    if(rr && rr.count >= 0){
      var taTarget = ["taNouns","taKwd"]
      getTextAnalysisRecursive(rr, taTarget, 0, 0);
    

    }else{
      console.log(res);
    }
  });
}


function getTextAnalysisRecursive(rr, textAnalysisList, taTargetIdx, rowIdx){
  if(rr && rr.count > rowIdx){
    var log = rr.rows[rowIdx];
    var taTarget = textAnalysisList[taTargetIdx];
    var url_ana = "/" + taTarget + "?text=" + log.cnts;     //TA-nouns 결과 조회
    doAjax(url_ana,function(res_ana){
      var rr_ana = JSON.parse(res_ana);
      console.log("taTarget = " + taTarget);
      console.log("rowIdx = " + rowIdx);
      console.log(rr_ana);
      if(rr_ana){    //TA-nouns 결과를 목록에 덧붙임
        log[taTarget] = rr_ana;
      }else{
        console.log(res_ana);
      }

      if (taTargetIdx < textAnalysisList.length - 1) {   //TA 종류 변경
        taTargetIdx++;
      } else {         //TA 원문 row 증가
        taTargetIdx = 0;
        rowIdx++;
      }
      getTextAnalysisRecursive(rr, textAnalysisList, taTargetIdx, rowIdx);
    });
  } else {
    //display all
    //console.log(rr);
    var table = "<TR><TH>전화번호(cid)</TH><TH>콜ID(uid)</TH><TH>시각</TH><TH>내용</TH><TH>명사</TH><TH>키워드</TH></TR>\n"
    rr.rows.forEach(function(log) {
        table = table + "<TR>\n";
        table = table + "<TD>" + log.cid + "</TD>\n";
        table = table + "<TD>" + log.uid + "</TD>\n";
        table = table + "<TD>" + log.time + "</TD>\n";
        table = table + "<TD>" + log.cnts + "</TD>\n";
        table = table + "<TD>" + log.taNouns + "</TD>\n";
        table = table + "<TD>" + Object.keys(log.taKwd.result) + "</TD>\n";
        table = table + "</TR>\n";
      });
    //console.log(table);
    var ojb = document.getElementById('txtCnts');
    ojb.innerHTML = table;
  }
}

function getTextAnalysis(){
  var num = document.getElementById('tel').value;
  var url = "/getSTT/" + num;
  doAjax(url,function(res){
    var rr = JSON.parse(res);
    console.log(rr);
    if(rr && rr.count >= 0){
      var table = "<TR><TH>전화번호(cid)</TH><TH>콜ID(uid)</TH><TH>시각</TH><TH>내용</TH></TR>\n"

      rr.rows.forEach(function(log) {
        table = table + "<TR>\n";
        table = table + "<TD>" + log.cid + "</TD>\n";
        table = table + "<TD>" + log.uid + "</TD>\n";
        table = table + "<TD>" + log.time + "</TD>\n";
        table = table + "<TD>" + log.cnts + "</TD>\n";
        table = table + "</TR>\n";
        console.log(table);
        });
      var ojb = document.getElementById('txtCnts');
      ojb.innerHTML = table;

    }else{
      console.log(res);
    }
  });
}

function displayRecentCallTable(){
  var num = document.getElementById('tel').value;
  var url = "/getSTT/" + num;
  doAjax(url,function(res){
    var rr = JSON.parse(res);
    console.log(rr);
    if(rr && rr.count >= 0){
      var table = "<TR><TH>전화번호(cid)</TH><TH>콜ID(uid)</TH><TH>시각</TH><TH>내용</TH></TR>\n"

      rr.rows.forEach(function(log) {
        table = table + "<TR>\n";
        table = table + "<TD>" + log.cid + "</TD>\n";
        table = table + "<TD>" + log.uid + "</TD>\n";
        table = table + "<TD>" + log.time + "</TD>\n";
        table = table + "<TD>" + log.cnts + "</TD>\n";
        table = table + "</TR>\n";
        console.log(table);
        });
      var ojb = document.getElementById('txtCnts');
      ojb.innerHTML = table;

    }else{
      console.log(res);
    }
  });
}
