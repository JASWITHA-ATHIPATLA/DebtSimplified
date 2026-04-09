import React, { useContext, useMemo, useState } from 'react';
import { PieChart, Pie,Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '../context/AppContext';
import { computeNetBalances, simplifyDebts, getSplitAmounts } from '../utils/balance';
import { CAT} from '../constants';
import Avatar from '../components/Avatar';
import AddExpenseModal from '../components/AddExpenseModal';
import { getName } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard({ setPage }) {
  const { state } = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const net = useMemo(() => computeNetBalances(state.expenses, state.settlements), [state.expenses, state.settlements]);
  const txns = useMemo(() => simplifyDebts(net), [net]);
  const myDebts = txns.filter(t => t.from === 'me');
  const owedMe = txns.filter(t => t.to === 'me');
  const youOwe = myDebts.reduce((s, t) => s + t.amount, 0);
  const youOwed = owedMe.reduce((s, t) => s + t.amount, 0);
  const recent = [...state.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const catData = useMemo(() => {
    const m = {};
    state.expenses.forEach(e => {
      m[e.category] = (m[e.category] || 0) + e.amount;
    });
    return Object.entries(m).map(([k, v]) => ({
      name: CAT[k]?.icon + ' ' + k,
      value: v,
      fill: k === 'food' ? '#f59e0b' : k === 'stay' ? '#6366f1' : k === 'transport' ? '#0ea5e9' : k === 'activity' ? '#10b981' : k === 'utilities' ? '#f97316' : k === 'rent' ? '#8b5cf6' : '#6b7280',
    }));
  }, [state.expenses]);

  return (
    <div className="page-inner">
      <div className="dashboard-header">
        <div>
          <h1 className="pg-title">Good morning, {state.user?.name?.split(' ')[0]} 👋</h1>
          <p className="pg-sub">Here's your financial overview</p>
        </div>
        <button className="btn btn-prim btn-md" onClick={() => setModal(true)}>
          + Add Expense
        </button>
      </div>
      <div className="stat-row">
        <div className="stat-c">
          <div className="stat-lbl">You Owe</div>
          <div className="stat-val red">₹{youOwe.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="stat-note">{myDebts.length} payments pending</div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Owed to You</div>
          <div className="stat-val grn">₹{youOwed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="stat-note">{owedMe.length} people owe you</div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Net Balance</div>
          <div className={`stat-val ${youOwed - youOwe >= 0 ? 'grn' : 'red'}`}>
            {youOwed - youOwe >= 0 ? '+' : ''}₹{Math.abs(youOwed - youOwe).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="stat-note">{youOwed - youOwe >= 0 ? "You're ahead" : "You're behind"}</div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Total Expenses</div>
          <div className="stat-val blu">₹{state.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="stat-note">{state.expenses.length} transactions</div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-hd">
            <span style={{ fontWeight: 700, fontSize: 14 }}>Spending by Category</span>
          </div>
          <div className="card-bd">
            <div className="chart-h">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={catData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={30}>
                    {catData.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <span style={{ fontWeight: 700, fontSize: 14 }}>Settle Suggestions</span>
            <button className="btn btn-sm btn-prim" onClick={() => setPage('settle')}>
              View all
            </button>
          </div>
          <div className="card-bd">
            {txns.filter(t => t.from === 'me' || t.to === 'me').length === 0 && (
              <div className="empty">
                <div className="empty-ic">✅</div>
                <h3>All settled!</h3>
              </div>
            )}
            {txns
              .filter(t => t.from === 'me' || t.to === 'me')
              .slice(0, 4)
              .map((t, i) => (
                <div className="debt-row" key={i}>
                  <Avatar name={getName(state, t.from)} size="xs" />
                  <span style={{ fontSize: 13, flex: 1 }}>
                    <b>{getName(state, t.from)}</b> → <b>{getName(state, t.to)}</b>
                  </span>
                  <span className="amt-neg">₹{t.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="dashboard-bottom">
        <div className="card">
          <div className="card-hd">
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Expenses</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('expenses')}>
              See all
            </button>
          </div>
          <div className="card-bd-p0">
            {recent.map(exp => {
              const cat = CAT[exp.category] || CAT.other;
              const sm = getSplitAmounts(exp); // need to import getSplitAmounts
              const myShare = sm['me'] || 0;
              const iPaid = exp.paidBy === 'me';
              return (
                <div className="exp-row" key={exp.id}>
                  <div className="exp-ic" style={{ background: cat.bg }}>
                    {cat.icon}
                  </div>
                  <div className="exp-inf">
                    <div className="exp-ttl">{exp.title}</div>
                    <div className="exp-meta">
                      Paid by {getName(state, exp.paidBy)} · {exp.date}
                    </div>
                  </div>
                  <div className="exp-amt">
                    <div className={`exp-main ${iPaid ? 'amt-pos' : 'amt-neg'}`}>
                      {iPaid ? '+' : '-'}₹{myShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="exp-sub">of ₹{exp.amount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <span style={{ fontWeight: 700, fontSize: 14 }}>My Groups</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('groups')}>
              See all
            </button>
          </div>
          <div className="card-bd" style={{ paddingTop: 0 }}>
            {state.groups.map(g => {
              const gExp = state.expenses.filter(e => e.groupId === g.id);
              const tot = gExp.reduce((s, e) => s + e.amount, 0);
              return (
                <div key={g.id} className="group-row">
                  <span style={{ fontSize: 22 }}>{g.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{g.members.length} members</div>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>₹{tot.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {modal && <AddExpenseModal onClose={() => setModal(false)} />}
    </div>
  );
}