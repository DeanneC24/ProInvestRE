import argon2 from 'argon2'

export async function hashString(data: string): Promise<string> {
    try {
        const hash = await argon2.hash(data)
        return hash
    } catch(err) {
        throw new Error('Error hashing supplied string')
    }
}

export async function verifyHash(data: string, hashedValue: string): Promise<boolean> {
    try {
        return await argon2.verify(hashedValue, data)
    } catch (err) {
        throw new Error(`Error verifying hash: ${err}`)
    }
}