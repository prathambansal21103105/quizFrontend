import React from 'react';
import './ReviewGrid.css';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

const ReviewGrid = () => {
  const location = useLocation();
  const [reviewList, setReviewList] = useState(location.state?.reviewList || []);
//   const { user } = useContext(AuthContext);

  const handleResolve = async(playerId, reviewRequestId) => {
    const res = await fetch("http://localhost:8080/reviewRequest/"+reviewRequestId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${user.token}`
        },
    });
    if(res.ok){
        const updatedList = reviewList.filter(review => review.playerId !== playerId);
        setReviewList(updatedList);
    }
  };

  return (
    <div className="review-grid-container">
      <p className='heading'>Review Requests</p>
      <table className="review-grid-table">
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Marked Responses</th>
            <th>Description</th>
            <th>Resolve</th>
          </tr>
        </thead>
        <tbody>
          {reviewList.map((review, idx) => (
            <tr key={idx} className="review-row">
              <td>{review.playerId}</td>
              <td>
                <ul className="marked-responses">
                  {review.markedResponses.map((response, index) => (
                    <li key={index} className="marked-response-item">
                      {response}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{review.description}</td>
              <td>
                <button
                  className='resolve'
                  onClick={() => handleResolve(review.playerId,review.reviewRequestId)}
                >
                  Mark as resolved
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewGrid;
