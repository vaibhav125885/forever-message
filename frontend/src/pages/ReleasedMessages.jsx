import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function ReleasedMemories() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await apiRequest("/my-released-messages");
            setMessages(data || []);
        } catch (err) {
            setError(err.message || "Unable to load released memories.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">
                            MEMORIES THAT ARRIVED
                        </span>

                        <h1>Released Memories</h1>

                        <p>
                            Messages that have reached their release date.
                        </p>
                    </div>

                    <div className="profile-avatar">
                        ◷
                    </div>
                </header>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="loading-inline">
                        <div className="loader"></div>
                        <p>Loading released memories...</p>
                    </div>

                ) : messages.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ◷
                        </div>

                        <h3>No released memories</h3>

                        <p>
                            Your released memories will appear here
                            when they become available.
                        </p>

                    </div>

                ) : (

                    <div className="released-grid">

                        {messages.map((item) => (

                            <article
                                className="released-card"
                                key={item.id}
                            >

                                <div className="released-header">

                                    <div className="released-icon">
                                        ✉
                                    </div>

                                    <span className="message-status released">
                                        Released
                                    </span>

                                </div>

                                <span className="message-type-label">
                                    {item.release_type === "yearly"
                                        ? "YEARLY MEMORY"
                                        : "ONE-TIME MEMORY"}
                                </span>

                                <h2>
                                    {item.title}
                                </h2>

                                <div className="memory-content">
                                    {item.message}
                                </div>

                                <div className="released-footer">

                                    <span>
                                        Released on
                                    </span>

                                    <strong>
                                        {formatDate(item.released_at)}
                                    </strong>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </main>
        </div>
    );
}