import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
    const { user, token, setUser, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate("/");
        } else {
            const data = await res.json();
            console.error("Logout failed:", data.message);
        }
    }

    return (
        <>
            {user ? (
                <header>
                    <nav>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                        <div className="flex items-center space-x-4">
                            <p className="text-slate-400 text-xs">
                                Welcome back {user.name}
                            </p>

                            <form onSubmit={handleLogout}>
                                <button className="nav-link">Logout</button>
                            </form>
                        </div>
                    </nav>
                </header>
            ) : null}
            <main>
                <Outlet />
            </main>
        </>
    );
}
