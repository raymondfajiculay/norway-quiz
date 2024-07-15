import { useContext, useEffect, useState } from "react"
import {AppContext} from "../../Context/AppContext"
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useContext(AppContext);
    const [formData, setFormData] = useState({
        link: ""
    });

    const [errors, setErrors] = useState({});

    async function getInterventions() {
        const res = await fetch(`/api/interventions/${id}`);
        const data = await res.json();

        if(res.ok) {
            setFormData({
                'link': data.link
            });
        }
    }


    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/interventions/${id}`, {
            method: 'put',
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

    useEffect(() => {
        getInterventions()
    }, [])

    return (
        <div className="container">
            <h1 className="title">Update Intervention</h1>

            <form onSubmit={(e) => handleUpdate(e)} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input 
                        type="text" 
                        name="link" 
                        placeholder="Link" 
                        value={formData.link} 
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="input-class"
                    />
                    {errors.link && <p className="error">{errors.link[0]}</p>}
                </div>

                <button type="submit" className="primary-btn">Update</button>
            </form>

        </div>
    )
}