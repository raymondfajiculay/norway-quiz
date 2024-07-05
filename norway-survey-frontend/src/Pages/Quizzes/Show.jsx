import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const {id} = useParams();
    const {user, token} = useContext(AppContext);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    // const navigate = useNavigate();

    async function getQuizzes() {
        const res = await fetch(`/api/quizzes/${id}`);
        const data = await res.json();

        if(res.ok) {
            setQuiz(data.quiz);
        }
    }

    async function getQuestions() {
        const res = await fetch(`/api/quizzes/${id}/questions`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        console.log(data);

        if(res.ok) {
            setQuestions(data);
        }
    }

    // async function handleDelete(e) {
    //     e.preventDefault();

    //     if(user && user.id === quiz.user_id) {
    //         const res = await fetch(`/api/quizzes/${id}`, {
    //             method: 'delete',
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
            
    //         if(res.ok) {
    //             navigate('/');
    //         }
    //     }
    // }

    useEffect(() => {
        getQuizzes();
    }, []);

    useEffect(() => {
        getQuestions();
    }, []);

    return (
        <>
            {quiz ?
                <div className="mt-4 p-4 flex flex-col">
                    <div key={quiz.id} className="mt-4 p-4 flex">
                        <div className="text-center ml-auto">
                            <h2 className="font-bold text-5xl">{quiz.title}</h2>
                            <small className="text-xs text-slate-600">Created by {quiz.user.name} on {new Date(quiz.created_at).toLocaleTimeString()}</small>
                            <p className="mt-2">{quiz.description}</p>
                        </div>

                        {user && user.id === quiz.user_id && (
                            <div className="flex flex-col items-center ml-auto justify-center">
                                {/* <Link to={`/quizzes/update/${quiz.id}`} className="bg-green-500 text-white text-sm rounded-lg px-5 py-1 mb-2">Update</Link> */}
                                {/* <form onSubmit={handleDelete}>
                                    <button className="bg-red-500 text-white text-sm rounded-lg px-5 py-1">Delete</button>
                                </form> */}
                                <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">View Dashboard</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Questions</p>
                            <Link to={`/create/question/${quiz.id}`}><button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">Add</button></Link>
                    </div>

                    {user ? (
                        questions.length > 0 ? (
                            questions.map((item) => (
                                <div key={item.id} className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400">
                                    <p>{item.question_text}</p>
                                    <small>{item.explanation}</small>
                                </div>
                            ))
                        ) : null
                    ): null}

                   


                        
                    </div>

                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Interventions</p>
                            <button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">Add</button>
                        </div>
                        <p className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400">https://www.youtube.com/watch?v=35KDnej1hlI</p>
                        <p className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400">https://www.youtube.com/watch?v=35KDnej1hlI</p>
                    </div>
                </div>
            : <p className="title">Quiz Not Found</p>} 
        </>
    ) 
}