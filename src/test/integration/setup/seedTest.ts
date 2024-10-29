import { PrismaClient } from '@prisma/client';
import { validAdmin } from '../../validEntitiesFromTests/validAdmin';

const prisma = new PrismaClient();

async function main() {

    const adminToCreate = validAdmin
    // Verifica se já existe um admin para evitar duplicação
    const existingAdmin = await prisma.user.findUnique({
        where: { phone: adminToCreate.phone.phoneNumber },
    });

    if (!existingAdmin) {
        // Criptografa a senha do admin
        const phoneObj = adminToCreate.phone
        const passwordObj = adminToCreate.password
        const cpfObj = adminToCreate.cpf

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
