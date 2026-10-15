import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await login(email, password);

            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-left">

                <div className="brand">
                    <div className="brand-icon">F</div>
                    <span>ForeverMessage</span>
                </div>

                <div className="auth-hero">
                    <span className="eyebrow">
                        PRESERVE WHAT MATTERS
                    </span>

                    <h1>
                        Some memories
                        <br />
                        deserve to live forever.
                    </h1>

                    <p>
                        Create meaningful messages today
                        that can be remembered and delivered
                        when they matter most.
                    </p>
                </div>

                <div className="auth-quote">
                    “A message can outlive a moment.”
                </div>

            </div>

            <div className="auth-right">

                <div className="auth-card">

                    <div className="mobile-brand">
                        <div className="brand-icon">F</div>
                        <span>ForeverMessage</span>
                    </div>

                    <div className="auth-heading">
                        <h2>Welcome back</h2>

                        <p>
                            Sign in to continue to your memories.
                        </p>
                    </div>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Email address</label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>Password</label>
                            </div>

                            <div className="password-input">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>
                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>

                    <div className="auth-footer">
                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create account
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}