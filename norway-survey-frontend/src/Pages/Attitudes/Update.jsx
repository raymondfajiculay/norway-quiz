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
        question_text: "",
    });

    const [errors, setErrors] = useState({});

    async function getInterventions() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/attitude/${id}`
        );
        const data = await res.json();

        if (res.ok) {
            setFormData({
                quiz_id: id,
                question_text: data.question_text,
            });
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/attitude/${id}`,
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
            <h1 className="title">Update Attitude</h1>

            <form
                onSubmit={(e) => handleUpdate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                <div>
                    <input
                        type="text"
                        name="attitude"
                        placeholder="Attitude"
                        value={formData.question_text}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                question_text: e.target.value,
                            })
                        }
                        className="input-class"
                    />
                    {errors.question_text && (
                        <p className="error">{errors.question_text[0]}</p>
                    )}
                </div>

                <button type="submit" className="primary-btn">
                    Update
                </button>
            </form>
        </div>
    );
}
