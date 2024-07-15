import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const {id} = useParams();
    const {user, token} = useContext(AppContext);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const navigate = useNavigate();

    async function getQuizzes() {
        const res = await fetch(`/api/quizzes/${id}`);
        const data = await res.json();

        if(res.ok) {
            setQuiz(data.quiz);
            setQuestions(data.quiz.questions);
            setInterventions(data.quiz.interventions);
        }
    }

    // async function getQuestions() {
    //     const res = await fetch(`/api/quizzes/${id}/questions`, {
    //         method: 'get',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     const data = await res.json();

    //     if(res.ok) {
    //         setQuestions(data);
    //     }
    // }

    // async function getInterventions() {
    //     const res = await fetch(`/api/quizzes/${id}/interventions`, {
    //         method: 'get',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     const data = await res.json();

    //     if(res.ok) {
    //         setInterventions(data);
    //     }
    // }

    async function handleDelete(e) {
        e.preventDefault();

        if(user && user.id === quiz.user_id) {
            const res = await fetch(`/api/quizzes/${id}`, {
                method: 'delete',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(res.ok) {
                navigate('/');
            }
        }
    }

    async function handleInterventionDelete(interventionId) {
        if(user && user.id === quiz.user_id) {
            const res = await fetch(`/api/interventions/${interventionId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                setInterventions(interventions.filter(item => item.id !== interventionId));
            }
        }
    }

    async function handleQuestionDelete(questionId) {
        if(user && user.id === quiz.user_id) {
            const res = await fetch(`/api/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                setQuestions(questions.filter(item => item.id !== questionId));
            }
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    // useEffect(() => {
    //     getQuestions();
    // }, []);

    // useEffect(() => {
    //     getInterventions();
    // }, []);

    return (
        <div className="container">
            {quiz ?
                <div className="mt-4 p-4 flex flex-col">
                    <div key={quiz.id} className="mt-4 p-4 flex">
                        <div className="text-center ml-auto">
                            <h2 className="font-bold text-5xl">{quiz.title}</h2>
                            <small className="text-xs text-slate-600">Created by {quiz.user.name} on {new Date(quiz.created_at).toLocaleTimeString()} | Status: {quiz.status}</small>
                            <p className="mt-2">Description: {quiz.description}</p>
                        </div>

                        {user && user.id === quiz.user_id && (
                            <div className="flex flex-col items-center ml-auto justify-center gap-2">
                                <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">Dashboard</button>
                                {/* <Link to={`/quizzes/update/${quiz.id}`} className="bg-green-500 text-white text-sm rounded-lg px-5 py-1 mb-2">Update</Link> */}
                                <form onSubmit={handleDelete}>
                                    <button className="bg-red-500 text-white text-sm rounded-lg px-5 py-1">Delete</button>
                                </form>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Questions</p>
                            <Link to={`/create/question/${quiz.id}`}><button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">Add</button></Link>
                        </div>

                        <div>
                            {user ? (
                               questions.length > 0 ? (
                                    questions.map((item) => (
                                        <div key={item.id} className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 items-center flex justify-between">
                                            <div>
                                                <>Question: {item.question_text}</> <br />
                                                <small>Type: Tama o Mali</small> <br />
                                                <small>Answer: {item.answer}</small> <br />
                                                <small>Explanation: {item.explanation}</small>
                                            </div>
                                            <div className="flex flex-col gap-2 items-center">
                                                <Link to={`/update/question/${item.id}`}>
                                                    <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                            Edit
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleQuestionDelete(item.id)} className="bg-red-500 text-white text-sm rounded-lg px-5 py-1">
                                                        Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : null
                            ): null}
                        </div>
                    </div>

                    <div className="flex flex-col mt-10 ">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Interventions</p>
                            <Link to={`/create/intervention/${quiz.id}`}><button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">Add</button></Link>
                        </div>
                        {user ? (
                            interventions.length > 0 ? (
                                interventions.map((item) => (
                                    <div key={item.id} className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 flex justify-between items-center">
                                        <p>Link: {item.link}</p>
                                        <div className="flex flex-col items-center gap-2">
                                            <Link to={`/update/intervention/${item.id}`}>
                                                        <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                                Edit
                                                        </button>
                                            </Link>
                                            <button onClick={() => handleInterventionDelete(item.id)} className="bg-red-500 text-white text-sm rounded-lg px-5 py-1">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : null
                        ): null}    
                    </div>
                </div>
            : <p className="title">Quiz Not Found</p>} 
        </div>
    ) 
}