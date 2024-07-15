import { useContext } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { AppContext } from "../Context/AppContext"

export default function Layout({hideHeader}) {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault()

        const res = await fetch('/api/logout', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`,

            },
        });

        if(res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate('/');
        } else {
            const data = await res.json();
            console.error('Logout failed:', data.message);
        }
    }

    return (
        <>
            <header className={hideHeader ? 'hidden' : ''}>
                <nav>
                    <Link to="/" className="nav-link">Home</Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <p className="text-slate-400 text-xs">Welcome back {user.name}</p>

                            <form onSubmit={handleLogout}>
                                <button className="nav-link">Logout</button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </>
    )
}