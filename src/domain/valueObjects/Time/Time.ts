
export type ITimeProps = {
    hour: number,
    minute: number
}
export class Time {

    constructor(
        public readonly props: ITimeProps,
    ) {
        if (this.props.hour > 23 || this.props.hour < 0) throw new Error('As horas devem estar entre 00 e 23')
        if (this.props.minute > 59 || this.props.minute < 0) throw new Error('Os minutos devem estar entre 00 e 59')
    }

    increment(minutes: number) {
        const totalMinutes = this.props.hour * 60 + this.props.minute + minutes;
        const newHour = Math.floor(totalMinutes / 60) % 24;
        const newMinute = totalMinutes % 60;

        return new Time({ hour: newHour, minute: newMinute });
    }

    toString = () => {
        return (`${this.props.hour.toString().padStart(2, '0')}:${this.props.minute.toString().padStart(2, '0')}`)
    }
}

