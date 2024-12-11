import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function Create() {
    const { slug } = useParams();
    const location = useLocation();
    const id = location.state?.id;
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState({
        quiz_id: id,
        link: "",
        start_time: "",
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/interventions`,
            {
                method: "post",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
        } else {
            navigate(`/quiz/${slug}`);
        }
    }

    return (
        <div className="container">
            <h1 className="title">Create a new interventions</h1>

            <form
                onSubmit={(e) => handleCreate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                {/* Question Text */}
                <div>
                    <input
                        type="text"
                        name="link"
                        placeholder="Video Link"
                        value={formData.link}
                        onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                        }
                        className="input-class mb-5"
                    />

                    <input
                        type="number"
                        name="number"
                        placeholder="Start time in seconds"
                        value={formData.start_time}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                start_time: e.target.value,
                            })
                        }
                        className="input-class mb-5"
                    />
                    {errors.start_time && (
                        <p className="error">{errors.start_time[0]}</p>
                    )}
                </div>
                <button type="submit" className="primary-btn">
                    Create
                </button>
            </form>
        </div>
    );
}
