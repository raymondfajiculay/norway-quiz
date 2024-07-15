import { useContext, useState } from "react"
import {AppContext} from "../../Context/AppContext"
import { useNavigate, useParams } from "react-router-dom";

export default function Create() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useContext(AppContext);
    const [formData, setFormData] = useState({
        quiz_id: id,
        question_text: "",
        answer: "",
        explanation: ""
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch('/api/questions', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json()

        if(data.errors) {
            setErrors(data.errors);
        } else {
            navigate(`/quizzes/${id}`);
        }
    }


    return (
        <div className="container">
            <h1 className="title">Create a new question</h1>

            <form onSubmit={(e) => handleCreate(e)} className="w-1/2 mx-auto space-y-6">
                {/* Question Text */}
                <div>
                    <input 
                        type="text" 
                        name="question_text" 
                        placeholder="Question" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                        className="input-class"
                    />
                    {errors.question_text && <p className="error">{errors.question_text[0]}</p>}
                </div>

                {/* Answer */}
                <div className="flex gap-2">
                    <label>Answer: </label>
                    <input 
                        type="radio" 
                        id="tama" 
                        name="answer" 
                        value="Tama" 
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                    <label htmlFor="Tama">Tama</label>
                    <input 
                        type="radio" 
                        id="mali" 
                        name="answer" 
                        value="Mali" 
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                    <label htmlFor="mali">Mali</label>
                </div>

                {/* Explanation */}
                <div>
                    <textarea 
                        rows="6" 
                        name="explanation" 
                        placeholder="Explanation" 
                        value={formData.explanation} 
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        className="textarea-class"
                    />
                    {errors.explanation && <p className="error">{errors.explanation[0]}</p>}
                </div>

                <button type="submit" className="primary-btn">Create</button>
            </form>

        </div>
    )
}