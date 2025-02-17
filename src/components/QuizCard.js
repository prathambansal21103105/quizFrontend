import { useNavigate } from "react-router-dom";

const QuizCard=({quiz})=>{
    const navigate = useNavigate();
    const quizRedirect= () =>{
        navigate("/quiz", { state: { quiz: quiz } });
    }
    return <div className="quizCard">
    <button className="question" onClick={quizRedirect}>{quiz.title}</button>
    </div>;
}

export default QuizCard;