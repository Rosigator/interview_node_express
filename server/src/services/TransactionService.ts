import { prisma } from "../lib/database/prisma";
import CardService from "./CardService";
import { CardError } from "../lib/errors/errors";

class TransactionService {
    static async deposit(pin: string, cardId: string, ATMid: string, amount: number, description?: string) {
        const pinIsValid = await CardService.pinIsValid(cardId, pin);
        if (!pinIsValid) {
            throw new CardError("Invalid PIN");
        }
        
    }
}

export default TransactionService;