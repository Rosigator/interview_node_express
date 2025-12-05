import { prisma } from "../lib/database/prisma";
import { DatabaseError } from "../lib/errors/errors";

class AccountService {
    async getTransactions(iban: string) {
        try {
            const transactions = await prisma.transaction.findMany({
                where: {
                    mainAccountIBAN: iban
                },
                omit: {
                    id: true
                },
                orderBy: {
                    date: 'desc'
                }
            });
            return transactions;
        } catch (error) {
            throw new DatabaseError(`Failed to fetch transactions (${error instanceof Error ? error.message : String(error)})`);
        }
    }

    async getBalance(iban: string) {
        try {
            const result = await prisma.transaction.aggregate({
                where: {
                    mainAccountIBAN: iban
                },
                _sum: {
                    amount: true
                }
            });
            return result._sum.amount || 0;
        } catch (error) {
            throw new DatabaseError(`Failed to fetch balance (${error instanceof Error ? error.message : String(error)})`);
        }
    }
}

export default AccountService;