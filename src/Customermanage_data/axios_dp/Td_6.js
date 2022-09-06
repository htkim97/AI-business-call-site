import React from 'react';
const Td_6 = ({ item, handleRemove, handleEdit }) => {
  const onRemove = () => {
    handleRemove(item.center_id);
  };

  const onEdit = () => {
    handleEdit(item);
  };

  return (
    <>
      <tr className="container_6 hang" width={"120%"} >
        <td className="menu_1" style={{  fontSize:'15px'}}>{item.center_id}</td>
        <td className="menu_2" style={{  fontSize:'15px', textAlign:'center'}}>{item.customer_name}</td>
        <td className="menu_3" style={{  fontSize:'15px',textAlign:'center' }}>{item.tel_one}</td>
        <td className="menu_4" style={{  fontSize:'15px', textAlign:'center' }}>{item.regi_date}</td>
        <td className="menu_5" style={{  fontSize:'15px',textAlign:'center' }}>{item.email}</td>
        <td className="menu_6" style={{  fontSize:'0px' }}>{item.customer_no}</td>
        <td className="menu_7" style={{  fontSize:'0px' }}>{item.home_address}</td>
        <td className="menu_8" style={{ fontSize:'0px' }}>{item.office_name}</td>
        <td className="menu_9" style={{   fontSize:'0px' }}>{item.status}</td>
        <td className="menu_10" style={{   fontSize:'0px' }} >{item.tel_three}</td>
        <td className="menu_11"  style={{   fontSize:'0px' }}>{item.tel_two}</td>
        <td className="menu_12"  style={{   fontSize:'0px' }}>{item.memo}</td>
     
       
      </tr>

      
    </>
  );
};

export default Td_6;
//
