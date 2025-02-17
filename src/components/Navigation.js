import { NavLink } from 'react-router-dom';
import classes from './Navigation.module.css';
// import { useContext } from 'react';
// import AppContext from '../store/app-context';
// import { defaultAppState } from '../store/AppProvider';
// import { useEffect } from 'react';


const Navigation=({user,reset})=>{
    // useEffect(()=>{},[ctx.username,ctx.status]);
    // const ctx=useContext(AppContext);
    const clickHandler=()=>{
        if(user!==""){
            reset();
        }
        return;
    }
    return(
        <header className={classes.header}>
            <nav>
                <ul className={classes.list}>
                    <li>
                        {<div className={classes.username}>Smart Quiz Management</div>}
                    </li>
                    <li>
                        <NavLink to="/" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/searchQuiz" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>Search Quiz</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
export default Navigation;