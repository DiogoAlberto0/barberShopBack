import { PrismaClient } from '@prisma/client';

import { Password } from '../src/domain/valueObjects/Password/Password';
import { Phone } from '../src/domain/valueObjects/Phone/Phone';
import { CPF } from '../src/domain/valueObjects/CPF/CPF';

const prisma = new PrismaClient();

async function main() {

    const phone = '61999999999'
    const password = '1234567890Abc.'
    const cpf = '064.419.180-56'

    // Verifica se já existe um admin para evitar duplicação
    const existingAdmin = await prisma.user.findUnique({
        where: { phone },
    });

    if (!existingAdmin) {
        // Criptografa a senha do admin
        const phoneObj = new Phone(phone)
        const passwordObj = Password.create(password)
        const cpfObj = new CPF(cpf)

        // Cria o usuário admin
        const user = await prisma.user.create({
            data: {
                name: 'Admin User',
                phone: phoneObj.phoneNumber,
                cpf: cpfObj.cleaned,
                hash: passwordObj.getHash(), // Salva a senha já criptografada
                role: 'admin', // Supondo que o campo role seja usado para permissões
            },
        });
        console.log('Admin user created');
        console.log(user)
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
