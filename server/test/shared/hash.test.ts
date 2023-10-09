import argon2 from 'argon2'
import { hashString, verifyHash } from '../../src/shared/hash'

jest.mock('argon2')
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>


describe('Hash Functions', () => {
  it('should hash a string', async () => {
    // Given a hash response from argon2
    mockedArgon2.hash.mockResolvedValue('mockedHash')
    // When
    const hashedData = await hashString('testData')
    // Then
    expect(hashedData).toBe('mockedHash')
  })

  it('should verify a correct hash', async () => {
    // Given a hash response from argon2
    mockedArgon2.verify.mockResolvedValue(true)
    // When
    const isVerified = await verifyHash('testData', 'correctHash')
    // Then
    expect(isVerified).toBe(true)
  })

  it('should fail to verify an incorrect hash', async () => {
    // Given a verify hash response from argon2
    mockedArgon2.verify.mockResolvedValue(false)
    // When
    const isVerified = await verifyHash('testData', 'incorrectHash')
    // Then
    expect(isVerified).toBe(false)
  })

  it('should handle hashing errors', async () => {
    // Given
    mockedArgon2.hash.mockRejectedValue(new Error('Hashing failed'))
    // When and Then
    await expect(hashString('testData')).rejects.toThrow('Error hashing supplied string')
  })

  it('should handle verification errors', async () => {
    // Given
    mockedArgon2.verify.mockRejectedValue(new Error('Verification failed'))
    // When & Then
    await expect(verifyHash('testData', 'correctHash')).rejects.toThrow('Error verifying hash: Error: Verification failed')
  })
})
