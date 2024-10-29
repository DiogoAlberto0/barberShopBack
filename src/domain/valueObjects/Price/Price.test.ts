import { describe, it, expect } from "vitest";
import { Price } from "./Price"; // Certifique-se de ajustar o caminho conforme a sua estrutura de pastas

describe("Price Value Object", () => {

    it("deve criar uma instância de Price com um valor válido", () => {
        const price = new Price(199.99);
        expect(price.getValue()).toBe(199.99);
    });

    it("deve formatar o preço corretamente para reais", () => {
        const price = new Price(199.99);
        expect(price.toStringBR()).toBe("R$ 199,99");
    });

    it("deve lançar um erro se o preço for negativo", () => {
        expect(() => new Price(-1)).toThrow("O preço deve ser um número positivo.");
    });

    it("deve lançar um erro se o preço for NaN", () => {
        expect(() => new Price(NaN)).toThrow("O preço deve ser um número positivo.");
    });

    it("deve lançar um erro se o preço não for um número", () => {
        expect(() => new Price("abc" as unknown as number)).toThrow("O preço deve ser um número positivo.");
    });

    it("deve criar um preço de 0 e formatá-lo corretamente", () => {
        const price = new Price(0);
        expect(price.toStringBR()).toBe("R$ 0,00");
    });

});
