import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { logout } = useAuth();

    const menuItems = [
        { path: "/dashboard", icon: "⌂", label: "Dashboard" },
        { path: "/recipients", icon: "♡", label: "Recipients" },
        { path: "/messages", icon: "✉", label: "Legacy Messages" },
        { path: "/released", icon: "◷", label: "Released Memories" },
        { path: "/verification", icon: "✓", label: "Verification" },
        { path: "/profile", icon: "○", label: "Profile" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">F</div>
                <span>ForeverMessage</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button className="logout-button" onClick={logout}>
                <span>↪</span>
                Logout
            </button>
        </aside>
    );
}