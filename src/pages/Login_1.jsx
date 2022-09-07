import { Link } from 'react-router-dom';
import { Grid } from 'rsuite';
import '../CSS/Login.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navitage = useNavigate();


  
  
  
  const f1 = () => {
    
    // data.append('_csrf', '37916f21-598c-4137-bb78-98d59de0b91c');



    const username =  document.querySelector("#put_1").value;
  
    const password =  document.querySelector("#put_2").value;
    
    const data = new FormData()
    data.append('username', username);
    data.append('password', password);



    
    fetch('http://cc.intelloid.click:17810/api/user/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: new URLSearchParams(data),
    })
      .then((v) => {
        console.log(v.url);
        console.log(v.redirected);

        if (v.redirected) {
          if (v.url.endsWith('error')) {
            alert('로그인 실패');
          } else {
            navitage('/Home');
          }

          // window.location = v.url;
        }
      })
      .catch((e) => console.warn(e));
  };

  


  return (
    <>
      <Grid className="login">
      
           <input type="text" name='id' id='put_1' placeholder='아이디' ></input>
           <input  type="text" name='pw' id='put_2' placeholder='비밀번호'></input>
   
       
       
        <button type="submit" onClick={f1}>
          로그인
        </button>

        <br />

        <Link to="/signUp">회원가입</Link>

        <Link to="/find_id">아이디 찾기</Link>

        <Link to="/find_pw">비밀번호 찾기</Link>
      </Grid>
    </>
  );
};

export default Login;
