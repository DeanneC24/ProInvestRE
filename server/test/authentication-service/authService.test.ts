import axios from 'axios'
import { authenticateUser } from '../../src/authentication-service/services/authService'
import { verifyHash } from '../../src/shared/hash'
import exp from 'constants'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('../../src/shared/hash')
const mockedVerifyHash = verifyHash as jest.MockedFunction<typeof verifyHash>


describe('User authentication service', () => {
    it('Should return true for a valid user', async () => {
        // Given a valid user complete with a valid username and matched hashed pw
        const mockUsername = 'test-user'
        const mockPassword = 'test-pw'
        const mockValidUser = {
            data : {
                username: mockUsername,
                mockPassword: mockPassword
            }
            
        }
        mockedAxios.get.mockResolvedValue(mockValidUser)
        mockedVerifyHash.mockResolvedValue(true)
        // When authenticateUser is called 
        const res = await authenticateUser(mockUsername, mockPassword)
        // Then the user is valid and the method returns true
        expect(res).toBeTruthy()

    })

    it('Should return false for an invalid password', async () => {
        // Given an invalid user complete with a valid username and matched hashed pw
        const mockUsername = 'test-user'
        const mockPassword = 'test-invalid-pw'
        const mockValidUser = {
            data : {
                username: mockUsername,
                mockPassword: mockPassword
            }
            
        }
        mockedAxios.get.mockResolvedValue(mockValidUser)
        mockedVerifyHash.mockResolvedValue(false)
        // When authenticateUser is called 
        const res = await authenticateUser(mockUsername, mockPassword)
        // Then the user is invalid and the method returns false
        expect(res).toBeFalsy()
    })

    it("Should return false for when the user doesn't exist", async () => {
        // Given an invalid user
        const mockUsername = 'test-nonexistant-user'
        const mockPassword = 'test-pw'
        const mockValidUser = {
            data : {}
        }
        const consoleLogSpy = jest.spyOn(console, 'log')
        mockedAxios.get.mockResolvedValue(mockValidUser)
        mockedVerifyHash.mockResolvedValue(false)
        // When authenticateUser is called 
        const res = await authenticateUser(mockUsername, mockPassword)
        // Then the user is invalid and the method returns false
        expect(res).toBeFalsy()
        expect(consoleLogSpy).toHaveBeenCalledWith(`User ${mockUsername} not found`)
    })
})