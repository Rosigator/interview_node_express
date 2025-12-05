export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

export class CardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CardError";
    }
}

export class TransactionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TransactionError";
    }
}

export class AccountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AccountError";
    }
}