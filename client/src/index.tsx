import React from 'react'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Banner from './components/Banner'
import HiddenAdminPage from './pages/HiddenAdminStub';//TODO REMOVE 
import PageDoesntExist from './pages/PageDoesntExist'
import ReactDOM from 'react-dom/client'
import AdminLoginPage from './pages/AdminLogin'
import Search from './pages/Search'

export default function App() {
  return(
    <BrowserRouter>
    <Banner/>
      <Routes>
        <Route path='/' element={<Search/>}/>
        <Route path='/admin-login' element={<AdminLoginPage/>}/>
        <Route path='/*' element={<PageDoesntExist/>}/>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(<App/>)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
