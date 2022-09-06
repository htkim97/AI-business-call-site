import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import Tr_6 from './Tr_6';
import './S_data.scss';






const Data_6 = ()=>{
    const [info_6, setInfo_6] = useState([]);
    const [selected, setSelected] = useState('');
    const [modalOn, setModalOn] = useState(false); 

    const nextId = useRef(11);
   
   

useEffect(()=>{
   
    axios.get('http://cc.intelloid.click:17800/crm_itld/api/customer/list?center_id=2')
    
    .then(res => setInfo_6(res.data))
    .catch(err => console.log(err));
    axios.defaults.withCredentials = false;


}, []);

   const handleSave = (data) => {
       if(data.id){
           setInfo_6(
               info_6.map(row => data.center_id === row.center_id ? {
                   id: data.center_id,
                   name: data.customer_name,
                   tel: data.tel_one,
                   date: data.regi_date,

               }: row))
       }else{
           setInfo_6(info => info.concat(
               {
               id: nextId.current,
               name: data.customer_name,
                   tel: data.tel_one,
                   date: data.regi_date,
           }
           ))
           nextId.current +=1;
       }
   }
   const handleRemove = (id) => {
       setInfo_6(info_6 => info_6.filter(item => item.id !==id)); 
   }

const handleEdit = (item) =>{
    setModalOn(true);
    const selectedData = {
        id: item.center_id,
        name: item.customer_name,
        tel: item.tel_one,
        date: item.regi_date,
        
    };

    console.log(selectedData);
    setSelected(selectedData);
};

const handleCancel = () =>{
    setModalOn(false);
}

const handleEditSubmit = (item) =>{
    console.log(item);
    handleSave(item);
    setModalOn(false);
}

    return (
        <div className="container_2 max-w-screen-lg mx-auto">
      
{/* 추가기능
      <Post onSaveData={handleSave} />


      {modalOn && <Modal selectedData={selected} handleCancel={handleCancel} 
      handleEditSubmit={handleEditSubmit} />} */}
      
      <table className="min-w-full table-auto text-gray-800 xtable_data Data_table" width={"100%"}>
        
       
            <th className="text-gray-300 px-4 py-3" width={"1%"}>ID</th>
            <th className="text-gray-300 px-4 py-3" width={"20%"}>이름</th>
            <th className="text-gray-300 px-4 py-3" width={"20%"}>전화번호</th>
            <th className="text-gray-300 px-4 py-3" width={"20%"}>생성일</th>
            <th className="text-gray-300 px-4 py-3" width={"20%"}>이메일</th>
            
            
            
        
        
        <Tr_6 info_6={info_6} handleRemove={handleRemove} handleEdit={handleEdit} />
      </table>

      
    </div>
    )
};

export default Data_6;

