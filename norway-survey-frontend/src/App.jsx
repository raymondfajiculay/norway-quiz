import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Pages/Layout'
import Home from './Pages/Home'

// Posts
// import Create from './Pages/Posts/Create'
// import Show from './Pages/Posts/Show'

// Quizzes
import CreateQuiz from './Pages/Quizzes/Create'
import CreateQuestion from './Pages/Questions/Create'
import CreateIntervention from './Pages/Interventions/Create'
import UpdateQuestion from './Pages/Questions/Update'
import UpdateIntervention from './Pages/Interventions/Update'
import Show from './Pages/Quizzes/Show'
// import Update from './Pages/Posts/Update'

// Game
import GameUser from './Pages/Game/Index'


import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import { useContext } from 'react'
import { AppContext } from './Context/AppContext'


export default function App() {
  const {user} = useContext(AppContext);

  return (
  <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>

                <Route path='/login' element={user ? <Home/> : <Login/>}/>
                
                <Route path='/register' element={user ? <Home/> :<Register/>}/>

                <Route path='/create/quiz' element={user ? <CreateQuiz/> :<Register/>}/>

                <Route path='/create/question/:id' element={user ? <CreateQuestion/> :<Register/>}/>

                <Route path='/update/question/:id' element={user ? <UpdateQuestion/> :<Register/>}/>

                <Route path='/create/intervention/:id' element={user ? <CreateIntervention/> :<Register/>}/>

                <Route path='/update/intervention/:id' element={user ? <UpdateIntervention/> :<Register/>}/>
            
                <Route path='/quizzes/:id' element={<Show/>}/>

                {/* <Route path='/posts/:id' element={<Show/>}/> */}

                {/* <Route path='/posts/update/:id' element={user ? <Update/> : <Login/>}/> */}

                {/* <Route path='/games/:id' element={<GameUser />} /> */}

            </Route>
            <Route path="/games/:id" element={<Layout hideHeader />}>
                <Route index element={<GameUser />} />
            </Route>
        </Routes>
  </BrowserRouter>
  )
}
