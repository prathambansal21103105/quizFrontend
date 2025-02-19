import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Question from "./Question";
import AddQuestion from './AddQuestion';

const Quiz = () => {
    const location = useLocation();
    const quiz = location.state?.quiz;
    const quizId = quiz?.id; // Unique identifier for the quiz
    const [create,setCreate] = useState(false);
    // console.log(quiz);
    // Load questions from localStorage or quiz data
    const [questions, setQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem(`quiz_${quizId}_questions`);
        if (savedQuestions) {
            return JSON.parse(savedQuestions).sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum));
        }
        return quiz?.questions ? [...quiz.questions].sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum)) : [];
    });

    const generatePDF = async() => {
        try {
            const res = await fetch(`http://localhost:8080/quiz/generate-pdf/${quizId}`);
            if (!res.ok) {
                throw new Error("Failed to generate PDF");
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Quiz_${quizId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    }

    const createQuestionTrigger=()=>{
        setCreate(true);
    }

    // Save questions to localStorage whenever they change
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem(`quiz_${quizId}_questions`, JSON.stringify(questions));
        }
    }, [questions, quizId]);

    // Function to update a question inside the list
    const updateQuestion = (updatedQuestion) => {
        setQuestions((prevQuestions) => {
            const updatedList = prevQuestions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            );
            return updatedList.sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum)); // Keep sorted
        });
    };

    const addQuestion = (newQuestion) => {
        setQuestions((prevQuestions) => {
            const updatedList = [...prevQuestions, newQuestion].sort(
                (a, b) => parseInt(a.questionNum) - parseInt(b.questionNum)
            );
            return updatedList;
        });
    };

    // Function to delete a question
    const deleteQuestion = (id) => {
        setQuestions(prevQuestions =>
            prevQuestions.filter(q => q.id !== id).sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum))
        );
    };

    const sampleQuestion = {
        "questionNum": "1",
        "question": "",
        "marks": 5,
        "options": [
            "True",
            "False",
            "None",
            "Error"
        ]
    };
      
    return (
        <main>
            <div className="quizContainer">
            <p className="heading">Quiz</p>
            <h1 className="quizTitle">{quiz?.title}</h1>
            <div className="quizDetails">
                <p><strong>Course:</strong> {quiz.course}</p>
                <p><strong>Course Code:</strong> {quiz.courseCode}</p>
                <p><strong>Max Marks:</strong> {quiz.maxMarks}</p>
            </div>
            <div>
            
            <ul>
                {questions.map((question) => (
                    <li className="questionList" key={question.id}>
                        <Question questionData={question} updateQuestion={updateQuestion} deleteQuestion={deleteQuestion} />
                    </li>
                ))}
                {create &&
                    <li className="questionList"> 
                        <div className="modalDiv">
                            <AddQuestion setCreate={setCreate} createQuestion={quizId} addQuestion={addQuestion} questionData={sampleQuestion}/>
                        </div>
                    </li>
                }
            </ul>
            <button className="button1" onClick={createQuestionTrigger}>Add Question</button>

            <button className="button2" onClick={generatePDF}>Generate PDF</button>
            </div>
            </div>
        </main>
    );
};

export default Quiz;
