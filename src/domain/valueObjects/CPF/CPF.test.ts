import { describe, it, expect } from 'vitest'
import { CPF } from './CPF'


describe('CPF value object tests', () => {


    it('should not be possible to instance an invalid CPF', () => {
        expect(() => new CPF('12345678910')).toThrow('CPF inválido')
    })

    it('should not be possible to instance an invalid CPF', () => {
        expect(() => new CPF('123.456.789-10')).toThrow('CPF inválido')
    })

    it('should be possible to instance an valid and cleaned CPF and get cleaned and formated', () => {

        const cpf = new CPF('07156817108')

        expect(cpf.cleaned).toStrictEqual('07156817108')
        expect(cpf.formated).toStrictEqual('071.568.171-08')
    })

    it('should be possible to instance an valid and formatted CPF and get cleaned and formated', () => {

        const cpf = new CPF('071.568.171-08')

        expect(cpf.cleaned).toStrictEqual('07156817108')
        expect(cpf.formated).toStrictEqual('071.568.171-08')
    })
})