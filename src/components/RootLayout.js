import Navigation from './Navigation';
import { Outlet } from "react-router-dom";
// import AppContext from '../store/app-context';
// import { useContext } from 'react';

const RootLayout=()=>{
    // const ctx=useContext(AppContext);
    return(
        <>
        <Navigation />
    
            <Outlet/>
        </>
    );
}

export default RootLayout;