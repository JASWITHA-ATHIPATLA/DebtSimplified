import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { getSplitAmounts } from '../utils/balance';
import { CAT} from '../constants';
import { getName } from '../utils/helpers';
import AddExpenseModal from '../components/AddExpenseModal';
import './Expenses.css';


export default function Expenses() {
  const { state, dispatch } = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let list = [...state.expenses];
    if (filterGroup !== 'all') list = list.filter(e => e.groupId === filterGroup);
    if (search.trim()) list = list.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.includes(search.toLowerCase()));
    if (sortBy === 'date') list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'amount') list.sort((a, b) => b.amount - a.amount);
    return list;
  }, [state.expenses, filterGroup, search, sortBy]);

  return (
    <div className="page-inner">
      <div className="expenses-header">
        <div>
          <h1 className="pg-title">Expenses</h1>
          <p className="pg-sub">{filtered.length} expenses · ₹{filtered.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN')} total</p>
        </div>
        <button className="btn btn-prim btn-md" onClick={() => setModal(true)}>+ Add Expense</button>
      </div>
      <div className="filter-row">
        <div className="search-wrap">
          <span className="search-ic">🔍</span>
          <input className="search-fi" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." />
        </div>
        <select className="fi" style={{ maxWidth: 180, marginBottom: 0 }} value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
          <option value="all">All Groups</option>
          {state.groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
        </select>
        <select className="fi" style={{ maxWidth: 160, marginBottom: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>
      <div className="card">
        <div className="card-bd-p0">
          {filtered.length === 0 && (
            <div className="empty">
              <div className="empty-ic">💸</div>
              <h3>No expenses</h3>
              <p>Add your first expense</p>
            </div>
          )}
          {filtered.map(exp => {
            const cat = CAT[exp.category] || CAT.other;
            const grp = state.groups.find(g => g.id === exp.groupId);
            const sm = getSplitAmounts(exp);
            const myShare = sm['me'] || 0;
            const iPaid = exp.paidBy === 'me';
            return (
              <div className="exp-row" key={exp.id}>
                <div className="exp-ic" style={{ background: cat.bg }}>{cat.icon}</div>
                <div className="exp-inf">
                  <div className="exp-ttl">{exp.title}</div>
                  <div className="exp-meta">
                    {grp?.emoji} {grp?.name} · Paid by <b>{getName(state, exp.paidBy)}</b> · {exp.date} · {exp.participants.length} people
                    <span className="badge bg-gray" style={{ marginLeft: 6 }}>{exp.splitType}</span>
                  </div>
                  {exp.note && <div className="exp-meta" style={{ marginTop: 2, fontStyle: 'italic' }}>"{exp.note}"</div>}
                </div>
                <div className="exp-amt">
                  <div className="exp-main">₹{exp.amount.toLocaleString('en-IN')}</div>
                  <div className={`exp-sub ${iPaid ? 'amt-pos' : 'amt-neg'}`}>
                    {iPaid ? 'you lent' : 'you owe'} ₹{myShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <button className="btn btn-ghost btn-xs" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_EXPENSE', payload: exp.id }); }}>
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {modal && <AddExpenseModal onClose={() => setModal(false)} />}
    </div>
  );
}