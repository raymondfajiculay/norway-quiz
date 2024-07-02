import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Pages/Layout'
import Home from './Pages/Home'
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
            </Route>
        </Routes>
  </BrowserRouter>
  )
}
