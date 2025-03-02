import { useState } from "react";
import QuizCard from "./QuizCard";
import imageSrc from '../search.gif';

const Search=()=>{
  const [searchInput,setSearchInput] = useState("");
  const [list,setList] = useState([]);
  const submitHandler=async()=>{
    setSearchInput(searchInput.trim());
    const fetchQuizesBySearchTerm=async() => {
      const res=await fetch("http://localhost:8080/quiz/search/" + searchInput)
      const resBody=await res.json();
      console.log(resBody);
      setList(resBody);
    }
    if(searchInput !== ""){
      fetchQuizesBySearchTerm();
    }
  }
    return (
      <>
      <main>
        <div className="quizDetails1">
        <p className="heading"> Search for a quiz</p>
        <div className="searchBar">
            <input
            type="name"
            placeholder="Quiz Title or Course Code"
            className="bar"
            value={searchInput}
            onChange={(e)=>{setSearchInput(e.target.value)}}
            />
            <button
            type="submit"
            className="searchButton"
            onClick={submitHandler}
            >Search</button>
        </div>
        </div>
        <img src={imageSrc} className="gif" alt="how to use"/>
        <ul className="quizList">
          {list.map((quiz)=><li key={quiz.id}><QuizCard quiz={quiz}/></li>)}
        </ul>
      </main>
      </>
    );
  }
  
export default Search;