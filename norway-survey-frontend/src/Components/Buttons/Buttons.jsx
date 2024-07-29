import React from "react";
import "./Buttons.css";

function Buttons({ children, className, onClick }) {
    return (
        <button className={`buttons ${className}`} onClick={onClick}>
            {children}
        </button>
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
