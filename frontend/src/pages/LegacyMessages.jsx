import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function LegacyMessages() { 

    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [releaseType, setReleaseType] = useState("one_time");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [messagesData, recipientsData] = await Promise.all([
                apiRequest("/legacy-messages"),
                apiRequest("/recipients"),
            ]);

            setMessages(messagesData || []);
            setRecipients(recipientsData || []);

        } catch (err) {
            setError(err.message || "Unable to load messages.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setRecipientId("");
        setReleaseDate("");
        setReleaseType("one_time");
        setEditingId(null);
    };

    const openCreateForm = () => {
        resetForm();
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const closeForm = () => {
        resetForm();
        setShowForm(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!recipientId || !title.trim() || !message.trim() || !releaseDate) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                const updated = await apiRequest(
                    `/legacy-messages/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: title.trim(),
                            message: message.trim(),
                        }),
                    }
                );

                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === editingId ? updated : item
                    )
                );

                setSuccess("Message updated successfully.");

            } else {
                const created = await apiRequest(
                    "/legacy-messages",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            recipient_id: Number(recipientId),
                            title: title.trim(),
                            message: message.trim(),
                            release_date: releaseDate,
                            release_type: releaseType,
                        }),
                    }
                );

                setMessages((prev) => [created, ...prev]);

                setSuccess("Legacy message created successfully.");
            }

            resetForm();
            setShowForm(false);

        } catch (err) {
            setError(err.message || "Unable to save message.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setTitle(item.title);
        setMessage(item.message);
        setRecipientId(String(item.recipient_id));
        setReleaseDate(item.release_date);
        setReleaseType(item.release_type);

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this legacy message?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await apiRequest(`/legacy-messages/${id}`, {
                method: "DELETE",
            });

            setMessages((prev) =>
                prev.filter((item) => item.id !== id)
            );

            setSuccess("Legacy message deleted successfully.");

        } catch (err) {
            setError(err.message || "Unable to delete message.");
        }
    };

    const getRecipientName = (recipientId) => {
        const recipient = recipients.find(
            (item) => item.id === recipientId
        );

        return recipient?.name || "Unknown recipient";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">

                {/* Header */}

                <header className="dashboard-header">

                    <div>
                        <span className="eyebrow">
                            YOUR WORDS
                        </span>

                        <h1>
                            Legacy Messages
                        </h1>

                        <p>
                            Write something today that can be remembered tomorrow.
                        </p>
                    </div>

                    <button
                        className="primary-button header-action"
                        onClick={() => {
                            if (showForm) {
                                closeForm();
                            } else {
                                openCreateForm();
                            }
                        }}
                    >
                        {showForm ? "Close" : "+ Create Message"}
                    </button>

                </header>

                {/* Error */}

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {/* Success */}

                {success && (
                    <div className="success-box">
                        {success}
                    </div>
                )}

                {/* Create / Edit Form */}

                {showForm && (
                    <section className="message-form-card">

                        <div className="section-heading">

                            <span className="card-label">
                                {editingId
                                    ? "EDIT MESSAGE"
                                    : "NEW LEGACY MESSAGE"}
                            </span>

                            <h2>
                                {editingId
                                    ? "Update your message"
                                    : "Create something meaningful"}
                            </h2>

                            <p>
                                Choose who should receive your message
                                and when it should be released.
                            </p>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="message-form-grid">

                                {/* Recipient */}

                                <div className="form-group">

                                    <label>
                                        Recipient *
                                    </label>

                                    <select
                                        value={recipientId}
                                        onChange={(e) =>
                                            setRecipientId(e.target.value)
                                        }
                                        disabled={!!editingId}
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

                                {/* Title */}

                                <div className="form-group">

                                    <label>
                                        Message title *
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. For your 18th birthday"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />

                                </div>

                                {/* Release Date */}

                                <div className="form-group">

                                    <label>
                                        Release date *
                                    </label>

                                    <input
                                        type="date"
                                        value={releaseDate}
                                        onChange={(e) =>
                                            setReleaseDate(e.target.value)
                                        }
                                        disabled={!!editingId}
                                    />

                                </div>

                                {/* Release Type */}

                                <div className="form-group">

                                    <label>
                                        Release type *
                                    </label>

                                    <select
                                        value={releaseType}
                                        onChange={(e) =>
                                            setReleaseType(e.target.value)
                                        }
                                        disabled={!!editingId}
                                    >

                                        <option value="one_time">
                                            One Time
                                        </option>

                                        <option value="yearly">
                                            Every Year
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* Message */}

                            <div className="form-group message-textarea-group">

                                <label>
                                    Your message *
                                </label>

                                <textarea
                                    rows="7"
                                    placeholder="Write your message here..."
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                />

                                <small>
                                    {message.length} characters
                                </small>

                            </div>

                            {/* Buttons */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Message"
                                            : "Create Message"}
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* Messages List */}

                <section className="messages-section">

                    <div className="section-heading">

                        <span className="card-label">
                            YOUR MESSAGES
                        </span>

                        <h2>
                            {messages.length}{" "}
                            {messages.length === 1
                                ? "message"
                                : "messages"}
                        </h2>

                    </div>

                    {loading ? (

                        <div className="loading-inline">
                            <div className="loader"></div>
                            <p>
                                Loading your messages...
                            </p>
                        </div>

                    ) : messages.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ✉
                            </div>

                            <h3>
                                No legacy messages yet
                            </h3>

                            <p>
                                Create your first message for someone
                                special.
                            </p>

                            <button
                                className="primary-button"
                                onClick={openCreateForm}
                            >
                                + Create First Message
                            </button>

                        </div>

                    ) : (

                        <div className="messages-list">

                            {messages.map((item) => (

                                <article
                                    className="message-card"
                                    key={item.id}
                                >

                                    <div className="message-card-header">

                                        <div>
                                            <span className="message-type-label">
                                                {item.release_type === "yearly"
                                                    ? "YEARLY MEMORY"
                                                    : "ONE-TIME MEMORY"}
                                            </span>

                                            <h3>
                                                {item.title}
                                            </h3>
                                        </div>

                                        <span
                                            className={
                                                item.is_released
                                                    ? "message-status released"
                                                    : "message-status scheduled"
                                            }
                                        >
                                            {item.is_released
                                                ? "Released"
                                                : "Scheduled"}
                                        </span>

                                    </div>

                                    <div className="message-recipient">

                                        <div className="small-avatar">
                                            {getRecipientName(
                                                item.recipient_id
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <span>
                                                For
                                            </span>

                                            <strong>
                                                {getRecipientName(
                                                    item.recipient_id
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="message-preview">

                                        {item.message}

                                    </div>

                                    <div className="message-card-footer">

                                        <div className="release-info">

                                            <span>
                                                Release date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    item.release_date
                                                )}
                                            </strong>

                                        </div>

                                        <div className="message-actions">

                                            {!item.is_released && (
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            <button
                                                className="view-button"
                                                onClick={() =>
                                                    navigate(`/messages/${item.id}`)
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>
        </div>
    );
}