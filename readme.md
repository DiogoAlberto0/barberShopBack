```markdown
# Sistema de Agendamento de Serviços de Barbearia

Este projeto é um sistema de agendamento de serviços de barbearia, permitindo que gerentes, funcionários e clientes interajam de forma eficiente. O sistema é construído utilizando Node.js e Express, com uma arquitetura baseada em camadas.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Rotas](#rotas)
  - [Gerenciamento de Agendamentos](#gerenciamento-de-agendamentos)
  - [Gerenciamento de Funcionários](#gerenciamento-de-funcionários)
  - [Gerenciamento de Serviços](#gerenciamento-de-serviços)
  - [Validação de Usuários](#validação-de-usuários)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- Vitest (para testes)
- Sqlite (ou outro banco de dados, conforme a implementação)
- PrismaORM
- Bcrypt
- jsonwebtoken

## Estrutura de Pastas

```
src/
├── application/
│   ├── useCases/
│   ├── interfaces/
├── domain/
│   ├── Entities/
│   ├── valueObjects/
├── main/
│   ├── controller/
│   ├── routes/
│   ├── factories/
├── presentation/
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu_usuario/seu_repositorio.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd seu_repositorio
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```

## Uso

O servidor estará rodando em `http://localhost:3000`. Você pode usar ferramentas como Postman ou Insomnia para testar as rotas.

## Rotas

### Gerenciamento de Agendamentos

- **POST /create**
  - **Descrição**: Cria um novo agendamento.
  - **Parâmetros**:
    - `customerName`: Nome do cliente (string, obrigatório)
    - `customerPhone`: Telefone do cliente (string, obrigatório)
    - `customerCPF`: CPF do cliente (string, obrigatório)
    - `date`: Data do agendamento (string, obrigatório)
    - `hour`: Hora do agendamento (number, obrigatório)
    - `minute`: Minuto do agendamento (number, obrigatório)
    - `barberShopId`: ID da barbearia (string, obrigatório)
    - `barberId`: ID do funcionário (string, obrigatório)
    - `serviceId`: ID do serviço (string, obrigatório)

- **DELETE /delete/:appointmentId**
  - **Descrição**: Cancela um agendamento existente.
  - **Parâmetros**:
    - `appointmentId`: ID do agendamento (string, obrigatório)
    - `customerName`: Nome do cliente (string, obrigatório)
    - `customerPhone`: Telefone do cliente (string, obrigatório)
    - `customerCPF`: CPF do cliente (string, obrigatório)

- **GET /byCustomer**
  - **Descrição**: Obtém agendamentos por cliente.
  - **Parâmetros**:
    - `customerName`: Nome do cliente (string, obrigatório)
    - `customerCPF`: CPF do cliente (string, obrigatório)
    - `customerPhone`: Telefone do cliente (string, obrigatório)
    - `page`: Número da página (number, opcional)
    - `pageSize`: Tamanho da página (number, opcional)

- **PUT /setClosed/:appointmentId**
  - **Descrição**: Define um agendamento como concluído.
  - **Parâmetros**:
    - `appointmentId`: ID do agendamento (string, obrigatório)

### Gerenciamento de Funcionários

- **POST /barber/create**
  - **Descrição**: Cria um novo funcionário.
  - **Parâmetros**:
    - `name`: Nome do funcionário (string, obrigatório)
    - `phone`: Telefone do funcionário (string, obrigatório)
    - `cpf`: CPF do funcionário (string, obrigatório)
    - `password`: Senha do funcionário (string, obrigatório)
    - `confirmPassword`: Confirmação da senha (string, obrigatório)
    - `barberShopId`: ID da barbearia (string, obrigatório)

- **DELETE /barber/delete/:barberId**
  - **Descrição**: Exclui um funcionário existente.
  - **Parâmetros**:
    - `barberId`: ID do funcionário (string, obrigatório)

### Gerenciamento de Serviços

- **POST /service/create**
  - **Descrição**: Cria um novo serviço.
  - **Parâmetros**:
    - `name`: Nome do serviço (string, obrigatório)
    - `price`: Preço do serviço (number, obrigatório)
    - `description`: Descrição do serviço (string, obrigatório)
    - `timeInMinutes`: Tempo estimado para o serviço (number, obrigatório)
    - `managerId`: ID do gerente (string, obrigatório)
    - `barberShopId`: ID da barbearia (string, obrigatório)

- **DELETE /service/delete/:serviceId**
  - **Descrição**: Exclui um serviço existente.
  - **Parâmetros**:
    - `serviceId`: ID do serviço (string, obrigatório)

### Validação de Usuários

- **POST /validate/admin**
  - **Descrição**: Valida um administrador.
  - **Parâmetros**:
    - `token`: Token de autenticação (string, obrigatório)

- **POST /validate/manager**
  - **Descrição**: Valida um gerente.
  - **Parâmetros**:
    - `token`: Token de autenticação (string, obrigatório)

- **POST /validate/barber**
  - **Descrição**: Valida um funcionário.
  - **Parâmetros**:
    - `token`: Token de autenticação (string, obrigatório)

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
```
