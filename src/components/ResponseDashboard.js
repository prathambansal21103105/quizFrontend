import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './ResponseDashboard.css';

const ResponseDashboard = () => {
    const location = useLocation();
    let responses = location.state?.responseList;
    let quizId = location.state?.quizId;
    const { user } = useContext(AuthContext);
    const maxQuestions = Math.max(...responses.map(r => r.markedResponses.length));
    const [data, setData] = useState(
        responses.map(r => ({
          ...r,
          markedResponses: Array.from({ length: maxQuestions }, (_, i) => r.markedResponses[i] || "0"),
          score: r.score || 0
        }))
      );
    const fetchData = async(quizId) => {
        const res = await fetch("http://localhost:8080/playerResponse/"+quizId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
        });
        const resBody = await res.json();
        return resBody;
    }
    const handleChange = (rowIndex, field, value, responseIndex = null) => {
        setData(prev => {
          const updated = [...prev];
          if (field === 'score') {
            updated[rowIndex].score = value;
          } else if (field === 'markedResponse') {
            updated[rowIndex].markedResponses[responseIndex] = value;
          }
          return updated;
        });
      };
      const updateResponse = async (id) => {
        let data1= { playerId:data[id].playerId, quizId, markedResponses:data[id].markedResponses, score:data[id].score };
        console.log("Submitting responses:", data1);
        const res = await fetch("http://localhost:8080/playerResponse", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data1),
        });
        const resBody=res.text();
        console.log(resBody);
      };

      const evaluate = async() => {
        const res1 = await fetch(`http://localhost:8080/quiz/evaluate/${quizId}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });
        console.log(res1);
        const resBody = await fetchData(quizId); 
        setData(resBody.map(r => ({
            ...r,
            markedResponses: Array.from({ length: maxQuestions }, (_, i) => r.markedResponses[i] || "0"),
            score: r.score || 0
        })));
      }

      const deleteResponse = async(id) => {
        const res = await fetch("http://localhost:8080/playerResponse/" + data[id].id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
        });
        if (res.ok) {
            const resBody = res.text();
            console.log(resBody);
            setData(prev =>
              prev.filter((_, i) => i !== id).map(({ id, ...rest }) => ({ ...rest }))
            );
          }
      }

    return (
    <main>
            <p className='heading'>Response Dashboard</p>
            <div className="table-container">
            <table className="response-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Player ID</th>
                    <th>Score</th>
                    {[...Array(maxQuestions)].map((_, i) => (
                    <th key={i}>Q{i + 1}</th>
                    ))}
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {data.map((res, rowIdx) => (
                    <tr key={res.id}>
                    <td>{rowIdx + 1}</td>
                    <td>{res.playerId}</td>
                    <td>
                        <input
                        type="number"
                        value={res.score}
                        onChange={e => handleChange(rowIdx, 'score', e.target.value)}
                        />
                    </td>
                    {[...Array(maxQuestions)].map((_, i) => (
                        <td key={i}>
                        <input
                            type="text"
                            value={res.markedResponses[i] || ''}
                            onChange={e =>
                            handleChange(rowIdx, 'markedResponse', e.target.value, i)
                            }
                        />
                        </td>
                    ))}
                    <td><button onClick={()=> updateResponse(rowIdx)} className="resolve1">Update</button></td>
                    <td><button onClick={()=> deleteResponse(rowIdx)} className="resolve2">Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <button onClick={evaluate} className="buttonEdit">Refresh</button>
    </main>
    );
}

export default ResponseDashboard;