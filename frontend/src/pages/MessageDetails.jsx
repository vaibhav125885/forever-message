import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function MessageDetails() {
    const { messageId } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadMessage();
    }, [messageId]);

    const loadMessage = async () => {
        try {
            setLoading(true);

            const data = await apiRequest(
                `/legacy-messages/${messageId}`
            );

            setMessage(data);
        } catch (err) {
            setError(
                err.message || "Unable to load this message."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Opening your memory...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">
                            LEGACY MESSAGE
                        </span>

                        <h1>Message Details</h1>

                        <p>
                            View the complete message and its
                            delivery information.
                        </p>
                    </div>

                    <div className="profile-avatar">
                        ✉
                    </div>
                </header>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {message && (
                    <section className="message-details-card">

                        <div className="details-top">
                            <div className="details-icon">
                                ✉
                            </div>

                            <span
                                className={`message-status ${
                                    message.is_released
                                        ? "released"
                                        : "scheduled"
                                }`}
                            >
                                {message.is_released
                                    ? "Released"
                                    : "Scheduled"}
                            </span>
                        </div>

                        <span className="message-type-label">
                            {message.release_type === "yearly"
                                ? "YEARLY MEMORY"
                                : "ONE-TIME MEMORY"}
                        </span>

                        <h2>{message.title}</h2>

                        <div className="full-message">
                            {message.message}
                        </div>

                        <div className="message-meta-grid">

                            <div className="message-meta-item">
                                <span>RELEASE DATE</span>
                                <strong>
                                    {formatDate(
                                        message.release_date
                                    )}
                                </strong>
                            </div>

                            <div className="message-meta-item">
                                <span>RELEASE TYPE</span>
                                <strong>
                                    {message.release_type === "yearly"
                                        ? "Every Year"
                                        : "One Time"}
                                </strong>
                            </div>

                            <div className="message-meta-item">
                                <span>CREATED ON</span>
                                <strong>
                                    {formatDate(
                                        message.created_at
                                    )}
                                </strong>
                            </div>

                            <div className="message-meta-item">
                                <span>RELEASED ON</span>
                                <strong>
                                    {message.released_at
                                        ? formatDate(
                                              message.released_at
                                          )
                                        : "Not released yet"}
                                </strong>
                            </div>

                        </div>

                        <div className="details-actions">
                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/messages")
                                }
                            >
                                ← Back to Messages
                            </button>

                            {!message.is_released && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            `/messages?edit=${message.id}`
                                        )
                                    }
                                >
                                    Edit Message
                                </button>
                            )}
                        </div>

                    </section>
                )}

            </main>
        </div>
    );
}