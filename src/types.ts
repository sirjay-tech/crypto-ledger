/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BuyTransaction {
  id: string; // e.g. "TXN-B-001"
  blockId: string; // e.g. "BLK-001" (the stock block created/augmented)
  coin: string; // e.g. "USDT", "BTC", "ETH"
  quantity: number;
  price: number;
  totalCost: number;
  date: string; // ISO date string (YYYY-MM-DD or full ISO)
  notes: string;
  fundingSource?: string; // e.g., "Orange Money"
}

export interface SellTransaction {
  id: string; // e.g. "TXN-S-001"
  blockId: string; // e.g. "BLK-001" (the stock block discharged)
  quantity: number;
  price: number;
  totalSale: number;
  profit: number; // calculated as quantity * (sellPrice - originalBuyPrice)
  date: string;
  wallet: string; // e.g. "Orange Money"
  coin?: string; // e.g. "USDT"
}

export interface BaseTransaction {
  id: string;
  timestamp: string; // ISO Date String
  amountLeones: number;
}

export interface BuyRecord extends BaseTransaction {
  coinType: 'USDT' | 'BTC' | 'ETH' | string;
  quantity: number;
  unitPrice: number;
  fundingSource: string; // e.g., "Orange Money"
}

export interface SellRecord extends BaseTransaction {
  coinType: 'USDT' | 'BTC' | 'ETH' | string;
  quantity: number;
  unitPrice: number;
  realizedGain: number;
  destinationWallet: string; // e.g., "Orange Money"
}

export interface DepositRecord extends BaseTransaction {
  paymentMethod: string; // e.g., "Orange Money"
  referenceId?: string;
}

export interface WithdrawalRecord extends BaseTransaction {
  paymentMethod: string;
  reasonForWithdrawal: string; // REQUIRED field to log why funds were pulled
}

export interface InventoryBlock {
  id: string; // e.g. "BLK-001"
  coin: string;
  quantity: number;
  price: number; // original unit cost / average unit cost
  totalCost: number; // remaining value basis (quantity * price)
  date: string;
  notes: string;
}

export interface Wallet {
  name: string;
  balance: number;
}

export interface AppSetting {
  key: string;
  value: string;
}

export interface LedgerMetrics {
  totalInventoryValue: number;
  realizedProfit: number;
  activeBlocks: number;
  wallets: Wallet[];
  holdings: { coin: string; qty: number }[];
}

export type ActiveView = 
  | 'dashboard'
  | 'buy'
  | 'sell'
  | 'inventory'
  | 'buy-ledger'
  | 'sell-ledger'
  | 'settings'
  | 'wallets';
