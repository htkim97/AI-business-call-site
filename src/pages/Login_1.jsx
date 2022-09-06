import { Link } from 'react-router-dom';
import { Grid } from 'rsuite';
import '../CSS/login.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navitage = useNavigate()
    const f1 = () =>{
       
        axios.post('http://cc.intelloid.click:17810/api/user/login')
        .then((res) => {
                
    
                  console.log(res.data);
                  navitage("/Home");
    
                });

                
        
    }




  return (
    <>
      <Grid className='login'>
  
          <input placeholder="아이디" name='username'></input>
          <input placeholder="비밀번호"name='password'></input>
          <button type='submit' onClick={f1}>로그인</button>
        

          <br/>
          
        <Link to="/signUp">회원가입</Link>
     
        <Link to="/find_id">아이디 찾기</Link>
     
        <Link to="/find_pw">비밀번호 찾기</Link>
     
        
      </Grid>
    </>
  );
};

export default Login;
