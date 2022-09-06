
import React, {useEffect, useState, useRef} from 'react';

import Post from './Post';
import Modal from '../../Modal';







const Add = ()=>{
    const [info_6, setInfo_6] = useState([]);
    const [selected, setSelected] = useState('');
    const [modalOn, setModalOn] = useState(false); 

    const nextId = useRef(11);
   
   


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
 



    return (
        <div className="container max-w-screen-lg mx-auto">
   

      <Post onSaveData={handleSave} />
      {/* <Up onSaveData={handleSave}/> */}


      {modalOn && <Modal selectedData={selected} 
    />}
      

      
    </div>
    )
};

export default Add;