import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const { id } = useParams();
    const { user, token } = useContext(AppContext);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    async function getPost() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`);
        const data = await res.json();

        if (res.ok) {
            setPost(data);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();

        if (user && user.id === post.post.user_id) {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/posts/${id}`,
                {
                    method: "delete",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                navigate("/");
            }
        }
    }

    useEffect(() => {
        getPost();
    }, []);

    return (
        <div className="container">
            {post ? (
                <div
                    key={post.post.id}
                    className="mt-4 p-4 border rounded-md border-dashed border-slate-400"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h2 className="font-bold text-2xl">
                                {post.post.title}
                            </h2>
                            <small className="text-xs text-slate-600">
                                Create by {post.user.name} on{" "}
                                {new Date(
                                    post.post.created_at
                                ).toLocaleTimeString()}
                            </small>
                        </div>
                    </div>
                    <p>{post.post.body}</p>

                    {user && user.id === post.post.user_id && (
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                to={`/posts/update/${post.post.id}`}
                                className="bg-green-500 text-white text-sm rounded-lg  px-5 py-1"
                            >
                                Update
                            </Link>

                            <form onSubmit={handleDelete}>
                                <button className="bg-red-500 text-white text-sm rounded-lg px-3 py-1">
                                    Delete
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <p className="title">Post Not Found</p>
            )}
        </div>
    );
}
