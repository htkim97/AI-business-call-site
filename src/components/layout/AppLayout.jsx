import { Outlet } from 'react-router-dom';
import { Content, Grid } from 'rsuite';
import Sidebar from '../navbar/Sidebar';
import Slidebar from '../sidebar/Slidebar';
import Btn from '../Buttons/Btn';


const AppLayout = () => {
  return (
    <div
      style={{
        marginTop: '-9%',
        background: 'white',
      }}
    >
      <div>
        <Grid
          style={{
            padding: '10% 0% 0% 0%',
            margin: '0% 0% 0% 20%',
            marginLeft: '28%',
          }}
        >
          {/* <Btn/> */}
        </Grid>
      </div>
      <Grid>
        <div
          style={{
            padding: '1% 1% 0% 9%',
            margin: '0% 0% 0% 0%',
            width: '90%',
            marginLeft: '9%',
          }}
        >
          <Sidebar />
        </div>
      </Grid>

      <Grid>
        
          {/* <S_data /> */}
      
     <Outlet />
    

       
        
        
         
        
      </Grid>
      
    </div>
  );
};

export default AppLayout;
