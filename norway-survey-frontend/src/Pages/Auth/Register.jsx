import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Register() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});

    function validateEmail(email) {
        const emailDomain = "@rootsofhealth.org";
        return email.endsWith(emailDomain);
    }

    async function handleRegister(e) {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Email validation
        if (!validateEmail(formData.email)) {
            setErrors({ email: ["Email must end with @rootsofhealth.org"] });
            return;
        }

        // Password matching validation
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: ["Passwords do not match"] });
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

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
                <h1 className="title">Register a new user</h1>

                <form
                    className="w-1/2 mx-auto space-y-6"
                    onSubmit={handleRegister}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                        {errors.name && (
                            <p className="error">{errors.name[0]}</p>
                        )}
                    </div>
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
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.password_confirmation}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password_confirmation: e.target.value,
                                })
                            }
                        />
                        {errors.password_confirmation && (
                            <p className="error">
                                {errors.password_confirmation[0]}
                            </p>
                        )}
                    </div>

                    <button className="primary-btn">Create</button>
                </form>
            </div>
        </>
    );
}
