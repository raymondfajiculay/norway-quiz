import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";

// Quizzes
import CreateQuiz from "./Pages/Quizzes/Create";
import CreateQuestion from "./Pages/Questions/Create";
import CreateAttitude from "./Pages/Attitudes/Create";
import CreateFeedback from "./Pages/Feedback/Create";
import CreateIntervention from "./Pages/Interventions/Create";
import UpdateQuiz from "./Pages/Quizzes/Update";
import UpdateQuestion from "./Pages/Questions/Update";
import UpdateIntervention from "./Pages/Interventions/Update";
import UpdateAttitude from "./Pages/Attitudes/Update";
import UpdateFeedback from "./Pages/Feedback/Update";
import Show from "./Pages/Quizzes/Show";
import Dashboard from "./Pages/Dashboard";
import OverAllDashboard from "./Pages/Dashboard/OverAllDashboard";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

// Game
import GameUser from "./Pages/Game/Index";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";

export default function App() {
    const { user } = useContext(AppContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    <Route
                        path="/login"
                        element={user ? <Home /> : <Login />}
                    />

                    <Route
                        path="/register"
                        element={user ? <Home /> : <Register />}
                    />

                    {/* Quizzes */}
                    <Route
                        path="/create/quiz"
                        element={user ? <CreateQuiz /> : <Login />}
                    />

                    <Route path="/quiz/:slug" element={<Show />} />

                    <Route
                        path="/quiz/update/:slug"
                        element={user ? <UpdateQuiz /> : <Login />}
                    />

                    {/* Questions */}
                    <Route
                        path="/create/question/:slug"
                        element={user ? <CreateQuestion /> : <Login />}
                    />

                    <Route
                        path="/update/question/:slug"
                        element={user ? <UpdateQuestion /> : <Login />}
                    />

                    {/* Interventions */}
                    <Route
                        path="/create/intervention/:slug"
                        element={user ? <CreateIntervention /> : <Login />}
                    />

                    <Route
                        path="/update/intervention/:slug"
                        element={user ? <UpdateIntervention /> : <Login />}
                    />

                    {/* Attitudes */}
                    <Route
                        path="/create/attitude/:slug"
                        element={user ? <CreateAttitude /> : <Login />}
                    />
                    <Route
                        path="/update/attitude/:slug"
                        element={user ? <UpdateAttitude /> : <Login />}
                    />

                    {/* Feedbacks */}
                    <Route
                        path="/create/feedback/:slug"
                        element={user ? <CreateFeedback /> : <Login />}
                    />
                    <Route
                        path="/update/feedback/:slug"
                        element={user ? <UpdateFeedback /> : <Login />}
                    />

                    <Route
                        path="/dashboard/:slug"
                        element={user ? <Dashboard /> : <Login />}
                    />

                    <Route
                        path="/forgotpassword"
                        element={user ? <Home /> : <Login />}
                    />

                    <Route
                        path="/overall-dashboard"
                        element={
                            user ? <OverAllDashboard /> : <ForgotPassword />
                        }
                    />

                    <Route path="/home" element={user ? <Home /> : <Login />} />
                </Route>
                <Route path="/:slug" element={<Layout hideHeader />}>
                    <Route index element={<GameUser />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
