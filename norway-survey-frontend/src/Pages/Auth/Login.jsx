import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "post",
            body: JSON.stringify(formData),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        // Set error if or save the data to localstorage and context
        if (data.errors) {
            setErrors(data.errors);
        } else {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            navigate("/");
        }
    }
    return (
        <>
            <div className="flex flex-col justify-center items-center mt-10">
                <h1 className="title">Login to your account</h1>

                <form
                    className="w-1/2 mx-auto space-y-6"
                    onSubmit={handleLogin}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                        {errors.email && (
                            <p className="error">{errors.email[0]}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                        {errors.password && (
                            <p className="error">{errors.password[0]}</p>
                        )}
                    </div>
                    <button className="primary-btn">Login</button>
                </form>
            </div>
        </>
    );
}
