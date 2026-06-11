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
  | 'settings';
