import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function Update() {
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

    async function getInterventions() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/interventions/${id}`
        );
        const data = await res.json();

        if (res.ok) {
            setFormData({
                quiz_id: id,
                link: data.link,
                start_time: data.start_time,
            });
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/interventions/${id}`,
            {
                method: "put",
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

    useEffect(() => {
        getInterventions();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Update Intervention</h1>

            <form
                onSubmit={(e) => handleUpdate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                <div>
                    <input
                        type="text"
                        name="link"
                        placeholder="Link"
                        value={formData.link}
                        onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                        }
                        className="input-class"
                    />
                    {errors.link && <p className="error">{errors.link[0]}</p>}
                </div>

                <div>
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
                    Update
                </button>
            </form>
        </div>
    );
}
