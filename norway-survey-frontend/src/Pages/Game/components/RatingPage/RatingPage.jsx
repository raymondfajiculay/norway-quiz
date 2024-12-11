import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Buttons from "../../../../Components/Buttons/Buttons";
import GameContainer from "../../../../Components/GameContainer/GameContainer";
import spermy from "../../../../assets/images/spermymotion.gif";
import Loader from "../../../../Components/Loader/Loader";
import styles from "./RatingPage.module.css";

const RatingPage = ({ id, handleNext }) => {
    const [loading, setLoading] = useState(true);
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.ratingPageContainer}>
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
                    className={`${styles.questions} font-bold flex flex-col items-center text-center`}
                >
                    {loading ? (
                        <Loader />
                    ) : (
                        <h2 className="text-center text-sm md:text-lg font-bold p-2">
                            Salamat sa oras na binigay mo para sa maikling quiz
                            na ito. ‘Wag kang mag-alala dahil ang mga
                            impormasyong nakuha namin ay mananatiling
                            confidential. Sana nag-enjoy at natuto ka!
                        </h2>
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
                    <Buttons className="tama mt-5" onClick={handleNext}>
                        Done
                    </Buttons>
                </motion.div>
            </div>
        </div>
    );
};

export default RatingPage;
