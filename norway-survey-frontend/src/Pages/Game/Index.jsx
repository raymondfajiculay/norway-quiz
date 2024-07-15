import './index.css';
import spermy from "../../assets/images/spermymotion.gif";
import astigprelogo from "../../assets/images/astigprelogo.png"
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function User() {
    const {id} = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [interventions, setInterventions] = useState([]);

    async function getQuizzes() {
        const res = await fetch(`/api/quizzes/${id}`);
        const data = await res.json();

        if(res.ok) {
            setQuiz(data.quiz);
            setQuestions(data.questions);
            setInterventions(data.interventions);
        }

            console.log(questions);
            console.log(interventions);
    }

    useEffect(() => {
        getQuizzes();
    }, []);

    return (
        <div className='game-container flex flex-col items-center justify-center h-dvh p-10'>
            <div className="question-container h-40 w-96 md:w-1/2 md:h-80 flex justify-center items-center p-5 md:p-10">
                <img src={spermy} alt="" className='spermy'/>
                <div className='flex flex-col justify-center items-center'>
                    <img src={astigprelogo} alt="" className='h-20 md:h-30 lg:h-40' />
                    {
                        quiz ? (
                            <p className='mt-4'>{quiz.description}</p>
                        ) : (null)
                    }
                </div>
            </div>

           <div className='text-white mt-4'>
                <h2>Questions: </h2>
                {questions ? (
                    questions.length > 0 ? (
                        questions.map((item) => (
                            <p key={item.id}>{item.question_text}</p>
                        ))
                    ) : null
                ) : null}
           </div>

           <div className='text-white mt-4'>
                <h2>Interventions: </h2>
                {interventions ? (
                    interventions.length > 0 ? (
                        interventions.map((item) => (
                            <p key={item.id}>{item.link}</p>
                        ))
                    ) : null
                ) : null}
           </div>

        </div>
    );
}