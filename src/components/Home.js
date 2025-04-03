import { useState, useEffect, useContext } from "react";
import QuizCard from "./QuizCard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [quizes, setQuizes] = useState([]);
  const navigate = useNavigate();
  const { user, fetchAuthorByEmail } = useContext(AuthContext);

  useEffect(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("quiz_")) {
        localStorage.removeItem(key);
      }
    });

    if (user) {
      if (user.role === "AUTHOR") {
        fetchQuizes();
      }
    }
  }, [user]);

  const fetchQuizes = async () => {
    if (!user) return;

    try {
      const author = await fetchAuthorByEmail(user.email, user.token);
      const quizList = author?.quizzes || [];
      console.log(quizList);
      setQuizes(quizList);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const createQuizHandler = async () => {
    const data = {
      title: "Sample Quiz Title",
      course: "",
      courseCode: "",
      maxMarks: 0,
    };

    try {
      const res = await fetch("http://localhost:8080/quiz/" + user.email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      });

      const resBody = await res.json();
      console.log(resBody);
      setQuizes((prevQuizes) => [...prevQuizes, resBody]);
      navigate("/quiz", { state: { quiz: resBody } });

    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  return (
    <>
      <main>
        <p className="heading">Quizzes</p>
        <button className="button" onClick={createQuizHandler}>Create a quiz</button>
        <ul className="quizList">
          {quizes.length > 0 && quizes.map((quiz) => <li key={quiz.id}><QuizCard quiz={quiz} /></li>)}
        </ul>
      </main>
    </>
  );
};

export default Home;
