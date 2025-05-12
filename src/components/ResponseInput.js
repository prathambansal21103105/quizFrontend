import React, { useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";

const ResponseInput = ({ questionLength, setResponseVisible, quizId, setUpdateResponseVisible }) => {
  const [responseList, setResponseList] = useState([]);
  // const { user } = useContext(AuthContext);
  const [sid, setSid] = useState("21103000");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initialResponses = Array(questionLength).fill(0);
    setResponseList(initialResponses);
  }, [questionLength]);

  const handleResponseChange = (index, value) => {
    const updatedResponses = [...responseList];
    updatedResponses[index] = value;
    setResponseList(updatedResponses);
  };

  const addResponse = async () => {
    let data= { playerId:sid, quizId, markedResponses:responseList, score };
    console.log("Submitting responses:", data);
    const res = await fetch("http://localhost:8080/playerResponse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const resBody=res.text();
    console.log(resBody);
    setResponseVisible(false);
  };

  const updateResponse = async () => {
    let data= { playerId:sid, quizId, markedResponses:responseList, score };
    console.log("Submitting responses:", data);
    const res = await fetch("http://localhost:8080/playerResponse", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const resBody=res.text();
    console.log(resBody);
    setUpdateResponseVisible(false);
  };

  return (
    <div className="bulk-update-container">
      {setResponseVisible && <h1 className="bulk-update-title">Add Response for a player</h1>}
      {setUpdateResponseVisible && <h1 className="bulk-update-title">Update Response for a player</h1>}
      
      <div className="inline">
        {"SID :"} 
        <input
          className="bulk-update-input-1"
          value={sid}
          onChange={(e) => setSid(e.target.value)}
        />
      </div>

      <ul className="bulk-update-list">
        {responseList.map((response, index) => (
          <li key={index} className="bulk-update-item">
            <div className="widthCustom">{index + 1}{"."}</div> 
            <input
              className="bulk-update-input"
              value={response}
              onChange={(e) => handleResponseChange(index, e.target.value)}
            />
          </li>
        ))}
      </ul>

      <div className="inline">
        {"Score:"} 
        <input
          className="bulk-update-input-1"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>

      {setResponseVisible && <button className="bulk-update-button update-btn" onClick={addResponse}>
        Register response
      </button>}
      {setUpdateResponseVisible && <button className="bulk-update-button update-btn" onClick={updateResponse}>
        Update response
      </button>}
      <button className="bulk-update-button cancel-btn" onClick={() => setResponseVisible(false)}>
        Cancel
      </button>
    </div>
  );
};

export default ResponseInput;


/*
const addResponse = async() => {
    const res = await fetch("http://localhost:8080/playerResponse/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
    });
    
  }
*/