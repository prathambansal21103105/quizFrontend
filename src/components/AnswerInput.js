import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AnswerInput = ({ questions, setVisible, setQuestions, quizId }) => {
  const [questionsList, setQuestionsList] = useState([...questions]);
  const { user } = useContext(AuthContext);

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index] = { ...updatedQuestions[index], answer: value };
    updatedQuestions.sort((a, b) => a.questionNum - b.questionNum);
    setQuestionsList(updatedQuestions);
  };

  const updateAnswers = async() => {
    const answers = questionsList.map((question) => question.answer);
    const res=await fetch("http://localhost:8080/quiz/addAnswers/" + quizId,{
        method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body:JSON.stringify(answers)
    })
    const resBody = res.json();
    console.log(resBody);
    setQuestions(prevQuestions =>
      prevQuestions
        .map((q, i) => ({
          ...q,
          answer: questionsList[i].answer,
        }))
        .sort((a, b) => a.questionNum - b.questionNum)
    );
    setVisible(false);
  };

  return (
    <div className="bulk-update-container">
        <h1 className="bulk-update-title">Bulk Update Answers</h1>
        <ul className="bulk-update-list">
            {questionsList.map((question, index) => (
            <li key={index} className="bulk-update-item">
                <input
                className="bulk-update-input"
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
            </li>
            ))}
        </ul>
        <button className="bulk-update-button update-btn" onClick={updateAnswers}>
            Update
        </button>
        <button className="bulk-update-button cancel-btn" onClick={() => setVisible(false)}>
            Cancel
        </button>
    </div>
  );
};

export default AnswerInput;
