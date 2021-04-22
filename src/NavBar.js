import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {MDBBtn, MDBIcon} from "mdbreact";
import "mdbreact/dist/css/mdb.css";


const NavBar = () => {


     return(

         <div>
             <AppBar position="sticky" className="mb-1 text-white">
                 <Toolbar>
                     <div >
                         <Typography variant="title" color="inherit">
                             <h3 className="text-white">Trash-can Portal</h3>
                         </Typography>
                     </div>
                     <MDBBtn style={{float: "right", marginLeft: "auto", marginRight: 30 }}
                              color="info">
                         Add <MDBIcon icon="plus" className="ml-2"/>
                     </MDBBtn>
                 </Toolbar>
             </AppBar>

         </div>
     );
}
export default NavBar;