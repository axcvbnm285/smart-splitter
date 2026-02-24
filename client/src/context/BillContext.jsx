import { createContext, useState } from "react";

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [items, setItems] = useState([]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidBy, setPaidBy] = useState("");
  const [payments, setPayments] = useState([]);

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
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
