import { useContext, useEffect, useState } from "react"
import {AppContext} from "../../Context/AppContext"
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token, user} = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    });

    const [errors, setErrors] = useState({});

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();

        if(res.ok) {
            if(data.post.user_id !== user.id) {
                navigate('/');
            }
            setFormData({
                'title': data.post.title,
                'body': data.post.body
            });
        }
    }


    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/posts/${id}`, {
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
        getPost()
    }, [])

    return (
        <div className="container">
            <h1 className="title">Update a new post</h1>

            <form onSubmit={(e) => handleUpdate(e)} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Post Title" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-class"
                    />
                    {errors.title && <p className="error">{errors.title[0]}</p>}
                </div>

                <div>
                    <textarea 
                        rows="6" 
                        name="body" 
                        placeholder="Post Body" 
                        value={formData.body} 
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        className="textarea-class"
                    />
                    {errors.body && <p className="error">{errors.body[0]}</p>}
                </div>

                <button type="submit" className="primary-btn">Update</button>
            </form>

        </div>
    )
}