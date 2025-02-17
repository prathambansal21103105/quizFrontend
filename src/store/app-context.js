import { createContext } from "react";

const AppContext=createContext({
  username:"",
  password:"",
  completed:[],
  favorites:[],
  questions:[],
  status:false,
  addToCompleted:(item)=>{},
  addToFavorites:(item)=>{},
})

export default AppContext;