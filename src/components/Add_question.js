import { useState } from "react";
import classes from "./AddQuestion.module.css"
import { use } from "react";

const AddQuestion = () => {
  const [questionNumber, setQuestionNumber] = useState("1");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [image, setImage] = useState(null);
  const [marks,setMarks] = useState(1);
  const [correctAnswer,setCorrectAnswer] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionNumber.trim() || !question.trim() || options.some(opt => !opt.trim()) || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }
    const formData = new FormData();
    const data = {
        questionNum:questionNumber,
        question,
        options,
        marks
    }
    formData.append("questionNumber", questionNumber);
    formData.append("question", question);
    options.forEach((opt, index) => formData.append(`option${index + 1}`, opt));
    formData.append("image", image);
    console.log(formData);

    // onSubmit((state) => {
    //     return [...state,formData];
    // });
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Add a Question</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="text"
          placeholder="Enter question number"
          value={questionNumber}
          onChange={(e) => setQuestionNumber(e.target.value)}
          className={classes.input}
          required
        />
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={classes.input1}
          required
        />
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className={classes.input}
            required
          />
        ))}
        <div className={classes.combo}>
        <input
          type="number"
          placeholder="Enter marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className={classes.input}
          required
        />
        <input
          type="text"
          placeholder="Enter correct answer"
          value={question}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className={classes.input1}
          required
        />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={classes.input}
          required
        />
        <button type="submit" className={classes.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
