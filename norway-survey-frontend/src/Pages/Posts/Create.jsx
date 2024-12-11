import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        body: "",
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
            method: "post",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
        } else {
            navigate("/");
        }
    }

    return (
        <div className="container">
            <h1 className="title">Create a new post</h1>

            <form
                onSubmit={(e) => handleCreate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Post Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="input-class"
                    />
                    {errors.title && <p className="error">{errors.title[0]}</p>}
                </div>

                <div>
                    <textarea
                        rows="6"
                        name="body"
                        placeholder="Post Body"
                        value={formData.body}
                        onChange={(e) =>
                            setFormData({ ...formData, body: e.target.value })
                        }
                        className="textarea-class"
                    />
                    {errors.body && <p className="error">{errors.body[0]}</p>}
                </div>

                <button type="submit" className="primary-btn">
                    Create
                </button>
            </form>
        </div>
    );
}
