import axios from 'axios'
import { verifyHash } from '../../shared/hash'

export const authenticateUser = async (username: string | undefined, password: string | undefined) => {
    try {
        
        if (username === undefined || password === undefined ) {
            console.log('Username or password is undefined')
            return false
        }
        const esGetUserResponse = await axios.get(
            `${process.env.BACKEND_BASE_URL}/es/getUser` // TODO remove hardcode
        )
        const userProfile = esGetUserResponse.data
        if (Object.keys(userProfile).length === 0) {
            console.log(`User ${username} not found`)
            return false
        }

        const passwordsMatch = await verifyHash(password, userProfile.password)

        if(passwordsMatch) {
            console.log(`User ${username} authenticated successfully.`)
            return true
        } else {
            console.log(`Authentication failed for user ${username}.`)
            return false
        }
    } catch (err) {
        console.log(`Error authenticating user: `, err)
        return false
    }
}