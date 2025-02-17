// import { useState,useContext } from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import AppContext from "../store/app-context";
import classes from './Login.module.css';
import Navigation from "./Navigation";

const Login=(props)=>{
    // const ctx=useContext(AppContext);
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const nameInputHandler=(event)=>{
        setName(event.target.value);
    }
    const passwordInputHandler=(event)=>{
        setPassword(event.target.value);
    }
    const submitHandler=(event)=>{
        event.preventDefault();
        if(props.onSubmit(name,password)){
            console.log("yes");
            // ctx.username=name;
            // ctx.password=password;
            // ctx.status=true;
            // console.log(ctx.username,ctx.password,ctx.status);
            setName("");
            setPassword("");
            navigate('/');
        }
        else{
            setName("");
            setPassword("");
            navigate('/login');
        }
        
    }
    return(
        <>
        <Navigation user={props.user} reset={props.reset}/>
        <main>
        <h1>Login</h1>
        <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes['input-group']}>
            <p>
            <label htmlFor="name">Username</label>
            <input type="text" placeholder="username" value={name} onChange={nameInputHandler} id='name'/>
            </p>
        </div>
        <div className={classes['input-group']}>
            <p>
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="password" value={password} onChange={passwordInputHandler} id='password'/>
            </p>
        </div>
        <p className={classes.action}>
            <button type="submit" className={classes.button}>login</button>
        </p>
        </form>
        </main>
        </>
    );
}
export default Login;

/*
        <form onSubmit={submitHandler}>
            <label htmlFor="name">Name</label>
            <input type="name" id="name" onChange={nameInputHandler} value={name}></input>
            <label htmlFor="name">Password</label>
            <input type="password" id="password" onChange={passwordInputHandler} value={password}></input>
            <button type="submit">Login</button>
        </form> 
        <>
        <form className="login-form" onSubmit={submitHandler}>
        <input type="text" placeholder="username" value={name} onChange={nameInputHandler}/>
        <input type="password" placeholder="password" value={password} onChange={passwordInputHandler}/>
        <button>login</button>
        </form>
        </>
*/