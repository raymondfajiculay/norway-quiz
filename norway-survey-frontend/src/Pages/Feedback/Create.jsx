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
        question_text: "",
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
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
            navigate(`/quiz/${slug}`);
        }
    }

    return (
        <div className="container">
            <h1 className="title">Create a new feedback</h1>

            <form
                onSubmit={(e) => handleCreate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                {/* Question Text */}
                <div>
                    <input
                        type="text"
                        name="question_text"
                        placeholder="Question"
                        value={formData.title}
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
                    Create
                </button>
            </form>
        </div>
    );
}
