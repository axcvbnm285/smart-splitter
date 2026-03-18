export function calculateContribution(items, participants, tax, discount) {
  let personTotals = {};

  participants.forEach((p) => {
    personTotals[p] = 0;
  });

  items.forEach((item) => {
    if (item.assignedTo.length === 0) return;
    const share = item.price / item.assignedTo.length;
    item.assignedTo.forEach((person) => {
      if (personTotals[person] !== undefined) {
        personTotals[person] += share;
      }
    });
  });

  const totalSubtotal = Object.values(personTotals).reduce((a, b) => a + b, 0);

  participants.forEach((p) => {
    if (totalSubtotal === 0) return;
    const ratio = personTotals[p] / totalSubtotal;
    personTotals[p] = (personTotals[p] - ratio * discount) + ratio * tax;
    personTotals[p] = parseFloat(personTotals[p].toFixed(2));
  });

  return personTotals;
}

export function calculateAllBillsContribution(bills) {
  // Collect all unique participants across all bills
  const allPeople = [...new Set(bills.flatMap(b => b.participants))];
  let personTotals = {};
  allPeople.forEach((p) => { personTotals[p] = 0; });

  bills.forEach((bill) => {
    if (bill.participants.length === 0) return;
    const billContributions = calculateContribution(bill.items, bill.participants, bill.tax, bill.discount);
    bill.participants.forEach((p) => {
      personTotals[p] = parseFloat((personTotals[p] + (billContributions[p] || 0)).toFixed(2));
    });
  });

  return personTotals;
}
