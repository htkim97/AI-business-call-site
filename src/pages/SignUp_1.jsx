import {Link} from 'react-router-dom';
import {Grid} from 'rsuite';

const signUp =()=>{
    return(
        <Grid className='login'>
<form>
    <input placeholder='아이디'></input>
    <input placeholder='비밀번호'></input>
    <input placeholder='이메일'></input>
    <input placeholder='회사명'></input>
    <input placeholder='전화번호'></input>
    <Link to="/Home">회원가입</Link>

</form>
        </Grid>
    );
}

export default signUp; 