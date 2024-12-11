import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const { slug } = useParams();
    const { user, token } = useContext(AppContext);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [attitude, setAttitude] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const navigate = useNavigate();

    async function getQuizzes() {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/quizzes/${slug}`
            );

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();

            if (data.quiz) {
                setQuiz(data.quiz);
                setQuestions(data.quiz.questions || []);
                setInterventions(data.quiz.interventions || []);
                setAttitude(data.quiz.attitude || null);
                setFeedback(data.quiz.feedback || null);
            } else {
                console.error("Quiz data is not in the expected format:", data);
            }
        } catch (error) {
            console.error("An error occurred while fetching quizzes:", error);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();

        if (user && user.id === quiz.user_id) {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/quizzes/${slug}`,
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

    async function handleInterventionDelete(interventionId) {
        if (user && user.id === quiz.user_id) {
            const res = await fetch(
                `https://games.ugatngkalusugan.org/public/api/interventions/${interventionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                setInterventions(
                    interventions.filter((item) => item.id !== interventionId)
                );
            }
        }
    }

    async function handleAttitudeDelete(attitudeId) {
        if (user && user.id === quiz.user_id) {
            const res = await fetch(
                `https://games.ugatngkalusugan.org/public/api/attitude/${attitudeId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                setAttitude(attitude.filter((item) => item.id !== attitudeId));
            }
        }
    }

    async function handleFeedbackDelete(feedbackId) {
        if (user && user.id === quiz.user_id) {
            const res = await fetch(
                `https://games.ugatngkalusugan.org/public/api/feedback/${feedbackId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                setFeedback(feedback.filter((item) => item.id !== feedbackId));
            }
        }
    }

    async function handleQuestionDelete(questionId) {
        if (user && user.id === quiz.user_id) {
            const res = await fetch(
                `https://games.ugatngkalusugan.org/public/api/questions/${questionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                setQuestions(
                    questions.filter((item) => item.id !== questionId)
                );
            }
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    return (
        <div className="container ">
            {quiz ? (
                <div className="mt-4 p-4 flex flex-col">
                    <div key={quiz.id} className="mt-4 p-4 flex">
                        <div className="text-center ml-auto">
                            <Link to={`/dashboard/${slug}`}>
                                <h2 className="font-bold text-5xl hover:text-sky-400">
                                    {quiz.title}
                                </h2>
                            </Link>
                            <small className="text-xs text-slate-600">
                                Created by {quiz.user.name} on{" "}
                                {new Date(quiz.created_at).toLocaleTimeString()}
                                | Status: {quiz.status}
                            </small>
                            <p className="mt-2">
                                Description: {quiz.description}
                            </p>
                        </div>

                        {user && user.id === quiz.user_id && (
                            <div className="flex flex-col items-center ml-auto justify-center gap-2">
                                {/* <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                    Dashboard
                                </button> */}
                                <Link
                                    to={`/quiz/update/${slug}`}
                                    className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1 mb-2"
                                >
                                    Edit
                                </Link>
                                <form onSubmit={handleDelete}>
                                    <button className="bg-red-500 text-white text-sm rounded-lg px-5 py-1">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Link to create new question */}
                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Questions</p>
                            <Link
                                to={`/create/question/${slug}`}
                                state={{ id: quiz.id }}
                            >
                                <button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">
                                    Add
                                </button>
                            </Link>
                        </div>

                        <div>
                            {user &&
                                (questions.length > 0 ? (
                                    questions.map(
                                        (item) =>
                                            item.test_type === "question" && (
                                                <div
                                                    key={item.id}
                                                    className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 items-center flex justify-between"
                                                >
                                                    <div>
                                                        <>
                                                            Question:&nbsp;
                                                            {item.question_text}
                                                        </>
                                                        <br />
                                                        <small>
                                                            Type: &nbsp;Tama o
                                                            Mali
                                                        </small>
                                                        <br />
                                                        <small>
                                                            Answer: &nbsp;
                                                            {item.answer}
                                                        </small>
                                                        <br />
                                                        <small>
                                                            Explanation: &nbsp;
                                                            {item.explanation}
                                                        </small>
                                                    </div>
                                                    <div className="flex flex-col gap-2 items-center">
                                                        <Link
                                                            to={`/update/question/${slug}`}
                                                            state={{
                                                                id: item.id,
                                                            }}
                                                        >
                                                            <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                                Edit
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleQuestionDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            className="bg-red-500 text-white text-sm rounded-lg px-5 py-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                    )
                                ) : (
                                    <p>No questions available.</p>
                                ))}
                        </div>
                    </div>

                    <div className="flex flex-col mt-10 ">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Interventions</p>
                            <Link
                                to={`/create/intervention/${slug}`}
                                state={{ id: quiz.id }}
                            >
                                <button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">
                                    Add
                                </button>
                            </Link>
                        </div>
                        {interventions?.length > 0 &&
                            interventions.map((item) => (
                                <div
                                    key={item.id}
                                    className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 flex justify-between items-center"
                                >
                                    <p>Link: &nbsp; {item.link}</p>
                                    <div className="flex flex-col items-center gap-2">
                                        <Link
                                            to={`/update/intervention/${slug}`}
                                            state={{ id: item.id }}
                                        >
                                            <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleInterventionDelete(
                                                    item.id
                                                )
                                            }
                                            className="bg-red-500 text-white text-sm rounded-lg px-5 py-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Link to create new attitude question */}
                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Attitude</p>
                            <Link
                                to={`/create/attitude/${slug}`}
                                state={{ id: quiz.id }}
                            >
                                <button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">
                                    Add
                                </button>
                            </Link>
                        </div>

                        <div>
                            {user &&
                                (attitude.length > 0 ? (
                                    attitude.map((item) => (
                                        <div
                                            key={item.id}
                                            className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 items-center flex justify-between"
                                        >
                                            <div>
                                                <>
                                                    Question:&nbsp;
                                                    {item.question_text}
                                                </>
                                            </div>
                                            <div className="flex flex-col gap-2 items-center">
                                                <Link
                                                    to={`/update/attitude/${slug}`}
                                                    state={{ id: item.id }}
                                                >
                                                    <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleAttitudeDelete(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white text-sm rounded-lg px-5 py-1"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No questions available.</p>
                                ))}
                        </div>
                    </div>

                    {/* Link to create new feedback question */}
                    <div className="flex flex-col mt-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-xl font-bold">Feedback</p>
                            <Link
                                to={`/create/feedback/${slug}`}
                                state={{ id: quiz.id }}
                            >
                                <button className="bg-green-500 text-white text-sm rounded-lg px-5 py-1">
                                    Add
                                </button>
                            </Link>
                        </div>

                        <div>
                            {user &&
                                (feedback.length > 0 ? (
                                    feedback.map((item) => (
                                        <div
                                            key={item.id}
                                            className="text-sm mt-4 p-4 border rounded-md border-dashed border-slate-400 items-center flex justify-between"
                                        >
                                            <div>
                                                <>
                                                    Question &nbsp;
                                                    {item.question_text}
                                                </>
                                            </div>
                                            <div className="flex flex-col gap-2 items-center">
                                                <Link
                                                    to={`/update/feedback/${slug}`}
                                                    state={{ id: item.id }}
                                                >
                                                    <button className="bg-blue-500 text-white text-sm rounded-lg px-5 py-1">
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleFeedbackDelete(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white text-sm rounded-lg px-5 py-1"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No questions available.</p>
                                ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="title">Quiz Not Found</p>
            )}
        </div>
    );
}
