import React,{ useState, useEffect } from 'react';
import axios from 'axios';




const  Up= ({ onSaveData }) => {


  
  

  const [form, setForm] = useState({
    
    // customer_name: '',
    // email: '',
    // tel_one:'',
    // tel_two:'',
    // tel_three:'',
    // home_address: '',
    // office_name: '',
    // customer_no:'' 

    
  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveData(form);
    console.log(form);


    


    //
 
       
    axios.defaults.withCredentials = false;

    
    const params = new URLSearchParams(form);
    params.append('center_id', '2');
    params.append('status','ACTIVE');
    params.append('tel_two', ' ');
    params.append('tel_three', ' ');
    params.append('customer_no', document.getElementsByClassName('ex2_Result5')[0].value);
    
 
      axios({
      method: 'post',
      url: 'http://cc.intelloid.click:17800/crm_itld/api/customer/update',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },

      data:
        params
      

    });


   
   

   

    
  };



      return(

     
        
    

   


      <>
       <br/>
      <form className="mt-3" onSubmit={handleSubmit}>



        <div>
          <label>
          이름
            <input className="ex2_Result2"
                required
               
                type="text"
                name="customer_name"
              // value={form.name}
              onChange={handleChange}
              
            />
          </label>
         
        </div>

        <br/>

        
        <div>

           <label
            
          >
            이메일
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result12"
              required
              
              type="email"
              name="email"
              // value={form.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <br/>


        <div className="flex flex-col md:flex-row">
          
         
        
         
         
          
        </div>

        <div>

          <label>
            전화번호(1)
            <input
              className="ex2_Result3"
              required
            
              type="text"
              name="tel_one"
              // value={form.tel_one}
              onChange={handleChange}
            />
          </label>
</div>
<br/>
<div className="flex flex-col md:flex-row mb-1">
 <label
            htmlFor="phone"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            전화번호(2)
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result13"
              
          
              type="text"
              name="tel_two"
              // value={"X"}
              
              onChange={handleChange}
            />
          </label>
          
</div>
<br/>
<div className="flex flex-col md:flex-row mb-1">
  <label
            htmlFor="phone"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            전화번호(3)
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result14"
              
            
              type="text"
              name="tel_three"
              // value={form.tel_three}
              onChange={handleChange}
            />
          </label>
          
</div>
<br/>
<div className="flex flex-col md:flex-row mb-1">
 <label
            htmlFor="home_address"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            주소
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result10"
              required
            
              type="text"
              name="home_address"
              // value={form.home_address}
              onChange={handleChange}
            />
          </label>
          
</div>
<br/>
<div className="flex flex-col md:flex-row mb-1">
 <label
            htmlFor="office"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            회사이름
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result9"
             
          
              type="text"
              name="office_name"
              // value={form.office_name}
              onChange={handleChange}
            />
          </label>
          
</div>
 <br/>

<div className="flex flex-col md:flex-row mb-1">
 <label
            htmlFor="office"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            고객번호
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200 ex2_Result5"
              required
          
              type="text"
              name="office_name"
              // value={form.office_name}
              onChange={handleChange}
            />
          </label>
          
</div>
<br/>
<div>

<label>
  <textarea
  style={{width:'50%'}}
    className="ex2_Result15"
    
  placeholder='메모를 입력하세요'
    type="text"
    name="memo"
    // value={form.tel_one}
    onChange={handleChange}
  />
</label>
</div>



        <div className="text-center">
          <button
            className="bg-blue-400 py-2 text-center px-10 md:px-12 md:py-3 text-white 
                    rounded text-xl md:text-base mt-4 Save_btn" 
            type="submit"
          >
            저장
          </button>
        </div>
      </form>
    </>


       
      )
      
};





export default Up;
