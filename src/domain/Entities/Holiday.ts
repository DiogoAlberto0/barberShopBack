import { Time } from "../valueObjects/Time/Time";

export type IHolidayProps = {
    date: Date,
    openTime: Time,
    closeTime: Time,
    isClosed: boolean
}
export class Holiday {
    constructor(
        public readonly props: IHolidayProps
    ) {
        if (this.props.openTime.props.hour > this.props.closeTime.props.hour) throw new Error('O horário de abertura deve ser anterior ao de fechamento')

        const day = this.props.date.getDate()
        const month = this.props.date.getMonth()
        const year = this.props.date.getFullYear()

        this.props.date = new Date(year, month, day)
    }
}