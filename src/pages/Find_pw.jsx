import {Link} from 'react-router-dom';
import {Grid} from 'rsuite';
import '../CSS/Login.scss';

const Find_pw =()=>{
    return (
        <Grid className='login'>
        <form>
          <input placeholder="아이디"></input>
          <input placeholder="전화번호"></input>
          <input placeholder="이메일"></input>
          <button>찾기</button>

          <br/>
          
    
        </form>
        
      </Grid>
    );
}

export default Find_pw;