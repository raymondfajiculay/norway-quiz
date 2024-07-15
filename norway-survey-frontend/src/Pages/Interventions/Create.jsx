import { useContext, useState } from "react"
import {AppContext} from "../../Context/AppContext"
import { useNavigate, useParams } from "react-router-dom";

export default function Create() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useContext(AppContext);
    const [formData, setFormData] = useState({
        quiz_id: id,
        link: "",
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch('/api/interventions', {
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
            <h1 className="title">Create a new interventions</h1>

            <form onSubmit={(e) => handleCreate(e)} className="w-1/2 mx-auto space-y-6">
                {/* Question Text */}
                <div>
                    <input 
                        type="text" 
                        name="link" 
                        placeholder="Video Link" 
                        value={formData.link} 
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="input-class"
                    />
                    {errors.link && <p className="error">{errors.link[0]}</p>}
                </div>
                <button type="submit" className="primary-btn">Create</button>
            </form>

        </div>
    )
}