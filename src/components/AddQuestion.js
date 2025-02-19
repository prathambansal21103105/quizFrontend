import { useState } from "react";

const AddQuestion = ({ questionData, setEdit, updateQuestion, setCreate, createQuestion, addQuestion }) => {
    const [questionNum, setQuestionNum] = useState(questionData.questionNum);
    const [question, setQuestion] = useState(questionData.question);
    const [marks, setMarks] = useState(questionData.marks);
    const [options, setOptions] = useState(questionData.options);
    const [image, setImage] = useState(questionData.image);  // base64 string for image
    const [correctAnswer, setCorrectAnswer] = useState(questionData.answer);

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Extract base64 part (after 'data:image/png;base64,')
                setImage(base64String);  // Save the base64 string to the state
            };
            reader.readAsDataURL(file); // Converts the file to base64 format
        }
    };

    const saveHandler = async () => {
        // console.log(questionData);
        let updatedQuestion = {
            ...questionData,
            questionNum,
            question,
            marks,
            options,
            image: null,
            // image,  // Sending the base64-encoded image
            answer: correctAnswer,
        };
        console.log(updatedQuestion);
        if(createQuestion){
            const res = await fetch("http://localhost:8080/questions/" + createQuestion, {
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
            // console.log(resBody);
            addQuestion(updatedQuestion);
            setCreate(false);
        }
        else{
            const res = await fetch("http://localhost:8080/questions/update/" + questionData.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedQuestion),
            });

            const resBody = res.text();
            console.log(resBody); // Log the response from the backend
            updateQuestion(updatedQuestion);
            setEdit(false); // Close the edit mode
        }
    };

    return (
        <div style={styles.container}>
            {/* <h2 style={styles.heading}>Edit Question</h2> */}

            <label style={styles.label}>Question Number:</label>
            <input
                style={styles.input}
                type="number"
                value={questionNum}
                onChange={(e) => setQuestionNum(e.target.value)}
            />

            <label style={styles.label}>Question:</label>
            <input
                style={styles.input}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <label style={styles.label}>Upload Image:</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.inputFile}
            />
            {image && (
                <img
                    src={`data:image/png;base64,${image}`} // Display base64 image
                    alt="Preview"
                    style={styles.imagePreview}
                />
            )}

            <label style={styles.label}>Options:</label>
            {options.map((option, index) => (
                <input
                    key={index}
                    style={styles.input}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                />
            ))}

            <label style={styles.label}>Correct Answer:</label>
            <input
                style={styles.input}
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
            />

            <label style={styles.label}>Marks:</label>
            <input
                style={styles.input}
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
            />

            <div style={styles.buttonContainer}>
                <button style={styles.saveButton} onClick={saveHandler}>
                    Save
                </button>
                <button
                    style={styles.cancelButton}
                    onClick={() => {
                        if(setEdit){
                            setEdit(false);
                        }
                        if(setCreate){
                            setCreate(false);
                        }
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// Styling for a clean UI
const styles = {
    container: {
        width: "100%",
        margin: "auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    },
    heading: {
        textAlign: "center",
        fontSize: "22px",
        marginBottom: "15px",
        color: "#333",
    },
    label: {
        fontWeight: "bold",
        marginTop: "10px",
        display: "block",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
    },
    inputFile: {
        marginTop: "5px",
    },
    imagePreview: {
        width: "100%",
        maxHeight: "150px",
        objectFit: "cover",
        marginTop: "10px",
        borderRadius: "5px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "15px",
    },
    saveButton: {
        padding: "10px 15px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    cancelButton: {
        padding: "10px 15px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default AddQuestion;
