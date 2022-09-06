import {useContext, useState} from 'react';
import '../CSS/login.scss'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {Grid} from 'rsuite';
import {Link} from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navitage = useNavigate()

  const {dispatch} = useContext(AuthContext)

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({type:"LOGIN", payload:user})
        navitage("/Home")
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    
    <div className="login">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
        <br/>
        <Link to="/SignUp">회원가입</Link>
        <br/>
        {error && <span>--잘못입력함--</span>}
      </form>
    </div>
  );
};

export default Login;

