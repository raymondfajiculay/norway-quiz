import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Buttons from "../../../../Components/Buttons/Buttons";
import GameContainer from "../../../../Components/GameContainer/GameContainer";
import spermy from "../../../../assets/images/spermymotion.gif";
import styles from "./PostTestPage.module.css";
import Loader from "../../../../Components/Loader/Loader";

const PosttestPage = ({
    id,
    questions,
    currentQuestionIndex,
    postTestStep,
    postTestAnswer,
    handleNext,
    mainStep,
}) => {
    const [score, setScore] = useState(0);
    const [step, setStep] = useState("Introduction");
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentQuestionIndex, postTestAnswer]);

    useEffect(() => {
        // Check if currentQuestionIndex is 100, if so, set the step to "Result"
        if (currentQuestionIndex === 100) {
            setStep("Result");
        }
    }, [currentQuestionIndex]);

    const handleAnswer = (selectedAnswer) => {
        setAnswer(selectedAnswer);
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion && selectedAnswer === currentQuestion.answer) {
            setScore((prevScore) => prevScore + 1);
        }

        handleNext(selectedAnswer);

        // if (currentQuestionIndex > questions.length) {
        //     setStep("Result");
        // }
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
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-center">
                                    {containerClass === "gamecontainerone" ? (
                                        <>
                                            Ngayong mas gets mo na ang consent,
                                            may chance ka ulit na{" "}
                                            <span className="whitespace-nowrap">
                                                i-perfect
                                            </span>{" "}
                                            ang quiz!
                                        </>
                                    ) : (
                                        <>
                                            Ngayong mas gets mo na ang condom,
                                            may chance ka ulit na{" "}
                                            <span className="whitespace-nowrap">
                                                i-perfect
                                            </span>{" "}
                                            ang quiz!
                                        </>
                                    )}
                                </h2>
                            </div>
                        </div>
                    </GameContainer>
                    <div className="flex flex-col items-center justify-center">
                        <motion.div>
                            <Buttons
                                className={`next mt-5`}
                                onClick={() => setStep("Quiz")}
                            >
                                Next
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            )}

            {step === "Quiz" && (
                <>
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
                                {questions.length > 0 &&
                                questions[currentQuestionIndex] ? (
                                    <div className="flex flex-col items-center text-sm md:text-lg font-medium mt-4 text-center">
                                        {postTestStep === 0 ? (
                                            <>
                                                <p className="mt-5 mb-2 font-semibold">
                                                    Question{" "}
                                                    {currentQuestionIndex + 1}{" "}
                                                    of {questions.length}
                                                </p>
                                                <p>
                                                    {loading ? (
                                                        <Loader />
                                                    ) : (
                                                        questions[
                                                            currentQuestionIndex
                                                        ].question_text
                                                    )}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                {loading ? (
                                                    <Loader />
                                                ) : (
                                                    <>
                                                        {answer !==
                                                            "Di Alam" && (
                                                            <p
                                                                className={`font-bold p-4 ${
                                                                    postTestAnswer ===
                                                                    "Tama"
                                                                        ? "text-green-600"
                                                                        : "text-red-500"
                                                                }`}
                                                            >
                                                                {postTestAnswer}{" "}
                                                                ang iyong sagot!
                                                            </p>
                                                        )}

                                                        <p>
                                                            {
                                                                questions[
                                                                    currentQuestionIndex
                                                                ].explanation
                                                            }
                                                        </p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <p>No questions available.</p>
                                )}
                            </div>
                        </GameContainer>

                        {postTestStep === 0 ? (
                            <div className="mt-5 flex flex-col md:flex-row gap-2 items-center">
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
                        ) : (
                            <div className="mt-5 flex flex-col md:flex-row gap-2">
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
                                        onClick={() => handleNext("Explain")}
                                    >
                                        Next
                                    </Buttons>
                                </motion.div>
                            </div>
                        )}
                    </>
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
                    <div className="flex flex-col items-center justify-center">
                        <motion.div>
                            <Buttons
                                className={`next mt-5`}
                                onClick={() => mainStep("Attitude Page")}
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

export default PosttestPage;
