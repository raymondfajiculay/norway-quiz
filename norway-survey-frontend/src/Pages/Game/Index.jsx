import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";

import WelcomePage from "./components/WelcomePage/WelcomePage";
import UserPage from "./components/UserPage/UserPage";
import PreTestPage from "./components/PreTestPage/PreTestPage";
import InterventionPage from "./components/InterventionPage/InterventionPage";
import PosttestPage from "./components/PostTestPage/PostTestPage";
import AttitudePage from "./components/AttitudePage/AttitudePage";
import FeedbackPage from "./components/FeedbackPage/FeedbackPage";
import RatingPage from "./components/RatingPage/RatingPage";

export default function User() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const { slug } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [attitude, setAttitude] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [answers, setAnswers] = useState([]);

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

    const [step, setStep] = useState("Welcome Page");
    const [postTestAnswer, setPostTestAnswer] = useState("");

    async function getQuizzes() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/quizzes/${slug}`
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
        if (step === "Pretest Page") {
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
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    setCurrentQuestionIndex(100);
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
    }

    async function handleParticipant() {
        try {
            const participantRes = await fetch(
                `${import.meta.env.VITE_API_URL}/participants`,
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
                `${import.meta.env.VITE_API_URL}/answers`,
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

    useEffect(() => {
        getQuizzes();
    }, []);

    useEffect(() => {}, [step]);

    const handleUserData = (newData) => {
        setUserData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const handleStep = (step) => {
        setStep(step);
    };

    function renderStepContent() {
        if (step === "Welcome Page") {
            return (
                <>
                    <WelcomePage quiz={quiz} setStep={setStep} />
                </>
            );
        } else if (step === "User Page") {
            return (
                <>
                    <UserPage
                        id={id}
                        setStep={handleStep}
                        handleUserData={handleUserData}
                    />
                </>
            );
        } else if (step === "Pretest Page") {
            return (
                <>
                    <PreTestPage
                        id={id}
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex}
                        handleNext={handleNext}
                        mainStep={setStep}
                    />
                </>
            );
        } else if (step === "Intervention Page") {
            return (
                <InterventionPage
                    id={id}
                    interventions={interventions}
                    handleNext={handleNext}
                    currentInterventionIndex={currentInterventionIndex}
                    setCurrentInterventionIndex={setCurrentInterventionIndex}
                />
            );
        } else if (step === "Posttest Page") {
            return (
                <>
                    <PosttestPage
                        id={id}
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex}
                        postTestStep={postTestStep}
                        postTestAnswer={postTestAnswer}
                        handleNext={handleNext}
                        mainStep={setStep}
                    />
                </>
            );
        } else if (step === "Attitude Page") {
            return (
                <>
                    <AttitudePage
                        id={id}
                        attitude={attitude}
                        currentAttitudeIndex={currentAttitudeIndex}
                        handleNext={handleNext}
                    />
                </>
            );
        } else if (step === "Feedback Page") {
            return (
                <>
                    <FeedbackPage
                        id={id}
                        feedback={feedback}
                        currentFeedbackIndex={currentFeedbackIndex}
                        handleNext={handleNext}
                    />
                </>
            );
        } else if (step === "Rating Page") {
            return (
                <>
                    <RatingPage id={id} handleNext={handleNext} />
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
