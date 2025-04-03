import { NavLink } from 'react-router-dom';
import classes from './Navigation.module.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation=()=>{
    const navigate = useNavigate();
    const { user,logout } = useContext(AuthContext);
    return(
        <header className={classes.header}>
            <nav>
                <ul className={classes.list}>
                    <li>
                        {<div className={classes.username}>Smart Quiz Management</div>}
                    </li>
                   {user && user.role==='AUTHOR' && <li>
                        <NavLink to="/" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>Home</NavLink>
                    </li>}
                    {user && user.role==='AUTHOR' && <li>
                        <NavLink to="/searchQuiz" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>Search Quiz</NavLink>
                    </li>}
                    {!user? <li>
                        <NavLink to="/login" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>Login</NavLink>
                    </li>: <li><div className='logoutButton' onClick={()=> {
                        logout();
                        navigate("/login");
                    }} >Logout</div></li>}
                    <li>
                        <NavLink to="/signUp" className={({isActive})=> isActive ? classes.active:undefined} id="nav" end>SignUp</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
export default Navigation;