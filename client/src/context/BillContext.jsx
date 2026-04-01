import { createContext, useState } from "react";

export const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

export const CATEGORIES = ["Food", "Drinks", "Travel", "Stay", "Entertainment", "Shopping", "Other"];

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
  // Global pool used for payments/paidBy dropdowns
  const [allParticipants, setAllParticipants] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const [bills, setBills] = useState([
    { id: 1, name: "Bill 1", items: [], tax: 0, discount: 0, participants: [], paidBy: "", payments: [] }
  ]);
  const [activeBillId, setActiveBillId] = useState(1);

  const activeBill = bills.find(b => b.id === activeBillId) || bills[0];

  // Active bill's participants
  const participants = activeBill.participants;
  const setParticipants = (participants) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, participants } : b));
  };

  const addParticipantToBill = (name) => {
    setBills(prev => prev.map(b =>
      b.id === activeBillId ? { ...b, participants: [...b.participants, name] } : b
    ));
    // Also add to global pool if not already there
    setAllParticipants(prev => prev.includes(name) ? prev : [...prev, name]);
  };

  const removeParticipantFromBill = (name) => {
    setBills(prev => prev.map(b => {
      if (b.id !== activeBillId) return b;
      return {
        ...b,
        participants: b.participants.filter(p => p !== name),
        // Remove from assigned items too
        items: b.items.map(item => ({
          ...item,
          assignedTo: item.assignedTo.filter(p => p !== name)
        }))
      };
    }));
  };

  const setItems = (items) => {
    setBills(prev => prev.map(b => b.id === activeBillId
      ? { ...b, items, payments: b.payments.length > 0 ? [] : b.payments }
      : b
    ));
  };

  const setTax = (tax) => {
    setBills(prev => prev.map(b => b.id === activeBillId
      ? { ...b, tax, payments: b.payments.length > 0 ? [] : b.payments }
      : b
    ));
  };

  const setDiscount = (discount) => {
    setBills(prev => prev.map(b => b.id === activeBillId
      ? { ...b, discount, payments: b.payments.length > 0 ? [] : b.payments }
      : b
    ));
  };

  const addBill = () => {
    const newId = Date.now();
    setBills(prev => [...prev, { id: newId, name: `Bill ${prev.length + 1}`, items: [], tax: 0, discount: 0, participants: [], paidBy: "", payments: [] }]);
    setActiveBillId(newId);
  };

  const removeBill = (id) => {
    if (bills.length === 1) return;
    const remaining = bills.filter(b => b.id !== id);
    setBills(remaining);
    setActiveBillId(remaining[0].id);
  };

  const renameBill = (id, name) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, name } : b));
  };

  const setPaidBy = (paidBy) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, paidBy } : b));
  };

  const setPayments = (payments) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, payments } : b));
  };

  const items = activeBill.items;
  const tax = activeBill.tax;
  const discount = activeBill.discount;
  const paidBy = activeBill.paidBy;
  const payments = activeBill.payments;

  return (
    <BillContext.Provider
      value={{
        participants,
        setParticipants,
        addParticipantToBill,
        removeParticipantFromBill,
        allParticipants,
        items,
        setItems,
        tax,
        setTax,
        discount,
        setDiscount,
        payments,
        setPayments,
        paidBy,
        setPaidBy,
        bills,
        activeBillId,
        setActiveBillId,
        activeBill,
        addBill,
        removeBill,
        renameBill,
        currency,
        setCurrency,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
