export function getSplitAmounts(exp) {
  const { amount, participants, splitType, splits } = exp;
  if (splitType === 'equal') {
    const share = amount / participants.length;
    return Object.fromEntries(participants.map(p => [p, parseFloat(share.toFixed(2))]));
  }
  if (splitType === 'exact') return splits;
  if (splitType === 'percentage')
    return Object.fromEntries(Object.entries(splits).map(([k, v]) => [k, parseFloat((amount * v / 100).toFixed(2))]));
  return {};
}

export function computeNetBalances(expenses, settlements) {
  const net = {};
  expenses.forEach(exp => {
    const shareMap = getSplitAmounts(exp);
    exp.participants.forEach(p => {
      if (p === exp.paidBy) return;
      const amt = shareMap[p] || 0;
      net[p] = net[p] || {};
      net[p][exp.paidBy] = (net[p][exp.paidBy] || 0) + amt;
      net[exp.paidBy] = net[exp.paidBy] || {};
      net[exp.paidBy][p] = (net[exp.paidBy][p] || 0) - amt;
    });
  });
  settlements.forEach(s => {
    net[s.from] = net[s.from] || {};
    net[s.to] = net[s.to] || {};
    net[s.from][s.to] = (net[s.from][s.to] || 0) - s.amount;
    net[s.to][s.from] = (net[s.to][s.from] || 0) + s.amount;
  });
  return net;
}

export function simplifyDebts(net) {
  const totals = {};
  Object.entries(net).forEach(([p, owed]) => {
    totals[p] = totals[p] || 0;
    Object.entries(owed).forEach(([, v]) => (totals[p] += v));
  });
  const cred = Object.entries(totals)
    .filter(([, v]) => v > 0.01)
    .map(([p, v]) => ({ p, v }))
    .sort((a, b) => b.v - a.v);
  const debt = Object.entries(totals)
    .filter(([, v]) => v < -0.01)
    .map(([p, v]) => ({ p, v: -v }))
    .sort((a, b) => b.v - a.v);
  const txns = [];
  let ci = 0,
    di = 0;
  while (ci < cred.length && di < debt.length) {
    const pay = Math.min(cred[ci].v, debt[di].v);
    txns.push({ from: debt[di].p, to: cred[ci].p, amount: parseFloat(pay.toFixed(2)) });
    cred[ci].v -= pay;
    debt[di].v -= pay;
    if (cred[ci].v < 0.01) ci++;
    if (debt[di].v < 0.01) di++;
  }
  return txns;
}