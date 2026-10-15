import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function Dashboard() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [recipients, setRecipients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [releasedMessages, setReleasedMessages] = useState([]);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [
                profileData,
                recipientsData,
                messagesData,
                activityData,
            ] = await Promise.all([
                apiRequest("/profile"),
                apiRequest("/recipients"),
                apiRequest("/legacy-messages"),
                apiRequest("/activity"),
            ]);

            setProfile(profileData);
            setRecipients(recipientsData || []);
            setMessages(messagesData || []);
            setActivity(activityData);

            // Released API ko separately call kar rahe hain.
            // Backend me issue hua to dashboard break nahi hoga.
            try {
                const releasedData = await apiRequest("/my-released-messages");
                setReleasedMessages(releasedData || []);
            } catch (error) {
                console.log("Released messages unavailable:", error);
                setReleasedMessages([]);
            }

        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading your memories...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main">

                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">
                            YOUR MEMORY SPACE
                        </span>

                        <h1>
                            Welcome, {profile?.name || "there"}
                        </h1>

                        <p>
                            Keep the moments that matter, close to forever.
                        </p>
                    </div>

                    <div className="profile-avatar">
                        {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </header>

                {/* Welcome Card */}
                <section className="welcome-card">
                    <div>
                        <span className="card-label">
                            FOREVERMESSAGE
                        </span>

                        <h2>
                            Preserve something meaningful.
                        </h2>

                        <p>
                            Create a message for someone special
                            and choose when it should be remembered.
                        </p>

                        <button
                            className="primary-button dashboard-action"
                            onClick={() => navigate("/messages")}
                        >
                            Create a Legacy Message
                        </button>
                    </div>

                    <div className="welcome-symbol">
                        ♡
                    </div>
                </section>

                {/* Stats */}
                <section className="stats-grid">

                    <div
                        className="stat-card clickable-card"
                        onClick={() => navigate("/recipients")}
                    >
                        <span>Recipients</span>

                        <strong>
                            {recipients.length}
                        </strong>

                        <small>
                            People you care about
                        </small>
                    </div>

                    <div
                        className="stat-card clickable-card"
                        onClick={() => navigate("/messages")}
                    >
                        <span>Scheduled</span>

                        <strong>
                            {messages.filter(
                                (message) => !message.is_released
                            ).length}
                        </strong>

                        <small>
                            Memories waiting
                        </small>
                    </div>

                    <div
                        className="stat-card clickable-card"
                        onClick={() => navigate("/released")}
                    >
                        <span>Released</span>

                        <strong>
                            {releasedMessages.length}
                        </strong>

                        <small>
                            Memories delivered
                        </small>
                    </div>

                </section>

                {/* Activity */}
                <section className="profile-status">

                    <div>
                        <span className="card-label">
                            ACCOUNT STATUS
                        </span>

                        <h3>
                            {profile?.status || "ACTIVE"}
                        </h3>

                        <p>
                            {activity
                                ? `Last activity: ${activity.days_inactive} day(s) ago.`
                                : "Your ForeverMessage account is currently active."
                            }
                        </p>
                    </div>

                    <span className="status-pill">
                        {activity?.verification_status || "active"}
                    </span>

                </section>

                {/* Quick Overview */}
                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <span className="card-label">
                                QUICK OVERVIEW
                            </span>

                            <h2>Your memory space</h2>
                        </div>
                    </div>

                    <div className="overview-grid">

                        <div className="overview-card">
                            <div className="overview-icon">♡</div>

                            <div>
                                <strong>
                                    {recipients.length}
                                </strong>

                                <p>
                                    Recipient{recipients.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">✉</div>

                            <div>
                                <strong>
                                    {messages.length}
                                </strong>

                                <p>
                                    Legacy message{messages.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">◷</div>

                            <div>
                                <strong>
                                    {releasedMessages.length}
                                </strong>

                                <p>
                                    Released memor{releasedMessages.length !== 1 ? "ies" : "y"}
                                </p>
                            </div>
                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}