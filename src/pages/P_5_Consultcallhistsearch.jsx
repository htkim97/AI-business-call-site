import React, { Children, useEffect } from 'react';
import '../CSS/Blank5.css';
import '../CSS/Blank5.scss';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import Board from '../Board';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';






//api



const Blank = () => {
  return (
  
   
      <div className="body">

<Helmet>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.3/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
<script src='../table/Tr.js'></script>
</Helmet>

      {/* <div className='not_oi'>
       
      <button className='title_icon_2'>
          <div className='title_icon_2_w'>
             NotReady
          </div>
         
           </button>

           <button id='title_icon_3'>
           <i className="bx bx-menu"></i>
           </button>



      </div>
           
          <div className='icons'>

        
         

           <button id='title_icon_1'>
           <i className="bx bx-menu"></i>
           </button>
          

          
          </div>

     
        

          <div className="title">
          

          
         


          </div>
       
            
            
             <nav id='menu'> 
              
         <ul>
           
         </ul>
           <li id='tab1'>
             <button><i className="bx bx-log-out" ></i> 로그아웃</button>

           </li>
           <li>
             <button><i className="bx bx-calendar-check"></i> 예약</button> 
           </li>
           <li>
             <button><i className="bx bx-bell"></i> 공지사항</button>
          </li>
               </nav> */}

           
       
      
          
          <hr className="line"/>

          <div className="checkbox">
            <label className="checkbox_line_1">
            
              {/* <td>
                &nbsp;&nbsp;&nbsp;
                <input type="checkbox"></input>&nbsp;최종상담 : &nbsp;
                <select className="drop4" name="browsers" required autofocus>
                  <option value=" " selected>
                    {' '}
                  </option>
                  <option value="최종선택">최종선택</option>
                  <option value="사본상담">사본상담</option>
                </select>
              </td>
              <td>
                &nbsp;
                &nbsp;
                <input type="checkbox"></input>&nbsp;&nbsp;발신번호 : &nbsp;
               <input type={'text'} className='s_from2'></input>
              </td>
              <td>
                &nbsp;&nbsp;&nbsp;
                <input type="checkbox"></input>&nbsp;고 객 명 : &nbsp;
                <input type={'text'} className='s_from3'></input>
              </td> */}

            
            </label>
            <br />
            <br />
            <label className="checkbox_line_2">
            
            <td>
                &nbsp;&nbsp;
                <input type="checkbox"></input>&nbsp;상담일자 : &nbsp;
                <div className="range_dates">
                  <DateRangePicker />
                </div>
              </td>

              <td>
                &nbsp;&nbsp;&nbsp;
                <input type="checkbox"></input>&nbsp;검색 : &nbsp;
                <input type={'text'} placeholder="Search For" className='s_from4'></input>
              </td>
            </label>
          </div>

          <hr className="line" />
          <input type="button" id="excelFileExport" className='excelButton' value="다운로드" />
          <div>
            <Board />
          </div>

      </div>
      
      
  
 
 
 
 
 );
};



function s2ab(s) { 
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf);  //create uint8array as viewer
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;    
}
function exportExcel(){ 
  // step 1. workbook 생성
  var wb = XLSX.utils.book_new();

  // step 2. 시트 만들기 
  var newWorksheet = excelHandler.getWorksheet();
  
  // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
  XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

  // step 4. 엑셀 파일 만들기 
  var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

  // step 5. 엑셀 파일 내보내기 
  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}

  $(document).on("click","#excelFileExport",function(){
      exportExcel();
  });



var excelHandler = {
      getExcelFileName : function(){
          return '통화이력.xlsx';
      },
      getSheetName : function(){
          return '통화이력';
      },
      getExcelData : function(){
          return  document.getElementById('table_list');
      },
      getWorksheet : function(){
          return XLSX.utils.table_to_sheet(this.getExcelData());
      }
}

//검색////////////////////////////////////////////////////////////////

var activeSystemClass = $('.list-group-item.active');

//something is entered in search form
$(document).on('focus keyup', '.s_from4', function () {
  var that = this;
  // affect all table rows on in systems table
  var tableBody = $('.page5_list');
  var tableRowsClass = $('.page5_list tr');
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



export default Blank;
