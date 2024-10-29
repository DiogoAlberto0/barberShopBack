import { describe, it, expect } from 'vitest'
import { WeekDay } from './WeekDay'


describe('Testing util class weekday', () => {


    it('sould be weekday method toString abbreviated return dom', () => {
        const weekDay = new WeekDay(0)

        expect(
            weekDay.toStringBR({
                abbreviated: true
            })
        ).toEqual('dom')
    })

    it('sould be weekday method toString not abbreviated return domingo', () => {
        const weekDay = new WeekDay(0)
        expect(
            weekDay.toStringBR()
        ).toEqual('domingo')
    })



    it('sould be weekday method toString abbreviated return dom', () => {
        const weekDay = new WeekDay(6)
        expect(
            weekDay.toStringBR({
                abbreviated: true
            })
        ).toEqual('sab')
    })

    it('sould be weekday method toString not abbreviated return domingo', () => {
        const weekDay = new WeekDay(6)
        expect(
            weekDay.toStringBR()
        ).toEqual('sábado')
    })

    it('should be instance week day with portugues string day', () => {
        const weekDay = new WeekDay('domingo')

        expect(weekDay.day).toStrictEqual(0)
        expect(weekDay.toStringEN()).toStrictEqual('sunday')
        expect(weekDay.toStringEN({ abbreviated: true })).toStrictEqual('sun')
    })

    it('should be instance week day with portugues string day', () => {
        const weekDay = new WeekDay('sunday')

        expect(weekDay.day).toStrictEqual(0)
        expect(weekDay.toStringBR()).toStrictEqual('domingo')
        expect(weekDay.toStringBR({ abbreviated: true })).toStrictEqual('dom')
    })

    it('should be instance week day with portugues string day', () => {
        expect(() => new WeekDay('asdasdasd')).toThrow()
    })
})