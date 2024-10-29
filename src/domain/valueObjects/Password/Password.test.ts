import { describe, it, expect } from 'vitest'

import { Password } from './Password'

describe('Password Value Object', () => {

    it('should throw an error when trying to create a Password with an invalid format', () => {
        expect(() => Password.create('12345')).toThrow('A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial')
    })

    it('should successfully generate a hash from a valid password', () => {
        const password = Password.create('123456789Abc.')
        expect(password.getHash()).toBeTypeOf('string')
    })

    it('should return false when comparing with an incorrect password', () => {
        const password = Password.create('123456789Abc.')
        expect(password.compare('987654321Abc.')).toBeFalsy()
    })

    it('should return true when comparing with the correct password', () => {
        const password = Password.create('123456789Abc.')
        expect(password.compare('123456789Abc.')).toBeTruthy()
    })
})
