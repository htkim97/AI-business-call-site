import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";
const SignUp =()=>{
    const [registerEmail, setRegisterEmail]=useState("");
    const [registerPassword, setRegisterPassword]=useState("");

    const register = async ()=>{
        try{
            const user=await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            console.log(user);
        }catch (error){
            console.log(error.message);
        }
    };
    return (
        <div>
            <input
            placeholder="email"
            onChange={(e) => {
                setRegisterEmail(e.target.value);
            }}
            />
            <input
             placeholder="password"
             onChange={(e) => {
                 setRegisterPassword(e.target.value);
             }}
            />
            <button onClick={register}>회원가입</button>
        </div>
    );
}
export default SignUp;