type weekDayTypeEN = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
type weekDayTypeBR = 'domingo' | 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado'

type toStringConfig = {
    abbreviated: boolean
}

const defaultConfigString: toStringConfig = {
    abbreviated: false
}

export class WeekDay {

    public readonly day: number

    private abbreviatedStringBR = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    private fullStringBR = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

    private fullStringEN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    private abbreviatedStringEN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    constructor(
        day: number | weekDayTypeEN | weekDayTypeBR | string
    ) {
        if (typeof day == "number") {
            if (day > 6 || day < 0) throw new Error('Os dias devem ir de domingo até segunda')
            this.day = day
        } else {
            let index: number = -1

            index < 0 ? index = this.fullStringBR.findIndex((value) => value === day) : undefined
            index < 0 ? index = this.fullStringEN.findIndex((value) => value === day) : undefined

            if (index < 0) throw new Error('Dia inválido')

            this.day = index
        }
    }

    toStringBR = (config: toStringConfig = defaultConfigString) => {
        if (config.abbreviated) {
            return this.abbreviatedStringBR[this.day]
        } else {
            return this.fullStringBR[this.day]
        }
    }

    toStringEN = (config: toStringConfig = defaultConfigString) => {
        if (config.abbreviated) {
            return this.abbreviatedStringEN[this.day]
        } else {
            return this.fullStringEN[this.day]
        }
    }
}