import React from 'react'
import { Layout } from 'antd';

const { Header } = Layout;


const NavBar = () => {


     return(

         <div>
             <Header>
                 <div className="logo text-white text-left font-weight-bold">
                     <b className="h5">TRASH-CAN PORTAL</b>
                 </div>
             </Header>

         </div>
     );
}
export default NavBar;