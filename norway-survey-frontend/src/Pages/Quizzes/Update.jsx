import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Create() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState({
        slug: "",
        title: "",
        description: "",
        status: "",
    });

    const [errors, setErrors] = useState({});

    async function getQuiz() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/quizzes/${slug}`
        );

        const data = await res.json();

        if (data.quiz) {
            setFormData({
                slug: data.quiz.slug,
                title: data.quiz.title,
                description: data.quiz.description,
                status: data.quiz.status,
            });
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/quizzes/${slug}`,
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
            navigate(`/quiz/${formData.slug}`);
        }
    }

    useEffect(() => {
        getQuiz();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Update Quiz Information</h1>

            <form
                onSubmit={(e) => handleUpdate(e)}
                className="w-1/2 mx-auto space-y-6"
            >
                {/* Title */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="input-class"
                    />
                    {errors.title && <p className="error">{errors.title[0]}</p>}
                </div>

                {/* Slug */}
                <div>
                    <input
                        type="text"
                        name="slug"
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                        }
                        className="input-class"
                    />
                    {errors.slug && <p className="error">{errors.slug[0]}</p>}
                </div>

                {/* Description */}
                <div>
                    <textarea
                        rows="6"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="textarea-class"
                    />
                    {errors.description && (
                        <p className="error">{errors.description[0]}</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                        }
                        className="textarea-class"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Open">Open</option>
                    </select>
                    {errors.status && (
                        <p className="error">{errors.status[0]}</p>
                    )}
                </div>

                <button type="submit" className="primary-btn">
                    Update
                </button>
            </form>
        </div>
    );
}
