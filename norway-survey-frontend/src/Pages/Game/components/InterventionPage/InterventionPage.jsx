import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Buttons from "../../../../Components/Buttons/Buttons";
import GameContainer from "../../../../Components/GameContainer/GameContainer";
import spermy from "../../../../assets/images/spermymotion.gif";
import styles from "./InterventionPage.module.css";

const InterventionPage = ({
    id,
    interventions,
    handleNext,
    currentInterventionIndex,
    setCurrentInterventionIndex,
}) => {
    const containerClass =
        id % 2 === 0 ? "gamecontainerone" : "gamecontainertwo";

    /*----------------------------------------------------*/
    /*------------- Video Related Controls----------------*/
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [isIntro, setIsIntro] = useState(true);
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
    }, [isIntro, currentInterventionIndex]);

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
                        const startTime =
                            interventions[currentInterventionIndex].start_time;
                        event.target.seekTo(startTime, true);
                    },
                },
            });
        }
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            if (currentInterventionIndex < interventions.length - 1) {
                setIsNextDisabled(true);
                setCurrentInterventionIndex((prevIndex) => prevIndex + 1);
            } else {
                setIsNextDisabled(false);
            }
        }
    };
    /*------------- Video Related Controls----------------*/
    /*----------------------------------------------------*/

    const handleNextClick = () => {
        if (!isNextDisabled) {
            // Custom logic for handling next step after all videos
            handleNext();
        }
    };

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
                        <div className={`${styles.questions}`}>
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-center">
                                    {containerClass === "gamecontainerone"
                                        ? "Panoorin ang video na ito para mas matuto pa tungkol sa consent."
                                        : "Panoorin ang mga video na ito para mas matuto pa tungkol sa 2-in-1 contraceptive na condom."}
                                </h2>
                            </div>
                        </div>
                    </GameContainer>
                    <div className="flex flex-col items-center justify-center">
                        <motion.div>
                            <Buttons
                                className={`next mt-5`}
                                onClick={() => setIsIntro(false)}
                            >
                                Next
                            </Buttons>
                        </motion.div>
                    </div>
                </>
            ) : (
                <>
                    <GameContainer container={containerClass}>
                        {interventions.length > 0 ? (
                            <>
                                <div
                                    className={`${styles.videocontainer} flex flex-col items-center justify-center`}
                                >
                                    <div id="player">
                                        <div ref={playerRef}></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No interventions available.</p>
                        )}
                    </GameContainer>

                    <p className="text-white text-center p-5">
                        Panoorin ang {interventions.length > 1 ? "mga" : ""}{" "}
                        video na 'to para makapunta sa susunod na bahagi ng
                        quiz.
                    </p>

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
            )}
        </>
    );
};

export default InterventionPage;
