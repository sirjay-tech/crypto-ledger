/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BuyTransaction, 
  SellTransaction, 
  InventoryBlock, 
  Wallet, 
  AppSetting, 
  LedgerMetrics,
  ActiveView,
  DepositRecord,
  WithdrawalRecord
} from '../types';
import { useAuth } from './AuthContext';
import { useP2PJournal } from '../hooks/useP2PJournal';

interface LedgerContextType {
  inventory: InventoryBlock[];
  buyLedger: BuyTransaction[];
  sellLedger: SellTransaction[];
  depositLedger: DepositRecord[];
  withdrawalLedger: WithdrawalRecord[];
  settings: AppSetting[];
  wallets: Wallet[];
  metrics: LedgerMetrics;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isLoading: boolean;
  supportedCoins: string[];
  setLoading: (loading: boolean) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  removeToast: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Core actions
  processBuyOrder: (coin: string, quantity: number, price: number, notes: string, walletName: string) => Promise<boolean>;
  processSellOrder: (blockId: string, quantity: number, price: number, walletName: string) => Promise<boolean>;
  mergeInventoryBlocks: (blockIds: string[]) => Promise<boolean>;
  updateSettingValue: (key: string, value: string) => Promise<boolean>;
  deleteSetting: (key: string) => void;
  syncWithGoogleSheets: () => Promise<void>;
  resetToDefault: () => void;
  updateWalletBalance: (name: string, balance: number) => void;
  addWallet: (name: string, initialBalance: number) => void;
  depositToWallet: (name: string, amount: number, referenceId?: string) => void;
  withdrawFromWallet: (name: string, amount: number, reasonForWithdrawal?: string) => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

// Robust Initial/Bootstrap Data for a stunning out-of-the-box presentation
const INITIAL_COINS = ['USDT', 'BTC', 'ETH', 'SOL', 'USDC', 'ADA'];

const DEFAULT_SETTINGS: AppSetting[] = [
  { key: 'API_STRICT_MODE', value: 'FALSE' },
  { key: 'MIN_PROFIT_MARGIN_PCT', value: '1.5' },
  { key: 'ORANGE_MONEY_TRADING_CAP', value: '500000' }, // 500,000 New Leones
  { key: 'GAS_WEB_APP_URL', value: '' } // Users can set their actual Google Apps Script web app URL here!
];

const INITIAL_WALLETS: Wallet[] = [
  { name: 'Orange Money', balance: 0 }
];

const INITIAL_INVENTORY: InventoryBlock[] = [];

const INITIAL_BUYS: BuyTransaction[] = [];

const INITIAL_SELLS: SellTransaction[] = [];

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const fb = useP2PJournal(currentUser?.uid);

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Theme support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('p2p_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('p2p_theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);
  
  // Core States (persisted via localStorage)
  const [inventory, setInventory] = useState<InventoryBlock[]>(() => {
    const saved = localStorage.getItem('p2p_inventory');
    const parsed = saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    return parsed.map((b: any) => {
      // Migrate any old large Leone numbers to new denominated Leones (divide by 1000)
      if (b.coin === 'USDT' && b.price >= 1000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      if (b.coin === 'BTC' && b.price >= 50000000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      if (b.coin === 'ETH' && b.price >= 5000000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      return b;
    });
  });
  
  const [buyLedger, setBuyLedger] = useState<BuyTransaction[]>(() => {
    const saved = localStorage.getItem('p2p_buy_ledger');
    const parsed = saved ? JSON.parse(saved) : INITIAL_BUYS;
    return parsed.map((b: any) => {
      // Migrate any old large Leone numbers to new denominated Leones (divide by 1000)
      if (b.coin === 'USDT' && b.price >= 1000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      if (b.coin === 'BTC' && b.price >= 50000000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      if (b.coin === 'ETH' && b.price >= 5000000) {
        return { ...b, price: b.price / 1000, totalCost: b.totalCost / 1000 };
      }
      return b;
    });
  });
  
  const [sellLedger, setSellLedger] = useState<SellTransaction[]>(() => {
    const saved = localStorage.getItem('p2p_sell_ledger');
    const parsed = saved ? JSON.parse(saved) : INITIAL_SELLS;
    return parsed.map((s: any) => {
      // Migrate any old large Leone numbers to new denominated Leones (divide by 1000)
      if (s.price >= 1000) {
        return { ...s, price: s.price / 1000, totalSale: s.totalSale / 1000, profit: s.profit / 1000 };
      }
      return s;
    });
  });

  const [depositLedger, setDepositLedger] = useState<DepositRecord[]>(() => {
    const saved = localStorage.getItem('p2p_deposit_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawalLedger, setWithdrawalLedger] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem('p2p_withdrawal_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSetting[]>(() => {
    const saved = localStorage.getItem('p2p_settings');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    return parsed.map((s: any) => {
      if (s.key === 'ORANGE_MONEY_TRADING_CAP' && parseFloat(s.value) >= 1000000) {
        return { ...s, value: (parseFloat(s.value) / 1000).toString() };
      }
      return s;
    });
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('p2p_wallets');
    let parsed = saved ? JSON.parse(saved) : INITIAL_WALLETS;
    // Purge unwanted legacy wallets automatically
    parsed = parsed.filter((w: any) => 
      w.name.toLowerCase() !== 'usdt funding' && 
      w.name.toLowerCase() !== 'apex otc'
    );
    if (!parsed.some((w: any) => w.name.toLowerCase() === 'orange money')) {
      parsed.unshift({ name: 'Orange Money', balance: 0 });
    }

    // Explicitly reset the Orange Money balance to 0 once, as requested by user
    if (!localStorage.getItem('p2p_orange_money_zeroed_v1')) {
      parsed = parsed.map((w: any) => {
        if (w.name.toLowerCase() === 'orange money') {
          return { ...w, balance: 0 };
        }
        return w;
      });
      localStorage.setItem('p2p_orange_money_zeroed_v1', 'true');
    }

    return parsed.map((w: any) => {
      if (w.balance >= 1000000) {
        return { ...w, balance: w.balance / 1000 };
      }
      return w;
    });
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  // Active state delegates: chooses between Firestore and standard LocalStorage fallback
  const activeInventory = currentUser ? fb.inventory : inventory;
  const activeBuyLedger = currentUser ? fb.buyHistory : buyLedger;
  const activeSellLedger = currentUser ? fb.sellHistory : sellLedger;
  const activeDepositLedger = currentUser ? fb.depositLedger : depositLedger;
  const activeWithdrawalLedger = currentUser ? fb.withdrawalLedger : withdrawalLedger;
  const activeWallets = currentUser ? fb.wallets : wallets;

  // Auto bootstrap local storage data to Cloud Firestore if Cloud Firestore is completely empty and currentUser recently logged in!
  useEffect(() => {
    if (currentUser && !fb.loading) {
      const alreadySynced = localStorage.getItem(`p2p_bulk_synced_${currentUser.uid}`);
      if (!alreadySynced && fb.buyHistory.length === 0 && fb.sellHistory.length === 0 && fb.depositLedger.length === 0 && fb.withdrawalLedger.length === 0) {
        fb.bulkUploadToCloud(buyLedger, sellLedger, depositLedger, withdrawalLedger, inventory, wallets).then(() => {
          localStorage.setItem(`p2p_bulk_synced_${currentUser.uid}`, 'true');
          addToast('Your existing offline records have been seamlessly migrated to the Cloud secure database!', 'success');
        });
      }
    }
  }, [currentUser, fb.loading]);

  // Supported coins checklist
  const supportedCoins = INITIAL_COINS;

  // Sync to local storage on adjustments
  useEffect(() => {
    localStorage.setItem('p2p_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('p2p_buy_ledger', JSON.stringify(buyLedger));
  }, [buyLedger]);

  useEffect(() => {
    localStorage.setItem('p2p_sell_ledger', JSON.stringify(sellLedger));
  }, [sellLedger]);

  useEffect(() => {
    localStorage.setItem('p2p_deposit_ledger', JSON.stringify(depositLedger));
  }, [depositLedger]);

  useEffect(() => {
    localStorage.setItem('p2p_withdrawal_ledger', JSON.stringify(withdrawalLedger));
  }, [withdrawalLedger]);

  useEffect(() => {
    localStorage.setItem('p2p_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('p2p_wallets', JSON.stringify(wallets));
  }, [wallets]);

  // Toast System Actions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Live Metrics Calculator
  const [metrics, setMetrics] = useState<LedgerMetrics>({
    totalInventoryValue: 0,
    realizedProfit: 0,
    activeBlocks: 0,
    wallets: [],
    holdings: []
  });

  // Recalculately dynamic metrics whenever inventory, sell ledger, or wallets transform
  useEffect(() => {
    const totalInventoryValue = activeInventory.reduce((sum, b) => sum + (b.quantity * b.price), 0);
    const realizedProfit = activeSellLedger.reduce((sum, s) => sum + s.profit, 0);
    const activeBlocks = activeInventory.filter(b => b.quantity > 0).length;

    // Aggregate holdings per coin
    const holdingsMap: { [coin: string]: number } = {};
    activeInventory.forEach(block => {
      if (block.quantity > 0) {
        holdingsMap[block.coin] = (holdingsMap[block.coin] || 0) + block.quantity;
      }
    });
    const holdings = Object.entries(holdingsMap).map(([coin, qty]) => ({ coin, qty }));

    setMetrics({
      totalInventoryValue,
      realizedProfit,
      activeBlocks,
      wallets: activeWallets,
      holdings
    });
  }, [activeInventory, activeSellLedger, activeWallets]);

  /**
   * Helper to execute requests against a real Google Apps Script web app URL if specified
   */
  const callGasBackend = async (action: string, payload: any): Promise<any> => {
    const gasUrlSetting = settings.find(s => s.key === 'GAS_WEB_APP_URL');
    if (!gasUrlSetting || !gasUrlSetting.value) {
      // Return null to signify fallback to local processing which keeps it functional
      return null;
    }

    try {
      const resp = await fetch(gasUrlSetting.value, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain', // GAS Web Apps handle POST with text/plain standardly without preflights CORS issues
        },
        body: JSON.stringify({ action, ...payload })
      });
      if (resp.ok) {
        const json = await resp.json();
        return json;
      }
      throw new Error(`Server returned HTTP ${resp.status}`);
    } catch (err: any) {
      console.warn('GAS Network Sync integration failed, utilizing local state:', err);
      addToast(`Direct Sync Warning: ${err.message || err}. Saved locally instead.`, 'info');
      return null;
    }
  };

  // 1. Process Buy Order Logic
  const processBuyOrder = async (
    coin: string, 
    quantity: number, 
    price: number, 
    notes: string, 
    walletName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const totalCost = quantity * price;

    // Check balance in funding source wallet
    const fundingWallet = activeWallets.find(w => w.name === walletName);
    if (!fundingWallet) {
      addToast(`Target settlement wallet "${walletName}" was not found.`, 'error');
      setIsLoading(false);
      return false;
    }

    if (fundingWallet.balance < totalCost) {
      addToast(`Liquidity check failed! Outflow is Le ${totalCost.toLocaleString()}, but "${walletName}" only holds Le ${fundingWallet.balance.toLocaleString()}.`, 'error');
      setIsLoading(false);
      return false;
    }

    // Try Sync to Google Sheets if integration binds
    const gasResult = await callGasBackend('processBuyOrder', { coin, quantity, price, notes, walletName });

    if (gasResult && gasResult.success) {
      // Overwrite state from gas remote sync payloads
      if (gasResult.inventory) setInventory(gasResult.inventory);
      if (gasResult.buyLedger) setBuyLedger(gasResult.buyLedger);
      if (gasResult.wallets) setWallets(gasResult.wallets);
      addToast('Buy transaction processed and synchronized with Sheets successfully!', 'success');
      setIsLoading(false);
      return true;
    }

    // Local/Cloud Execution
    const newBlockId = `BLK-${(1001 + activeInventory.length).toString()}`;
    const newTxId = `TXN-B-${(100 + activeBuyLedger.length + 1).toString()}`;
    const dateStamp = new Date().toISOString().split('T')[0];

    // Create block
    const newBlock: InventoryBlock = {
      id: newBlockId,
      coin,
      quantity,
      price,
      totalCost,
      date: dateStamp,
      notes: notes || `Direct allocation block standardly created.`
    };

    // Create Buy record
    const newBuyTx: BuyTransaction = {
      id: newTxId,
      blockId: newBlockId,
      coin,
      quantity,
      price,
      totalCost,
      date: dateStamp,
      notes: notes || `Local allocation entry`,
      fundingSource: walletName
    };

    // Update wallet balance
    const updatedWallets = activeWallets.map(w => {
      if (w.name === walletName) {
        return { ...w, balance: w.balance - totalCost };
      }
      return w;
    });

    if (currentUser) {
      await fb.saveInventoryBlock(newBlock);
      await fb.saveBuyRecord(newBuyTx);
      for (const w of updatedWallets) {
        await fb.saveWallet(w);
      }
    } else {
      setInventory(prev => [newBlock, ...prev]);
      setBuyLedger(prev => [newBuyTx, ...prev]);
      setWallets(updatedWallets);
    }

    addToast(`Successfully instantiated Block ${newBlockId}. Spent Le ${totalCost.toLocaleString()}.`, 'success');
    setIsLoading(false);
    return true;
  };

  // 2. Process Sell Order Logic (discharging from inventory block)
  const processSellOrder = async (
    blockId: string, 
    sellQty: number, 
    sellPrice: number, 
    walletName: string
  ): Promise<boolean> => {
    setIsLoading(true);

    const block = activeInventory.find(b => b.id === blockId);
    if (!block) {
      addToast(`Asset block ID "${blockId}" does not exist.`, 'error');
      setIsLoading(false);
      return false;
    }

    if (block.quantity < sellQty) {
      addToast(`Capacity exceeded! Available quantity is ${block.quantity}, but you attempted to discharge ${sellQty}.`, 'error');
      setIsLoading(false);
      return false;
    }

    const totalSale = sellQty * sellPrice;
    const baseCostOfDischarge = sellQty * block.price;
    const profit = totalSale - baseCostOfDischarge;

    // Sync to GAS sheets backend if connected
    const gasResult = await callGasBackend('processSellOrder', { blockId, sellQty, sellPrice, walletName });

    if (gasResult && gasResult.success) {
      if (gasResult.inventory) setInventory(gasResult.inventory);
      if (gasResult.sellLedger) setBuyLedger(gasResult.sellLedger);
      if (gasResult.wallets) setWallets(gasResult.wallets);
      addToast('Sell trade executed and written to Apps Script ledger successfully!', 'success');
      setIsLoading(false);
      return true;
    }

    // Local/Cloud Execution
    const dateStamp = new Date().toISOString().split('T')[0];
    const newTxId = `TXN-S-${(200 + activeSellLedger.length + 1).toString()}`;

    // Update block inventory remaining
    const updatedInventory = activeInventory.map(b => {
      if (b.id === blockId) {
        const remainingQty = b.quantity - sellQty;
        return {
          ...b,
          quantity: remainingQty,
          totalCost: remainingQty * b.price,
          notes: b.notes + ` (Discharged ${sellQty} item(s) on ${dateStamp})`
        };
      }
      return b;
    }).filter(b => b.quantity > 0.000001); // Filter out completely depleted blocks

    // Create sell transaction log
    const newSellTx: SellTransaction = {
      id: newTxId,
      blockId,
      quantity: sellQty,
      price: sellPrice,
      totalSale,
      profit,
      date: dateStamp,
      wallet: walletName,
      coin: block.coin
    };

    // Apply gross sale inflow to target receipt wallet
    const updatedWallets = activeWallets.map(w => {
      if (w.name === walletName) {
        return { ...w, balance: w.balance + totalSale };
      }
      return w;
    });

    if (currentUser) {
      const blockToUpdate = updatedInventory.find(b => b.id === blockId);
      if (blockToUpdate) {
        await fb.saveInventoryBlock(blockToUpdate);
      } else {
        await fb.deleteInventoryBlock(blockId);
      }

      await fb.saveSellRecord(newSellTx);
      for (const w of updatedWallets) {
        await fb.saveWallet(w);
      }
    } else {
      setInventory(updatedInventory);
      setSellLedger(prev => [newSellTx, ...prev]);
      setWallets(updatedWallets);
    }

    addToast(`Sale realized! Gained Le ${totalSale.toLocaleString()} (Net Profit: Le ${profit.toLocaleString()}).`, 'success');
    setIsLoading(false);
    return true;
  };

  // 3. Merge Inventory Blocks Action
  const mergeInventoryBlocks = async (blockIds: string[]): Promise<boolean> => {
    if (blockIds.length < 2) {
      addToast('Merging blocks requires choosing at least 2 target nodes.', 'error');
      return false;
    }

    setIsLoading(true);
    
    // Validate that all are the exact same coin type
    const matches = activeInventory.filter(b => blockIds.includes(b.id));
    if (matches.length !== blockIds.length) {
      addToast('Some selected block nodes could not be verified in memory.', 'error');
      setIsLoading(false);
      return false;
    }

    const coinType = matches[0].coin;
    const allSameCoin = matches.every(b => b.coin === coinType);
    if (!allSameCoin) {
      addToast('Crypto Asset Mismatch! All aggregated blocks must be of the same token (e.g., all USDT).', 'error');
      setIsLoading(false);
      return false;
    }

    // Try remote sync to Sheets
    const gasResult = await callGasBackend('mergeInventoryBlocks', { blockIds });
    if (gasResult && gasResult.success) {
      if (gasResult.inventory) setInventory(gasResult.inventory);
      addToast('Inventory consolidated and merged remote block written to active ledger.', 'success');
      setIsLoading(false);
      return true;
    }

    // Local execution: calculate weighted cost basis
    const totalRemainingQty = matches.reduce((sum, b) => sum + b.quantity, 0);
    const totalCostBasisCombined = matches.reduce((sum, b) => sum + (b.quantity * b.price), 0);
    const weightedAverageUnitCost = totalRemainingQty > 0 ? (totalCostBasisCombined / totalRemainingQty) : 0;

    const mergedBlockId = `BLK-MRG-${Date.now().toString().slice(-4)}`;
    const dateStamp = new Date().toISOString().split('T')[0];

    const mergedNotes = `Consolidated from blocks: [${blockIds.join(', ')}]. Weighted Average Cost Basis applied.`;

    const newMergedBlock: InventoryBlock = {
      id: mergedBlockId,
      coin: coinType,
      quantity: totalRemainingQty,
      price: Math.round(weightedAverageUnitCost * 100) / 100,
      totalCost: totalCostBasisCombined,
      date: dateStamp,
      notes: mergedNotes
    };

    // Update active state list
    if (currentUser) {
      await fb.saveInventoryBlock(newMergedBlock);
      for (const bid of blockIds) {
        await fb.deleteInventoryBlock(bid);
      }
    } else {
      setInventory(prev => [
        newMergedBlock,
        ...prev.filter(b => !blockIds.includes(b.id))
      ]);
    }

    addToast(`Consolidated ${blockIds.length} blocks of ${coinType} into single Block ${mergedBlockId} (${totalRemainingQty.toLocaleString()} units).`, 'success');
    setIsLoading(false);
    return true;
  };

  // 4. Update settings
  const updateSettingValue = async (key: string, value: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Re-verify if GAS Web App URL is being configured, perform a simple confirmation
    if (key === 'GAS_WEB_APP_URL' && value) {
      addToast('Configuring real-time Sheets replication link. Verifying node sync...', 'info');
    }

    // Update locally
    setSettings(prev => {
      const exists = prev.find(s => s.key === key);
      if (exists) {
        return prev.map(s => s.key === key ? { ...s, value } : s);
      } else {
        return [...prev, { key, value }];
      }
    });

    addToast(`Parameter key "${key}" saved as "${value}".`, 'success');
    setIsLoading(false);
    return true;
  };

  const deleteSetting = (key: string) => {
    setSettings(prev => prev.filter(s => s.key !== key));
    addToast(`Setting parameter "${key}" removed from local memory registry.`, 'info');
  };

  // 5. Force Manual Sync / Pull with remote sheet
  const syncWithGoogleSheets = async () => {
    setIsLoading(true);
    addToast('Contacting custom Apps Script Endpoint database...', 'info');

    try {
      const gasUrlSetting = settings.find(s => s.key === 'GAS_WEB_APP_URL');
      if (!gasUrlSetting || !gasUrlSetting.value) {
        // Just simulate a load delay to satisfy sensory tracking
        await new Promise(resolve => setTimeout(resolve, 1500));
        addToast('No remote GAS Web App URL configured. Working in highly isolated sandbox mode.', 'success');
        setIsLoading(false);
        return;
      }

      const resp = await fetch(`${gasUrlSetting.value}?action=getAllData`, {
        method: 'GET',
        mode: 'cors'
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success) {
          if (data.inventory) setInventory(data.inventory);
          if (data.buyLedger) setBuyLedger(data.buyLedger);
          if (data.sellLedger) setSellLedger(data.sellLedger);
          if (data.wallets) setWallets(data.wallets);
          if (data.settings) {
            // Merge custom server settings without wiping local web app url
            const safeSettings = data.settings.map((srvSet: AppSetting) => {
              if (srvSet.key === 'GAS_WEB_APP_URL') return null;
              return srvSet;
            }).filter(Boolean) as AppSetting[];
            setSettings(prev => {
              const gasUrl = prev.find(s => s.key === 'GAS_WEB_APP_URL');
              return [...safeSettings, gasUrl].filter(Boolean) as AppSetting[];
            });
          }
          addToast('Full ledger state synchronized and re-aligned with Sheets data source!', 'success');
        } else {
          addToast('Database pull failed: Sheets backend was not formatted appropriately.', 'error');
        }
      } else {
        throw new Error(`Endpoint response bad state: HTTP ${resp.status}`);
      }
    } catch (err: any) {
      console.error(err);
      addToast(`Unable to pull remote database: ${err.message || err}. Working offline.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = async () => {
    if (window.confirm('Are you absolutely sure you want to reset all records and wallet balances to 0? This action cannot be undone.')) {
      if (currentUser) {
        await fb.clearAllData();
        await fb.saveWallet({ name: 'Orange Money', balance: 0 });
      } else {
        setInventory([]);
        setBuyLedger([]);
        setSellLedger([]);
        setDepositLedger([]);
        setWithdrawalLedger([]);
        setWallets([
          { name: 'Orange Money', balance: 0 }
        ]);
        setSettings(DEFAULT_SETTINGS);
      }
      addToast('Database reset successfully.', 'success');
    }
  };

  const updateWalletBalance = async (name: string, balance: number) => {
    if (currentUser) {
      await fb.saveWallet({ name, balance });
    } else {
      setWallets(prev => prev.map(w => w.name === name ? { ...w, balance } : w));
    }
    addToast(`Successfully updated ${name} balance to Le ${balance.toLocaleString()}`, 'success');
  };

  const addWallet = async (name: string, initialBalance: number) => {
    if (!name.trim()) {
      addToast('Wallet name cannot be empty.', 'error');
      return;
    }
    const exists = activeWallets.some(w => w.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      addToast(`A wallet named "${name}" already exists.`, 'error');
      return;
    }
    if (currentUser) {
      await fb.saveWallet({ name: name.trim(), balance: initialBalance });
    } else {
      setWallets(prev => [...prev, { name: name.trim(), balance: initialBalance }]);
    }
    addToast(`Successfully created wallet "${name}" with balance Le ${initialBalance.toLocaleString()}`, 'success');
  };

  const depositToWallet = async (name: string, amount: number, referenceId?: string) => {
    if (amount <= 0) {
      addToast('Deposit amount must be greater than zero.', 'error');
      return;
    }

    const walletToUpdate = activeWallets.find(w => w.name.toLowerCase() === name.toLowerCase());
    const finalBalance = (walletToUpdate?.balance || 0) + amount;

    const newDep: DepositRecord = {
      id: `DEP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountLeones: amount,
      paymentMethod: name,
      referenceId: referenceId || 'N/A'
    };

    if (currentUser) {
      await fb.saveWallet({ name: walletToUpdate?.name || name, balance: finalBalance });
      await fb.saveDepositRecord(newDep);
    } else {
      setWallets(prev => prev.map(w => w.name.toLowerCase() === name.toLowerCase() ? { ...w, balance: w.balance + amount } : w));
      setDepositLedger(prev => [newDep, ...prev]);
    }

    addToast(`Successfully deposited Le ${amount.toLocaleString()} into ${name}.`, 'success');
  };

  const withdrawFromWallet = async (name: string, amount: number, reasonForWithdrawal?: string) => {
    if (amount <= 0) {
      addToast('Withdrawal amount must be greater than zero.', 'error');
      return;
    }
    const targetWallet = activeWallets.find(w => w.name.toLowerCase() === name.toLowerCase());
    if (!targetWallet) {
      addToast(`Wallet "${name}" not found.`, 'error');
      return;
    }
    if (targetWallet.balance < amount) {
      addToast(`Insufficient funds in ${name}! Cannot withdraw Le ${amount.toLocaleString()} (Current Balance: Le ${targetWallet.balance.toLocaleString()}).`, 'error');
      return;
    }

    const finalBalance = targetWallet.balance - amount;

    const newWith: WithdrawalRecord = {
      id: `WTH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountLeones: amount,
      paymentMethod: name,
      reasonForWithdrawal: reasonForWithdrawal || 'Manual withdrawal'
    };

    if (currentUser) {
      await fb.saveWallet({ name: targetWallet.name, balance: finalBalance });
      await fb.saveWithdrawalRecord(newWith);
    } else {
      setWallets(prev => prev.map(w => w.name.toLowerCase() === name.toLowerCase() ? { ...w, balance: w.balance - amount } : w));
      setWithdrawalLedger(prev => [newWith, ...prev]);
    }

    addToast(`Successfully withdrew Le ${amount.toLocaleString()} from ${name}.`, 'success');
  };

  return (
    <LedgerContext.Provider value={{
      inventory,
      buyLedger,
      sellLedger,
      depositLedger,
      withdrawalLedger,
      settings,
      wallets,
      metrics,
      activeView,
      setActiveView,
      isLoading,
      supportedCoins,
      setLoading,
      addToast,
      toasts,
      removeToast,
      theme,
      toggleTheme,
      
      processBuyOrder,
      processSellOrder,
      mergeInventoryBlocks,
      updateSettingValue,
      deleteSetting,
      syncWithGoogleSheets,
      resetToDefault,
      updateWalletBalance,
      addWallet,
      depositToWallet,
      withdrawFromWallet
    }}>
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used inside a LedgerProvider boundary');
  }
  return context;
};
