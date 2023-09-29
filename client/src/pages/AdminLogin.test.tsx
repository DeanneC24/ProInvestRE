// import React from 'react'
import axios from 'axios'
import { render, screen, fireEvent, act } from '@testing-library/react'
import AdminLoginPage from './AdminLogin'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AdminLoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(<AdminLoginPage />)
    })

    it('renders the admin login form', () => {
        const usernameInput = screen.getByPlaceholderText('Username')
        const passwordInput = screen.getByPlaceholderText('Password')
        const loginButton = screen.getByText('Login')

        expect(usernameInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(loginButton).toBeInTheDocument()
    })

    // it('handles form submission and logs in', async () => {
    //     // Mock a successful login response
    //     mockedAxios.post.mockResolvedValue({success: true})

    //     // Simulate user input and form submission
    //     const usernameInput = screen.getByPlaceholderText('Username');
    //     const passwordInput = screen.getByPlaceholderText('Password');
    //     const loginButton = screen.getByText('Login');

    //     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //     fireEvent.change(passwordInput, { target: { value: 'password123' } });

    //     await act(async () => {
    //     fireEvent.click(loginButton);
    //     // Wait for the asynchronous fetch and component update
    //     });

    //     // Check if the success message is displayed
    //     const successMessage = screen.getByText("User testuser, you're successfully logged in!");
    //     expect(successMessage).toBeInTheDocument();
    // })

    // it('handles login failure', async () => {
    //     // Mock a failed login response
    //     fetch.mockResolvedValueOnce({
    //     ok: false,
    //     json: async () => ({ error: 'Login failed' }),
    //     });

    //     // Simulate user input and form submission
    //     const usernameInput = screen.getByPlaceholderText('Username');
    //     const passwordInput = screen.getByPlaceholderText('Password');
    //     const loginButton = screen.getByText('Login');

    //     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //     fireEvent.change(passwordInput, { target: { value: 'incorrectpassword' } });

    //     await act(async () => {
    //     fireEvent.click(loginButton)
    //     // Wait for the asynchronous fetch and component update
    //     })

    //     // Check if the error message is displayed
    //     const errorMessage = screen.getByText('Unfortunately log in was not successful')
    //     expect(errorMessage).toBeInTheDocument()
    // })
})
// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import AdminLoginPage from '././AdminLogin'
// import axios from 'axios'

// jest.mock('axios')
// const mockedAxios = axios as jest.Mocked<typeof axios>

// describe('AdminLoginPage', () => {

//     it('displays an error message on failed login', async () => {
//         // Mock the fetch function to simulate a failed login
//         mockedAxios.post.mockResolvedValue({
//             response: {
//                 data: { error: 'Unauthorized'},
//                 status: 404
//             }
//         })

//         render(<AdminLoginPage />)

//         const usernameInput = screen.getByPlaceholderText('Username')
//         const passwordInput = screen.getByPlaceholderText('Password')
//         const loginButton = screen.getByText('Login')

//         fireEvent.change(usernameInput, { target: { value: 'testuser' } })
//         fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
//         fireEvent.click(loginButton)

//         await waitFor(() => {
//             const errorMessage = screen.getByText('Login failed')
//             expect(errorMessage).toBeInTheDocument()
//         })
//     })

    // it('displays a success message on successful login', async () => {
    //     // Mock the fetch function to simulate a successful login
    //     global.fetch.mockResolvedValue({
    //     ok: true,
    //     json: () => Promise.resolve({ message: 'Login successful' }),
    //     });

    //     const { getByText, getByPlaceholderText, queryByTestId } = render(
    //     <AdminLoginPage />
    //     );

    //     const usernameInput = getByPlaceholderText('Username');
    //     const passwordInput = getByPlaceholderText('Password');
    //     const loginButton = getByText('Login');

    //     // Simulate user input and form submission
    //     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //     fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    //     fireEvent.click(loginButton);

    //     // Wait for the success message to appear
    //     await waitFor(() => {
    //     const successMessage = queryByTestId('success-message');
    //     expect(successMessage).toBeInTheDocument();
    //     expect(successMessage).toHaveTextContent('Login successful');
    //     });
    // });
// })
