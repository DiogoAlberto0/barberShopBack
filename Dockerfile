FROM ubuntu:latest

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get upgrade -y && apt-get install -y curl

# Instalar Node.js versão 22 diretamente do repositório oficial
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Verifica a versão instalada
RUN node --version
