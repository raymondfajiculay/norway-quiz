import React from "react";
import "./Buttons.css";
import { motion } from "framer-motion";

function Buttons({ children, className, onClick, loading }) {
    return (
        <motion.div
            initial={{ scale: 0.1 }}
            animate={{ scale: 0.8 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
            whileHover={{ scale: 0.8 }}
            whileTap={{ scale: 0.6 }}
        >
            <button
                className={`buttons ${className}`}
                onClick={onClick}
                disabled={loading}
            >
                {loading ? (
                    <div className="spinner"></div> /* Loading animation */
                ) : (
                    children
                )}
            </button>
        </motion.div>
    );
}

export default Buttons;

// import React, { useEffect } from "react";
// import "./Buttons.css";

// import buttonClickSound from "../../assets/mouseclick.mp3";

// function Buttons({ children, className }) {
//     const playButtonClickSound = () => {
//         const audio = new Audio(buttonClickSound);
//         audio.play();
//     };

//     useEffect(() => {
//         // Preload the audio file
//         const audio = new Audio(buttonClickSound);
//         audio.preload = "auto";
//     }, []);

//     return (
//         <button
//             className={`buttons ${className}`}
//             onClick={(e) => {
//                 playButtonClickSound();
//                 if (onClick) {
//                     onClick(e);
//                 }
//             }}
//             type={type}
//         >
//             {children}
//         </button>
//     );
// }

// export default Buttons;
