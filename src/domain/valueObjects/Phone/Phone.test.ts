import { describe, expect, it, test } from "vitest";
import { Phone } from "./Phone";


describe('util class Phone tests', () => {

    it('should not be possible to instance class with a phone number less than 10 and more than 11', () => {
        expect(() => new Phone('12345')).toThrow('Telefone inválido')
    })

    it('should not be possible to instance class with a phone number less than 10 and more than 11', () => {
        expect(() => new Phone('(61)98654-82')).toThrow('Telefone inválido')
    })

    it('should be able to instance the class with a phone number with 10 length ', () => {
        expect(new Phone('(61)98654-827')).toBeInstanceOf(Phone)
    })

    it('should be able to instance the class with a phone number with 11 length ', () => {
        expect(new Phone('(61)98654-8270')).toBeInstanceOf(Phone)
    })

    test('if the "format" method is expected to return the phone number with parentheses and dash', () => {
        expect(new Phone('61986548270').format()).toEqual('+55 (61)98654-8270')
    })

    test('if the "format" method is expected to return the phone number with parentheses and dash', () => {
        expect(new Phone('6198654827').format()).toEqual('+55 (61)9865-4827')
    })

    test('if the "format" method is expected to return the phone number with parentheses and dash', () => {
        expect(new Phone('6198654827', 1).format()).toEqual('+1 (61)9865-4827')
    })

})