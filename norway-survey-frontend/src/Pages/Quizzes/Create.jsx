import { useContext, useState } from "react"
import {AppContext} from "../../Context/AppContext"
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();
    const {token} = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Draft"
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch('/api/quizzes', {
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
            navigate('/');
        }
    }


    return (
        <div className="container">
            <h1 className="title">Create a new quiz</h1>

            <form onSubmit={(e) => handleCreate(e)} className="w-1/2 mx-auto space-y-6">
                {/* Title */}
                <div>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-class"
                    />
                    {errors.title && <p className="error">{errors.title[0]}</p>}
                </div>

                {/* Description */}
                <div>
                    <textarea 
                        rows="6" 
                        name="description" 
                        placeholder="Description" 
                        value={formData.body} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="textarea-class"
                    />
                    {errors.description && <p className="error">{errors.description[0]}</p>}
                </div>

                <button type="submit" className="primary-btn">Create</button>
            </form>

        </div>
    )
}