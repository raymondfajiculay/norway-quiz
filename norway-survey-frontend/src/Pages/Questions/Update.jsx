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
        question_text: "",
        answer: "",
        explanation: "",
    });

    const [errors, setErrors] = useState({});

    async function getPost() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/questions/${id}`
        );
        const data = await res.json();

        if (res.ok) {
            setFormData({
                question_text: data.question_text,
                answer: data.answer,
                explanation: data.explanation,
            });
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(
            `https://games.ugatngkalusugan.org/public/api/questions/${id}`,
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
        getPost();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Update Question</h1>

            <form
                onSubmit={(e) => handleUpdate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                <div>
                    <input
                        type="text"
                        name="Question"
                        placeholder="Question"
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

                <div className="flex gap-2">
                    <label>Answer: </label>
                    <input
                        type="radio"
                        id="tama"
                        name="answer"
                        value="Tama"
                        checked={formData.answer === "Tama"} // Set checked based on formData.answer
                        onChange={(e) =>
                            setFormData({ ...formData, answer: e.target.value })
                        }
                    />
                    <label htmlFor="Tama">Tama</label>
                    <input
                        type="radio"
                        id="mali"
                        name="answer"
                        value="Mali"
                        checked={formData.answer === "Mali"} // Set checked based on formData.answer
                        onChange={(e) =>
                            setFormData({ ...formData, answer: e.target.value })
                        }
                    />
                    <label htmlFor="mali">Mali</label>
                </div>

                <div>
                    <textarea
                        rows="6"
                        name="explanation"
                        placeholder="Explanation"
                        value={formData.explanation}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                explanation: e.target.value,
                            })
                        }
                        className="textarea-class"
                    />
                    {errors.explanation && (
                        <p className="error">{errors.explanation[0]}</p>
                    )}
                </div>

                <button type="submit" className="primary-btn">
                    Update
                </button>
            </form>
        </div>
    );
}
