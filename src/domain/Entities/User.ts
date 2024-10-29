import { randomUUID } from "node:crypto";
import { CPF } from "../valueObjects/CPF/CPF";
import { Password } from "../valueObjects/Password/Password";
import { Phone } from "../valueObjects/Phone/Phone";

export type IUserBuildProps = {
    name: string,
    phone: Phone,
    cpf: CPF,
    password: Password
}

export type IUserWithProps = {
    id: string,
    name: string,
    phone: Phone,
    cpf: CPF,
    password: Password
}

export class User {

    protected constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: Phone,
        public readonly cpf: CPF,
        public readonly password: Password
    ) { }

    protected static build({
        name,
        phone,
        cpf,
        password
    }: IUserBuildProps) {
        return new User(
            randomUUID(),
            name,
            phone,
            cpf,
            password
        );
    }

    static with({
        id,
        name,
        phone,
        cpf,
        password
    }: IUserWithProps) {
        return new User(
            id,
            name,
            phone,
            cpf,
            password
        );
    }
}
