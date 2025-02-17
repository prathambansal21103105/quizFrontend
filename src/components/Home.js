import { useState } from "react";
import { useEffect } from "react";
import QuizCard from "./QuizCard";
import { useNavigate } from "react-router-dom";

const Home=()=>{
  const [quizes,setQuizes] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    fetchQuizes();
  },[]);
  const fetchQuizes=async() => {
    const res=await fetch("http://localhost:8080/quiz")
    const resBody=await res.json();
    console.log(resBody);
    setQuizes(resBody);
  }
  const createQuizHandler=async() => {
    const data={
        "title": "Sample Quiz Title",
        "course": "",
        "courseCode": "",
        "maxMarks": 0
    }
    const res=await fetch("http://localhost:8080/quiz",{
      method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    const resBody=await res.json();
    setQuizes((prevQuizes) => [...prevQuizes, resBody]);
    navigate("/quiz", { state: { quiz: resBody } });
    console.log(resBody);
  }
    return (
      <>
      {/* <Navigation user={user} reset={reset}/> */}
      <main>
      <p className="heading"> Quizes</p>
      {/* <div className="display">
      <div className='outer'>
      <h2>Dynamic Programming</h2>
      <div className="topic">
      <ul>
      {items.map((element)=><li><Card key={element.id} id={element.id} question={element}/></li>)}
      </ul>
      </div>
      </div>
      </div> */}
      {/* {topics.map((topic)=> <Tags clickHandler={clickHandler} topic={topic} user={user} flag={0}/>)} */}
      <button className="button" onClick={createQuizHandler}>Create a quiz</button>
      <ul className="quizList">
      {quizes.map((quiz)=><li key={quiz.id}><QuizCard quiz={quiz}/></li>)}
      </ul>
      </main>
      </>
    );
  }
  
  export default Home;

  /*

   <h1>hello</h1>
    <button onClick={()=>{setShowLogin((prev)=>!prev)}}>{!showLogin? 'Login':'Close'}</button>
    {showLogin && !status && <Login onSubmit={verify}/>}
    {isTouched && status && <p>Welcome</p>}
    {isTouched && !status && <p>Wrong Credentials</p>}
  
    <button onClick={()=>{setShowSignUp((prev)=>!prev)}}>{!showSignUp? 'Create an Account':'Close'}</button>
    {showSignUp && <SignUp onSubmit={addUser}/>}
  
    {status && <p> Welcome to the website!!</p>}


  */