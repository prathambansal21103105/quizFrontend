import { useReducer } from 'react';
import AppContext from './app-context';

const defaultQuestions=[
    {title:'Longest Increasing Subsequence',url:'https://leetcode.com/problems/longest-increasing-subsequence/description/',checked:false,id:1,key:1},
    {title:'Knapsack Problem',url:'https://leetcode.com/problems/partition-equal-subset-sum/description/',checked:true,id:2,key:2},
    {title:'Matrix chain multiplication',url:'https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1',checked:false,id:3,key:3},
    {title:'Climbing Stairs',url:'https://leetcode.com/problems/climbing-stairs/description/',checked:true,id:4,key:4},
    {title:'Arithmetic Slices II - Subsequence',url:'https://leetcode.com/problems/arithmetic-slices-ii-subsequence/description/?envType=daily-question&envId=2024-01-07',checked:true,id:5}
]

export const defaultAppState={
    username:"",
    password:"",
    status:false,
    completed:[],
    favorites:[],
    questions:defaultQuestions,
}

const appReducer=(state,action)=>{
    if(action.type==='COMPLETE'){

    }
    if(action.type==='FAVORITE'){
    }
    return defaultAppState;
}

const AppProvider=(props)=>{
    const [appState,dispatchAppAction]=useReducer(appReducer,defaultAppState);

    const addItemToCompletedHandler=(item)=>{
        dispatchAppAction({type:'COMPLETE',item:item})
    }

    const addItemToFavoritesHandler=(item)=>{
        dispatchAppAction({type:'FAVORITE',item:item})
    }

    const appContext={
        username:appState.username,
        password:appState.password,
        completed:appState.completed,
        favorites:appState.favorites,
        questions:appState.questions,
        status:false,
        addToCompleted:addItemToCompletedHandler,
        addToFavorites:addItemToFavoritesHandler,
    }

    return(
        <AppContext.Provider value={appContext}>
            {props.children}
        </AppContext.Provider>
    );

}

export default AppProvider;