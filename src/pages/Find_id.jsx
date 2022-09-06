import {Link} from 'react-router-dom';
import {Grid} from 'rsuite';
import '../CSS/login.scss';
const Find_id =()=>{
    return (
        <Grid className='login'>
        <form>
          <input placeholder="전화번호"></input>
          <input placeholder="이메일"></input>
          <input placeholder="회사명"></input>
          <button>찾기</button>

          <br/>
          
    
        </form>
        
      </Grid>
    );
}

export default Find_id;