import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    validateNumber,
    validateNickname,
    validateAge,
    validateSelect,
} from "./validation";

import "./index.css";
import spermy from "../../assets/images/spermymotion.gif";
import backBtn from "../../assets/images/back.png";
import Buttons from "../../Components/Buttons/Buttons";
import ButtonXSad from "../../assets/images/button_xsad.png";
import ButtonSad from "../../assets/images/button_sad.png";
import ButtonNeutral from "../../assets/images/button_neutral.png";
import ButtonHappy from "../../assets/images/button_happy.png";
import ButtonXHappy from "../../assets/images/button_xhappy.png";

import WelcomePage from "./components/WelcomePage/WelcomePage";
import UserPage from "./components/UserPage/UserPage";

export default function User() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [attitude, setAttitude] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [answers, setAnswers] = useState([]);

    const [currentFormQuestionIndex, setCurrentFormQuestionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentInterventionIndex, setCurrentInterventionIndex] = useState(0);
    const [currentAttitudeIndex, setCurrentAttitudeIndex] = useState(0);
    const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
    const [postTestStep, setPostTestStep] = useState(0);

    const [userData, setUserData] = useState({
        quiz_id: id,
        nickname: "",
        age: "",
        number: "",
        biological_sex: "",
        identification: "",
    });

    const formQuestions = [
        { type: "text", name: "nickname", placeholder: "Enter a nickname" },
        { type: "number", name: "age", placeholder: "How old are you" },
        {
            type: "text",
            name: "number",
            placeholder: "Enter your phone number",
        },
        {
            type: "select",
            name: "biological_sex",
            placeholder: "What is your sex at birth",
            options: [
                { value: "", text: "Select your sex" },
                { value: "Male", text: "Male" },
                { value: "Female", text: "Female" },
            ],
        },
        {
            type: "select",
            name: "identification",
            placeholder: "How do you identify yourself",
            options: [
                { value: "", text: "How do you identify yourself" },
                { value: "Male", text: "Male" },
                { value: "Female", text: "Female" },
                { value: "Transgender", text: "Transgender" },
                { value: "Non Binary", text: "Non Binary" },
            ],
        },
    ];

    const [step, setStep] = useState("Welcome Page");
    const [validationMessage, setValidationMessage] = useState("");
    const [postTestAnswer, setPostTestAnswer] = useState("");

    async function getQuizzes() {
        const res = await fetch(
            `https://games.ugatngkalusugan.org/public/api/quizzes/${slug}`
        );
        const data = await res.json();

        if (res.ok) {
            setQuiz(data.quiz);
            setQuestions(data.questions);
            setInterventions(data.interventions);
            setAttitude(data.attitude);
            setFeedback(data.feedback);
        }
    }

    async function handleNext(answer = null) {
        if (step === "User Page") {
            const currentQuestion = formQuestions[currentFormQuestionIndex];
            let validationMsg = "";

            if (currentQuestion.name === "nickname") {
                validationMsg = validateNickname(userData.nickname);
            } else if (currentQuestion.name === "age") {
                validationMsg = validateAge(userData.age);
            } else if (currentQuestion.name === "number") {
                validationMsg = await validateNumber(userData.number, id);
            } else if (currentQuestion.name === "biological_sex") {
                validationMsg = validateSelect(userData.biological_sex);
            } else if (currentQuestion.name === "identification") {
                validationMsg = validateSelect(userData.identification);
            }

            setValidationMessage(validationMsg);

            if (
                !validationMsg &&
                currentFormQuestionIndex < formQuestions.length - 1
            ) {
                setCurrentFormQuestionIndex(currentFormQuestionIndex + 1);
            } else if (!validationMsg) {
                setStep("Pretest Page");
            }
        } else if (step === "Pretest Page") {
            if (answer !== null) {
                setAnswers([
                    ...answers,
                    {
                        question_id: questions[currentQuestionIndex].id,
                        answer,
                        test_type: "Pre Test",
                    },
                ]);
            }
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setStep("Intervention Page");
                setCurrentQuestionIndex(0);
            }
        } else if (step === "Intervention Page") {
            if (currentInterventionIndex < interventions.length - 1) {
                setCurrentInterventionIndex(currentInterventionIndex + 1);
            } else {
                setStep("Posttest Page");
                setCurrentInterventionIndex(0);
            }
        } else if (step === "Posttest Page") {
            if (postTestStep === 0) {
                const newAnswer = {
                    question_id: questions[currentQuestionIndex].id,
                    answer,
                    test_type: "Post Test",
                };
                setAnswers((prevAnswers) => {
                    const updatedAnswers = [...prevAnswers, newAnswer];
                    const isCorrect =
                        answer.trim().toLowerCase() ===
                        questions[currentQuestionIndex].answer
                            .trim()
                            .toLowerCase();

                    setPostTestAnswer(isCorrect ? "Tama" : "Mali");

                    return updatedAnswers;
                });
                setPostTestStep(1);
            } else if (postTestStep === 1) {
                // Move to the next question if there are more questions
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    setStep("Attitude Page");
                    setCurrentQuestionIndex(0);
                }
                setPostTestStep(0);
            }
        } else if (step === "Attitude Page") {
            if (answer !== null) {
                setAnswers([
                    ...answers,
                    {
                        question_id: attitude[currentAttitudeIndex].id,
                        answer,
                        test_type: "Attitude Test",
                    },
                ]);
            }
            if (currentAttitudeIndex < attitude.length - 1) {
                setCurrentAttitudeIndex(currentAttitudeIndex + 1);
            } else {
                setStep("Feedback Page");
                setCurrentAttitudeIndex(0);
            }
        } else if (step === "Feedback Page") {
            if (answer !== null) {
                setAnswers([
                    ...answers,
                    {
                        question_id: feedback[currentFeedbackIndex].id,
                        answer,
                        test_type: "Feedback Test",
                    },
                ]);
            }
            if (currentFeedbackIndex < feedback.length - 1) {
                setCurrentFeedbackIndex(currentFeedbackIndex + 1);
            } else {
                setStep("Rating Page");
                setCurrentFeedbackIndex(0);
            }
        } else if (step === "Rating Page") {
            handleParticipant();
        }
        setLoading(false);
    }

    async function handleParticipant() {
        try {
            const participantRes = await fetch(
                "https://games.ugatngkalusugan.org/public/api/participants",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );
            const participantData = await participantRes.json();
            if (!participantRes.ok) {
                throw new Error("Failed to save participant data");
            }
            const participantId = participantData.id;
            const answersRes = await fetch(
                "https://games.ugatngkalusugan.org/public/api/answers",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        participant_id: participantId,
                        answers: answers,
                    }),
                }
            );
            if (!answersRes.ok) {
                throw new Error("Failed to save answers");
            }
            navigate(`/`);
        } catch (error) {
            console.error("Error saving participant data:", error);
            throw error;
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    }

    function handleBack() {
        if (step === "User Page") {
            setLoading(true);
            if (currentFormQuestionIndex > 0) {
                setCurrentFormQuestionIndex(currentFormQuestionIndex - 1);
            } else {
                setStep("Welcome Page");
            }
            setLoading(false);
        } else if (step === "Pretest Page") {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
                setStep("User Page");
            }
        } else if (step === "Intervention Page") {
            if (currentInterventionIndex > 0) {
                setCurrentInterventionIndex(currentInterventionIndex - 1);
            } else {
                setStep("Pretest Page");
            }
        } else if (step === "Posttest Page") {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
                setStep("Intervention Page");
            }
        } else if (step === "Rating Page") {
            setStep("Posttest Page");
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    useEffect(() => {}, [step]);

    // ====================================================//
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const playerRef = useRef(null);

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (window.YT && window.YT.Player) {
            initializePlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initializePlayer;
        }
    }, [step, currentInterventionIndex]); // Run on step or video index change

    const initializePlayer = () => {
        if (playerRef.current) {
            // If a player already exists, destroy it to avoid duplicates
            if (window.playerInstance) {
                window.playerInstance.destroy();
            }

            // Create a new player instance with the current video ID
            window.playerInstance = new window.YT.Player(playerRef.current, {
                videoId: interventions[currentInterventionIndex].link, // YouTube video ID
                events: {
                    onStateChange: onPlayerStateChange,
                    onReady: (event) => {
                        // Set the start time in seconds (e.g., start at 30 seconds)
                        const startTime =
                            interventions[currentInterventionIndex].start_time; // Change this value to your desired start time
                        event.target.seekTo(startTime, true);
                    },
                },
            });
        }
    };

    // Function to handle video end event
    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            // Check if there is a next intervention
            if (currentInterventionIndex < interventions.length - 1) {
                setIsNextDisabled(true); // Disable the "Next" button until the next video is ready
                setCurrentInterventionIndex((prevIndex) => prevIndex + 1); // Move to the next video
            } else {
                setIsNextDisabled(false); // Enable "Next" button when all videos are done
            }
        }
    };

    // Handle the "Next" button click
    const handleNextClick = () => {
        if (!isNextDisabled) {
            // Custom logic for handling next step after all videos
            handleNext();
        }
    };
    // ====================================================//

    function renderStepContent() {
        if (step === "Welcome Page") {
            return (
                <>
                    <WelcomePage quiz={quiz} setStep={setStep} />
                </>
            );
        } else if (step === "User Page") {
            const currentQuestion = formQuestions[currentFormQuestionIndex];
            return (
                <>
                    {currentFormQuestionIndex > 0 && (
                        <motion.img
                            onClick={handleBack}
                            src={backBtn}
                            className="backBtn"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                        />
                    )}
                    <div className="question-container">
                        <motion.img
                            src={spermy}
                            className="spermy"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                        />
                    </div>
                    <div className="input-container z-10 mt-4">
                        {currentQuestion.type === "text" && (
                            <>
                                <div className="flex flex-row justify-center">
                                    <input
                                        type="text"
                                        name={currentQuestion.name}
                                        placeholder={
                                            currentQuestion.placeholder
                                        }
                                        value={userData[currentQuestion.name]}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                {validationMessage && (
                                    <p className="error-message mt-2">
                                        {validationMessage}
                                    </p>
                                )}
                            </>
                        )}
                        {currentQuestion.type === "number" && (
                            <div>
                                <input
                                    type="number"
                                    name={currentQuestion.name}
                                    placeholder={currentQuestion.placeholder}
                                    value={userData[currentQuestion.name]}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationMessage && (
                                    <p className="error-message mt-2">
                                        {validationMessage}
                                    </p>
                                )}
                            </div>
                        )}
                        {currentQuestion.type === "select" && (
                            <div>
                                <select
                                    name={currentQuestion.name}
                                    value={userData[currentQuestion.name]}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {currentQuestion.options.map(
                                        (option, index) => (
                                            <option
                                                key={index}
                                                value={option.value}
                                            >
                                                {option.text}
                                            </option>
                                        )
                                    )}
                                </select>
                                {validationMessage && (
                                    <p className="error-message mt-2">
                                        {validationMessage}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-5 flex justify-between">
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
                            <Buttons className="next" onClick={handleNext}>
                                Next
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            );
        } else if (step === "Pretest Page") {
            return (
                <>
                    <div className="question-container justify-center flex items-center min-h-40 w-96 md:w-1/2 md:h-80 p-5 md:p-10">
                        {questions.length > 0 &&
                        questions[currentQuestionIndex] ? (
                            <div className="text-center p-2">
                                <p className="mt-5 text-sm md:text-lg font-semibold">
                                    Question {currentQuestionIndex + 1} of
                                    &nbsp;
                                    {questions.length}
                                </p>
                                <p className="text-sm md:text-lg font-medium ">
                                    {
                                        questions[currentQuestionIndex]
                                            .question_text
                                    }
                                </p>
                            </div>
                        ) : (
                            <p>No questions available.</p>
                        )}
                    </div>

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
                                onClick={() => handleNext("Tama")}
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
                                onClick={() => handleNext("Mali")}
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
                                onClick={() => handleNext("Di Alam")}
                            >
                                Di Alam
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            );
        } else if (step === "Intervention Page") {
            return (
                <>
                    {interventions.length > 0 ? (
                        <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                            <div className="flex justify-center items-center">
                                <div id="player">
                                    <div
                                        ref={playerRef}
                                        className="youtube-vid"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : null}
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
                            className={`next mt-5 ${
                                isNextDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleNextClick}
                            disabled={isNextDisabled}
                        >
                            Next
                        </Buttons>
                    </motion.div>
                </>
            );
        } else if (step === "Posttest Page") {
            return (
                <>
                    <div className="question-container justify-center flex items-center min-h-40 w-96 md:w-1/2 md:h-80 p-5 md:p-10">
                        {questions.length > 0 &&
                        questions[currentQuestionIndex] ? (
                            <div className="text-sm md:text-lg font-medium mt-4 text-center">
                                <p className="mt-5 mb-2 font-semibold">
                                    {postTestStep === 0 ? (
                                        <>
                                            Question {currentQuestionIndex + 1}
                                            &nbsp; of &nbsp;{questions.length}
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className={`font-bold ${
                                                    postTestAnswer === "Tama"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {postTestAnswer} ang iyong
                                                sagot!!!
                                            </span>
                                        </>
                                    )}
                                </p>
                                <p className="p-2">
                                    {postTestStep === 0
                                        ? questions[currentQuestionIndex]
                                              .question_text
                                        : questions[currentQuestionIndex]
                                              .explanation}
                                </p>
                            </div>
                        ) : (
                            <p>No questions available.</p>
                        )}
                    </div>
                    {postTestStep === 0 ? (
                        <>
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
                                        onClick={() => handleNext("Tama")}
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
                                        onClick={() => handleNext("Mali")}
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
                                        onClick={() => handleNext("Di Alam")}
                                    >
                                        Di Alam
                                    </Buttons>
                                </motion.div>
                            </div>
                        </>
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
            );
        } else if (step === "Attitude Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        <div className="text-sm md:text-lg font-medium mt-4 text-center ">
                            {attitude.length > 0 ? (
                                <p>
                                    {
                                        attitude[currentAttitudeIndex]
                                            .question_text
                                    }
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-5 flex flex-row flex-wrap items-center justify-center">
                        <motion.img
                            onClick={() => handleNext("Lubos Na Di Sang-Ayon")}
                            src={ButtonXSad}
                            alt="Lubos Na Sang-Ayon Di Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Di Sang-Ayon")}
                            src={ButtonSad}
                            alt="Di Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Neutral")}
                            src={ButtonNeutral}
                            alt="Neutral Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Sang-Ayon")}
                            src={ButtonHappy}
                            alt="Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Lubos Na Sang-Ayon")}
                            src={ButtonXHappy}
                            alt="Lubos Na Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                    </div>
                </>
            );
        } else if (step === "Feedback Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        <div className="text-sm md:text-lg font-medium mt-4 text-center">
                            {feedback.length > 0 ? (
                                <p>
                                    {
                                        feedback[currentFeedbackIndex]
                                            .question_text
                                    }
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-5 flex flex-row flex-wrap items-center justify-center">
                        <motion.img
                            onClick={() => handleNext("Lubos Na Di Sang-Ayon")}
                            src={ButtonXSad}
                            alt="Lubos Na Sang-Ayon Di Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Di Sang-Ayon")}
                            src={ButtonSad}
                            alt="Di Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Neutral")}
                            src={ButtonNeutral}
                            alt="Neutral Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Sang-Ayon")}
                            src={ButtonHappy}
                            alt="Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                        <motion.img
                            onClick={() => handleNext("Lubos Na Sang-Ayon")}
                            src={ButtonXHappy}
                            alt="Lubos Na Sang-Ayon Button"
                            className="w-20 h-20 m-2"
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.7 }}
                        />
                    </div>
                </>
            );
        } else if (step === "Rating Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        <h2 className="text-center text-sm md:text-lg font-medium p-2">
                            Maraming salamat sa iyong pagsagot sa quiz na ito!
                            Ang iyong numero ay awtomatikong isasama sa
                            nalalapit na raffle, kung saan magkakaroon ka ng
                            pagkakataon na manalo ng iba&#39;t ibang papremyo.
                            Puwede mo ring sagutan ang iba pang mga quiz para
                            mas maraming chance of winning!
                        </h2>
                    </div>
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
                        <Buttons className="tama mt-5" onClick={handleNext}>
                            Done
                        </Buttons>
                    </motion.div>
                </>
            );
        }
    }

    return (
        <div className="game-page flex flex-col items-center justify-center h-dvh">
            {renderStepContent()}
        </div>
    );
}
