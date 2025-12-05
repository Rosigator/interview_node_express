import { prisma } from "../lib/database/prisma";
import CardService from "./CardService";
import { CardError, DatabaseError } from "../lib/errors/errors";
import AccountService from "./AccountService";
import BankService from "./BankService";
import { ca } from "zod/locales";

class TransactionService {

    static async deposit(pin: string, cardId: string, ATMid: string, amount: number, description?: string) {
        const card = await CardService.pinIsValid(cardId, pin);
        if (!card) {
            throw new CardError("Invalid PIN");
        }
        const foundATM = await prisma.aTM.findUnique({
            where: { id: ATMid }
        });
        if (!foundATM) {
            throw new CardError("ATM not found");
        }
        const cardBankId = await CardService.getCardBankId(cardId);
        if (cardBankId !== foundATM.bankId) {
            throw new CardError("You can't deposit using an ATM of another bank");
        }
        try {
            const transaction = await prisma.transaction.create({
                data: {
                    type: 'DEPOSIT',
                    amount: amount,
                    description: description,
                    mainAccountIBAN: card.accountIBAN
                }
            });
            return transaction;
        } catch (error) {
            throw new DatabaseError(`Failed to create transaction (${error instanceof Error ? error.message : String(error)})`);
        }
    }
}

export default TransactionService;