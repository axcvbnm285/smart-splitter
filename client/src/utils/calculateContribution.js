export function calculateContribution(items, participants, tax, discount) {
  let personTotals = {};

  participants.forEach((p) => {
    personTotals[p] = 0;
  });

  // Item splitting
  items.forEach((item) => {
    if (item.assignedTo.length === 0) return;
    const share = item.price / item.assignedTo.length;

    item.assignedTo.forEach((person) => {
      personTotals[person] += share;
    });
  });

  const totalSubtotal = Object.values(personTotals).reduce(
    (a, b) => a + b,
    0
  );

  // Proportional tax & discount
  participants.forEach((p) => {
    if (totalSubtotal === 0) return;

    const ratio = personTotals[p] / totalSubtotal;
    const taxShare = ratio * tax;
    const discountShare = ratio * discount;

    personTotals[p] = personTotals[p] + taxShare - discountShare;
  });

  return personTotals;
}
