import P_1_Home from './pages/P_1_Home';
import P_2_Customerhandle from './pages/P_2_Customerhandle';
import P_3_Consultcallback from './pages/P_3_Consultcallback';
import P_4_Consultreservation from './pages/P_4_Consultreservation';
import P_5_Consultcallhistsearch from './pages/P_5_Consultcallhistsearch';
import P_6_Customermanage from './pages/P_6_Customermanage';
import SignUp_1 from './pages/SignUp_1';
import Login_1 from './pages/Login_1';
import Find_id from './pages/Find_id';
import Find_pw from './pages/Find_pw';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import WebSocket from './WebSocket/WebSocket';
import SignUp from './pages/SignUp';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
// import { productInputs, userInputs } from "./formSourse";
import './App.scss';
import 'boxicons/css/boxicons.min.css';
import '@elastic/react-search-ui-views/lib/styles/styles.css';


function App() {
  const { currentUser } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/Login" />;
  };
  return (
    <>
      <WebSocket />
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' index element={<Login/>} /> */}
          <Route path="/" index element={<Login_1 />} />
          <Route element={<AppLayout />}>
            <Route
              path="/Home"
              index
              element={
                <RequireAuth>
                  <P_1_Home />
                </RequireAuth>
              }
            />

            <Route path="/customerhandle" element={<P_2_Customerhandle />} />
            <Route path="/consultcallback" element={<P_3_Consultcallback />} />
            <Route
              path="/consultreservation"
              element={<P_4_Consultreservation />}
            />
            <Route
              path="/consultcallhistsearch"
              element={<P_5_Consultcallhistsearch />}
            />
            <Route path="/customermanage" element={<P_6_Customermanage />} />
          </Route>

          <Route path="/signUp" element={<SignUp_1 />}></Route>
          <Route path='/find_id' element={<Find_id/>}></Route>
          <Route path='/find_pw' element={<Find_pw/>}></Route>
          {/* <Route path='/signUp' element={<SignUp/>}></Route> */}
        </Routes>
      </BrowserRouter>

      {/* 
     P_1_Home => 홈
     P_2_Customerhandle => 상담등록 
     P_3_Consultcallback  => 콜백전화
     P_4_Consultreservation => 예약전화
     P_5_Consultcallhistsearch => 상담이력조회
     P_6_Customermanage => 고객정보조회
     blank7 => 캠페인 
     
     
     
     
     
     */}
    </>
  );
}

export default App;
