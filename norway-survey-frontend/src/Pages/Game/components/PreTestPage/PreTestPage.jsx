import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Buttons from "../../../../Components/Buttons/Buttons";
import GameContainer from "../../../../Components/GameContainer/GameContainer";
import spermy from "../../../../assets/images/spermymotion.gif";
import styles from "./PreTestPage.module.css";
import Loader from "../../../../Components/Loader/Loader";

const QuestionPage = ({
    id,
    questions,
    currentQuestionIndex,
    handleNext,
    mainStep,
}) => {
    const [score, setScore] = useState(0);
    const [step, setStep] = useState("Introduction");
    const [loading, setLoading] = useState(true);
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentQuestionIndex, step]);

    const handleAnswer = (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion && selectedAnswer === currentQuestion.answer) {
            setScore((prevScore) => prevScore + 1);
        }

        handleNext(selectedAnswer);

        if (currentQuestionIndex === questions.length - 1) {
            setStep("Result");
        }
    };

    return (
        <>
            {step === "Introduction" && (
                <>
                    <GameContainer container={containerClass}>
                        <motion.img
                            src={spermy}
                            className={styles.spermy}
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                        />
                        <div className={`${styles.questions}`}>
                            {questions[currentQuestionIndex] ? (
                                <div className="flex flex-col items-center text-center p-2">
                                    <p className="mt-5 text-sm md:text-lg font-semibold">
                                        Question {currentQuestionIndex + 1} of
                                        &nbsp;
                                        {questions.length}
                                    </p>
                                    {loading ? (
                                        <Loader /> // Show loader when loading the next question
                                    ) : (
                                        <p className="text-sm md:text-lg font-medium">
                                            {
                                                questions[currentQuestionIndex]
                                                    .question_text
                                            }
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p>No questions available.</p>
                            )}
                        </div>
                    </GameContainer>
                    <div className="mt-5 flex flex-col md:flex-row gap-2 justify-center items-center">
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
                        >
                            <Buttons
                                className="tama"
                                onClick={() => handleAnswer("Tama")}
                            >
                                Tama
                            </Buttons>
                        </motion.div>

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
                        >
                            <Buttons
                                className="mali"
                                onClick={() => handleAnswer("Mali")}
                            >
                                Mali
                            </Buttons>
                        </motion.div>

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
                        >
                            <Buttons
                                className="next"
                                onClick={() => handleAnswer("Di Alam")}
                            >
                                Di Alam
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            )}

            {step === "Result" && (
                <>
                    <GameContainer container={containerClass}>
                        <motion.img
                            src={spermy}
                            className={styles.spermy}
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                        />

                        <div className={`${styles.questions}`}>
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-center">
                                    Result!
                                </h2>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <p className="text-lg mt-3 text-center">
                                            Your score is: {score} out of{" "}
                                            {questions.length}
                                        </p>
                                        <p className="text-lg mt-3 text-center">
                                            {score / questions.length < 0.33
                                                ? "Mukhang kailangan pa ng more info, pre!"
                                                : score / questions.length <
                                                  0.66
                                                ? "Pwede na, pero kaya pa ‘yang i-improve!"
                                                : "Lodi 🙌🏼 Gets mo ang konsepto ng consent!"}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </GameContainer>
                    <div className="mt-5 flex flex-col md:flex-row gap-2 justify-center items-center">
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
                        >
                            <Buttons
                                className="tama"
                                onClick={() => mainStep("Intervention Page")}
                            >
                                Next
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            )}
        </>
    );
};

export default QuestionPage;
