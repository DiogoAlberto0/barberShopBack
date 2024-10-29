export class Price {
    private readonly value: number;

    constructor(value: number) {
        if (!this.isValid(value)) {
            throw new Error('O preço deve ser um número positivo.');
        }

        this.value = value;
    }

    // Método de validação do preço
    private isValid(value: number): boolean {
        return value >= 0;
    }

    // Método para obter o valor do preço
    public getValue(): number {
        return this.value;
    }

    // Método para formatar o preço para reais com "R$"
    public toStringBR(): string {
        return this.value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
}