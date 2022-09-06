import React from 'react';
import '../sidebar/sideSlidebar.scss';
import $ from 'jquery';
import { Helmet } from 'react-helmet';


const sideSlidebar = () => {
  return (
    <nav className="sidebar-navigation">
      <Helmet>
        <meta charset="utf-8" />
        <title>리액트</title>
        <script type="text/javascript" src="./Js/webSocket_Head.js"></script>
        <script type="text/javascript" src="Js/Stately.js"></script>
        <script type="text/javascript" src="Js/customEvent.js"></script>
        <script type="text/javascript" src="Js/wsApp.js"></script>
        <script type="text/javascript" src="Js/wsCapi.js"></script>
        {/* <script type="text/javascript" src="http://cc.intelloid.click:5001/wsStt.js"></script> */}

    
      </Helmet>

      <ul>
       

        {/* ready // notready 버튼 */}
        <li>
          {/* <button
            id="Inbound"
            onClick={() => 'ibMode'}
            className="wsButton InBound"
            disabled
          >
            {' '}
            IB모드{' '}
          </button>
          <button
            id="Outbound"
            onClick={() => 'obMode'}
            className="wsButton OutBound"
            disabled
          >
            {' '}
            OB모드{' '}
          </button>
          <button
            id="NotReady"
            onClick={() => 'notReady'}
            className="wsButton Ready"
            disabled
          >
            {' '}
            NotReady{' '}
          </button> */}
        </li>

     
        
        
      </ul>
    </nav>
  );
};
export default sideSlidebar;
