import React from 'react';
import Td_6 from './Td_6';

const Tr_6 = ({info_6, handleRemove, handleEdit})=>{
    return(
        <tbody>
        {
               info_6.map((item)=>{
                   return(
                       <Td_6 key={item.center_id} item={item} handleRemove={handleRemove} handleEdit={handleEdit}/>
                   )
               })
            }
        </tbody>

    )
};

export default Tr_6;