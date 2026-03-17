import { createContext, useState } from "react";

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paidBy, setPaidBy] = useState("");

  // Multiple bills support
  const [bills, setBills] = useState([
    { id: 1, name: "Bill 1", items: [], tax: 0, discount: 0 }
  ]);
  const [activeBillId, setActiveBillId] = useState(1);

  const activeBill = bills.find(b => b.id === activeBillId) || bills[0];

  const setItems = (items) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, items } : b));
  };

  const setTax = (tax) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, tax } : b));
  };

  const setDiscount = (discount) => {
    setBills(prev => prev.map(b => b.id === activeBillId ? { ...b, discount } : b));
  };

  const addBill = () => {
    const newId = Date.now();
    setBills([...bills, { id: newId, name: `Bill ${bills.length + 1}`, items: [], tax: 0, discount: 0 }]);
    setActiveBillId(newId);
  };

  const removeBill = (id) => {
    if (bills.length === 1) return;
    const remaining = bills.filter(b => b.id !== id);
    setBills(remaining);
    setActiveBillId(remaining[0].id);
  };

  const renameBill = (id, name) => {
    setBills(bills.map(b => b.id === id ? { ...b, name } : b));
  };

  // Flatten all items from all bills for calculations
  const items = activeBill.items;
  const tax = activeBill.tax;
  const discount = activeBill.discount;

  return (
    <BillContext.Provider
      value={{
        participants,
        setParticipants,
        items,
        setItems,
        tax,
        setTax,
        discount,
        setDiscount,
        paidBy,
        setPaidBy,
        payments,
        setPayments,
        bills,
        activeBillId,
        setActiveBillId,
        activeBill,
        addBill,
        removeBill,
        renameBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
