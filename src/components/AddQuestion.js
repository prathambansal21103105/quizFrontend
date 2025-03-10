import { useState,useEffect } from "react";

const replaceGreekCommands = (input) => {
    console.log(input);
    const symbolMap = {
        // Greek Letters
        "//alpha": "α", "//beta": "β", "//gamma": "γ", "//delta": "δ",
        "//epsilon": "ε", "//zeta": "ζ", "//eta": "η", "//theta": "θ",
        "//iota": "ι", "//kappa": "κ", "//lambda": "λ", "//mu": "μ",
        "//nu": "ν", "//xi": "ξ", "//omicron": "ο", "//pi": "π",
        "//rho": "ρ", "//sigma": "σ", "//tau": "τ", "//upsilon": "υ",
        "//phi": "φ", "//chi": "χ", "//psi": "ψ", "//omega": "ω",

        // Mathematical Symbols
        "//sum": "∑",         // Summation
        "//prod": "∏",        // Product
        "//int": "∫",         // Integral
        "//contourint": "∮",  // Contour Integral
        "//deriv": "d/dx",    // Derivative
        "//partialderiv": "∂/∂x"  // Partial Derivative
    };

    return input.replace(/\/\/[a-z]+/g, match => symbolMap[match] || match);
}

const AddQuestion = ({ questionData, setEdit, updateQuestion, setCreate, createQuestion, addQuestion }) => {
    const [questionNum, setQuestionNum] = useState(questionData.questionNum);
    const [question, setQuestion] = useState(questionData.question);
    const [marks, setMarks] = useState(questionData.marks);
    const [options, setOptions] = useState(questionData.options);
    const [imageId, setImageId] = useState(questionData.imageId);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(questionData.answer);
    const uploadImage = async () => {
        try {
            let formData = new FormData();
            formData.append("file", imageFile);
    
            const response = await fetch(`http://localhost:8080/question-images`, {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }
    
            console.log("Image uploaded successfully!");
            return await response.text();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    useEffect(() => {
        if (imageId) {
            fetch(`http://localhost:8080/question-images/${questionData.imageId}`)
                .then(response => response.blob())
                .then(blob => {
                    if (blob.size > 0) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImage(reader.result);
                        reader.readAsDataURL(blob);
                    }
                })
                .catch(err => console.error("Error fetching image:", err));
        }
    }, [createQuestion, questionData.id]);

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file); // Store the file for sending to backend
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const saveHandler = async () => {
        // console.log(questionData);
        let initialQuestion = question;
        let initialOptions = options;
        console.log(initialOptions);
        let newQuestion = replaceGreekCommands(initialQuestion);
        let newOptions = initialOptions.map(option => replaceGreekCommands(option));
        // let newOptions = replaceGreekCommands(initialOptions);
        console.log(newQuestion);
        // console.log(newOptions);
        let updatedQuestion = {
            ...questionData,
            questionNum,
            question: newQuestion,
            marks,
            options: newOptions,
            // image,  // Sending the base64-encoded image
            answer: correctAnswer,
        };
        console.log(updatedQuestion);
        
        if(createQuestion){
            if(imageFile){
                let imageId1 = await uploadImage();
                updatedQuestion.imageId = imageId1;
            }
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
            console.log(updatedQuestion);
            addQuestion(updatedQuestion);
            setCreate(false);
        }
        else{
            if(imageFile){
                let imageId1 = await uploadImage();
                updatedQuestion.imageId = imageId1;
            }
            const res = await fetch("http://localhost:8080/questions/update/" + questionData.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedQuestion),
            });

            const resBody = res.text();
            console.log(resBody); // Log the response from the backend
            console.log(updatedQuestion);
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
            <input type="file" accept="image/*" onChange={handleImageChange} style={styles.inputFile} />
            {image && <img src={image} alt="Preview" style={styles.imagePreview} />}

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
        backgroundColor: "rgb(84 107 105)",
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
        backgroundColor: "rgb(74 125 63)",
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
