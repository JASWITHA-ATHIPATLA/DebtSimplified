import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import Avatar from './Avatar';
import { CAT } from '../constants';
import { getName } from '../utils/helpers';
import './AddExpenseModal.css';

export default function AddExpenseModal({ onClose, defaultGroup }) {
  const { state, dispatch } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [groupId, setGroupId] = useState(defaultGroup || state.groups[0]?.id || '');
  const [paidBy, setPaidBy] = useState('me');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('food');
  const [splitType, setSplitType] = useState('equal');
  const [splits, setSplits] = useState({});
  const [participants, setParticipants] = useState([]);
  const [note, setNote] = useState('');

  const group = state.groups.find(g => g.id === groupId);
  const members = group?.members || [];
  useEffect(() => {
    if (members.length) setParticipants(members);
  }, [groupId]);

  const setSV = (p, v) => setSplits(s => ({ ...s, [p]: parseFloat(v) || 0 }));
  const toggleP = m => setParticipants(p => (p.includes(m) ? p.filter(x => x !== m) : [...p, m]));
  const remaining =
    splitType === 'exact'
      ? (parseFloat(amount) || 0) - participants.reduce((s, p) => s + (splits[p] || 0), 0)
      : splitType === 'percentage'
      ? 100 - participants.reduce((s, p) => s + (splits[p] || 0), 0)
      : null;

  const submit = () => {
    if (!title || !amount || !groupId || !participants.length) return alert('Fill all required fields');
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: 'e' + Date.now(),
        groupId,
        title,
        amount: parseFloat(amount),
        paidBy,
        date,
        category,
        splitType,
        splits,
        participants,
        note,
      },
    });
    onClose();
  };

  return (
    <Modal title="Add Expense" onClose={onClose} wide>
      <div className="fg2">
        <div className="fg" style={{ gridColumn: '1/-1', marginBottom: 0 }}>
          <label className="fl">Expense Title *</label>
          <input className="fi" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's this expense for?" />
        </div>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label className="fl">Amount (₹) *</label>
          <input className="fi" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label className="fl">Date</label>
          <input className="fi" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label className="fl">Group *</label>
          <select className="fi" value={groupId} onChange={e => setGroupId(e.target.value)}>
            {state.groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.emoji} {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label className="fl">Paid By</label>
          <select className="fi" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
            {members.map(m => (
              <option key={m} value={m}>
                {getName(state, m)}
              </option>
            ))}
          </select>
        </div>
        <div className="fg" style={{ gridColumn: '1/-1', marginBottom: 0 }}>
          <label className="fl">Category</label>
          <select className="fi" value={category} onChange={e => setCategory(e.target.value)}>
            {Object.keys(CAT).map(c => (
              <option key={c} value={c}>
                {CAT[c].icon} {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fg" style={{ marginTop: '.75rem' }}>
        <label className="fl">Participants</label>
        <div className="participants-wrap">
          {members.map(m => (
            <button key={m} onClick={() => toggleP(m)} className={`btn btn-sm ${participants.includes(m) ? 'btn-prim' : 'btn-sec'}`}>
              {getName(state, m)}
            </button>
          ))}
        </div>
      </div>
      <div className="fg">
        <label className="fl">Split Type</label>
        <div className="split-row">
          {['equal', 'exact', 'percentage'].map(t => (
            <button key={t} className={`split-tab ${splitType === t ? 'on' : ''}`} onClick={() => setSplitType(t)}>
              {t === 'equal' ? '⚖️ Equal' : t === 'exact' ? '💰 Exact' : '% Percentage'}
            </button>
          ))}
        </div>
      </div>
      {splitType !== 'equal' && participants.length > 0 && (
        <div className="fg">
          <label className="fl">
            Split Details
            {remaining !== null && (
              <span style={{ marginLeft: 8, fontSize: 12, color: Math.abs(remaining) < 0.01 ? 'var(--brand)' : '#ef4444', fontWeight: 600 }}>
                {splitType === 'exact' ? `₹${remaining.toFixed(2)} left` : `${remaining.toFixed(1)}% left`}
              </span>
            )}
          </label>
          {participants.map(p => (
            <div key={p} className="split-input-row">
              <Avatar name={getName(state, p)} size="xs" />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{getName(state, p)}</span>
              <input
                className="fi"
                type="number"
                style={{ width: 90, marginBottom: 0 }}
                value={splits[p] || ''}
                onChange={e => setSV(p, e.target.value)}
                placeholder={splitType === 'percentage' ? '%' : '₹'}
              />
            </div>
          ))}
        </div>
      )}
      <div className="fg">
        <label className="fl">Notes (optional)</label>
        <textarea className="fi" value={note} onChange={e => setNote(e.target.value)} placeholder="Any additional notes..." />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-sec btn-md" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-prim btn-md" onClick={submit}>
          Add Expense
        </button>
      </div>
    </Modal>
  );
}