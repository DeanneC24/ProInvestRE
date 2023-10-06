import React, { useState, ChangeEvent, FormEvent } from 'react'
import '../styles/adminLogin.css'

interface LoginData {
    username: string
    password: string
}

const AdminLoginPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loginData, setLoginData] = useState<LoginData>({
      username: '',
      password: ''  
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const res = await fetch(`${process.env.BACKEND_BASE_URL}/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })

            if(res.ok) {
                console.log('Successfully logged in!')
                setIsLoggedIn(true)
                //todo handle
            } else {
                console.log(`Log in was not successful`)
                setErrorMessage('Login failed')
                //todo handle
            }
        } catch (err) {
            console.error(err)
            setErrorMessage('Issue during authentication. Please try again.')
            //Todo add further error handling for network connection errors
        }
    }

    return (
        <div>
            {isLoggedIn ? (
               <h1>User {loginData.username}, you're succesfully logged in!</h1> 
        ) : (
            
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                {errorMessage && <p className='error-message'>{errorMessage}</p> }
                <form onSubmit={handleSubmit} className="form-container">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        )}
    </div>)
}


export default AdminLoginPage