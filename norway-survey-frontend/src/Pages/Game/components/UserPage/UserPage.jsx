import GameContainer from "../../../../Components/GameContainer/GameContainer";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    validateNumber,
    validateNickname,
    validateAge,
    validateSelect,
} from "../../validation";
import Buttons from "../../../../Components/Buttons/Buttons";
import spermy from "../../../../assets/images/spermymotion.gif";
import backBtn from "../../../../assets/images/back.png";
import styles from "./UserPage.module.css";

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
        placeholder: "Sex Assigned at birth",
        options: [
            { value: "", text: "Sex Assigned at birth" },
            { value: "Male", text: "Male" },
            { value: "Female", text: "Female" },
        ],
    },
    {
        type: "select",
        name: "identification",
        placeholder: "How do you identify as",
        options: [
            { value: "", text: "How do you identify as" },
            { value: "Male", text: "Male" },
            { value: "Female", text: "Female" },
            { value: "Transgender", text: "Transgender" },
            { value: "Non-Binary", text: "Non-Binary" },
        ],
    },
];

const UserPage = ({ id, setStep, handleUserData }) => {
    const [validationMessage, setValidationMessage] = useState("");
    const [currentFormQuestionIndex, setCurrentFormQuestionIndex] = useState(0);
    const [userData, setUserData] = useState({
        quiz_id: id,
        nickname: "",
        age: "",
        number: "",
        biological_sex: "",
        identification: "",
    });
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [formComplete, setFormComplete] = useState(false);

    async function handleNext(answer = null) {
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

        if (!validationMsg) {
            if (currentFormQuestionIndex < formQuestions.length - 1) {
                setCurrentFormQuestionIndex(currentFormQuestionIndex + 1);
            } else {
                handleUserData(userData);
                setFormComplete(true);
            }
        }
    }

    return (
        <>
            {currentFormQuestionIndex > 0 && (
                <motion.img
                    onClick={() => {
                        if (formComplete === true) {
                            setFormComplete(false);
                        } else {
                            setCurrentFormQuestionIndex(
                                currentFormQuestionIndex - 1
                            );
                        }
                    }}
                    src={backBtn}
                    className={styles.backBtnMobile}
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

            <GameContainer container={containerClass}>
                {!formComplete ? (
                    <>
                        {/* Back Button */}
                        {currentFormQuestionIndex > 0 && (
                            <motion.img
                                onClick={() =>
                                    setCurrentFormQuestionIndex(
                                        currentFormQuestionIndex - 1
                                    )
                                }
                                src={backBtn}
                                className={styles.backBtnDesktop}
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

                        {/* Sperm Image */}
                        <div className="question-container">
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
                        </div>
                    </>
                ) : (
                    <>
                        <div className="question-container">
                            <motion.img
                                src={spermy}
                                className={styles.spermysummary}
                                initial={{ scale: 0.1 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                }}
                            />
                        </div>
                        <div className={styles.summary}>
                            <h1 className="text-center text-lg">
                                {" "}
                                <strong>Personal Details </strong>
                            </h1>
                            <p>
                                <strong>Nickname:</strong> {userData.nickname}
                            </p>
                            <p>
                                <strong>Age:</strong> {userData.age}
                            </p>
                            <p>
                                <strong>Phone Number:</strong> {userData.number}
                            </p>
                            <p>
                                <strong>Sex Assigned at Birth:</strong>{" "}
                                {userData.biological_sex}
                            </p>
                            <p>
                                <strong>Gender Identity:</strong>{" "}
                                {userData.identification}
                            </p>
                        </div>
                    </>
                )}
            </GameContainer>

            {/* Input Fields */}
            {!formComplete && (
                <div className="input-container z-10 mt-4">
                    {formQuestions[currentFormQuestionIndex].type ===
                        "text" && (
                        <div className="flex flex-col justify-center">
                            <input
                                className="w-1/2 text-center"
                                type="text"
                                name={
                                    formQuestions[currentFormQuestionIndex].name
                                }
                                placeholder={
                                    formQuestions[currentFormQuestionIndex]
                                        .placeholder
                                }
                                value={
                                    userData[
                                        formQuestions[currentFormQuestionIndex]
                                            .name
                                    ]
                                }
                                onChange={handleInputChange}
                                required
                            />
                            {validationMessage && (
                                <p className="error-message mt-2 text-red-600 text-center">
                                    {validationMessage}
                                </p>
                            )}
                        </div>
                    )}
                    {formQuestions[currentFormQuestionIndex].type ===
                        "number" && (
                        <div>
                            <input
                                className="text-center"
                                type="number"
                                name={
                                    formQuestions[currentFormQuestionIndex].name
                                }
                                placeholder={
                                    formQuestions[currentFormQuestionIndex]
                                        .placeholder
                                }
                                value={
                                    userData[
                                        formQuestions[currentFormQuestionIndex]
                                            .name
                                    ]
                                }
                                onChange={handleInputChange}
                                required
                            />
                            {validationMessage && (
                                <p className="error-message mt-2 text-red-600 text-center">
                                    {validationMessage}
                                </p>
                            )}
                        </div>
                    )}
                    {formQuestions[currentFormQuestionIndex].type ===
                        "select" && (
                        <div>
                            <select
                                className="text-center"
                                name={
                                    formQuestions[currentFormQuestionIndex].name
                                }
                                value={
                                    userData[
                                        formQuestions[currentFormQuestionIndex]
                                            .name
                                    ]
                                }
                                onChange={handleInputChange}
                                required
                            >
                                {formQuestions[
                                    currentFormQuestionIndex
                                ].options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.text}
                                    </option>
                                ))}
                            </select>
                            {validationMessage && (
                                <p className="error-message mt-2 text-red-600 text-center">
                                    {validationMessage}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Buttons */}
            {!formComplete ? (
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
            ) : (
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
                        <Buttons
                            className="next"
                            onClick={() => setStep("Pretest Page")}
                        >
                            BEGIN
                        </Buttons>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default UserPage;
