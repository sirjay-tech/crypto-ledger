/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, query, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { BuyTransaction, SellTransaction, DepositRecord, WithdrawalRecord, InventoryBlock, Wallet } from '../types';

export const useP2PJournal = (uid: string | undefined) => {
  const [buyHistory, setBuyHistory] = useState<BuyTransaction[]>([]);
  const [sellHistory, setSellHistory] = useState<SellTransaction[]>([]);
  const [depositLedger, setDepositLedger] = useState<DepositRecord[]>([]);
  const [withdrawalLedger, setWithdrawalLedger] = useState<WithdrawalRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryBlock[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) {
      setBuyHistory([]);
      setSellHistory([]);
      setDepositLedger([]);
      setWithdrawalLedger([]);
      setInventory([]);
      setWallets([]);
      return;
    }

    setLoading(true);

    // Set up paths cleanly with multi-tenant privacy
    const buyHistoryRef = collection(db, 'users', uid, 'buys');
    const sellHistoryRef = collection(db, 'users', uid, 'sells');
    const depositLedgerRef = collection(db, 'users', uid, 'deposits');
    const withdrawalLedgerRef = collection(db, 'users', uid, 'withdrawals');
    const inventoryRef = collection(db, 'users', uid, 'inventory');
    const walletsRef = collection(db, 'users', uid, 'wallets');

    // Simple countdown logic to release loading when initial fetches complete
    let pendingSnapshots = 6;
    const releaseLoading = () => {
      pendingSnapshots--;
      if (pendingSnapshots <= 0) {
        setLoading(false);
      }
    };

    // Listen to buyHistory
    const unsubBuy = onSnapshot(buyHistoryRef, (snapshot) => {
      const items: BuyTransaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as BuyTransaction);
      });
      // Sort desc by date or fallback to ID
      items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
      setBuyHistory(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubBuy fail:", err);
      releaseLoading();
    });

    // Listen to sellHistory
    const unsubSell = onSnapshot(sellHistoryRef, (snapshot) => {
      const items: SellTransaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as SellTransaction);
      });
      items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
      setSellHistory(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubSell fail:", err);
      releaseLoading();
    });

    // Listen to depositLedger
    const unsubDeposit = onSnapshot(depositLedgerRef, (snapshot) => {
      const items: DepositRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as DepositRecord);
      });
      items.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '') || b.id.localeCompare(a.id));
      setDepositLedger(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubDeposit fail:", err);
      releaseLoading();
    });

    // Listen to withdrawalLedger
    const unsubWithdrawal = onSnapshot(withdrawalLedgerRef, (snapshot) => {
      const items: WithdrawalRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as WithdrawalRecord);
      });
      items.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '') || b.id.localeCompare(a.id));
      setWithdrawalLedger(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubWithdrawal fail:", err);
      releaseLoading();
    });

    // Listen to inventory blocks
    const unsubInventory = onSnapshot(inventoryRef, (snapshot) => {
      const items: InventoryBlock[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as InventoryBlock);
      });
      setInventory(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubInventory fail:", err);
      releaseLoading();
    });

    // Listen to wallet balances
    const unsubWallets = onSnapshot(walletsRef, (snapshot) => {
      const items: Wallet[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Wallet);
      });
      setWallets(items);
      releaseLoading();
    }, (err) => {
      console.error("Firestore unsubWallets fail:", err);
      releaseLoading();
    });

    return () => {
      unsubBuy();
      unsubSell();
      unsubDeposit();
      unsubWithdrawal();
      unsubInventory();
      unsubWallets();
    };
  }, [uid]);

  // Write single record helper methods
  const saveBuyRecord = async (record: BuyTransaction) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'buys', record.id), record);
  };

  const saveSellRecord = async (record: SellTransaction) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'sells', record.id), record);
  };

  const saveDepositRecord = async (record: DepositRecord) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'deposits', record.id), record);
  };

  const saveWithdrawalRecord = async (record: WithdrawalRecord) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'withdrawals', record.id), record);
  };

  const saveInventoryBlock = async (record: InventoryBlock) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'inventory', record.id), record);
  };

  const saveWallet = async (record: Wallet) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'wallets', record.name), record);
  };

  // Bulk initialize cloud storage with current local storage fallback to ease user onboarding experience
  const bulkUploadToCloud = async (
    localBuys: BuyTransaction[],
    localSells: SellTransaction[],
    localDeps: DepositRecord[],
    localWiths: WithdrawalRecord[],
    localInv: InventoryBlock[],
    localWallets: Wallet[]
  ) => {
    if (!uid) return;
    try {
      const batch = writeBatch(db);

      localBuys.forEach((b) => {
        const itemRef = doc(db, 'users', uid, 'buys', b.id);
        batch.set(itemRef, b);
      });

      localSells.forEach((s) => {
        const itemRef = doc(db, 'users', uid, 'sells', s.id);
        batch.set(itemRef, s);
      });

      localDeps.forEach((d) => {
        const itemRef = doc(db, 'users', uid, 'deposits', d.id);
        batch.set(itemRef, d);
      });

      localWiths.forEach((w) => {
        const itemRef = doc(db, 'users', uid, 'withdrawals', w.id);
        batch.set(itemRef, w);
      });

      localInv.forEach((b) => {
        const itemRef = doc(db, 'users', uid, 'inventory', b.id);
        batch.set(itemRef, b);
      });

      localWallets.forEach((w) => {
        const itemRef = doc(db, 'users', uid, 'wallets', w.name);
        batch.set(itemRef, w);
      });

      await batch.commit();
    } catch (e) {
      console.error("Bulk upload fail:", e);
    }
  };

  const deleteInventoryBlock = async (id: string) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'inventory', id));
  };

  const clearAllData = async () => {
    if (!uid) return;
    try {
      const batch = writeBatch(db);
      const buySnaps = await getDocs(collection(db, 'users', uid, 'buys'));
      buySnaps.forEach(docSnap => batch.delete(docSnap.ref));
      const sellSnaps = await getDocs(collection(db, 'users', uid, 'sells'));
      sellSnaps.forEach(docSnap => batch.delete(docSnap.ref));
      const depSnaps = await getDocs(collection(db, 'users', uid, 'deposits'));
      depSnaps.forEach(docSnap => batch.delete(docSnap.ref));
      const withSnaps = await getDocs(collection(db, 'users', uid, 'withdrawals'));
      withSnaps.forEach(docSnap => batch.delete(docSnap.ref));
      const invSnaps = await getDocs(collection(db, 'users', uid, 'inventory'));
      invSnaps.forEach(docSnap => batch.delete(docSnap.ref));
      const walSnaps = await getDocs(collection(db, 'users', uid, 'wallets'));
      walSnaps.forEach(docSnap => batch.delete(docSnap.ref));
      await batch.commit();
    } catch (e) {
      console.error("clearAllData fail:", e);
    }
  };

  return {
    buyHistory,
    sellHistory,
    depositLedger,
    withdrawalLedger,
    inventory,
    wallets,
    loading,
    saveBuyRecord,
    saveSellRecord,
    saveDepositRecord,
    saveWithdrawalRecord,
    saveInventoryBlock,
    saveWallet,
    deleteInventoryBlock,
    clearAllData,
    bulkUploadToCloud
  };
};
