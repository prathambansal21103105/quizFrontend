import { useLocation } from "react-router-dom";

const Quiz=()=>{
    const location = useLocation();
    const quiz = location.state?.quiz;

    return <>
    <main>
    <p className="heading">Quiz</p>
    {quiz.title}
    </main>
    </>;
}
export default Quiz;