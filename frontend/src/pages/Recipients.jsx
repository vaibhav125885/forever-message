import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api/api";

export default function Recipients() {
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [relation, setRelation] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadRecipients();
    }, []);

    const loadRecipients = async () => {
        try {
            setLoading(true);

            const data = await apiRequest("/recipients");

            setRecipients(data || []);
        } catch (error) {
            setError(error.message || "Unable to load recipients.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setRelation("");
        setDateOfBirth("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !relation.trim()) {
            setError("Name and relation are required.");
            return;
        }

        try {
            setSaving(true);

            const data = await apiRequest("/recipients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim() || null,
                    relation: relation.trim(),
                    date_of_birth: dateOfBirth || null,
                }),
            });

            setRecipients((prev) => [...prev, data]);

            setSuccess("Recipient added successfully.");

            resetForm();
            setShowForm(false);

        } catch (error) {
            setError(error.message || "Unable to add recipient.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">

                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <span className="eyebrow">
                            YOUR PEOPLE
                        </span>

                        <h1>Recipients</h1>

                        <p>
                            Manage the people who will receive your memories.
                        </p>
                    </div>

                    <button
                        className="primary-button header-action"
                        onClick={() => {
                            setShowForm(!showForm);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {showForm ? "Close" : "+ Add Recipient"}
                    </button>
                </header>

                {/* Messages */}
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

                {/* Add Form */}
                {showForm && (
                    <section className="recipient-form-card">

                        <div className="section-heading">
                            <span className="card-label">
                                NEW RECIPIENT
                            </span>

                            <h2>Add someone special</h2>

                            <p>
                                Add the person who may receive your future memories.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Full name *</label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Rahul Singh"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Relation *</label>

                                    <select
                                        value={relation}
                                        onChange={(e) =>
                                            setRelation(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select relation
                                        </option>

                                        <option value="Son">
                                            Son
                                        </option>

                                        <option value="Daughter">
                                            Daughter
                                        </option>

                                        <option value="Father">
                                            Father
                                        </option>

                                        <option value="Mother">
                                            Mother
                                        </option>

                                        <option value="Brother">
                                            Brother
                                        </option>

                                        <option value="Sister">
                                            Sister
                                        </option>

                                        <option value="Spouse">
                                            Spouse
                                        </option>

                                        <option value="Friend">
                                            Friend
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="recipient@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date of birth</label>

                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) =>
                                            setDateOfBirth(e.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Adding..."
                                        : "Add Recipient"
                                    }
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* Recipients */}
                <section className="recipients-section">

                    <div className="section-heading">
                        <span className="card-label">
                            YOUR RECIPIENTS
                        </span>

                        <h2>
                            {recipients.length}{" "}
                            {recipients.length === 1
                                ? "person"
                                : "people"}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="loading-inline">
                            <div className="loader"></div>
                            <p>Loading recipients...</p>
                        </div>
                    ) : recipients.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ♡
                            </div>

                            <h3>No recipients yet</h3>

                            <p>
                                Add someone special to start creating
                                memories for them.
                            </p>

                            <button
                                className="primary-button"
                                onClick={() => setShowForm(true)}
                            >
                                + Add First Recipient
                            </button>

                        </div>

                    ) : (

                        <div className="recipients-grid">

                            {recipients.map((recipient) => (

                                <div
                                    className="recipient-card"
                                    key={recipient.id}
                                >

                                    <div className="recipient-top">

                                        <div className="recipient-avatar">
                                            {recipient.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <div>
                                            <h3>
                                                {recipient.name}
                                            </h3>

                                            <span className="relation-badge">
                                                {recipient.relation}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="recipient-details">

                                        {recipient.email && (
                                            <div>
                                                <span>Email</span>
                                                <strong>
                                                    {recipient.email}
                                                </strong>
                                            </div>
                                        )}

                                        {recipient.date_of_birth && (
                                            <div>
                                                <span>Date of birth</span>
                                                <strong>
                                                    {recipient.date_of_birth}
                                                </strong>
                                            </div>
                                        )}

                                    </div>

                                    <div className="recipient-card-footer">
                                        <span>
                                            Recipient #{recipient.id}
                                        </span>
                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>
        </div>
    );
}