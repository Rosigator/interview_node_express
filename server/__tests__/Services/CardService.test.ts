import CardService from '../../src/services/CardService';
import { prisma, disconnectPrisma } from '../../src/lib/database/prisma';
import bcrypt from 'bcrypt';

describe('CardService', () => {
    let testCardId: string;
    const testPin = '1234';

    beforeAll(async () => {
        const bank = await prisma.bank.create({
            data: {
                name: 'Test Bank',
                withdrawalFee: 0,
                transferFee: 0
            }
        });

        const user = await prisma.user.create({
            data: {}
        });

        const account = await prisma.account.create({
            data: {
                userId: user.id,
                bankId: bank.id
            }
        });


        const hashedPin = await bcrypt.hash(testPin, 10);
        const card = await prisma.card.create({
            data: {
                hashedPin: hashedPin,
                type: 'DEBIT',
                withdrawalLimit: 500,
                active: true,
                accountIBAN: account.IBAN
            }
        });

        testCardId = card.id;
    });

    afterAll(async () => {
        // Limpiar datos de test
        await prisma.card.deleteMany();
        await prisma.account.deleteMany();
        await prisma.user.deleteMany();
        await prisma.bank.deleteMany();
        await disconnectPrisma();
    });

    describe('pinIsValid', () => {
        it('should return true for correct PIN', async () => {
            const result = await CardService.pinIsValid(testCardId, testPin);
            expect(result).toBe(true);
        });

        it('should return false for incorrect PIN', async () => {
            const result = await CardService.pinIsValid(testCardId, '0000');
            expect(result).toBe(false);
        });

        it('should throw CardError if card not found', async () => {
            await expect(CardService.pinIsValid('non-existent-id', '1234'))
                .rejects.toThrow('Card not found');
        });
    });
});