


export class CPF {

    public readonly cleaned: string

    constructor(
        cleaned: string
    ) {
        if (typeof cleaned != 'string') throw new Error('CPF inválido')
        this.cleaned = this.clean(cleaned)
        if (!this.isValid()) throw new Error('CPF inválido')
    }

    private clean = (cpf: string) => {
        return cpf.replace(/\D/g, '');
    }

    private isValid(): boolean {

        if (this.cleaned.length !== 11 || /^(\d)\1{10}$/.test(this.cleaned)) {
            return false;
        }

        let sum: number;
        let rest: number;

        for (let i = 1; i <= 9; i++) {
            sum = 0;
            for (let j = 0; j < 9; j++) {
                sum += parseInt(this.cleaned.charAt(j)) * (10 - j);
            }
            rest = (sum * 10) % 11;
            if (rest === 10 || rest === 11) rest = 0;
            if (rest !== parseInt(this.cleaned.charAt(9))) return false;

            sum = 0;
            for (let j = 0; j < 10; j++) {
                sum += parseInt(this.cleaned.charAt(j)) * (11 - j);
            }
            rest = (sum * 10) % 11;
            if (rest === 10 || rest === 11) rest = 0;
            if (rest !== parseInt(this.cleaned.charAt(10))) return false;
        }

        return true;
    }


    get formated() {

        const cpf = this.cleaned

        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
    }
}