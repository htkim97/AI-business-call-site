import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.scss'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';




const sidebarNavItems = [
  

  
  
  
  
  {
    icon: (
    
      <div className='icons_nav'>
        <div className='bx bx-home tooltip'>
          <span className='tooltipText tooltip_1'>홈     </span>
        </div>
      </div>
     
    ),

    to: '/Home',
    section: '',
  },

  {
    icon: (
      <div className='icons_nav'>
      <div className='bx bx-headphone tooltip'>
        <span className='tooltipText tooltip_2'>상담등록 </span>
      </div>
    </div>
      
    ),

    to: '/Customerhandle',
    section: 'Customerhandle',
  },
  {
    icon: (

      <div className='icons_nav'>
      <div className='bx bx-link-external tooltip'>
        <span className='tooltipText tooltip_1'>콜백전화 </span>
      </div>
    </div>
    
    ),
    to: '/Consultcallback',
    section: 'Consultcallback',
  },
  {
    icon: (
      <div className='icons_nav'>
      <div className='bx bxs-book-bookmark tooltip'>
        <span className='tooltipText tooltip_1'>예약전화 </span>
      </div>
    </div>
     
    ),
    to: '/Consultreservation',
    section: 'Consultreservation',
  },
  {
    icon: (
      <div className='icons_nav'>
      <div className='bx bx-search tooltip'>
        <span className='tooltipText tooltip_1'>상담이력등록</span>
      </div>
    </div>
    
    ),

    to: '/Consultcallhistsearch',
    section: 'Consultcallhistsearch',
  },
  {
    icon: (
      <div className='icons_nav'>
      <div className='bx bxs-contact tooltip'>
        <span className='tooltipText tooltip_1'>고객정보조회</span>
      </div>
    </div>
      
    ),

    to: '/Customermanage',
    section: 'Customermanage',
  },

  {

    
    icon: (
      <div className='icons_nav'>
      <div className='bx bx-power-off tooltip'>
        <span className='tooltipText tooltip_1'>로그아웃</span>
      </div>
    </div>

      
     
    ),

    to: '/',
    section: 'login',
  },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef.current.querySelector(
        '.sidebar__menu__item',
      );
      indicatorRef.current = `${sidebarItem.clientHeight}px`;
      setStepHeight(sidebarItem.clientHeight);
    }, 50);
  }, []);

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname.split('/')[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath,
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        {/* <img src="img/intelloid_1.png" width={220} /> */}
      </div>
      <div ref={sidebarRef} className="sidebar__menu">
        {/* <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div> */}
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div
              className={`sidebar__menu__item ${
                activeIndex === index ? 'active' : ''
              }`}
            >
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
