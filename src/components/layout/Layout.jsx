import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Routers from "../../routers/Routers";

const Layout = () => {
    return (
      <>
        <Header/>
        <div>
            <Routers/>
        </div>    
        <Footer/>
      </>
    );
  }
  
export default Layout;
  