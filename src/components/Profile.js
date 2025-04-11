import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import QuizBarChart from "./QuizBarChart";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [player, setPlayer] = useState(null);
    const [author, setAuthor] = useState(null);
    const [name, setName] = useState("");
    const [branch, setBranch] = useState("");
    const [responses,setResponses] = useState([]);
    const [editAble,setEditAble] = useState(false);
    const submitHandler=async()=>{
        if(editAble){
            try{
                let updatedPlayer = {
                    ...player,
                    name:name,
                    branch:branch,
                }
                const res=await fetch("http://localhost:8080/player/" + player.id,{
                    method:"PUT",
                      headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${user.token}`,
                      },
                      body:JSON.stringify(updatedPlayer)
                  })
                //   const resBody=await res.json();
                  console.log(res);
                  setPlayer(updatedPlayer);
            }
            catch(e){
                console.log(e);
            }
        }
        setEditAble((state) => !state);
    }
    useEffect(() => {
        const loadFromStorage = () => {
            const cachedPlayers = Object.keys(localStorage)
                .filter(key => key.startsWith("player_profile_"))
                .map(key => JSON.parse(localStorage.getItem(key)));

            const cachedPlayer = cachedPlayers.find(p => p.email === user.email);
            if (cachedPlayer) setPlayer(cachedPlayer);
        };

        const loadAuthorFromStorage = () => {
            const cachedAuthors = Object.keys(localStorage)
                .filter(key => key.startsWith("author_profile_"))
                .map(key => JSON.parse(localStorage.getItem(key)));

            const cachedAuthor = cachedAuthors.find(p => p.email === user.email);
            if (cachedAuthor) setAuthor(cachedAuthor);
        };

        const fetchStats = async () => {
            try {
                const res = await fetch(`http://localhost:8080/player/emailFetch/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                console.log(data);
                const res1 = await fetch(`http://localhost:8080/player/stats/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data1 = await res1.json();
                console.log(data1);
                let data2=data1;
                for(let i=0;i<data2.length;i++){
                    data2[i].percentage=(data2[i].score*100)/data2[i].maxMarks;
                }
                setName(data.name);
                setPlayer(data);
                setResponses(data2);
                setBranch(data.branch);
                localStorage.setItem(`player_profile_${data.id}`, JSON.stringify(data));
                console.log("Fetched and stored player profile:", data);
            } catch (err) {
                console.error("Failed to fetch player stats:", err);
            }
        };

        const fetchAuthorData = async() => {
            try {
                const res = await fetch(`http://localhost:8080/author/emailFetch/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                console.log(data);
                setAuthor(data);
                console.log(data.quizzes);
                setResponses(data.quizzes);
                localStorage.setItem(`author_profile_${data.id}`, JSON.stringify(data));
                console.log("Fetched and stored author profile:", data);
            } catch (err) {
                console.error("Failed to fetch author data:", err);
            }
        }

        if (user?.role === "PLAYER") {
            loadFromStorage();
            if (!player) fetchStats();
        }
        if (user?.role === "AUTHOR") {
            loadAuthorFromStorage();
            if(!author) fetchAuthorData();
        }
    }, [user]);

    return (
        <main>
            <p className="heading">Profile</p>
            {player && (
                <div className="playerCard">
                    {/* {editAble && <h2 className="playerName">{name}</h2>} */}
                    {editAble? <input
                    type="name"
                    placeholder="Name"
                    className="invisibleh2"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                /> : <h2>{name}</h2> }
                    <p><strong>SID:</strong> {player.id}</p>
                    {editAble?  <div className="branch"><strong>Branch:</strong><input
                    type="name"
                    placeholder="Branch"
                    className="invisiblep"
                    value={branch}
                    onChange={(e)=>{setBranch(e.target.value)}}
                /></div>  : <p><strong>Branch:</strong> {branch}</p>}
                    <p><strong>Email:</strong> {player.email}</p>
                    <button className="buttonEdit" onClick={submitHandler}>{!editAble? `Edit`:`Save`}</button>
                </div>
            )}
            {author && <div className="playerCard">
                    <h2 className="playerName">{author.name}</h2>
                    <p><strong>Email:</strong> {author.email}</p>
                </div>}
            {player && 
             <div className="responsesContainer">
                <h2 className="heading">Recent Attempted Quizzes</h2>
                {responses && responses.length > 0 ? (
                    responses.map((response, index) => (
                        <div className="responseCard" key={index}>
                            <h3>{response.title}</h3> 
                            <p>{response.course}, {response.courseCode}</p>
                            <p><strong>Total Score:</strong> {response.score}</p>
                            <p><strong>Max Marks:</strong> {response.maxMarks}</p>
                            <p><strong>Percentage:</strong> {response.percentage}%</p>
                        </div>
                    ))
                ) : (
                    <p>No responses available.</p>
                )}
            </div>
            }
            {author && 
            <div className="responsesContainer">
                <h2 className="heading">Quizzes</h2>
                {responses && responses.length > 0 ? (
                    responses.map((response, index) => (
                        <div className="responseCard" key={index}>
                            <h3>{response.title}</h3> 
                            <p>{response.course}, {response.courseCode}</p>
                            <p><strong>Max Marks:</strong> {response.maxMarks}</p>
                        </div>
                    ))
                ) : (
                    <p>No responses available.</p>
                )}
        </div>
            }
            {player && responses.length > 0 && <QuizBarChart responses={responses} />}
        </main>
    );
};

export default Profile;
