import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import '../../styles.css';
import { toast } from 'react-toastify';  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setIsAuthenticated, setIsLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                setUser({
                    id: user.uid,
                    email: user.email,
                });
                setIsAuthenticated(true);

                if (userData.devices && userData.devices.length > 0) {
                    navigate('/'); // Redirect to dashboard if devices exist
                    toast.success("Login successful!");  // Success toast
                } else {
                    navigate('/select-device'); // Redirect to device selection page if no devices
                    toast.info("Please select a device to continue.");  // Info toast
                }
            } else {
                console.log("No such document!");
                toast.error("No such document!");  // Error toast
            }

        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed: " + error.message);  // Error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">
                  <span>Smart</span>Garden
                </h2>
                <h2 className="auth-title">Welcome Back to Smart Garden</h2>
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
                        {setIsLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;