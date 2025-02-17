import {useState,useEffect} from 'react';
import Login from './components/Login';
import SignUp from './components/Signup';
import Home from './components/Home';
import Search from './components/Search';
import RootLayout from './components/RootLayout';
import AppProvider from './store/AppProvider';
import Add from './components/Add';
import Profile from './components/Profile';
import Loading from './components/Loading';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Quiz from './components/Quiz';
// import { useContext } from 'react';
// import AppContext from './store/app-context';
// import Navigation from './components/Navigation';

const App=()=>{
    const [users,setUsers]=useState([]);
    const [fetchedQuestions,setFetchedQuestions]=useState([]);
    const [user,setUser]=useState("");
    // const [loading,setLoading]=useState(false);
    const [leetData,setLeetData]=useState([]);
    const [codeData,setCodeData]=useState([]);
    const [cfData,setCfData]=useState([]);
    
    // const [profile,setProfile]=useState([]);
    const fetchUserProfie=async(username)=>{
      // const res=await fetch("https://leetcode-stats-api.herokuapp.com/"+username);
      const data={"username":username};
      console.log("username:",data);
      const res=await fetch("http://localhost:4000/fetchUserProfile",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
      })
      const resBody=await res.json();
      return resBody;
    }
    const fetchUserData=async()=>{
      const res=await fetch("http://localhost:4000/fetchUsers");
      const resBody=await res.json();
      const data=resBody.users;
      const usersList=[];
      // console.log("userData:");
      // console.log(data);
      for(const user in data){
        usersList.push(data[user]);
      }
      // console.log(usersList);
      setUsers(usersList);
    }
    const fetchQuestions=async()=>{
      const res=await fetch("http://localhost:4000/fetchQuestions");
      const resBody=await res.json();
      const data=resBody.questions;
      const questionsList=[];
      for(const question in data){
        questionsList.push(data[question]);
      }
      // console.log(questionsList);
      setFetchedQuestions(questionsList);
    }
    const getQuestion=async(question)=>{
      const res=await fetch("http://localhost:4000/createQuestions",{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(question)
      });
      const resData=await res.json();
      // console.log(resData);
      const questionsList=[];
      for(const question in resData.questions){
        questionsList.push(resData.questions[question]);
      }
      setFetchedQuestions(questionsList);
    }
    // const ctx=useContext(AppContext);
    // console.log(ctx.questions);
    // const [favs,setFavs]=useState([]);
    // const [status,setStatus]=useState(false);
    // const [isTouched,setIsTouched]=useState(false);
    // const [showLogin,setShowLogin]=useState(false);
    // const [showSignUp,setShowSignUp]=useState(false);
    
    // useEffect(() => {
    //   setUsers([]);
    //   const fetchUserData=async()=>{
    //     const res=await fetch("https://react-http-1df71-default-rtdb.firebaseio.com/users.json");
    //     if(!res.ok){
    //       throw new Error("Couldn't fetch Data!");
    //     }
    //     const data=await res.json();
  
    //     const usersList=[];
    //     for(const user in data){
    //       usersList.push(data[user]);
    //     }
    //     setUsers(usersList);
    //   }
    //   fetchUserData();
    // },[]);
    useEffect(() => {
      // setUsers([]);
      // setFetchedQuestions([]);
      // fetchUserData();
      // fetchQuestions();
    },[]);

    const verify=async(name,password)=>{
      for(const user of users){
        if(user["username"]===name.trim() && user["password"]===password.trim()){
          setUser(user);
          // console.log(user);
          let leetUser=user["leetcodeUsername"];
          let cfUser=user["codeforcesUsername"];
          console.log(leetUser);
          console.log(leetUser,cfUser);
          console.log(typeof leetUser);
          console.log(typeof cfUser);
          console.log(cfUser.length);
          if(cfUser.charAt(0)==='"'){
            cfUser=cfUser.slice(1,cfUser.length-1);
          }
          console.log(cfUser);
          const data=await fetchUserProfie(leetUser);
          let cfUrl="https://codeforces.com/api/user.info?handles="+cfUser+"&checkHistoricHandles=false";
          console.log(cfUrl);
          const res=await fetch("https://codeforces.com/api/user.info?handles="+cfUser+"&checkHistoricHandles=false");
          const resData=await res.json();
          let codeforcesUrl="https://codeforces.com/api/user.status?handle=";
          codeforcesUrl=codeforcesUrl+cfUser;
          console.log(codeforcesUrl);
          const resQ=await fetch(codeforcesUrl);
          const dataQ=await resQ.json();
          let totalSubmissions=dataQ["result"].length;
          let correctSubmissions=0;
          let cfData={};
          for(const question of dataQ["result"]){
            if(question["verdict"]==="OK"){
              correctSubmissions=correctSubmissions+1;
              // console.log(question);
              cfData[question["problem"]["name"]]=1;
            }
          }
          let questionsSolved=Object.entries(cfData).length;
          console.log(cfData);
          console.log(questionsSolved);
          console.log(correctSubmissions);
          console.log(totalSubmissions);
          console.log(resData);
          console.log(data);
          setLeetData(data);
          setCodeData(resData);
          setCfData({questionsSolved,correctSubmissions,totalSubmissions});
          // setProfile((state)=>{
          //   return {...state, leetCode:data};
          // })
          return true;
        }
      }
      return false;
    }

    // const addUser=async(name,password)=>{
    //   const data={"username":name.trim(),"password":password.trim()};
    //   const data1=users;
    //   data1.push(data);
    //   fetch("https://react-http-1df71-default-rtdb.firebaseio.com/users.json",{
    //     method:'PUT',
    //     body:JSON.stringify(data1)
    //   })
    //   setUsers((prev)=>{
    //     let prev1=prev;
    //     prev1.push(data);
    //     return prev1;
    //   })
    //   return true;
    // }
    const addUser=async(name,password,leetcode,codeforces)=>{
      const data={"username":name.trim(),"password":password.trim(),"favorites":[],"leetcodeUsername":leetcode.trim(),"codeforcesUsername":codeforces.trim()};
      const res=await fetch("http://localhost:4000/create",{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
      })
      const resData=await res.json();
      // console.log(resData);
      if(resData.msg){
        console.log("already exists!");
      }
      else{
        const usersList=[];
        for(const user in resData.users){
          usersList.push(resData.users[user]);
        }
        setUsers(usersList);
      }
      return true;
    }

    const addTofav=async(question,flag)=>{
      let newList=[];
      if(flag===0){
        const newList1=user["favorites"];
        console.log("question:",question);
        console.log("newList1:",newList1);
        for(const fav of newList1){
          console.log("fav:",fav);
          if(fav["link"]===question["link"]){
            console.log("Not Added:");
            return false;
          }
        }
        newList1.push(question);
        newList=newList1;
      }
      else{
        const newList1=user["favorites"].filter((fav)=>{
          return fav["link"]!==question["link"];
        });
        console.log(newList1);
        newList=newList1;
      }
      const data={};
      data.id=user["id"];
      data.favs=newList;
      console.log(data);
      // setLoading(true);
      const res=await fetch("http://localhost:4000/favs",{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
      })
      const resBody=await res.json();
      console.log("resBody");
      console.log(resBody);
      setUsers(resBody["items"]);
      setUser(resBody["user"]);
      // setLoading(false);
      return true;
    }

    const reset=()=>{
      setUser("");
    }

    const router=createBrowserRouter([
      {
        path:'/', 
        element:<RootLayout />, 
        children:[
          {index:true,path:'', element:<Home clickHandler={addTofav} items={fetchedQuestions} user={user} reset={reset}/>},
          // {path:'login', element:<Login onSubmit={verify} user={user} reset={reset}/>},
          // {path:'signUp', element:<SignUp onSubmit={addUser} user={user} reset={reset}/>},
          // {path:'favs', element:<Favorites items={user["favorites"]} user={user} reset={reset} clickHandler={addTofav}/>},
          // {path:'contribute',element:<Add onSubmit={getQuestion} user={user} reset={reset}/>},
          // {path:'profile',element:<Profile user={user} reset={reset} leetData={leetData} codeData={codeData} cfData={cfData}/>},
          // {path:'loading',element:<Loading user={user} reset={reset}/>},
          {path:'searchQuiz',element:<Search/>},
          {path:'createQuiz',element:<Add/>},
          {path:'quiz',element:<Quiz/>}
        ]
      }
      
    ]);

    return <AppProvider><RouterProvider router={router}/></AppProvider>;
}

export default App;