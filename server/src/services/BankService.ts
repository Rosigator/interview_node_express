import { prisma } from "../lib/database/prisma";
import { DatabaseError } from "../lib/errors/errors";

export class BankService {
    static async getWithdrawalFee(bankId: string): Promise<number> {
        try {
            const bank = await prisma.bank.findUnique({
                where: { id: bankId }
            });
            if (!bank) {
                throw new Error("Bank not found");
            }
            return bank.withdrawalFee;
        } catch (error) {
            throw new DatabaseError(`Failed to fetch withdrawal fee (${error instanceof Error ? error.message : String(error)})`);
        }
    }
}

export default BankService;