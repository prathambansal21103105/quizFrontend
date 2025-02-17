import Navigation from './Navigation';
import classes from './Add.module.css';
import { useState } from 'react';

const Add=({onSubmit,user,reset})=>{
    const [title,setTitle]=useState("");
    const [link,setLink]=useState("");
    const [tag,setTag]=useState("");
    const titleInputHandler=(event)=>{
        setTitle(event.target.value);
    }
    const tagInputHandler=(event)=>{
        setTag(event.target.value);
    }
    const linkInputHandler=(event)=>{
        setLink(event.target.value);
    }
    const submitHandler=(event)=>{
        event.preventDefault();
        const question={"title":title,"tag":tag,"link":link};
        onSubmit(question);
        setLink("");
        setTag("");
        setTitle("");
    }
    return(
        <>
         <Navigation user={user} reset={reset}/>
        <main>
        <h1>Contribute a question</h1>
        <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes['input-group']}>
            <p>
            <label htmlFor="name">Title</label>
            <input type="text" placeholder="title" value={title} onChange={titleInputHandler} id='name'/>
            </p>
        </div>
        <div className={classes['input-group']}>
            <p>
            <label htmlFor="password">Tag</label>
            <input type="text" placeholder="tag" value={tag} onChange={tagInputHandler} id='name'/>
            </p>
        </div>
        <div className={classes['input-group']}>
            <p>
            <label htmlFor="password">Link</label>
            <input type="text" placeholder="link" value={link} onChange={linkInputHandler} id='name'/>
            </p>
        </div>
        <p className={classes.action}>
            <button type="submit" className={classes.button}>submit</button>
        </p>
        </form>
        </main>
        </>
    );
}
export default Add;