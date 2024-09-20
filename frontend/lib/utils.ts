import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { number } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  if (addr.length <= 8) {
    return addr; // Return the original string if it's 8 characters or less
  }

  return `${addr.slice(0, 6)}....${addr.slice(-4)}`;
};

export const formatMoney = (amount: number) => {
  if (amount < 10 ** 3) {
    return amount.toString()
  } else if (amount < 10 ** 6) {
    return Math.round(amount / 10 ** 3).toString() + "K"
  } else if (amount < 10 ** 9) {
    return Math.round(amount / 10 ** 6).toString() + "M"
  } else if (amount < 10 ** 12) {
    return Math.round(amount / 10 ** 9).toString() + "B"
  } else {
    return number.toString()
  }
};