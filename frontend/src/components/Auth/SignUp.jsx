import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import '../../styles.css';
import { toast } from 'react-toastify';  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoading, setUser, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a document in Firestore for the new user
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                email: email,
                devices: [], // Initialize an empty array for devices
            });

            setUser({
                id: user.uid,
                email: email,
            });
            setIsAuthenticated(true);
            navigate('/select-device'); // Redirect to the device selection page
            toast.success("Sign-up successful!");  // Success toast
        } catch (error) {
            console.error("Sign-up failed:", error);
            toast.error("Sign-up failed: " + error.message);  // Error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">Join Smart Garden Today!</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" disabled={setIsLoading} className={`auth-button ${setIsLoading ? 'auth-button-disabled' : ''}`}>
                        {setIsLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;