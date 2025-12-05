-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'FEE');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "withdrawalFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transferFee" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ATM" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "ATM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "IBAN" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("IBAN")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mainAccountIBAN" TEXT NOT NULL,
    "counterpartAccountIBAN" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "hashedPin" TEXT NOT NULL,
    "pinChanged" BOOLEAN NOT NULL DEFAULT false,
    "type" "CardType" NOT NULL,
    "withdrawalLimit" DOUBLE PRECISION NOT NULL,
    "creditLimit" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "accountIBAN" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ATM" ADD CONSTRAINT "ATM_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_mainAccountIBAN_fkey" FOREIGN KEY ("mainAccountIBAN") REFERENCES "Account"("IBAN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_counterpartAccountIBAN_fkey" FOREIGN KEY ("counterpartAccountIBAN") REFERENCES "Account"("IBAN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountIBAN_fkey" FOREIGN KEY ("accountIBAN") REFERENCES "Account"("IBAN") ON DELETE RESTRICT ON UPDATE CASCADE;
