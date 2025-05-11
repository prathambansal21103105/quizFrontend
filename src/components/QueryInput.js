import React, { useState } from "react";
import "./QueryInput.css";

const QueryInput = ({ onPost }) => {
  const [comment, setComment] = useState("");

  const handlePost = () => {
    if (comment.trim() !== "") {
      onPost(comment);
      setComment("");
    }
  };

  return (
    <div className="comment-box-container">
      <textarea
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your query and mention question numbers..."
      />
      <button className="buttonEdit" onClick={handlePost}>
        Post
      </button>
    </div>
  );
};

export default QueryInput;
