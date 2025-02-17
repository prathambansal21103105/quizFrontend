const Question = ({questionData}) => {
    const { questionNum, question, marks, options, image } = questionData;

  // Convert byte[] image to Base64
  const getImageSrc = () => {
    if (image) {
      return `data:image/png;base64,${btoa(
        new Uint8Array(image).reduce((data, byte) => data + String.fromCharCode(byte), "")
      )}`;
    }
    return null;
  };
  console.log("questionData");
  console.log(questionData);
  return (
    <div className="question-card">
    <main>
      <h3>Question {questionNum}</h3>
      <p>{question}</p>
      {getImageSrc() && <img src={getImageSrc()} alt="Question" className="question-image" />}
      <ul>
        {options.map((option, index) => (
          <li key={index}>{index + 1}. {option}</li>
        ))}
      </ul>
      <p><strong>Marks:</strong> {marks}</p>
      </main>
    </div>
  );
}
export default Question;