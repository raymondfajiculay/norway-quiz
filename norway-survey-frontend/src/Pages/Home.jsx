import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const {user} = useContext(AppContext);

    async function getQuizzes() {
        const res = await fetch("/api/quizzes");
        const data = await res.json();

        console.log(data);

        if(res.ok) {
            setQuizzes(data);
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    return(
        <div className="container flex flex-col">
           
            { user ? (
                <>
                    <h1 className="title">These are your quizzes</h1>
                    <Link to="/create/quiz" className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1 self-end">Create New Quiz</Link>
                </>
            ) : (
                <h1 className="title">Play These Games!</h1>
            )}


            {user ? (
                quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                        user.id === quiz.user_id ? (
                            <Link to={`/quizzes/${quiz.id}`} key={quiz.id}>
                                <div className="mt-4 p-4 border rounded-md border-dashed border-slate-400 flex flex-col">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div>
                                            <h2 className="font-bold text-2xl">{quiz.title}</h2>
                                            <small className="text-xs text-slate-600">
                                                Created By: {quiz.user.name} on {new Date(quiz.created_at).toLocaleDateString()} |  Status: {quiz.status}
                                            </small>
                                        </div>
                                    </div>
                                    <small>Description: {quiz.description}</small>
                                </div>
                            </Link>
                        ) : null
                    ))
                ) : (
                    <p>You have not created any quiz yet</p>
                )
            ) : (
                <div className="flex flex-wrap">
                    {quizzes.length > 0 ? (
                        quizzes.map(quiz => (
                                <div key={quiz.id} className="w-full m-2 md:w-1/3 md:m-0 p-2">
                           <Link  to={`/games/${quiz.id}`} key={quiz.id}>
                                    <div className="mt-4 p-4 border rounded-md border-dashed border-slate-400 flex justify-center items-center md:h-40">
                                        <h2 className="font-bold text-2xl">{quiz.title}</h2>
                                    </div>
                           </Link>
                                </div>
                        ))
                    ) : (
                        <p>There are no quiz yet.</p>
                    )}
                </div>
            )}
        </div>
    )
}