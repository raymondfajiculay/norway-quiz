import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Chart from "chart.js/auto";

const Dashboard = () => {
    const { slug } = useParams();

    // Requested Data
    const [gender, setGender] = useState("");
    const [startAge, setStartAge] = useState(0);
    const [endAge, setEndAge] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Returned Data
    const [preTestScore, setPreTestScore] = useState(null);
    const [postTestScore, setPostTestScore] = useState(null);
    const [questions, setQuestions] = useState([]);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Fetch data from the API
    const fetchMessage = async () => {
        try {
            const res = await fetch(
                 `${import.meta.env.VITE_API_URL}/dashboard/${slug}?sex=${gender}&startAge=${startAge}&endAge=${endAge}&startDate=${startDate}&endDate=${endDate}`
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
    };

      // Trigger Fetch Data from API on Page Load
      useEffect(() => {
        fetchMessage();
    }, [slug]);

    // Update chart when questions change
    useEffect(() => {
        if (questions.length > 0 && chartRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const ctx = chartRef.current.getContext("2d");
            const chartData = questions.map((question) => ({
                question: `${question.question}`, // Dynamically setting question text
                preTest: question.preTestCorrect, // Use real data if available
                postTest: question.postTestCorrect, // Use real data if available
            }));

            chartInstanceRef.current = new Chart(ctx, {
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
                            callbacks: {
                                label: function (tooltipItem) {
                                    const questionIndex = tooltipItem.dataIndex;
                                    const questionText =
                                        chartData[questionIndex].question;
                                    return `${questionText}: ${tooltipItem.raw}%`;
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
            <div className="flex justify-end gap-2 items-center text-white mb-4">
                <select
                    className="p-1 rounded bg-white text-black text-sm w-28"
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <input
                    type="number"
                    className="rounded bg-white text-black text-sm"
                    onChange={(e) => setStartAge(e.target.value)}
                    value={startAge}
                    style={{ width: '100px', padding: '5px' }} 
                    placeholder="Start Age"
                />

                <input
                    type="number"
                    className="rounded bg-white text-black text-sm"
                    onChange={(e) => setEndAge(e.target.value)}
                    value={endAge}
                    style={{ width: '100px', padding: '5px' }} 
                    placeholder="End Age"
                />

                <input
                    type="date"
                    className="p-1 rounded bg-white text-black text-sm w-30"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                />

                <input
                    type="date"
                    className="p-1 rounded bg-white text-black text-sm w-30"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                />

                <button
                    className="px-2 py-1 bg-blue-600 rounded"
                    onClick={fetchMessage}
                >
                    Filter
                </button>
            </div>

            <div className="flex flex-row justify-between items-center text-white gap-3">
                <h1 className="text-2xl flex-1">
                    <span className="text-green-600 font-semibold">Pre</span> &{" "}
                    <span className="text-violet-600 font-semibold">Post</span>{" "}
                    Test Result |{" "}
                    <span className="font-bold">
                        {slug
                            .split("-")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                    </span>
                </h1>

                <div className="flex flex-col items-center">
                    <p className="text-lg text-green-600 font-semibold">
                        Pre Test
                    </p>
                    <p className="text-3xl text-green-600 font-bold">
                        {preTestScore}%
                    </p>
                    <p className="text-xs text-white">Overall Percentage</p>
                </div>

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
