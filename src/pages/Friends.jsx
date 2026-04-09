import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { computeNetBalances, simplifyDebts } from '../utils/balance';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import './Friends.css';

export default function Friends() {
  const { state, dispatch } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);

  const net = useMemo(() => computeNetBalances(state.expenses, state.settlements), [state.expenses, state.settlements]);
  const txns = useMemo(() => simplifyDebts(net), [net]);

  const friends = state.friends
    .map(fid => {
      const u = state.users.find(u => u.id === fid);
      const owedMe = txns.filter(t => t.from === fid && t.to === 'me').reduce((s, t) => s + t.amount, 0);
      const iOwe = txns.filter(t => t.from === 'me' && t.to === fid).reduce((s, t) => s + t.amount, 0);
      return { ...u, owedMe, iOwe };
    })
    .filter(f => f?.name?.toLowerCase().includes(search.toLowerCase()));

  const unusedUsers = state.users.filter(u => !state.friends.includes(u.id));

  return (
    <div className="page-inner">
      <div className="friends-header">
        <div>
          <h1 className="pg-title">Friends</h1>
          <p className="pg-sub">{state.friends.length} friends</p>
        </div>
        <button className="btn btn-prim btn-md" onClick={() => setModal(true)}>+ Add Friend</button>
      </div>
      <div className="filter-row">
        <div className="search-wrap">
          <span className="search-ic">🔍</span>
          <input className="search-fi" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search friends..." />
        </div>
      </div>
      <div className="friends-list">
        {friends.length === 0 && (
          <div className="empty">
            <div className="empty-ic">🤝</div>
            <h3>No friends found</h3>
          </div>
        )}
        {friends.map(f => (
          <div className="fc" key={f.id}>
            <Avatar name={f.name} size="md" />
            <div className="fc-info">
              <div className="fc-name">{f.name}</div>
              <div className="fc-email">{f.email}</div>
            </div>
            <div className="fc-balance">
              {f.owedMe > 0 && <div className="amt-pos">+₹{f.owedMe.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>}
              {f.iOwe > 0 && <div className="amt-neg">-₹{f.iOwe.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>}
              {f.owedMe === 0 && f.iOwe === 0 && <div className="settled">Settled ✓</div>}
              <div className="balance-hint">{f.owedMe > 0 ? 'owes you' : f.iOwe > 0 ? 'you owe' : ''}</div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title="Add Friend" onClose={() => setModal(false)}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem' }}>Select from existing users:</p>
          {unusedUsers.length === 0 && (
            <div className="empty">
              <h3>All users added</h3>
            </div>
          )}
          {unusedUsers.map(u => (
            <div key={u.id} className="fc" style={{ marginBottom: 8 }}>
              <Avatar name={u.name} size="md" />
              <div className="fc-info">
                <div className="fc-name">{u.name}</div>
                <div className="fc-email">{u.email}</div>
              </div>
              <button className="btn btn-prim btn-sm" onClick={() => { dispatch({ type: 'ADD_FRIEND', payload: u.id }); setModal(false); }}>
                Add
              </button>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}