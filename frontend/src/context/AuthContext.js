// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext(null); //Explicitly set null

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider is rendering"); //Add log

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider useEffect triggered"); //Add Log
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                    });
                    setIsAuthenticated(true);
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    try {
                        const docSnap = await getDoc(userDocRef);

                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            setDeviceId(userData.deviceId || null);
                        } else {
                            console.log("No such document!");
                            setDeviceId(null);
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }

                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setDeviceId(null);
                }
            } catch (error) {
                console.error("Error in onAuthStateChanged:", error);
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = () => {
        return signOut(auth) // Return the promise
            .then(() => {
                setUser(null);
                setIsAuthenticated(false);
                setDeviceId(null);
            })
            .catch((error) => {
                console.error("Error signing out:", error);
                alert("Error signing out: " + error.message);
                throw error; // Re-throw the error to be handled in component
            });
    };

    const value = {
        user,
        isAuthenticated,
        deviceId,
        isLoading,
        setUser,
        setIsAuthenticated,
        setIsLoading,
        setDeviceId,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {console.log("AuthProvider rendering children")}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    console.log("useAuth hook called"); // Add log
    return useContext(AuthContext);
};