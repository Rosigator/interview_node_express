import { prisma } from "../lib/database/prisma";
import type { Card } from "../../prisma/generated/prisma/client";
import bcrypt from 'bcrypt';
import { DatabaseError, CardError } from "../lib/errors/errors";

class CardService {

    static async changePin(cardId: string, oldPin: string, newHashedPin: string): Promise<boolean> {
        let card;
        try {
            card = await prisma.card.findUnique({
                where: { id: cardId }
            });
        } catch (e) {
            throw new DatabaseError(`Failed to fetch card (${e instanceof Error ? e.message : String(e)})`);
        }
        if (!card) {
            throw new CardError("Card not found");
        }
        const hashedOldPin = card.hashedPin;
        const isMatch = await bcrypt.compare(oldPin, hashedOldPin);
        if (!isMatch) {
            throw new CardError("Old PIN does not match");
        }
        try {
            const hashedPin = await bcrypt.hash(newHashedPin, 10);
            await prisma.card.update({
                where: { id: cardId },
                data: {
                    hashedPin: hashedPin,
                    pinChanged: true
                }
            });
            return true;
        } catch (error) {
            throw new DatabaseError(`Failed to update PIN (${error instanceof Error ? error.message : String(error)})`);
        }
    }

    static async activateCard(cardId: string, pin: string): Promise<boolean> {
        let card;
        try {
            card = await prisma.card.findUnique({
                where: { id: cardId }
            });
        } catch (e) {
            throw new DatabaseError(`Failed to fetch card (${e instanceof Error ? e.message : String(e)})`);
        }
        if (!card) {
            throw new CardError("Card not found");
        }
        if (card.active) {
            return true;
        }
        const hashedPin = await bcrypt.hash(pin, 10);
        try {
            await prisma.card.update({
                where: { id: cardId },
                data: {
                    hashedPin: hashedPin
                }
            });
            return true;
        } catch (error) {
            throw new DatabaseError(`Failed to activate card (${error instanceof Error ? error.message : String(error)})`);
        }
    }

    static async pinIsValid(cardId: string, pin: string): Promise<boolean> {
        let card: Card | null = null;
        try {
            card = await prisma.card.findUnique({
                where: { id: cardId }
            });
        } catch (e) {
            throw new DatabaseError(`Failed to fetch card (${e instanceof Error ? e.message : String(e)})`);
        }
        if (!card) {
            throw new CardError("Card not found");
        }
        if (!card.active) {
            throw new CardError("Card is not active");
        }
        const hashedPin = card.hashedPin;
        const isMatch = await bcrypt.compare(pin, hashedPin);
        return isMatch;
    }
}

export default CardService;