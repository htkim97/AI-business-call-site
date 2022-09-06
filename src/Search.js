import React, { useState } from 'react';
import axios from 'axios';





function Search() {
  const [data, setData] = useState(null);
  const onClick = async() => {
    try{
        const response = await 
        axios
        .get('http://cc.intelloid.click:5001/taNouns?text=%EC%95%84%20%EC%A7%80%EA%B8%88%20%EC%A0%80%EA%B8%B0%EC%9E%85%EB%8B%88%EB%8B%A4.%20%EC%B2%AD%EB%8B%B4%EC%A7%80%ED%95%98%EC%B2%A0%EC%97%AD%20%EB%A7%88%EC%9D%B4%ED%81%AC%20%EB%91%90%EB%93%9C%EB%A0%A4%20%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.'
        );
        setData(response.data);
    }catch (e) {
        console.log(e);
    }
  };

const [info, setInfo] = useState([]);



  return (
    <div>
      <div>
        <button onClick={onClick} className='Search_btn' >불러오기</button>
      </div>

      {data && (
        

          <textarea className='SearchBox'
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readOnly={true}
        />
      
        
      )}








    </div>

    
  );
}

export default Search;