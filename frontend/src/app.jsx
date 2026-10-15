import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipients from "./pages/Recipients";
import ProtectedRoute from "./components/ProtectedRoute";
import LegacyMessages from "./pages/LegacyMessages";
import Verification from "./pages/Verification";
import ReleasedMessages from "./pages/ReleasedMessages";
import Profile from "./pages/Profile";
import MessageDetails from "./pages/MessageDetails";
function SimplePage(
    { title, description }) {
    return (
        <div className="dashboard-page">
            <main className="dashboard-main">
                <div className="welcome-card">
                    <div>
                        <span className="card-label">
                            FOREVERMESSAGE
                        </span>

                        <h2>{title}</h2>

                        <p>{description}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recipients"
                        element={
                            <ProtectedRoute>
                                <Recipients />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recipients"
                        element={
                            <ProtectedRoute>
                                <SimplePage
                                    title="Recipients"
                                    description="Manage the people who will receive your memories."
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <LegacyMessages />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/:messageId"
                        element={
                            <ProtectedRoute>
                                <MessageDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/released"
                        element={
                            <ProtectedRoute>
                                <ReleasedMessages />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/verification"
                        element={
                            <ProtectedRoute>
                                <Verification />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;