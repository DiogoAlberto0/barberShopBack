import { describe, it, expect } from 'vitest';
import { Time } from './Time';

describe('testing util class Time', () => {

    it('should not be able to instantiate a class with an invalid hour', () => {
        expect(() => new Time({ hour: 25, minute: 0 })).toThrow('As horas devem estar entre 00 e 23');
        expect(() => new Time({ hour: -1, minute: 0 })).toThrow('As horas devem estar entre 00 e 23');
    });

    it('should not be able to instantiate a class with invalid minutes', () => {
        expect(() => new Time({ hour: 0, minute: 70 })).toThrow('Os minutos devem estar entre 00 e 59');
        expect(() => new Time({ hour: 0, minute: -5 })).toThrow('Os minutos devem estar entre 00 e 59');
    });

    it('should correctly format time to string', () => {
        const time1 = new Time({ hour: 8, minute: 0 });
        expect(time1.toString()).toEqual('08:00');

        const time2 = new Time({ hour: 12, minute: 30 });
        expect(time2.toString()).toEqual('12:30');

        const time3 = new Time({ hour: 23, minute: 59 });
        expect(time3.toString()).toEqual('23:59');
    });

    it('should increment time correctly without changing the original instance', () => {
        const time = new Time({ hour: 12, minute: 0 });
        const incrementedTime = time.increment(120);

        expect(incrementedTime.toString()).toStrictEqual('14:00');
        expect(time.toString()).toStrictEqual('12:00');
    });

    it('should correctly handle incrementing minutes across hour boundaries', () => {
        const time = new Time({ hour: 11, minute: 45 });
        const incrementedTime = time.increment(30);

        expect(incrementedTime.toString()).toStrictEqual('12:15');
    });

    it('should correctly handle incrementing minutes across day boundaries', () => {
        const time = new Time({ hour: 23, minute: 45 });
        const incrementedTime = time.increment(30);

        expect(incrementedTime.toString()).toStrictEqual('00:15');
    });

    it('should handle large increments of minutes', () => {
        const time = new Time({ hour: 10, minute: 15 });
        const incrementedTime = time.increment(1440); // 1440 minutes = 24 hours

        expect(incrementedTime.toString()).toStrictEqual('10:15');
    });
});
