import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './SignUp.module.css';
import Navigation from "./Navigation";

const SignUp=(props)=>{
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [leetcode,setLeetcode]=useState("");
    const [codeforces,setCodeforces]=useState("");
    const navigate=useNavigate();
    const nameInputHandler=(event)=>{
        setName(event.target.value);
    }
    const passwordInputHandler=(event)=>{
        setPassword(event.target.value);
    }
    const leetcodeInputHandler=(event)=>{
        setLeetcode(event.target.value);
    }
    const codeforcesInputHandler=(event)=>{
        setCodeforces(event.target.value);
    }
    const submitHandler=(event)=>{
        event.preventDefault();
        if(props.onSubmit(name,password,leetcode,codeforces)){
            setName("");
            setPassword("");
            setLeetcode("");
            setCodeforces("");
            navigate('/login');
        }
    }
    return(
       
         <>
         <Navigation user={props.user} reset={props.reset}/>
         <main>
         <h1>SignUp</h1>
         <form className={classes.form} onSubmit={submitHandler}>
         <div className={classes['input-group']}>
             <p>
             <label htmlFor="name">Username</label>
             <input type="text" value={name} onChange={nameInputHandler} id='name'/>
             </p>
         </div>
         <div className={classes['input-group']}>
             <p>
             <label htmlFor="password">Password</label>
             <input type="password" value={password} onChange={passwordInputHandler} id='password'/>
             </p>
         </div>
         <div className={classes['input-group']}>
             <p>
             <label htmlFor="name">Leetcode Handle</label>
             <input type="text" value={leetcode} onChange={leetcodeInputHandler} id='name'/>
             </p>
         </div>
         <div className={classes['input-group']}>
         <p>
             <label htmlFor="name">Codeforces Handle</label>
             <input type="text" value={codeforces} onChange={codeforcesInputHandler} id='name'/>
             </p>
         </div>
         <p className={classes.action}>
             <button type="submit" className={classes.button}>register</button>
         </p>
         </form>
         </main>
         </>
    );
}
export default SignUp;

/*

        <form onSubmit={submitHandler}>
            <label htmlFor="name">Name</label>
            <input type="name" id="name" onChange={nameInputHandler} value={name}></input>
            <label htmlFor="name">Password</label>
            <input type="password" id="password" onChange={passwordInputHandler} value={password}></input>
            <button type="submit">SignUp</button>
        </form>

         <>
        <form className="login-form" onSubmit={submitHandler}>
            <input type="text" placeholder="username" value={name} onChange={nameInputHandler}/>
            <input type="password" placeholder="password" value={password} onChange={passwordInputHandler}/>
            <button>Create an Account</button>
        </form>
        </>


*/