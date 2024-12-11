import styles from "./GameContainer.module.css";

const GameContainer = ({ children, container }) => (
    <div className={`justify-center flex items-center  ${styles[container]}`}>
        {children}
    </div>
);

export default GameContainer;
