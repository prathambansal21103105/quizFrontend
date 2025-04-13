import React, { useState } from 'react';
import './QuestionsPerPageInput.css'; // <-- Import this CSS file
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const QuestionsPerPageInput = ({ quizId, cancel }) => {
  const [inputs, setInputs] = useState([1]);

  const { user } = useContext(AuthContext);

  const handleChange = (index, value) => {
    const updated = [...inputs];
    updated[index] = Number(value);
    setInputs(updated);
  };

  const addPage = () => {
    setInputs([...inputs, 1]);
  };

  const removePage = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const defaultHandler = (e) =>{
    e.preventDefault();
    generatePDF(0);
    cancel();
  }

  const customHandler = (e) =>{
    e.preventDefault();
    generatePDF(1);
    cancel();
  }

  const cancelHandler = () => {
    cancel();
  }

  const generatePDF = async(flag) => {
    try {
        let reqObj={flag:0, questionsPerPage:[]};
        if(flag === 1){
            reqObj={flag:1, questionsPerPage:inputs};
        }
        const res = await fetch(`http://localhost:8080/quiz/generate-pdf/${quizId}`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqObj)
        });
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

  return (
    <form className="questions-per-page-form">
      <h2>Set Custom Format</h2>
      <button type="submit" onClick={cancelHandler} className="button1">Close</button>
      {inputs.map((val, idx) => (
        <div key={idx} className="page-input-row">
          <label>Page {idx + 1}:</label>
          <input
            type="number"
            value={val}
            min={1}
            onChange={(e) => handleChange(idx, e.target.value)}
            required
          />
          {inputs.length > 1 && (
            <button
              type="button"
              onClick={() => removePage(idx)}
              className="remove-btn"
              title="Remove page"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="button-group">
        <button type="button" onClick={addPage} className="add-btn">+ Add Page</button>
        <button type="submit" onClick={defaultHandler} className="submit-btn-default">Normal Layout</button>
        <button type="submit" onClick={customHandler} className="submit-btn">Use Custom Layout</button>
      </div>
    </form>
  );
};

export default QuestionsPerPageInput;
