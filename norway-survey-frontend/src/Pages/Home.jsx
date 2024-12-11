import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { motion } from "framer-motion";
import AstigPreLogo from "../../src/assets/images/astigprelogo.png";
import Spermy from "../../src/assets/images/spermymotion.gif";
import styles from "./Home.module.css";

export default function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const { user } = useContext(AppContext);

    async function getQuizzes() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/quizzes`);
        const data = await res.json();

        if (res.ok) {
            setQuizzes(data);
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    return (
        <div className="home-container">
            <div className="container flex flex-col">
                {user ? (
                    <>
                        <h1 className="title text-slate-50">
                            These are your quizzes
                        </h1>
                        <Link
                            to="/create/quiz"
                            className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1 self-end"
                        >
                            Create New Quiz
                        </Link>
                    </>
                ) : (
                    <div className={styles.container}>
                        <img
                            className={styles.spermy}
                            src={Spermy}
                            alt="Spermy GIF"
                        />
                        <img
                            className={styles.logo}
                            src={AstigPreLogo}
                            alt="AstigPre Logo"
                        />
                    </div>
                )}

                {user ? (
                    quizzes.length > 0 ? (
                        quizzes.map((quiz) =>
                            user.id === quiz.user_id ? (
                                <Link to={`/quiz/${quiz.slug}`} key={quiz.id}>
                                    <div className="mt-4 p-4 border rounded-md border-dashed border-slate-400 flex flex-col">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h2 className="font-bold text-2xl text-slate-50">
                                                    {quiz.title}
                                                </h2>
                                                <small className="text-xs text-slate-600">
                                                    Created By: {quiz.user.name}
                                                    on
                                                    {new Date(
                                                        quiz.created_at
                                                    ).toLocaleDateString()}
                                                    | Status: {quiz.status}
                                                </small>
                                            </div>
                                        </div>
                                        <small className="text-slate-50">
                                            Description: {quiz.description}
                                        </small>
                                    </div>
                                </Link>
                            ) : null
                        )
                    ) : (
                        <p>You have not created any quiz yet</p>
                    )
                ) : (
                    <div className="flex flex-wrap items-center justify-center mt-5">
                        {quizzes.length > 0 ? (
                            quizzes
                                .filter((quiz) => quiz.status === "Open")
                                .map((quiz) => (
                                    <motion.div
                                        initial={{ scale: 0.1 }}
                                        animate={{ scale: 0.8 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                        }}
                                        whileHover={{ scale: 1 }}
                                        whileTap={{ scale: 0.6 }}
                                        key={quiz.id}
                                        className={`w-full h-40 md:m-0 p-2 border-slate-400 md:h-40 md:w-96 lg:w-96 lg:h-64 flex justify-center items-center rounded-md cursor-pointer ${
                                            quiz.id % 2 === 0
                                                ? styles.typetwocard
                                                : styles.typeonecard
                                        }`}
                                    >
                                        <Link
                                            to={`/${quiz.slug}`}
                                            key={quiz.slug}
                                            state={{ id: quiz.id }}
                                        >
                                            <h2 className="font-custom text-2xl text-slate-50 text-center">
                                                {quiz.title}
                                            </h2>
                                        </Link>
                                    </motion.div>
                                ))
                        ) : (
                            <p className="text-white mt-5">
                                There are no quizzes yet.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
