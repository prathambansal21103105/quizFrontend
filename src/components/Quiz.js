import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Question from "./Question";
import AddQuestion from './AddQuestion';
import AnswerInput from './AnswerInput';

const Quiz = () => {
    const location = useLocation();
    let quiz = location.state?.quiz;
    const quizId = quiz?.id; // Unique identifier for the quiz
    const [create,setCreate] = useState(false);
    const [quizTitle, setQuizTitle] = useState(() => localStorage.getItem(`quiz_${quizId}_title`) || quiz.title);
    const [courseCode, setCourseCode] = useState(() => localStorage.getItem(`quiz_${quizId}_courseCode`) || quiz.courseCode);
    const [course, setCourse] = useState(() => localStorage.getItem(`quiz_${quizId}_course`) || quiz.course);
    const [maxMarks, setMaxMarks] = useState(() => localStorage.getItem(`quiz_${quizId}_maxMarks`) || quiz.maxMarks);
    const [editAble, setEditAble] = useState(false);
    const [visible, setVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
    }

    const createQuestionTrigger=()=>{
        setCreate(true);
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
    }, [questions, quizId]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_title`, quizTitle);
    }, [quizTitle, quizId]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_courseCode`, courseCode);
    }, [courseCode, quizId]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_course`, course);
    }, [course, quizId]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizId}_maxMarks`, maxMarks);
    }, [maxMarks, quizId]);


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

    const generateResults = async() => {
        try{
            const res1 = await fetch(`http://localhost:8080/quiz/evaluate/${quizId}`);
            console.log(res1);
            const res = await fetch(`http://localhost:8080/quiz/generate-csv/${quizId}`);
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
      
    return (
        <main>
            <div className="quizContainer">
            <p className="heading">Quiz</p>
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
                <button className="buttonEdit" onClick={submitHandler}>{!editAble? `Edit`:`Save`}</button>
                <button className="buttonEdit" onClick={()=>setVisible((state) => !state)}>Update Answers</button>
                </div>
            </div>
            <div>
            {visible && <AnswerInput questions={questions} setQuestions={setQuestions} setVisible={setVisible} quizId={quizId}/>}
            {!visible && <ul>
                {questions.map((question) => (
                    <li className="questionList" key={question.id}>
                        <Question questionData={question} updateQuestion={updateQuestion} deleteQuestion={deleteQuestion} addQuestion={addQuestion} quizId={quizId}/>
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
            {!visible &&
            <div>
            <button className="button1" onClick={createQuestionTrigger}>Add Question</button>
            <button className="button2" onClick={generatePDF}>Generate PDF</button>
            <input
                type="file"
                className="custom-file-input"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button className="button5" onClick={registerResponses}>Register Responses</button>
            <button className="button4" onClick={generateResults}>Generate Results</button>
            </div>
            }
            </div>
            </div>
        </main>
    );
};

export default Quiz;
