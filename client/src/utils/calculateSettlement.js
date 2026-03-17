export function calculateSettlement(contributions, payments) {
  const balances = {};

  // Calculate what each person owes
  Object.keys(contributions).forEach((person) => {
    balances[person] = parseFloat(contributions[person].toFixed(2));
  });

  // Subtract what each person already paid
  payments.forEach(({ person, amount }) => {
    if (balances[person] !== undefined) {
      balances[person] -= amount;
    }
  });

  // Separate debtors and creditors
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance > 0.01) {
      debtors.push({ person, amount: balance });
    } else if (balance < -0.01) {
      creditors.push({ person, amount: -balance });
    }
  });

  // Calculate settlements
  const settlements = [];
  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: parseFloat(amount.toFixed(2)),
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
}
