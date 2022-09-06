import React from 'react';
import './Btn.scss';
import $, { removeData } from 'jquery';
import { Helmet } from 'react-helmet';


const mainBtn = () => {
  return (
    <div className="topButton">

      
       
<Helmet>
<meta charset="utf-8"/>


<script type="text/javascript" src="Js/wsApp.js"></script>



</Helmet>

      {/* bi/bo 토글 버튼 */}




{/* <div className="sidebar__logo">
        <img src="img/intelloid_1.png" width={220} />
      </div> */}

{/* 
      <div className="icons">
        <button className="yuBtn bx bx-menu">
        </button>
      </div> */}

      <div className="title"></div>

      <nav id="menu">
        <li id="tab1">
          <button>
            <i className="bx bx-log-out"></i> 로그아웃
          </button>
        </li>
        <li>
          <button>
            <i className="bx bx-calendar-check"></i> 예약
          </button>
        </li>
        <li>
          <button>
            <i className="bx bx-bell"></i> 공지사항
          </button>
        </li>
      </nav>
    </div>
  );
};

$(document).on('click', '.yuBtn', function () {
  $('#menu').fadeToggle(600);

  // console.log('동작확인');
});

// 그 그 머냐 옆 사이드 메뉴 ㅀ직


// $(document).on('click', '.sidebar_icon1', function () {
//   $('.sideMenu1').slideToggle(600);
//   $('.sideMenu2').slideUp(550);
//   $('.sideMenu3').slideUp(550);
//   $('.sideMenu4').slideUp(550);

//   // console.log('동작확인');
// });

$(document).on('click', '#sidebar_icon2', function () {
  $('#sideMenu2').slideToggle(600);
  $('#sideMenu1').slideUp(550);
  $('#sideMenu3').slideUp(550);
  $('#sideMenu4').slideUp(550);

  // console.log('동작확인');
});

$(document).on('click', '#sidebar_icon3', function () {
  $('#sideMenu3').slideToggle(600);
  $('#sideMenu1').slideUp(550);
  $('#sideMenu2').slideUp(550);
  $('#sideMenu4').slideUp(550);

  // console.log('동작확인');
});

$(document).on('click', '#sidebar_icon4', function () {
  $('#sideMenu4').slideToggle(600);
  $('#sideMenu1').slideUp(450);
  $('#sideMenu2').slideUp(450);
  $('#sideMenu3').slideUp(450);

  // console.log('동작확인');
});


// toggle 버튼



export default mainBtn;
