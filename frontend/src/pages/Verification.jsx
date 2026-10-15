import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function Verification() {
    const [status, setStatus] = useState(null);
    const [activity, setActivity] = useState(null);
    const [recipients, setRecipients] = useState([]);

    const [recipientId, setRecipientId] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadVerification();
    }, []);

    const loadVerification = async () => {
        try {
            const [statusData, activityData, recipientsData] =
                await Promise.all([
                    apiRequest("/verification-status"),
                    apiRequest("/activity"),
                    apiRequest("/recipients"),
                ]);

            setStatus(statusData);
            setActivity(activityData);
            setRecipients(recipientsData || []);

        } catch (err) {
            setError(err.message || "Unable to load verification status.");
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!recipientId) {
            setError("Please select a recipient.");
            return;
        }

        try {
            setSending(true);

            await apiRequest("/verification-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient_id: Number(recipientId),
                }),
            });

            setSuccess(
                "Verification request sent successfully."
            );

            setRecipientId("");

            await loadVerification();

        } catch (err) {
            setError(err.message || "Unable to send request.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Checking verification status...</p>
            </div>
        );
    }

    const currentStatus =
        status?.status || "active";

    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">
                            ACCOUNT SAFETY
                        </span>

                        <h1>Verification</h1>

                        <p>
                            Manage your ForeverMessage verification status.
                        </p>
                    </div>

                    <div className="profile-avatar">
                        ✓
                    </div>
                </header>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-box">
                        {success}
                    </div>
                )}

                <section className="verification-card">

                    <div className="verification-icon">
                        ✓
                    </div>

                    <div className="verification-content">

                        <span className="card-label">
                            CURRENT STATUS
                        </span>

                        <h2>
                            {currentStatus}
                        </h2>

                        <p>
                            Your account verification status is currently
                            <strong> {currentStatus}</strong>.
                        </p>

                    </div>

                    <span className="status-pill">
                        {currentStatus}
                    </span>

                </section>

                <section className="activity-card">

                    <div>
                        <span className="card-label">
                            ACTIVITY
                        </span>

                        <h2>
                            {activity?.days_inactive ?? 0} days inactive
                        </h2>

                        <p>
                            Last login:{" "}
                            {activity?.last_login
                                ? new Date(
                                    activity.last_login
                                ).toLocaleString("en-IN")
                                : "Not available"}
                        </p>
                    </div>

                </section>

                {currentStatus === "verification_required" && (

                    <section className="verification-request-card">

                        <span className="card-label">
                            VERIFICATION REQUEST
                        </span>

                        <h2>
                            Request verification
                        </h2>

                        <p>
                            Select the recipient who should review
                            your verification request.
                        </p>

                        <form onSubmit={sendRequest}>

                            <div className="form-group">
                                <label>
                                    Select recipient
                                </label>

                                <select
                                    value={recipientId}
                                    onChange={(e) =>
                                        setRecipientId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select recipient
                                    </option>

                                    {recipients.map((recipient) => (
                                        <option
                                            key={recipient.id}
                                            value={recipient.id}
                                        >
                                            {recipient.name} —{" "}
                                            {recipient.relation}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="primary-button"
                                type="submit"
                                disabled={sending}
                            >
                                {sending
                                    ? "Sending..."
                                    : "Send Verification Request"}
                            </button>

                        </form>

                    </section>

                )}

            </main>
        </div>
    );
}