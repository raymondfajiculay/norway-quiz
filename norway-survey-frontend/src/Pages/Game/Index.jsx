import './index.css';
import spermy from "../../assets/images/spermymotion.gif";
import backBtn from "../../assets/images/back.png";
import astigprelogo from "../../assets/images/astigprelogo.png";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Buttons from "../../Components/Buttons/Buttons";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { validateNumber, validateNickname, validateAge, validateSelect } from './validation';

export default function User() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [step, setStep] = useState("Welcome Page");
    const [currentFormQuestionIndex, setCurrentFormQuestionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentInterventionIndex, setCurrentInterventionIndex] = useState(0);
    const [userData, setUserData] = useState({
        nickname: '',
        age: '',
        number: '',
        biological_sex: '',
        identification: ''
    });
    const [answers, setAnswers] = useState([]);
    const [validationMessage, setValidationMessage] = useState('');
    

    // Get Quiz Data
    async function getQuizzes() {
        const res = await fetch(`/api/quizzes/${id}`);
        const data = await res.json();

        if (res.ok) {
            setQuiz(data.quiz);
            setQuestions(data.questions);
            setInterventions(data.interventions);
        }
    }

    // Save User Information
    async function handleParticipant() {
        console.log(userData);
        try {
            const participantRes = await fetch('/api/participants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const participantData = await participantRes.json();

            if (!participantRes.ok) {
                throw new Error('Failed to save participant data');
            }

            console.log('Participant data saved:', participantData);

            const participantId = participantData.id;

            const answersRes = await fetch('/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participant_id: participantId,
                    answers: answers
                })
            });

            const answersData = await answersRes.json();

            if (!answersRes.ok) {
                throw new Error('Failed to save answers');
            }

            console.log('Answers saved:', answersData);
        } catch (error) {
            console.error('Error saving participant data:', error);
            throw error;
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    const formQuestions = [
        { type: 'text', name: 'nickname', placeholder: 'Enter a nickname' },
        { type: 'number', name: 'age', placeholder: 'How old are you' },
        { type: 'text', name: 'number', placeholder: 'Enter your phone number' },
        {
            type: 'select', name: 'biological_sex', placeholder: 'What is your sex at birth', options: [
                { value: '', text: 'Select your sex' },
                { value: 'Male', text: 'Male' },
                { value: 'Female', text: 'Female' }
            ]
        },
        {
            type: 'select', name: 'identification', placeholder: 'How do you identify yourself', options: [
                { value: '', text: 'Select your identification' },
                { value: 'Male', text: 'Male' },
                { value: 'Female', text: 'Female' },
                { value: 'Transgender', text: 'Transgender' },
                { value: 'Gender Neutral', text: 'Gender Neutral' },
                { value: 'Non Binary', text: 'Non Binary' }
            ]
        }
    ];

    function handleInputChange(event) {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    }

    async function handleNext(answer = null) {
        if (step === "User Page") {
            const currentQuestion = formQuestions[currentFormQuestionIndex];
            let validationMsg = '';
            console.log(validationMsg);

            if (currentQuestion.name === 'nickname') {
                validationMsg = validateNickname(userData.nickname);
            } else if (currentQuestion.name === 'age') {
                validationMsg = validateAge(userData.age);
            } else if(currentQuestion.name === 'number') {
                validationMsg = await validateNumber(userData.number, id);
            } else if(currentQuestion.name === 'biological_sex') {
                validationMsg = validateSelect(userData.biological_sex);
            } else if(currentQuestion.name === 'identification') {
                validationMsg = validateSelect(userData.identification);
            }

            setValidationMessage(validationMsg);

            if (!validationMsg && currentFormQuestionIndex < formQuestions.length - 1) {
                setCurrentFormQuestionIndex(currentFormQuestionIndex + 1);
            } else if (!validationMsg) {
                setStep("Pretest Page");
            }
        } else if (step === "Pretest Page") {
            if (answer !== null) {
                setAnswers([...answers, { question_id: questions[currentQuestionIndex].id, answer, test_type: "Pre Test" }]);
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
            if (answer !== null) {
                setAnswers([...answers, { question_id: questions[currentQuestionIndex].id, answer, test_type: "Post Test"}]);
            }
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setStep("Rating Page");
            }
        } else if (step === "Rating Page") {
            handleParticipant();
        }
    }

    function handleBack() {
        if (step === "User Page") {
            if (currentFormQuestionIndex > 0) {
                setCurrentFormQuestionIndex(currentFormQuestionIndex - 1);
            } else {
                setStep("Welcome Page");
            }
        } else if (step === "Pretest Page") {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
                setStep("User Page");
            }
        } else if (step === "Intervention Page") {
            if (currentInterventionIndex > 0) {
                setCurrentInterventionIndex(currentInterventionIndex - 1);
                console.log('test');
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

    function renderStepContent() {
        if (step === "Welcome Page") {
            return (
                <>
                    <div className="question-container">
                        <img src={astigprelogo} alt="" className='astigpre_logo'/>
                        {quiz ? (
                            <p className='question-container-text'>
                                <ReactTyped strings={[quiz.description]} typeSpeed={25} />
                            </p>
                        ) : null}
                    </div>

                    <Buttons className="next mt-5" onClick={() => setStep("User Page")}>
                        Play
                    </Buttons>
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
                            className='backBtn'
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            whileHover={{ scale: 1.2}}
                            whileTap={{ scale: 0.8 }}
                        />
                    )}
                    <div className="question-container">
                        <motion.img
                            src={spermy}
                            className='spermy'
                            initial={{ scale: 0.1 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                        />
                    </div>
                    <div className='input-container z-10 mt-4'>
                        {currentQuestion.type === 'text' && (
                            <>
                                <div className='flex flex-row justify-center'>
                                    <input 
                                        type="text" 
                                        name={currentQuestion.name} 
                                        placeholder={currentQuestion.placeholder} 
                                        value={userData[currentQuestion.name]} 
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                {validationMessage && <p className="error-message">{validationMessage}</p>}
                            </>
                        )}
                        {currentQuestion.type === 'number' && (
                            <div>
                                <input 
                                    type="number" 
                                    name={currentQuestion.name} 
                                    placeholder={currentQuestion.placeholder} 
                                    value={userData[currentQuestion.name]} 
                                    onChange={handleInputChange}
                                    required 
                                />
                                {validationMessage && <p className="error-message">{validationMessage}</p>}
                            </div>
                        )}
                        {currentQuestion.type === 'select' && (
                            <div>
                                <select 
                                    name={currentQuestion.name} 
                                    value={userData[currentQuestion.name]} 
                                    onChange={handleInputChange}
                                    required
                                >
                                    {currentQuestion.options.map((option, index) => (
                                        <option key={index} value={option.value}>{option.text}</option>
                                    ))}
                                </select>
                                {validationMessage && <p className="error-message">{validationMessage}</p>}
                            </div>
                        )}
                    </div>
                    <div className='mt-5 flex justify-between'>
                        <Buttons className="next" onClick={handleNext}>
                            Next
                        </Buttons>
                    </div>
                </>
            );
        } else if (step === "Pretest Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        <div className='text-white mt-4 text-center'>
                            {questions.length > 0 ? (
                                <p>
                                    <ReactTyped strings={[questions[currentQuestionIndex].question_text]} typeSpeed={25} />
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col md:flex-row gap-2'>
                        <Buttons className="tama" onClick={() => handleNext('Tama')}>Tama</Buttons>
                        <Buttons className="mali" onClick={() => handleNext('Mali')}>Mali</Buttons>
                        <Buttons className="next" onClick={() => handleNext('Di Alam')}>Di Alam</Buttons>
                    </div>
                </>
            );
        } else if (step === "Intervention Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        {/* <img src={spermy} alt="" className='spermy' /> */}
                        <div className='flex justify-center items-center'>
                            {interventions.length > 0 ? (
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/Ut_vf1QwJZo?si=87ArteQLqX7ZYWg-" allow="autoplay" className='youtube-vid'></iframe>
                            ) : null}
                        </div>
                    </div>
                    <Buttons className="next mt-5" onClick={handleNext}>
                        Next
                    </Buttons>
                </>
            );
        } else if (step === "Posttest Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                        <div className='text-white mt-4 text-center'>
                            {questions.length > 0 ? (
                                <p>
                                    <ReactTyped strings={[questions[currentQuestionIndex].question_text]} typeSpeed={25} />
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col md:flex-row gap-2'>
                        <Buttons className="tama" onClick={() => handleNext('Tama')}>Tama</Buttons>
                        <Buttons className="mali" onClick={() => handleNext('Mali')}>Mali</Buttons>
                        <Buttons className="next" onClick={() => handleNext('Di Alam')}>Di Alam</Buttons>
                    </div>
                </>
            );
        } else if (step === "Rating Page") {
            return (
                <>
                    <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                       <h2>Done</h2>
                    </div>
                    <Buttons className="tama mt-5" onClick={() => handleNext()}>Done</Buttons>
                </>
            );
        }
    }

    return (
        <div className='game-container flex flex-col items-center justify-center h-dvh p-10'>
            {renderStepContent()}
        </div>
    );
}
