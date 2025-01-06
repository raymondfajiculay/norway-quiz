import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Chart from "chart.js/auto";

const Dashboard = () => {
    const { slug } = useParams();
    const [preTestScore, setPreTestScore] = useState();
    const [postTestScore, setPostTestScore] = useState();
    const [questions, setQuestions] = useState([]);
    const chartRef = useRef(null);

    // Fetch data from the API
    async function fetchMessage() {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/dashboard/${slug}`
            );

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();
            setPreTestScore(data.pre_test_score);
            setPostTestScore(data.post_test_score);
            setQuestions(data.questions);
        } catch (error) {
            console.error(
                "An error occurred while fetching the message:",
                error
            );
        }
    }

    useEffect(() => {
        fetchMessage();
    }, [slug]);

    const chartData = questions.map((question) => ({
        question: `${question.question}`, // Dynamically setting question text
        preTest: question.preTestCorrect, // Use real data if available
        postTest: question.postTestCorrect, // Use real data if available
    }));

    useEffect(() => {
        if (questions.length > 0 && chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: chartData.map((_, index) => `Q${index + 1}`),
                    datasets: [
                        {
                            label: "Pre Test",
                            data: chartData.map((item) => item.preTest), // Pre-test data
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Post Test",
                            data: chartData.map((item) => item.postTest), // Post-test data
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                            borderColor: "rgba(153, 102, 255, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            // Custom tooltip to display the actual question text
                            callbacks: {
                                label: function (tooltipItem) {
                                    // Get the index of the bar being hovered over
                                    const questionIndex = tooltipItem.dataIndex;
                                    const questionText =
                                        chartData[questionIndex].question; // Actual question text
                                    return `${questionText}: ${tooltipItem.raw}%`; // Show question text and the percentage
                                },
                            },
                        },
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Comparison of Correct Answers for Each Question",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Questions",
                            },
                            // Use rotated labels to prevent text overlap
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Percentage",
                            },
                            ticks: {
                                stepSize: 10,
                                max: 110,
                            },
                        },
                    },
                },
            });
        }
    }, [questions]);

    return (
        <div className="bg-slate-700 p-5 min-h-dvh">
            <div className="flex flex-row justify-between items-center text-white gap-3">
                {/* Dashboard in the center */}
                <h1 className="text-2xl flex-1 ">
                    <span className="text-green-600 font-semibold">Pre</span> &
                    <span className="text-violet-600 font-semibold"> Post</span>{" "}
                    Test Result |{" "}
                    <span className="font-bold">
                        {" "}
                        {slug
                            .split("-")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                    </span>
                </h1>

                {/* Pre Test */}
                <div className="flex flex-col items-center">
                    <p className="text-lg text-green-600 font-semibold">
                        Pre Test
                    </p>
                    <p className="text-3xl text-green-600 font-bold">
                        {preTestScore}%
                    </p>
                    <p className="text-xs text-white">Overall Percentage</p>
                </div>

                {/* Post Test */}
                <div className="flex flex-col items-center">
                    <p className="text-lg text-violet-600 font-semibold">
                        Post Test
                    </p>
                    <p className="text-3xl text-violet-600 font-bold">
                        {postTestScore}%
                    </p>
                    <p className="text-xs text-white">Overall Percentage</p>
                </div>
            </div>

            <div className="mt-5">
                <canvas ref={chartRef} height={110}></canvas>
            </div>
        </div>
    );
};

export default Dashboard;
