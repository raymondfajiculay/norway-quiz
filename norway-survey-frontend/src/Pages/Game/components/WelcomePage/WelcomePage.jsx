import { motion } from "framer-motion";
import Buttons from "../../../../Components/Buttons/Buttons";
import GameContainer from "../../../../Components/GameContainer/GameContainer";
import astigprelogo from "../../../../assets/images/astigprelogo.png";
import spermy from "../../../../assets/images/spermymotion.gif";
import styles from "./WelcomePage.module.css";

import Loader from "../../../../Components/Loader/Loader";

const WelcomePage = ({ quiz, setStep }) => {
    const isLoading = !quiz;
    const description = quiz ? quiz.description : "";
    const containerClass =
        quiz && quiz.id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    return (
        <>
            <GameContainer container={containerClass}>
                <img
                    src={spermy}
                    className={styles.spermy}
                    alt="spermy"
                    loading="lazy"
                />
                <div className="flex flex-col items-center justify-center p-2">
                    <img
                        src={astigprelogo}
                        className={styles.astigpre}
                        alt="Astig Pre Logo"
                        loading="lazy"
                    />

                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p
                            className="mt-5 font-custom text-xl text-white text-center"
                            style={{
                                WebkitTextStroke: ".5px black",
                            }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </GameContainer>

            <motion.div
                initial={{ scale: 0.1 }}
                animate={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.6 }}
            >
                <Buttons
                    className="next mt-5"
                    onClick={() => setStep("User Page")}
                >
                    Play Now
                </Buttons>
            </motion.div>
        </>
    );
};

export default WelcomePage;
