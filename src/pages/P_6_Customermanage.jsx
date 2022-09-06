import React from 'react';
import axios from 'axios';
import '../CSS/Blank6.scss';
import '../components/sidebar/sideSlidebar.scss';
import $ from 'jquery';
import { Grid } from 'rsuite';
import S_data from '../Customermanage_data/axios_dp/S_data';
import Add from '../Customermanage_data/axios_Add/Add';
import Update from '../Customermanage_data/axios_Update/Update';
import { Helmet } from 'react-helmet';
import '../components/Memo/Memo.scss';

const Blank = () => {
  return (
    <div>
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>리액트</title>
        <script type="text/javascript" src="Js/AddMemo.js"></script>
        <script type="text/javascript" src="https://kit.fontawesome.com/a076d05399.js"></script>
        <script type="text/javascript" src="./Js/webSocket_Head.js"></script>
        <script type="text/javascript" src="Js/Stately.js"></script>
        <script type="text/javascript" src="Js/customEvent.js"></script>
        <script type="text/javascript" src="Js/wsApp.js"></script>
        <script type="text/javascript" src="Js/wsCapi.js"></script>
       
      </Helmet>

      <hr className="line_6" />

      {/* 검색기능 */}
      <Grid style={{ marginLeft: '35%' }}>
        <button
          id="Inbound"
          onClick={() => 'ibMode'}
          className="wsButton InBound"
          disabled
        >
          {' '}
          IB모드{' '}
        </button>
        <button
          id="Outbound"
          onClick={() => 'obMode'}
          className="wsButton OutBound"
          disabled
        >
          {' '}
          OB모드{' '}
        </button>
        <button
          id="NotReady"
          onClick={() => 'notReady'}
          className="wsButton Ready"
          disabled
        >
          {' '}
          NotReady{' '}
        </button>
      </Grid>

      {/* <hr className="line_6" /> */}

      {/**/}

      <div className="changs">
        {/* 데이터 테이블 */}

        <Grid
          style={{
            width: 'auto',
            marginLeft: '-50%',
          }}
        >
          <div class="col-md-9">
            <table
              id="example-table-2"
              className="table_1 text-center table-list-search "
            >
              <div class="row">
                <button className="Upload_btn">
                  <i className="bx bx-plus"></i>
                </button>
              </div>
              <S_data />
            </table>
          </div>
        </Grid>

        {/* 첫번째 그리드 */}

        <Grid>
          <div style={{ display: 'flex', marginLeft: '-8%' }}>
            <Grid className="page1" style={{ width: '50rem' }}>
              <div class="wrapper">
                <header></header>
                <div class="inputField">
                  <input type="text" placeholder="메모 입력" />
                  <button>
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <ul class="todoList"></ul>
                <div class="footer">
                  <span><span class="pendingTasks"></span>개의 메모 기록 중</span>
                  <button>All Delete</button>
                </div>
              </div>
            </Grid>
            {/* 두번째 그리드 */}

            <Grid className="page2" style={{ width: '50%', height: 'auto' }}>
              <nav className="sideMenu1">
                <i className="bx bx-user sideMenu1_logo"></i>
                <div onload="voiceWelcome()">
                  <button id="start" style={{ display: 'none' }}>
                    Start
                  </button>
                  <button id="stop" style={{ display: 'none' }}>
                    Stop
                  </button>
                  <button id="reset" style={{ display: 'none' }}>
                    Reset
                  </button>
                  

                  <output style={{ marginLeft: '43%' }}>00:00</output>
                </div>
                <input
                  id="tel"
                  class="system-search ex2_Result3 fofo"
                  name="q"
                  style={{
                    marginLeft: '20%',
                    marginTop: '5%',
                    textAlign: 'center',
                  }}
                />

                <div style={{ marginLeft: '27%', marginTop: '6%' }}>
                  <button
                    id="Answer"
                    onClick={() => 'answer'}
                    className="wsButton sideMenu1_btn1 bx bxs-phone-incoming"
                    disabled
                  ></button>

                  <button
                    className="bx bx-phone-outgoing jeonhwa_1 wsButton userF"
                    id="Dial"
                    onClick={() => 'dial'}
                    disabled
                  ></button>
                </div>

                <button
                  className="bx bx-phone-off sideMenu1_btn2 jeonhwa_2 "
                  disabled
                  id="Hangup"
                  onClick={() => 'hangup'}
                ></button>
              </nav>
            </Grid>
          </div>

          <div style={{ display: 'flex', marginLeft: '-8%' }}>
            <Grid className="page3" style={{ width: '45rem', height: '50%' }}>
              <div className="h">{/* 메뉴 5 */}</div>

              <div class="tabM">
                {/* <button class="edit_btn" data-toggle="modal" data-target="#myModal" contenteditable="false">편집</button> */}

                <ul class="tabs">
                  <li class="tab-link current" data-tab="tab-1">
                    상세정보
                  </li>
                  <li class="tab-link current1" data-tab="tab-2">
                    메시지
                  </li>
                  <li class="tab-link current2" data-tab="tab-3">
                    편집
                  </li>{' '}
                  <button className="Delete_btn">삭제</button>
                </ul>

                {/* 화면 띄우기 */}

                {/* 탭 메뉴 1 */}
                <div id="tab-1" class="tab-content current">
                  <div className="uploadChang">
                    <Add />
                    <button className="cancelBtn">취소</button>
                  </div>

                  <div class="col-lg-12 listData1 ex2_Result6">
                    {' '}
                    <div style={{ marginLeft: '40%' }}>리스트 항목을 클릭 </div>
                  </div>
                  <div class="col-lg-12 listData1" id="ex2_Result5"></div>
                </div>

                {/* 탭 메뉴 2 */}
                <div id="tab-2" class="tab-content tab2">
                  <div className="uploadChang">
                    <Add />
                    <button className="cancelBtn">취소</button>
                  </div>
                  <div className="message_chang">
                    <textarea
                      placeholder="메세지를 입력하세요"
                      name=""
                      id=""
                      cols="52"
                      rows="10"
                    ></textarea>

                    <button className="send_btn">전송</button>
                  </div>
                </div>

                {/* 탭 메뉴 3 */}
                <div id="tab-3" class="tab-content">
                  <div className="uploadChang">
                    <Add />
                    <button className="cancelBtn">취소</button>
                  </div>
                  <Update />
                </div>
              </div>
            </Grid>

            <Grid className="page4">
              <div
                style={{
                  marginTop: '12%',
                  marginLeft: '10%',
                }}
              >
                <input
                  class="form-control_S system-search"
                  name="q"
                  placeholder="Search for"
                  style={{ width: '70%' }}
                />
              </div>
            </Grid>
          </div>
        </Grid>
      </div>
    </div>
  );
};

<script type="text/javascript" />;

$(document).on(function () {
  $('#test').val('.ex2_Result6');
});

<script type="text/javascript"></script>;

//
////////////////////////// 탭메뉴 jquery///////////////////////////////

$(document).on('click', 'ul.tabs li', function () {
  var tab_id = $(this).attr('data-tab');

  $('ul.tabs li').removeClass('current');
  $('.tab-content').removeClass('current');

  $(this).addClass('current');
  $('#' + tab_id).addClass('current');
});

// 여기서 부터 그리드1 검색기능////////////////

var activeSystemClass = $('.list-group-item.active');

//something is entered in search form
$(document).on('focus keyup', '.system-search', function () {
  var that = this;
  // affect all table rows on in systems table
  var tableBody = $('.table-list-search tbody');
  var tableRowsClass = $('.table-list-search tbody tr');
  $('.search-sf').remove();
  tableRowsClass.each(function (i, val) {
    //Lower text for case insensitive
    var rowText = $(val).text().toLowerCase();
    var inputText = $(that).val().toLowerCase();
    if (inputText != '') {
      $('.search-query-sf').remove();
      tableBody.prepend(
        '<tr class="search-query-sf"><td colspan="6"><strong>Searching for: "' +
          $(that).val() +
          '"</strong></td></tr>',
      );
    } else {
      $('.search-query-sf').remove();
    }

    if (rowText.indexOf(inputText) == -1) {
      //hide rows
      tableRowsClass.eq(i).hide();
    } else {
      $('.search-sf').remove();
      tableRowsClass.eq(i).show();
    }
  });
  //all tr elements are hidden
  if (tableRowsClass.children(':visible').length == 0) {
    tableBody.append(
      '<tr class="search-sf"><td class="text-muted" colspan="6">No entries found.</td></tr>',
    );
    $('.Upload_btn').trigger('click', function () {
      $('.tabM').css('visibility', 'collapse');
      $('.uploadChang').css('visibility', 'visible');
    });
  } else {
    $('.cancelBtn').trigger('click', function () {
      $('.uploadChang').css('visibility', 'collapse');
      $('.tabM').css('visibility', 'visible');
    });
  }
});

////////////////////////////// 여기서 부터 그리드 2로 가져오기 및 삭제하기////////////////////////////////////////////////////

$(document)
  .off('click', '.hang')
  .on('click', '.hang', function () {
    var str = '';

    var heo = '';

    var n = '';
    var w = '';
    var p = '';
    var e1 = '';
    var b = '';
    var c = '';
    var ad = '';
    var of = '';
    var st = '';
    var E = '';
    var name2 = '';
    var name3 = '';

    var tdArr = new Array(); // 배열 선언
    var hang = $(this);

    // checkBtn.parent() : checkBtn의 부모는 <td>이다.
    // checkBtn.parent().parent() : <td>의 부모이므로 <tr>이다.
    var tr = hang;
    var td = tr.children();

    // console.log('클릭한 Row의 모든 데이터 : ' + tr.text());

    var no = td.eq(0).text();
    var userid = td.eq(1).text();
    var name = td.eq(2).text();
    var email = td.eq(3).text();
    var email_r = td.eq(4).text();
    var num = td.eq(5).text();
    var address = td.eq(6).text();
    var office = td.eq(7).text();
    var sta = td.eq(8).text();
    var name3 = td.eq(9).text();
    var name2 = td.eq(10).text();
    var memo = td.eq(11).text();

    // 반복문을 이용해서 배열에 값을 담아 사용할 수 도 있다.
    td.each(function (i) {
      tdArr.push(td.eq(i).text());
    });

    // console.log('배열에 담긴 값 : ' + tdArr);
    n += no;

    w += no;

    p += userid;

    e1 += name;

    b += email;

    c += num;

    ad += address;

    of += office;

    sta += st;

    E += email_r;

    str +=
      " ID : <font color='black'>" +
      no +
      '</font>' +
      ' <br/>' +
      "이름 : <font color='black'>" +
      userid +
      '</font>' +
      ' <br/>' +
      "이메일 : <font color='black'>" +
      email_r +
      '</font>' +
      ' <br/>' +
      "전화번호 1 : <font color='black'>" +
      name +
      '</font>' +
      ' <br/>' +
      "전화번호 2 : <font color='black'>" +
      name2 +
      '</font>' +
      ' <br/>' +
      "전화번호 3 : <font color='black'>" +
      name3 +
      '</font>' +
      ' <br/>' +
      "생성일 : <font color='black'>" +
      email +
      '</font>' +
      ' <br/>' +
      "고객번호 : <font color='black'>" +
      num +
      '</font>' +
      ' <br/>' +
      "주소 : <font color='black'>" +
      address +
      '</font>' +
      ' <br/>' +
      "기관이름 : <font color='black'>" +
      of +
      '</font>' +
      ' <br/>' +
      "상태 : <font color='black'>" +
      sta +
      '</font>' +
      ' <br/>' +
      "메모 : <font color='black'>" +
      memo +
      '</font>';

    heo += userid;

    $('.ex2_Result1').html(n);
    $('.ex2_Result2').val(p);
    $('.ex2_Result3').html(e1).val(e1);
    $('.ex2_Result4').html(b);
    $('.ex2_Result5').html(c).val(c);
    $('.ex2_Result6').html(str);
    $('#ex2_Result7').html(heo);
    $('#ex2_Result8').html(w);
    $('.ex2_Result9').html(of).val(of);
    $('.ex2_Result10').html(ad).val(ad);
    $('.ex2_Result11').html(st).val(st);
    $('.ex2_Result12').html(E).val(E);
    $('.ex2_Result13').html(name2).val(name2);
    $('.ex2_Result14').html(name3).val(name3);
    $('.ex2_Result15').html(memo).val(memo);

    ////////////////////////////////// 고객 삭제////////////////////////////////////

    $(document)
      .off('click', '.Delete_btn')
      .on('click', '.Delete_btn', function () {
        var rlt = window.confirm(userid + '(을)를 삭제하시겠습니까?');

        if (rlt) {
          axios.get(
            'http://cc.intelloid.click:17800/crm_itld/api/customer/destroy?center_id=2&customer_no=' +
              num,
          );

          alert(userid + '(을)를 삭제')
            .then((res) => {
              console.log('삭제 성공');
            })
            .catch(() => {
              console.log('삭제 요청 실패');
            });
        } else {
          alert(userid + '(을)를 삭제취소');
        }

        axios.defaults.withCredentials = false;
      });
  });

//////////////고객 편집///////////////////

/////////// 고객 추가하기 화면 출력/////////////////////////////////////////

$(document).on('click', '.Upload_btn', function () {
  $('.tabM').css('visibility', 'collapse');
  $('.uploadChang').css('visibility', 'visible');
});

$(document).on('click', '.cancelBtn', function () {
  $('.uploadChang').css('visibility', 'collapse');
  $('.tabM').css('visibility', 'visible');
});

$(document).on('click', '.current1', function () {
  $('.sidebar_icon1').trigger('click', function () {
    $('.sideMenu1').slide(600);
  });
});

export default Blank;
