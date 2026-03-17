export function calculateContribution(items, participants, tax, discount) {
  let personTotals = {};

  participants.forEach((p) => {
    personTotals[p] = 0;
  });

  items.forEach((item) => {
    if (item.assignedTo.length === 0) return;
    const share = item.price / item.assignedTo.length;
    item.assignedTo.forEach((person) => {
      personTotals[person] += share;
    });
  });

  const totalSubtotal = Object.values(personTotals).reduce((a, b) => a + b, 0);

  participants.forEach((p) => {
    if (totalSubtotal === 0) return;
    const ratio = personTotals[p] / totalSubtotal;
    // Correct order: apply discount on subtotal, then add tax
    personTotals[p] = (personTotals[p] - ratio * discount) + ratio * tax;
    // Round to 2 decimal places to avoid floating point errors
    personTotals[p] = parseFloat(personTotals[p].toFixed(2));
  });

  return personTotals;
}

export function calculateAllBillsContribution(bills, participants) {
  let personTotals = {};
  participants.forEach((p) => { personTotals[p] = 0; });

  bills.forEach((bill) => {
    const billContributions = calculateContribution(bill.items, participants, bill.tax, bill.discount);
    participants.forEach((p) => {
      personTotals[p] += billContributions[p] || 0;
    });
  });

  return personTotals;
}
