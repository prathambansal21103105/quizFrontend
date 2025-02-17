import { useNavigate } from 'react-router-dom';
import classes from './Card.module.css';
import { useState } from 'react';
// import { useState,useContext } from 'react';
// import AppContext from '../store/app-context';

const Card=(props)=>{
    const navigate=useNavigate();
    const [clicked,setClicked]=useState(false);
    // const ctx=useContext(AppContext);
    const addHandler=async(event)=>{
        event.preventDefault();
        if(!clicked){
            navigate("/loading");
            let res='1';
            res=await props.clickHandler(props.question,props.flag);
            if(res===true || res===false){
                navigate("/");
            }
        }
        setClicked((state)=>!state);
    }
    const openURL=()=>{
        window.open(props.question.link);
    }
    let x='➕';
    let y='➖';
    if(props.flag===1){
        x='➖';
        y='➕';
    }
    return(
        // <div className={classes.box}>
        <>
            {props.user!=="" && <button className={classes.star} onClick={addHandler}>{(!clicked)? x:y}</button>}
            <button className={classes.question} onClick={openURL}>{props.question.title}</button>
        </>
        // {/* </div> */}
    );
}
export default Card;