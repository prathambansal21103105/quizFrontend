import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const QuizCard=({quiz})=>{
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const { user } = useContext(AuthContext);
    const quizRedirect= () =>{
        navigate("/quiz", { state: { quiz: quiz } });
    }
    const duplicateQuizRedirect = async() => {
        try{
            const res=await fetch("http://localhost:8080/quiz/duplicate/" + quiz.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const resBody=await res.json();
            const duplicateQuiz = resBody;
            console.log(duplicateQuiz);
            navigate("/quiz", { state: { quiz: duplicateQuiz } });
        }
        catch(error){
            console.log(error);
        }
    }
    return (
    <div 
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        <div className="quizCard">
            <button className="question" onClick={quizRedirect}>
                {quiz.title}
            </button>
            {hover && <button className="button3" onClick={duplicateQuizRedirect}>
                Duplicate
            </button>}
        </div>
    </div>
    );
}

export default QuizCard;