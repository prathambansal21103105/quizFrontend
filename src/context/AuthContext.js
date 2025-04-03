import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchAuthorByEmail = async (email, token) => {
        try {
            const res = await fetch(`http://localhost:8080/author/emailFetch/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!res.ok) {
                throw new Error("Failed to fetch author details");
            }
    
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching author:", error);
            return null;
        }
    };

    const fetchPlayerByEmail = async (email, token) => {
        try {
            const res = await fetch(`http://localhost:8080/player/emailFetch/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!res.ok) {
                throw new Error("Failed to fetch player details");
            }
    
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching player:", error);
            return null;
        }
    };

    const login = async(token, flag, email, password) => {
        const userData = { 
            token, 
            role: flag === 1 ? "AUTHOR" : "PLAYER", 
            email, 
            password
        };
        // if(flag === 1){
        //     const author = fetchAuthorByEmail(email,token);
        //     userData.id=author.id;
        //     userData.quizzes=author.quizzes;
        //     console.log(author);
        //     console.log(userData);
        // }
        // else{
        //     const player = fetchPlayerByEmail(email,token);
        //     userData.id=player.id;
        //     console.log(player);
        //     console.log(userData);
        // }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchAuthorByEmail, fetchPlayerByEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
