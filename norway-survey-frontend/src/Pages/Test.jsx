import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Buttons from "../Components/Buttons/Buttons";

export default function Test() {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false); // Simulate async action
        }, 1000);
    };

    return (
        <div>
            <Buttons
                className="next mt-5"
                onClick={handleClick}
                loading={loading}
            >
                Next
            </Buttons>
        </div>
    );
}
