import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Question from "./Question";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const location = useLocation();
    const quiz = location.state?.quiz;

    useEffect(() => {
        if (quiz?.questions) {
            const sortedQuestions = [...quiz.questions].sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum));
            setQuestions(sortedQuestions);
        }
    }, [quiz]); 

    return (
        <main>
            <p className="heading">Quiz</p>
            {quiz?.title}
            <ul>
                {questions.map((question) => (
                    <li key={question.id}><Question questionData={question} /></li>
                ))}
            </ul>
        </main>
    );
};

export default Quiz;
