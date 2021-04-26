import React from 'react'
import {MDBBtn, MDBIcon, MDBNavbar, MDBNavbarBrand} from "mdbreact";
import "mdbreact/dist/css/mdb.css";


const NavBar = () => {


     return(

         <div>
             <MDBNavbar color="indigo" dark expand="md">
                 <MDBNavbarBrand>
                     <strong className="white-text font-weight-bold">Trash-can Portal</strong>
                 </MDBNavbarBrand>
             </MDBNavbar>

         </div>
     );
}
export default NavBar;