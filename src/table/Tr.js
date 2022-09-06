import React from 'react';
import Td from '../table/Td';
//ss
const Tr = ({info}) => {
    return (
        <tbody id="table_list" className='page5_list'>
            {
                info.map((rows) => {
                    return (
                    
                        <>
                         <Td rows={rows} />
                         
                        

                   
                   
                         
                        
                       

                        </>
                       
                        

                        
                        
                        
                    )
                })
            }
        </tbody>
        
    );
};


export default Tr; 
