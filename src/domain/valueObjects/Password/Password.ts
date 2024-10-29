import { genSaltSync, hashSync, compareSync } from 'bcrypt'

export class Password {

    private readonly hash: string;

    private constructor(hash: string) {
        this.hash = hash
    }

    getHash = () => this.hash

    static create = (plainText: string) => {

        if (!plainText || !this.isValid(plainText)) throw new Error('A senha deve conter no minimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial')
        const salt = genSaltSync(10)
        const hash = hashSync(plainText, salt)

        return new Password(hash)
    }

    static withHash = (hash: string) => new Password(hash)

    public static isValid = (password: string) => {

        const minLength = 10;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }

    public compare = (plainText: string) => compareSync(plainText, this.hash)

}