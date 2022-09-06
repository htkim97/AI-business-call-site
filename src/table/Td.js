import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import $ from 'jquery';
import '../components/Memo/Memo.scss';
import { Grid } from 'rsuite';
const Td = ({ rows }) => {
  return (
    <>
    <Grid>
       <table style={{textAlign:'center'}}>
        <tr className="container_2">
          <td className="color_3" style={{ width: '0%' }}>
            {rows.center_id}
          </td>
          <td className="color_3" style={{ width: '14%' }}>
            {rows.customer_name}
          </td>

          <td className="color_3" style={{ width: '12%' }}>
            {new Date(Date.parse(rows.created_at)).toLocaleString()}
          </td>
          <td className="color" width={'23%'}>
            {rows.customer_email}
          </td>
        
          <td className="color_3">{rows.callerid}</td>
          <td className="color_3">{rows.call_type}</td>
          <td className="color_3"style={{width:'2%'}}>{rows.sippeer_id}</td>
          <td className="color_1"><textarea>{rows.result}</textarea></td>
          <td className="color_1"  width={'35%'} >
            <select
              className="drop4"
              name="browsers"
              required
              autofocus
              style={{ width: '100%' }}
            >
              <option value="좋은대응" style={{ textAlign: 'center' }}>
                좋은 대응
              </option>
              <option value="안좋은대응" style={{ textAlign: 'center' }}>
                안좋은 대응
              </option>
              <option value="스팸" style={{ textAlign: 'center' }}>
                스팸
              </option>
            </select>
          </td>
        </tr>
      </table>
    </Grid>
    <Grid>
 <br/>
    </Grid>
    
    </>
  );
};
export default Td;
