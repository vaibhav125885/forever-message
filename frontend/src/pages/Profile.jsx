import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await apiRequest("/profile");
            setProfile(data);
        } catch (err) {
            setError(err.message || "Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return "Not available";

        return new Date(value).toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">ACCOUNT</span>
                        <h1>My Profile</h1>
                        <p>View your ForeverMessage account information.</p>
                    </div>

                    <div className="profile-avatar">
                        {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </header>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {profile && (
                    <>
                        {/* Profile Hero */}
                        <section className="profile-hero-card">
                            <div className="large-profile-avatar">
                                {profile.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="profile-hero-content">
                                <span className="card-label">
                                    FOREVERMESSAGE MEMBER
                                </span>

                                <h2>{profile.name}</h2>

                                <p>{profile.email}</p>

                                <span className="profile-status-badge">
                                    {profile.status || "ACTIVE"}
                                </span>
                            </div>
                        </section>

                        {/* Account Information */}
                        <section className="profile-info-card">
                            <div className="section-heading">
                                <div>
                                    <span className="card-label">
                                        ACCOUNT INFORMATION
                                    </span>

                                    <h2>Personal details</h2>

                                    <p>
                                        Your basic account information is shown below.
                                    </p>
                                </div>
                            </div>

                            <div className="profile-info-grid">

                                <div className="profile-info-item">
                                    <span>FULL NAME</span>
                                    <strong>{profile.name}</strong>
                                </div>

                                <div className="profile-info-item">
                                    <span>EMAIL ADDRESS</span>
                                    <strong>{profile.email}</strong>
                                </div>

                                <div className="profile-info-item">
                                    <span>ACCOUNT STATUS</span>
                                    <strong>
                                        {profile.status || "ACTIVE"}
                                    </strong>
                                </div>

                                <div className="profile-info-item">
                                    <span>LAST LOGIN</span>
                                    <strong>
                                        {formatDate(profile.last_login)}
                                    </strong>
                                </div>

                            </div>
                        </section>

                        {/* Security */}
                        <section className="profile-security-card">
                            <div>
                                <span className="card-label">
                                    ACCOUNT SECURITY
                                </span>

                                <h2>Session & security</h2>

                                <p>
                                    You are currently signed in to your
                                    ForeverMessage account.
                                </p>
                            </div>

                            <button
                                className="logout-profile-button"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </section>
                    </>
                )}

            </main>
        </div>
    );
}