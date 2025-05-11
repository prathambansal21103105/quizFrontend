import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Question from "./Question";
import AddQuestion from './AddQuestion';
import AnswerInput from './AnswerInput';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import QuestionsPerPageInput from "./QuestionsPerPageInput";
import ResponseInput from "./ResponseInput";
import QueryInput from "./QueryInput";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const location = useLocation();
    const [count,setCount] = useState(0);
    let quiz = location.state?.quiz;
    let readOnly = location.state?.readOnly;
    let markedResponses = location.state?.markedResponses;
    let score = location.state?.score;
    const quizId = quiz?.id; // Unique identifier for the quiz
    const [create,setCreate] = useState(false);
    const [quizTitle, setQuizTitle] = useState(() => localStorage.getItem(`quiz_${quizId}_title`) || quiz.title);
    const [courseCode, setCourseCode] = useState(() => localStorage.getItem(`quiz_${quizId}_courseCode`) || quiz.courseCode);
    const [course, setCourse] = useState(() => localStorage.getItem(`quiz_${quizId}_course`) || quiz.course);
    const [maxMarks, setMaxMarks] = useState(() => localStorage.getItem(`quiz_${quizId}_maxMarks`) || quiz.maxMarks);
    const [evaulationMode, setEvaluationMode] = useState(() => localStorage.getItem(`quiz_${quizId}_evaluationMode`) || quiz.evaluationMode);
    const [editAble, setEditAble] = useState(false);
    const [visible, setVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useContext(AuthContext);
    const [customFormat, setCustomFormat] = useState(false);
    const [responseVisible, setResponseVisible] = useState(false);
    const readOnlyFlag = readOnly? readOnly:false;
    const scoredMarks = score? score:0;
    const navigate = useNavigate();
    // console.log(quiz);
    // Load questions from localStorage or quiz data
    const [questions, setQuestions] = useState(() => {
        const savedQuestions = localStorage.getItem(`quiz_${quizId}_questions`);
        if (savedQuestions) {
            return JSON.parse(savedQuestions).sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum));
        }
        return quiz?.questions ? [...quiz.questions].sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum)) : [];
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    const registerResponses = async() => {
        console.log(quizId);
        if (!selectedFile) {
            alert("Please select a PDF file first.");
            return;
          }
      
          const formData = new FormData();
          formData.append("pdf_file", selectedFile);
      
          try {
            const response = await fetch("http://127.0.0.1:5000/process_pdf/" + quizId, {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            console.log("Server Response:", result);
          } catch (error) {
            console.error("Error uploading file:", error);
          }
          alert("Responses saved");
    }

    const createQuestionTrigger=()=>{
        setCreate(true);
    }

    const customHandler = () => {
        setCustomFormat((state)=> !state);
    }

    const submitHandler=async()=>{
        if(editAble){
            try{
                let updatedQuiz = {
                    title:quizTitle,
                    course,
                    courseCode,
                    maxMarks
                }
                const res=await fetch("http://localhost:8080/quiz/update/" + quiz.id,{
                    method:"POST",
                      headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${user.token}`,
                      },
                      body:JSON.stringify(updatedQuiz)
                  })
                //   const resBody=await res.json();
                  console.log(res);
                  quiz.title = quizTitle;
                  quiz.course = course;
                  quiz.courseCode = courseCode;
                  quiz.maxMarks = maxMarks;
            }
            catch(e){
                console.log(e);
            }
        }
        setEditAble((state) => !state);
    }

    // Save questions to localStorage whenever they change
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem(`quiz_${quizId}_questions`, JSON.stringify(questions));
        }
    }, [questions, quizId, count]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_title`, quizTitle);
    }, [quizTitle, quizId, count]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_courseCode`, courseCode);
    }, [courseCode, quizId, count]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_course`, course);
    }, [course, quizId, count]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_maxMarks`, maxMarks);
    }, [maxMarks, quizId, count]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_evaluationMode`, evaulationMode);
    }, [evaulationMode, quizId, count]);


    // Function to update a question inside the list
    const updateQuestion = (updatedQuestion) => {
        setCount((state)=> state+1);
        setQuestions((prevQuestions) => {
            const updatedList = prevQuestions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            );
            return updatedList.sort((a, b) => parseInt(a.questionNum) - parseInt(b.questionNum)); // Keep sorted
        });
    };

    const addQuestion = (newQuestion) => {
        setCount((state)=> state+1);
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

    const toggleMode = async() => {
        try{
            const res = await fetch(`http://localhost:8080/quiz/toggleMode/${quizId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const data = res.text();
            console.log(data);
            setEvaluationMode(state => !state);
        }
        catch(error){
            console.log("Failed to toggle evaluation mode!");
        }
    }

    const generateResults = async() => {
        try{
            const res1 = await fetch(`http://localhost:8080/quiz/evaluate/${quizId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            console.log(res1);
            const res = await fetch(`http://localhost:8080/quiz/generate-csv/${quizId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            if (!res.ok) {
                throw new Error("Failed to download file");
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `quiz_responses_${quizId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        catch(error){
            console.error("Error downloading file:", error);
        }
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

    const handleQuery = async(query)=>{
        console.log(query);
        const body = {
            description:query,
            quizId:quizId,
            email:user.email,
        }
        console.log(body);
        const res = await fetch("http://localhost:8080/reviewRequest/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(body),
        });
        if(res.ok){
            const id = await res.json();
            console.log(id);
        }
    }

    const fetchReviews = async() => {
        const res = await fetch("http://localhost:8080/quiz/reviewRequests/" + quizId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
        });
        const data = await res.json();
        console.log(data);
        navigate("/quiz/reviews", { state: { reviewList: data } });
    }
      
    return (
        <main>
            <div className="quizContainer">
            {/* <div className="center"> */}
                <div className="flex">
                <div className="first">
                    {<p className="heading">Quiz {quizId}</p>}
                </div>
                <div className="secondTitle">
                {!readOnlyFlag && <div className="box">
                   <div className="titleMode"> Evaluation Mode</div>
                {!readOnlyFlag && <div className="buttonDiv">
                    <button onClick={toggleMode} className={`evaluation-button ${evaulationMode ? "green" : "red"}`}>{evaulationMode ? "On": "Off"}</button>
                </div>}
                {!readOnlyFlag && <div className="buttonDiv">
                    <button onClick={fetchReviews} className={`evaluation-button black`}>{"Review Requests"}</button>
                </div>}
                {!readOnlyFlag && <div className="buttonDiv">
                    <button className={`evaluation-button white`}>{"Fetch Player Responses"}</button>
                </div>}
                </div>}
                </div>
                </div>
            {/* </div> */}
            <h1 className="quizTitle">
                {editAble? <input
                    type="name"
                    placeholder="Quiz Title"
                    className="invisibleh1"
                    value={quizTitle}
                    onChange={(e)=>{setQuizTitle(e.target.value)}}
                /> : <div className="invisibleh1">{quizTitle}</div> }
            </h1>
            <div className="quizDetails">
            
                <div className="head">
                    <div className="firstHalf">
                    <div className="innerDiv">
                    <strong>Course:</strong> 
                    </div>
                    </div>
                    <span className="secondHalf">
                    {editAble? <input
                        type="name"
                        placeholder="Course Name"
                        className="invisible"
                        value={course}
                        onChange={(e)=>{setCourse(e.target.value)}}
                    />: `  ${course}`}
                    </span>
                </div>
                <div className="head">
                    <div className="firstHalf">
                    <div className="innerDiv">
                    <strong>Course Code:</strong> 
                    </div>
                    </div>
                    <span className="secondHalf">
                    {editAble? <input
                        type="name"
                        placeholder="Course Code"
                        className="invisible"
                        value={courseCode}
                        onChange={(e)=>{setCourseCode(e.target.value)}}
                    />: ` ${courseCode}`}
                    </span>
                </div>
                <div className="head">
                    <div className="firstHalf">
                    <div className="innerDiv">
                    <strong>Max Marks:</strong> 
                    </div>
                    </div>
                    <span className="secondHalf">
                    {editAble? <input
                        type="name"
                        placeholder="Max Marks"
                        className="invisible"
                        value={maxMarks}
                        onChange={(e)=>{setMaxMarks(Number(e.target.value))}}
                    />: ` ${maxMarks}`}
                    </span>
                </div>
                <div className="spanDiv">
                {!readOnlyFlag &&
                <button className="buttonEdit" onClick={submitHandler}>{!editAble? `Edit`:`Save`}</button>}
                {!readOnlyFlag &&
                <button className="buttonEdit" onClick={()=> {setVisible((state) => !state); setResponseVisible(false); }}>Update Answers</button>}
                {!readOnlyFlag &&
                <button className="buttonEdit" onClick={()=> {setResponseVisible((state) => !state); setVisible(false); }}>Add Response</button>}

                </div>
            </div>
            {readOnlyFlag && <p className="heading1">Your Marked Responses, toggle for correct answer!</p>}
            <div>
            {visible && <AnswerInput questions={questions} setQuestions={setQuestions} setVisible={setVisible} quizId={quizId}/>}
            {responseVisible && <ResponseInput questionLength={questions.length} quizId={quizId} setResponseVisible={setResponseVisible}/>}
            {!visible && !responseVisible && <ul>
                {questions.map((question, index) => (
                    <li className="questionList" key={question.id}>
                        {!readOnlyFlag && <Question questionData={question} updateQuestion={updateQuestion} deleteQuestion={deleteQuestion} addQuestion={addQuestion} quizId={quizId} count={count}/>}
                        {readOnlyFlag && <Question questionData={question} updateQuestion={updateQuestion} deleteQuestion={deleteQuestion} addQuestion={addQuestion} quizId={quizId} count={count} readOnlyFlag={readOnlyFlag} markedAnswer={markedResponses? markedResponses[index]: 0}/>}
                    </li>
                ))}
                {create &&
                    <li className="questionList"> 
                        <div className="modalDiv">
                            <AddQuestion setCreate={setCreate} createQuestion={quizId} addQuestion={addQuestion} questionData={sampleQuestion}/>
                        </div>
                    </li>
                }
            </ul>}
            {!visible && !responseVisible &&
            <div>
            {!readOnlyFlag && <button className="button1" onClick={createQuestionTrigger}>Add Question</button>}
            {!readOnlyFlag && <button className="button2" onClick={customHandler}>Generate PDF</button>}
            {customFormat && <QuestionsPerPageInput quizId={quizId} cancel={customHandler}/>}
            {!readOnlyFlag && <input
                type="file"
                className="custom-file-input"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
            />}
            {!readOnlyFlag && <button className="button5" onClick={registerResponses}>Register Responses</button>}
            {!readOnlyFlag && <button className="button4" onClick={generateResults}>Generate Results</button>}
            </div>
            }
            {readOnlyFlag && <p className="bold">Your Score: {scoredMarks}</p>}
            {readOnlyFlag && <QueryInput onPost={handleQuery}/>}
            </div>
            </div>
        </main>
    );
};

export default Quiz;
