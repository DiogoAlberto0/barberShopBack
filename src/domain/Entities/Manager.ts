import { randomUUID } from "crypto";

//value object
import { CPF } from "../valueObjects/CPF/CPF";
import { Password } from "../valueObjects/Password/Password";
import { Phone } from "../valueObjects/Phone/Phone";

//Entity
import { IUserBuildProps, IUserWithProps, User } from "./User";
import { BarberShop } from "./BarberShop";


type IManagerBuildProps = IUserBuildProps & {}

type IManagerWithProps = IUserWithProps & {
    barberShops?: BarberShop[]
}

export class Manager extends User {

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: Phone,
        public readonly cpf: CPF,
        public readonly password: Password,
        public readonly barberShops: BarberShop[]
    ) {
        super(id, name, phone, cpf, password)
        this.barberShops = barberShops
    }

    static build({
        name,
        phone,
        cpf,
        password,
    }: IManagerBuildProps) {
        return new Manager(
            randomUUID(),
            name.toLocaleLowerCase(),
            phone,
            cpf,
            password,
            []
        );
    }

    static with({
        id,
        name,
        phone,
        cpf,
        password,
        barberShops = []
    }: IManagerWithProps) {
        return new Manager(
            id,
            name.toLocaleLowerCase(),
            phone,
            cpf,
            password,
            barberShops
        );
    }

    addBarberShop = (barberShop: BarberShop) => {
        if (this.barberShops.find(({ id }) => id == barberShop.id)) throw new Error('Barbearia ja está associada ao gerente')

        this.barberShops.push(barberShop)
    }

    removeBarberShop = (barberShop: BarberShop) => {
        const index = this.barberShops.findIndex(({ id }) => id === barberShop.id);
        if (index === -1) {
            throw new Error('Barbearia não associada ao gerente');
        }
        this.barberShops.splice(index, 1);
    }

    getBarberShops = () => {
        return this.barberShops
    }

}
