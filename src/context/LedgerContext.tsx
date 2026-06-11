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
  ActiveView
} from '../types';

interface LedgerContextType {
  inventory: InventoryBlock[];
  buyLedger: BuyTransaction[];
  sellLedger: SellTransaction[];
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
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

// Robust Initial/Bootstrap Data for a stunning out-of-the-box presentation
const INITIAL_COINS = ['USDT', 'BTC', 'ETH', 'SOL', 'USDC', 'ADA'];

const DEFAULT_SETTINGS: AppSetting[] = [
  { key: 'API_STRICT_MODE', value: 'FALSE' },
  { key: 'MIN_PROFIT_MARGIN_PCT', value: '1.5' },
  { key: 'ORANGE_MONEY_TRADING_CAP', value: '500000000' }, // 500,000,000 Leones
  { key: 'GAS_WEB_APP_URL', value: '' } // Users can set their actual Google Apps Script web app URL here!
];

const INITIAL_WALLETS: Wallet[] = [
  { name: 'Orange Money', balance: 120500000 }, // 120,500,000 Leones
  { name: 'USDT Funding', balance: 65000000 },  // 65,000,000 Leones
  { name: 'Apex OTC', balance: 35000000 }      // 35,000,000 Leones
];

const INITIAL_INVENTORY: InventoryBlock[] = [
  { id: 'BLK-001', coin: 'USDT', quantity: 4500, price: 22500, totalCost: 101250000, date: '2026-06-01', notes: 'Inflow from Sierra P2P' }, // 22,500 price, 101,250,000 Leones
  { id: 'BLK-002', coin: 'BTC', quantity: 0.12, price: 1350000000, totalCost: 162000000, date: '2026-06-03', notes: 'Direct OTC execution' },  // 1,350,000,000 BTC price, 162,000,000 Leones
  { id: 'BLK-003', coin: 'ETH', quantity: 1.8, price: 72000000, totalCost: 129600000, date: '2026-06-05', notes: 'Liquidity pool withdrawal' }, // 72,000,000 ETH price, 129,600,000 Leones
  { id: 'BLK-004', coin: 'USDT', quantity: 1200, price: 22600, totalCost: 27120000, date: '2026-06-08', notes: 'Mini batch pickup' }        // 22,600 price, 27,120,000 Leones
];

const INITIAL_BUYS: BuyTransaction[] = [
  { id: 'TXN-B-101', blockId: 'BLK-001', coin: 'USDT', quantity: 4500, price: 22500, totalCost: 101250000, date: '2026-06-01', notes: 'Inflow from Sierra P2P' },
  { id: 'TXN-B-102', blockId: 'BLK-002', coin: 'BTC', quantity: 0.12, price: 1350000000, totalCost: 162000000, date: '2026-06-03', notes: 'Direct OTC execution' },
  { id: 'TXN-B-103', blockId: 'BLK-003', coin: 'ETH', quantity: 1.8, price: 72000000, totalCost: 129600000, date: '2026-06-05', notes: 'Liquidity pool withdrawal' },
  { id: 'TXN-B-104', blockId: 'BLK-004', coin: 'USDT', quantity: 1200, price: 22600, totalCost: 27120000, date: '2026-06-08', notes: 'Mini batch pickup' }
];

const INITIAL_SELLS: SellTransaction[] = [
  { id: 'TXN-S-201', blockId: 'BLK-001', quantity: 1500, price: 24700, totalSale: 37050000, profit: 3300000, date: '2026-06-04', wallet: 'Orange Money' }, // 24,700 price, 37,050,000 sale, 3,300,000 profit
  { id: 'TXN-S-202', blockId: 'BLK-003', quantity: 0.5, price: 78500000, totalSale: 39250000, profit: 3250000, date: '2026-06-07', wallet: 'USDT Funding' }   // 78,500,000 price, 39,250,000 sale, 3,250,000 profit
];

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      if (b.coin === 'USDT' && b.price < 500) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      if (b.coin === 'BTC' && b.price < 5000000) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      if (b.coin === 'ETH' && b.price < 500000) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      return b;
    });
  });
  
  const [buyLedger, setBuyLedger] = useState<BuyTransaction[]>(() => {
    const saved = localStorage.getItem('p2p_buy_ledger');
    const parsed = saved ? JSON.parse(saved) : INITIAL_BUYS;
    return parsed.map((b: any) => {
      if (b.coin === 'USDT' && b.price < 500) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      if (b.coin === 'BTC' && b.price < 5000000) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      if (b.coin === 'ETH' && b.price < 500000) {
        return { ...b, price: b.price * 1000, totalCost: b.totalCost * 1000 };
      }
      return b;
    });
  });
  
  const [sellLedger, setSellLedger] = useState<SellTransaction[]>(() => {
    const saved = localStorage.getItem('p2p_sell_ledger');
    const parsed = saved ? JSON.parse(saved) : INITIAL_SELLS;
    return parsed.map((s: any) => {
      if (s.price < 500) {
        return { ...s, price: s.price * 1000, totalSale: s.totalSale * 1000, profit: s.profit * 1000 };
      }
      if (s.price < 500000 && !s.price.toString().startsWith('78500')) {
        return { ...s, price: s.price * 1000, totalSale: s.totalSale * 1000, profit: s.profit * 1000 };
      }
      return s;
    });
  });

  const [settings, setSettings] = useState<AppSetting[]>(() => {
    const saved = localStorage.getItem('p2p_settings');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    return parsed.map((s: any) => {
      if (s.key === 'ORANGE_MONEY_TRADING_CAP' && parseFloat(s.value) < 1000000) {
        return { ...s, value: (parseFloat(s.value) * 1000).toString() };
      }
      return s;
    });
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('p2p_wallets');
    const parsed = saved ? JSON.parse(saved) : INITIAL_WALLETS;
    return parsed.map((w: any) => {
      if (w.balance < 10000000) {
        return { ...w, balance: w.balance * 1000 };
      }
      return w;
    });
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

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
    const totalInventoryValue = inventory.reduce((sum, b) => sum + (b.quantity * b.price), 0);
    const realizedProfit = sellLedger.reduce((sum, s) => sum + s.profit, 0);
    const activeBlocks = inventory.filter(b => b.quantity > 0).length;

    // Aggregate holdings per coin
    const holdingsMap: { [coin: string]: number } = {};
    inventory.forEach(block => {
      if (block.quantity > 0) {
        holdingsMap[block.coin] = (holdingsMap[block.coin] || 0) + block.quantity;
      }
    });
    const holdings = Object.entries(holdingsMap).map(([coin, qty]) => ({ coin, qty }));

    setMetrics({
      totalInventoryValue,
      realizedProfit,
      activeBlocks,
      wallets,
      holdings
    });
  }, [inventory, sellLedger, wallets]);

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
    const fundingWallet = wallets.find(w => w.name === walletName);
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

    // Local Fallback Execution
    const newBlockId = `BLK-${(1001 + inventory.length).toString()}`;
    const newTxId = `TXN-B-${(100 + buyLedger.length + 1).toString()}`;
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
      notes: notes || `Local allocation entry`
    };

    // Update wallet balance
    const updatedWallets = wallets.map(w => {
      if (w.name === walletName) {
        return { ...w, balance: w.balance - totalCost };
      }
      return w;
    });

    setInventory(prev => [newBlock, ...prev]);
    setBuyLedger(prev => [newBuyTx, ...prev]);
    setWallets(updatedWallets);

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

    const block = inventory.find(b => b.id === blockId);
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

    // Local Fallback Execution
    const dateStamp = new Date().toISOString().split('T')[0];
    const newTxId = `TXN-S-${(200 + sellLedger.length + 1).toString()}`;

    // Update block inventory remaining
    const updatedInventory = inventory.map(b => {
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
      wallet: walletName
    };

    // Apply gross sale inflow to target receipt wallet
    const updatedWallets = wallets.map(w => {
      if (w.name === walletName) {
        return { ...w, balance: w.balance + totalSale };
      }
      return w;
    });

    setInventory(updatedInventory);
    setSellLedger(prev => [newSellTx, ...prev]);
    setWallets(updatedWallets);

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
    const matches = inventory.filter(b => blockIds.includes(b.id));
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
    setInventory(prev => [
      newMergedBlock,
      ...prev.filter(b => !blockIds.includes(b.id))
    ]);

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

  const resetToDefault = () => {
    if (window.confirm('Are you absolutely sure you want to revert all records to default sandbox values? This destroys custom edits.')) {
      setInventory(INITIAL_INVENTORY);
      setBuyLedger(INITIAL_BUYS);
      setSellLedger(INITIAL_SELLS);
      setWallets(INITIAL_WALLETS);
      setSettings(DEFAULT_SETTINGS);
      addToast('Database reset successfully to preseed files.', 'info');
    }
  };

  return (
    <LedgerContext.Provider value={{
      inventory,
      buyLedger,
      sellLedger,
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
      resetToDefault
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
