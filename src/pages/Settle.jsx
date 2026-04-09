import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { computeNetBalances, simplifyDebts } from '../utils/balance';
import { getName } from '../utils/helpers';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import './Settle.css';

export default function Settle() {
  const { state, dispatch } = useContext(AppContext);
  const [modal, setModal] = useState(null);
  const [selTxn, setSelTxn] = useState(null);
  const [amt, setAmt] = useState('');

  const net = useMemo(() => computeNetBalances(state.expenses, state.settlements), [state.expenses, state.settlements]);
  const txns = useMemo(() => simplifyDebts(net), [net]);

  const settleNow = (t, partial) => {
    const amount = partial ? parseFloat(amt) : t.amount;
    if (!amount || amount <= 0 || amount > t.amount) return alert('Invalid amount');
    dispatch({
      type: 'ADD_SETTLEMENT',
      payload: {
        id: 's' + Date.now(),
        from: t.from,
        to: t.to,
        amount,
        toName: getName(state, t.to),
        date: new Date().toISOString().slice(0, 10),
      },
    });
    setModal(null);
    setSelTxn(null);
    setAmt('');
  };

  const myTxns = txns.filter(t => t.from === 'me' || t.to === 'me');
  const allTxns = txns;

  return (
    <div className="page-inner">
      <h1 className="pg-title">Settle Up</h1>
      <p className="pg-sub">Optimised payments using debt simplification</p>

      <div className="settle-info">
        💡 <b>Debt Simplification:</b> Instead of {state.expenses.length} raw payments, our algorithm reduces this to just <b>{txns.length} optimised transactions</b> — saving everyone time and bank fees.
      </div>

      <div className="stat-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem' }}>
        <div className="stat-c">
          <div className="stat-lbl">You Owe Total</div>
          <div className="stat-val red">
            ₹{txns.filter(t => t.from === 'me').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Owed to You</div>
          <div className="stat-val grn">
            ₹{txns.filter(t => t.to === 'me').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <h2 className="settle-section-title">Your Transactions</h2>
      {myTxns.length === 0 && (
        <div className="card">
          <div className="card-bd">
            <div className="empty">
              <div className="empty-ic">🎉</div>
              <h3>You're all settled up!</h3>
              <p>No pending transactions</p>
            </div>
          </div>
        </div>
      )}
      {myTxns.map((t, i) => (
        <div className="settle-c" key={i} style={{ borderColor: t.from === 'me' ? '#ef4444' : 'var(--brand)' }}>
          <Avatar name={getName(state, t.from)} size="md" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {getName(state, t.from)} <span style={{ color: 'var(--text3)' }}>→</span> {getName(state, t.to)}
            </div>
            {t.from === 'me' ? (
              <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>You need to pay</div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 2 }}>They need to pay you</div>
            )}
          </div>
          <Avatar name={getName(state, t.to)} size="md" />
          <div className="amt-neg" style={{ fontSize: 16, fontWeight: 800 }}>₹{t.amount.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-prim btn-sm" onClick={() => settleNow(t, false)}>Settle ✓</button>
            <button className="btn btn-sec btn-sm" onClick={() => { setSelTxn(t); setModal('partial'); }}>Partial</button>
          </div>
        </div>
      ))}

      {allTxns.filter(t => t.from !== 'me' && t.to !== 'me').length > 0 && (
        <>
          <h2 className="settle-section-title">All Transactions</h2>
          {allTxns.filter(t => t.from !== 'me' && t.to !== 'me').map((t, i) => (
            <div className="settle-c" key={i}>
              <Avatar name={getName(state, t.from)} size="md" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{getName(state, t.from)} → {getName(state, t.to)}</div>
              </div>
              <Avatar name={getName(state, t.to)} size="md" />
              <div className="amt-neg" style={{ fontSize: 15, fontWeight: 700 }}>₹{t.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </>
      )}

      {state.settlements.length > 0 && (
        <>
          <h2 className="settle-section-title">Settlement History</h2>
          <div className="card">
            <div className="card-bd-p0">
              {state.settlements.map(s => (
                <div className="exp-row" key={s.id}>
                  <div className="exp-ic" style={{ background: 'rgba(0,179,126,0.1)' }}>✅</div>
                  <div className="exp-inf">
                    <div className="exp-ttl">{getName(state, s.from)} → {getName(state, s.to)}</div>
                    <div className="exp-meta">{s.date}</div>
                  </div>
                  <div className="amt-pos" style={{ fontSize: 15, fontWeight: 700 }}>₹{s.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {modal === 'partial' && selTxn && (
        <Modal title="Partial Settlement" onClose={() => { setModal(null); setSelTxn(null); }}>
          <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: '1rem' }}>
            {getName(state, selTxn.from)} owes {getName(state, selTxn.to)} a total of <b>₹{selTxn.amount.toLocaleString('en-IN')}</b>
          </p>
          <div className="fg">
            <label className="fl">Amount to settle</label>
            <input className="fi" type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder={`Max ₹${selTxn.amount}`} max={selTxn.amount} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-sec btn-md" onClick={() => { setModal(null); setSelTxn(null); }}>Cancel</button>
            <button className="btn btn-prim btn-md" onClick={() => settleNow(selTxn, true)}>Confirm Payment</button>
          </div>
        </Modal>
      )}
    </div>
  );
}