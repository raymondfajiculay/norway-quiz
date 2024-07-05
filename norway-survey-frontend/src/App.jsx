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
import Show from './Pages/Quizzes/Show'


import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import { useContext } from 'react'
import { AppContext } from './Context/AppContext'
import Update from './Pages/Posts/Update'

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
            
                {/* <Route path='/posts/:id' element={<Show/>}/> */}

                <Route path='/posts/update/:id' element={user ? <Update/> : <Login/>}/>

                <Route path='/quizzes/:id' element={<Show/>}/>
            </Route>
        </Routes>
  </BrowserRouter>
  )
}
