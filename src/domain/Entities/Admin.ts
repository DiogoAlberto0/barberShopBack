import { randomUUID } from "crypto";

//value object
import { CPF } from "../valueObjects/CPF/CPF";
import { Password } from "../valueObjects/Password/Password";
import { Phone } from "../valueObjects/Phone/Phone";

//Entity
import { IUserBuildProps, IUserWithProps, User } from "./User";


type IAdminBuildProps = IUserBuildProps & {}

type IAdminWithProps = IUserWithProps & {}

export class Admin extends User {

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: Phone,
        public readonly cpf: CPF,
        public readonly password: Password,
    ) {
        super(id, name, phone, cpf, password)
    }

    static build({
        name,
        phone,
        cpf,
        password,
    }: IAdminBuildProps) {
        return new Admin(
            randomUUID(),
            name.toLowerCase(),
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
    }: IAdminWithProps) {
        return new Admin(
            id,
            name.toLocaleLowerCase(),
            phone,
            cpf,
            password
        );
    }

}
