import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Tr from './table/Tr';
import './CSS/Blank5.css';

const Board = () => {
  const [info, setInfo] = useState([]);
  var rowIdx = 0;
  var taTargetIdx = 0;

  useEffect(() => {
    axios
      // .get('http://cc.intelloid.click:5001/getSTT/1111')
      .get('http://cc.intelloid.click:17800/crm_itld/api/call_hists/list?center_id=2&customer_id=829')
      .then((res) => {
        // for (let i = 0; i < res.data.rows.length; i++) {
        //   // console.log(res.data.rows[i].time); // 전화번호, 콜ID, 시각, 내용 데이터 조회 출력

        //   // var url ='%EC%95%84%20%EC%A7%80%EA%B8%88%20%EC%A0%80%EA%B8%B0%EC%9E%85%EB%8B%88%EB%8B%A4.%20%EC%B2%AD%EB%8B%B4%EC%A7%80%ED%95%98%EC%B2%A0%EC%97%AD%20%EB%A7%88%EC%9D%B4%ED%81%AC%20%EB%91%90%EB%93%9C%EB%A0%A4%20%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.'
        //   var url = encodeURI(res.data.rows[i].cnts);
        //   axios
        //     .get('http://cc.intelloid.click:5001/taNouns?text=' + url)

        //     .then((res0) => {
        //       // res[0] = res0.data;
        //       rowIdx++;

        //       res.data.rows[i].taNouns = res0.data.join(', ');

        //       console.log(res0.data);

        //     });

        //   ////////////////////////태그 호출//////////////////////////////////////////

        //   var url_1 = encodeURI(res.data.rows[i].cnts);
        //   axios
        //     .get('http://cc.intelloid.click:5001/taKwd?text=' + url_1)

        //     .then((res1) => {
        //       taTargetIdx++;

        //       res.data.rows[i].taKwd =  Object.keys(res1.data.result).join(', ');

        //       console.log(Object.keys(res1.data.result).join(', '));

        //       if (rowIdx && taTargetIdx >= res.data.rows.length) {
        //         console.log(res1.data.result);
        //         setInfo(res.data.rows);
        //       }
        //     })

        //     .catch((err) => console.log(err));
        // }

        setInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 각 th 제목 리턴

  return (
    <>
     

      <Tr info={info} />
    
    <script>

    </script>
    
    
    
    </>


  );
};

export default Board;
