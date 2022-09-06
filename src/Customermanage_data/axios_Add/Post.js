import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';

const Post = ({ onSaveData }) => {
  
 
 
  
  
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    tel_one: '',
    tel_two: '',
    tel_three: '',
    home_address:'',
    office_name:'',

    
  
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


    axios.defaults.withCredentials = false;

    
    const params = new URLSearchParams(form);
    params.append('center_id', '2');
    params.append('status','ACTIVE');
    

    

    axios({
      method: 'post',
      url: 'http://cc.intelloid.click:17800/crm_itld/api/customer/create',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },

      data:
        params
      

    });

   

    
  };

  //

  return (
    <>
      
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row mb-1">
          <label htmlFor="username" className="w-full flex-1 mx-2 text-xs font-semibold text-gray-600 uppercase">
          이름
            <input className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              required
              placeholder="이름을 입력해주세요"
              type="text"
              name="customer_name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label
            htmlFor="email"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            이메일
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              required
              placeholder="이메일 주소를 입력해주세요"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="flex flex-col md:flex-row">
          <label
            htmlFor="phone"
            className="w-full flex-1 mx-2 text-xs font-semibold 
                    text-gray-600 uppercase"
          >
            전화번호(1)
            <input
              className="w-full py-3 px-1 mt-1 
                    text-gray-800 appearance-none 
                    border-2 border-gray-100
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              required
              placeholder="핸드폰 번호를 입력해주세요"
              type="text"
              name="tel_one"
              value={form.tel_one}
              onChange={handleChange}
            />
          </label>
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
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              
              placeholder="핸드폰 번호를 입력해주세요"
              type="text"
              name="tel_two"
              value={form.tel_two}
              onChange={handleChange}
            />
          </label>
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
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              
              placeholder="핸드폰 번호를 입력해주세요"
              type="text"
              name="tel_three"
              value={form.tel_three}
              onChange={handleChange}
            />
          </label>
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
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              required
              placeholder="주소를 입력해주세요"
              type="text"
              name="home_address"
              value={form.home_address}
              onChange={handleChange}
            />
          </label>
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
                    focus:text-gray-500 focus:outline-none focus:border-gray-200"
              required
              placeholder="회사이름을 입력해주세요"
              type="text"
              name="office_name"
              value={form.office_name}
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
  );

  

};


// ////////////////편집//////////////////////

// $(document).on("click",".hang",function() {
//   var columnHeadings = $(".hiddenData th").map(function() {
//             return $(this).text();
//          }).get();
//   columnHeadings.pop();
//   var columnValues = $("thead td").map(function() {
//             return $(this).text();
//   }).get();
// var modalBody = $('<div id="modalContent"></div>');
// var modalForm = $('<form role="form" name="modalForm" action="funct()" method="post"></form>');
// $.each(columnHeadings, function(i, columnHeader) {
//   var formGroup = $('<div class="form-group"></div>');
//   formGroup.append('<label for="'+columnHeader+'">'+columnHeader+'</label>');
//   formGroup.append('<input class="form-control" name="'+columnHeader+i+'" id="'+columnHeader+i+'" value="'+columnValues[i]+'" />');
   

  
//   modalForm.append(formGroup);
//   // console.log(formGroup);
 

//   modalBody.append(modalForm);
// $('.modal-body').html(modalBody);



// });



// });
 
  

export default Post;
