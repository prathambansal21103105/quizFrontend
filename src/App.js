import Home from './components/Home';
import Search from './components/Search';
import RootLayout from './components/RootLayout';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Quiz from './components/Quiz';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile';
import ReviewGrid from './components/ReviewGrid';
import ResponseDashboard from './components/ResponseDashboard';


const App=()=>{

    const router=createBrowserRouter([
      {
        path:'/', 
        element:<RootLayout />, 
        children:[
          {index:true,path:'', element:<Home/>},
          {path:'login', element:<Login/>},
          {path:'signUp', element:<Register/>},
          {path:'searchQuiz',element:<Search/>},
          {path:'quiz',element:<Quiz/>},
          {path:'profile',element:<Profile/>},
          {path:'player/review',element:<Quiz/>},
          {path:'quiz/reviews',element:<ReviewGrid/>},
          {path:'quiz/responseDashboard', element:<ResponseDashboard/>}
        ]
      }
      
    ]);

    return <AuthProvider><RouterProvider router={router}/></AuthProvider>;
}

export default App;