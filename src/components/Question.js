import { useState,useEffect } from "react";
import AddQuestion from "./AddQuestion";

const Question = ({ questionData, updateQuestion, deleteQuestion, quizId, addQuestion }) => {
    const { questionNum, question, marks, options, image } = questionData;
    const [showAnswer, setShowAnswer] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [edit, setEdit] = useState(false);
    // console.log(questionData);
    // Function to get image source
    const getImageSrc = () => {
        if (image) {
            return image;  // Image should be base64 string or Blob
        }
        return null;
    };

    const deleteHandler=async()=>{
      const res = await fetch("http://localhost:8080/questions/" + questionData.id, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
      });
      console.log(res);
      deleteQuestion(questionData.id);
    }
    const handleDuplicate = async() => {
        const updatedQuestion = {
         ...questionData,
         questionNum:questionData.questionNum+1,
        }
        console.log(updatedQuestion);
        const res = await fetch("http://localhost:8080/questions/duplicate/" + quizId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedQuestion),
        });
        if (!res.ok) {
            throw new Error("Failed to add question");
        }
        const questionId = await res.text();
        updatedQuestion.id=questionId;
        addQuestion(updatedQuestion);
    }
    return (
        <div
            style={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!edit ? (
                <div>
                    <div style={styles.header}>
                        <div className="questionDes">
                        Q{questionNum}: {question}
                        </div>
                        <div style={isHovered ? styles.buttonsVisible : styles.buttonsHidden}>
                            <button className="duplicate1" onClick={handleDuplicate}>➕ Copy</button>
                            <button className="edit1" onClick={() => setEdit(true)}>✏️ Edit</button>
                            <button className="delete1" onClick={deleteHandler}>🗑️ Delete</button>
                        </div>
                    </div>

                    {getImageSrc() && (
                        <img
                            src={getImageSrc()}
                            alt="Question"
                            style={styles.imagePreview}
                        />
                    )}

                    <ul style={styles.optionsList}>
                        {options.map((option, index) => (
                            <li key={index} style={styles.option}>
                                {index + 1}. {option}
                            </li>
                        ))}
                    </ul>

                    <p><strong>Marks:</strong> {marks}</p>

                    <button className="answer1" onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                    </button>

                    {showAnswer && <p><strong>Answer:</strong> {questionData.answer}</p>}
                </div>
            ) : (
                <AddQuestion
                    questionData={questionData}
                    setEdit={setEdit}
                    updateQuestion={updateQuestion}
                />
            )}
        </div>
    );
};

const styles = {
    card: {
        padding: "16px",
        margin: "12px 0",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        width: "800px",
        transition: "box-shadow 0.3s ease-in-out",
        position: "relative",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #f1f1f1",
        paddingBottom: "8px",
        marginBottom: "10px",
    },
    imagePreview: {
        width: "100%",
        maxHeight: "200px",
        objectFit: "cover",
        marginTop: "10px",
        borderRadius: "5px",
        transition: "transform 0.3s ease-in-out",
    },
    optionsList: {
        listStyleType: "none",
        padding: "0",
    },
    option: {
        padding: "6px",
        backgroundColor: "#f9f9f9",
        marginBottom: "5px",
        borderRadius: "4px",
        overflow: "scroll",
        display: "flex",
        textAlign: "left",
    },
    buttonsVisible: {
        display: "flex",
        borderRadius: "4px",
        // opacity: 1,
        // transition: "opacity 0.3s ease-in-out",
    },
    buttonsHidden: {
        display: "flex",
        opacity: 0,
        borderRadius: "4px",
        // pointerEvents: "none",
        // transition: "opacity 0.3s ease-in-out",
    },
};

export default Question;
