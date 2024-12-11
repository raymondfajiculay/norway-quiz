import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ButtonXSad from "../../../../assets/images/button_xsad.png";
import ButtonSad from "../../../../assets/images/button_sad.png";
import ButtonNeutral from "../../../../assets/images/button_neutral.png";
import ButtonHappy from "../../../../assets/images/button_happy.png";
import ButtonXHappy from "../../../../assets/images/button_xhappy.png";

import GameContainer from "../../../../Components/GameContainer/GameContainer";
import spermy from "../../../../assets/images/spermymotion.gif";
import styles from "./AttitudePage.module.css";
import Loader from "../../../../Components/Loader/Loader";
import Buttons from "../../../../Components/Buttons/Buttons";

const AttitudePage = ({ id, attitude, currentAttitudeIndex, handleNext }) => {
    const [loading, setLoading] = useState(true);
    const [isIntro, setIsIntro] = useState(true);
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentAttitudeIndex]);
    return (
        <>
            {isIntro ? (
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
                        <div
                            className={`${styles.questions} text-center font-bold`}
                        >
                            {containerClass === "gamecontainerone" ? (
                                <h1>
                                    Pre, pa-click ng emoji na naaayon sa
                                    nararamdaman mo sa mga statements tungkol sa
                                    consent.
                                </h1>
                            ) : (
                                <h1>
                                    Pre, pa-click ng emoji na naaayon sa
                                    nararamdaman mo sa mga statements na ito
                                    tungkol sa condom.
                                </h1>
                            )}
                        </div>
                    </GameContainer>
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
                            onClick={() => setIsIntro(false)}
                        >
                            Next
                        </Buttons>
                    </motion.div>
                </>
            ) : (
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

                        <div
                            className={`${styles.questions} flex items-center`}
                        >
                            <div className="text-sm md:text-lg font-bold mt-4 text-center">
                                {attitude.length > 0 ? (
                                    loading ? (
                                        <Loader />
                                    ) : (
                                        <p>
                                            {
                                                attitude[currentAttitudeIndex]
                                                    .question_text
                                            }
                                        </p>
                                    )
                                ) : (
                                    <p>No attitude questions available.</p>
                                )}
                            </div>
                        </div>
                    </GameContainer>

                    <div className="mt-5 flex flex-row flex-wrap items-center justify-center">
                        <motion.img
                            onClick={() => handleNext("Lubos Na Di Sang-Ayon")}
                            src={ButtonXSad}
                            alt="Lubos Na Di Sang-Ayon Button"
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
            )}
        </>
    );
};

export default AttitudePage;
